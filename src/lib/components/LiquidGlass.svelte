<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	export let width = 400;
	export let height = 300;
	export let thickness = 20.0;
	export let refractionIndex = 1.52;
	export let dispersionStrength = 0.02;
	export let fresnelPower = 3.0;
	export let blurRadius = 8.0;
	export let cornerRadius = 32.0;
	export let backgroundColor = [0.1, 0.1, 0.15, 1.0];
	export let tintColor = [1.0, 1.0, 1.0, 0.95];
	export let mousePosition = [0, 0];
	export let enabled = true;

	let canvas: HTMLCanvasElement;
	let device: GPUDevice | null = null;
	let context: GPUCanvasContext | null = null;
	let renderPipeline: GPURenderPipeline | null = null;
	let uniformBuffer: GPUBuffer | null = null;
	let backgroundTexture: GPUTexture | null = null;
	let animationId: number;
	let isVisible = false;
	let observer: IntersectionObserver;

	const vertexShaderCode = `
		struct VertexOutput {
			@builtin(position) position: vec4<f32>,
			@location(0) uv: vec2<f32>,
		}

		@vertex
		fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
			var pos = array<vec2<f32>, 6>(
				vec2<f32>(-1.0, -1.0),
				vec2<f32>( 1.0, -1.0),
				vec2<f32>(-1.0,  1.0),
				vec2<f32>( 1.0, -1.0),
				vec2<f32>( 1.0,  1.0),
				vec2<f32>(-1.0,  1.0)
			);
			
			var uv = array<vec2<f32>, 6>(
				vec2<f32>(0.0, 1.0),
				vec2<f32>(1.0, 1.0),
				vec2<f32>(0.0, 0.0),
				vec2<f32>(1.0, 1.0),
				vec2<f32>(1.0, 0.0),
				vec2<f32>(0.0, 0.0)
			);

			var output: VertexOutput;
			output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
			output.uv = uv[vertexIndex];
			return output;
		}
	`;

	const fragmentShaderCode = `
		struct Uniforms {
			resolution: vec2<f32>,
			time: f32,
			mouse: vec2<f32>,
			thickness: f32,
			refractionIndex: f32,
			dispersionStrength: f32,
			fresnelPower: f32,
			blurRadius: f32,
			cornerRadius: f32,
			backgroundColor: vec4<f32>,
			tintColor: vec4<f32>,
		}

		@group(0) @binding(0) var<uniform> uniforms: Uniforms;
		@group(0) @binding(1) var backgroundSampler: sampler;
		@group(0) @binding(2) var backgroundTexture: texture_2d<f32>;

		// SDF of a rounded rectangle (from IQ's distance functions)
		fn sdfRect(center: vec2<f32>, size: vec2<f32>, p: vec2<f32>, r: f32) -> f32 {
			let pRel = p - center;
			let q = abs(pRel) - size;
			return length(max(q, vec2<f32>(0.0))) + min(max(q.x, q.y), 0.0) - r;
		}

		// Calculate surface normal using finite differences (matching original)
		fn getNormal(sd: f32, thickness: f32) -> vec3<f32> {
			let dx = dpdx(sd);
			let dy = dpdy(sd);
			
			// The cosine and sine between normal and the xy plane
			let nCos = max(thickness + sd, 0.0) / thickness;
			let nSin = sqrt(1.0 - nCos * nCos);
			
			return normalize(vec3<f32>(dx * nCos, dy * nCos, nSin));
		}

		// The height (z component) of the pad surface at sd
		fn height(sd: f32, thickness: f32) -> f32 {
			if (sd >= 0.0) {
				return 0.0;
			}
			if (sd < -thickness) {
				return thickness;
			}
			
			let x = thickness + sd;
			return sqrt(thickness * thickness - x * x);
		}

		// Fresnel reflection calculation
		fn fresnel(cosTheta: f32, n1: f32, n2: f32) -> f32 {
			let r0 = pow((n1 - n2) / (n1 + n2), 2.0);
			return r0 + (1.0 - r0) * pow(1.0 - cosTheta, uniforms.fresnelPower);
		}

		// Sample background with blur for depth effect
		fn sampleBackgroundBlurred(coord: vec2<f32>, blurAmount: f32) -> vec4<f32> {
			let texelSize = 1.0 / uniforms.resolution;
			var color = vec4<f32>(0.0);
			let samples = 9;
			let radius = blurAmount * texelSize.x;
			
			// Box blur sampling
			for (var i = 0; i < samples; i++) {
				for (var j = 0; j < samples; j++) {
					let offset = vec2<f32>(f32(i - samples/2), f32(j - samples/2)) * radius;
					let sampleCoord = clamp(coord + offset, vec2<f32>(0.0), vec2<f32>(1.0));
					
					// Sample from the actual background content
					color += textureSample(backgroundTexture, backgroundSampler, sampleCoord);
				}
			}
			return color / f32(samples * samples);
		}

		// Background image simulation for fallback
		fn bgImage(uv: vec2<f32>) -> vec4<f32> {
			let time = uniforms.time * 0.3;
			let wave1 = sin(uv.x * 15.0 + time) * 0.5 + 0.5;
			let wave2 = cos(uv.y * 12.0 + time * 1.2) * 0.5 + 0.5;
			let wave3 = sin((uv.x + uv.y) * 8.0 + time * 0.7) * 0.5 + 0.5;
			
			return vec4<f32>(wave1 * 0.7 + 0.2, wave2 * 0.8 + 0.1, wave3 * 0.9 + 0.2, 1.0);
		}

		// Background strips pattern (matching original)
		fn bgStrips(uv: vec2<f32>) -> vec4<f32> {
			let stripHeight = 20.0;
			if (fract(uv.y * uniforms.resolution.y / stripHeight) < 0.5) {
				return vec4<f32>(0.0, 0.5, 1.0, 1.0);
			} else {
				return vec4<f32>(0.9, 0.9, 0.9, 1.0);
			}
		}

		// Background function (try real texture first, fallback to procedural)
		fn bg(uv: vec2<f32>) -> vec4<f32> {
			// Try to sample the real background texture
			let realBg = textureSample(backgroundTexture, backgroundSampler, uv);
			if (realBg.a > 0.1) {
				return realBg;
			}
			
			// Fallback to procedural patterns
			if (uv.x > 0.5) {
				return bgStrips(uv);
			}
			return bgImage(uv);
		}

		@fragment
		fn main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
			let fragCoord = uv * uniforms.resolution;
			
			// Glass parameters
			let thickness = uniforms.thickness;
			let index = uniforms.refractionIndex;
			let baseHeight = thickness * 8.0;
			let colorMix = 0.2;
			let colorBase = vec4<f32>(1.0, 1.0, 1.0, 0.0);
			
			// Center position
			var center = uniforms.mouse;
			if (center.x == 0.0 && center.y == 0.0) {
				center = uniforms.resolution * 0.5;
			}
			
			// Calculate SDF for the glass shape
			let sd = sdfRect(center, vec2<f32>(128.0, 0.0), fragCoord, uniforms.cornerRadius);
			
			// Background pass-through with anti-aliasing
			var bgCol = vec4<f32>(0.0);
			bgCol = mix(vec4<f32>(0.0), bg(uv), clamp(sd / 100.0, 0.0, 1.0) * 0.1 + 0.9);
			bgCol.a = smoothstep(-4.0, 0.0, sd);
			
			// Early exit for background
			if (bgCol.a > 0.99) {
				return bgCol;
			}
			
			let normal = getNormal(sd, thickness);
			let h = height(sd, thickness);
			let incident = vec3<f32>(0.0, 0.0, -1.0);
			
			// CHROMATIC ABERRATION - Split RGB channels with different indices
			let dispersion = uniforms.dispersionStrength;
			let redIndex = index - dispersion;
			let greenIndex = index;
			let blueIndex = index + dispersion;
			
			// Refraction for each color channel
			let refractVecR = refract(incident, normal, 1.0 / redIndex);
			let refractVecG = refract(incident, normal, 1.0 / greenIndex);
			let refractVecB = refract(incident, normal, 1.0 / blueIndex);
			
			// Calculate refraction distances
			let refractLengthR = (h + baseHeight) / dot(vec3<f32>(0.0, 0.0, -1.0), refractVecR);
			let refractLengthG = (h + baseHeight) / dot(vec3<f32>(0.0, 0.0, -1.0), refractVecG);
			let refractLengthB = (h + baseHeight) / dot(vec3<f32>(0.0, 0.0, -1.0), refractVecB);
			
			// Sample refracted background with blur based on depth
			let depthBlur = uniforms.blurRadius * (1.0 + abs(sd) / thickness);
			let coordR = (fragCoord + refractVecR.xy * refractLengthR) / uniforms.resolution;
			let coordG = (fragCoord + refractVecG.xy * refractLengthG) / uniforms.resolution;
			let coordB = (fragCoord + refractVecB.xy * refractLengthB) / uniforms.resolution;
			
			let colorR = sampleBackgroundBlurred(coordR, depthBlur);
			let colorG = sampleBackgroundBlurred(coordG, depthBlur);
			let colorB = sampleBackgroundBlurred(coordB, depthBlur);
			
			// Combine chromatic channels
			var refractColor = vec4<f32>(colorR.r, colorG.g, colorB.b, 1.0);
			
			// FRESNEL REFLECTION
			let viewAngle = dot(-incident, normal);
			let fresnelAmount = fresnel(viewAngle, 1.0, index);
			
			// Environment reflection
			let reflectVec = reflect(incident, normal);
			let envCoord = (reflectVec.xy * 0.5 + 0.5);
			let envColor = bg(envCoord);
			
			// SPECULAR HIGHLIGHTS
			let lightDir = normalize(vec3<f32>(1.0, 1.0, 2.0));
			let reflectLight = reflect(-lightDir, normal);
			let specular = pow(max(dot(-incident, reflectLight), 0.0), 32.0);
			let specularColor = vec4<f32>(1.0, 1.0, 1.0, 1.0) * specular * 0.6;
			
			// Caustics effect (light focusing through glass)
			let causticIntensity = abs(sin(sd * 0.05 + uniforms.time * 2.0)) * 0.2;
			let causticColor = vec4<f32>(0.9, 0.95, 1.0, 1.0) * causticIntensity;
			
			// Combine all effects
			var glassSurface = mix(refractColor, envColor, fresnelAmount);
			glassSurface += specularColor;
			glassSurface += causticColor;
			
			// Final glass tinting
			glassSurface = mix(glassSurface, colorBase, colorMix);
			glassSurface = mix(glassSurface, uniforms.tintColor, 0.1);
			
			// Anti-aliased blending with background
			glassSurface = clamp(glassSurface, vec4<f32>(0.0), vec4<f32>(1.0));
			bgCol = clamp(bgCol, vec4<f32>(0.0), vec4<f32>(1.0));
			
			return mix(glassSurface, bgCol, bgCol.a);
		}
	`;

	async function initWebGPU() {
		if (!navigator.gpu) {
			console.warn('WebGPU not supported');
			return false;
		}

		try {
			const adapter = await navigator.gpu.requestAdapter();
			if (!adapter) return false;

			device = await adapter.requestDevice();
			context = canvas.getContext('webgpu');
			if (!context) return false;

			const format = navigator.gpu.getPreferredCanvasFormat();
			context.configure({
				device,
				format,
				alphaMode: 'premultiplied'
			});

			// Create render pipeline
			const shaderModule = device.createShaderModule({
				code: vertexShaderCode + fragmentShaderCode
			});

			renderPipeline = device.createRenderPipeline({
				layout: 'auto',
				vertex: {
					module: shaderModule,
					entryPoint: 'main'
				},
				fragment: {
					module: shaderModule,
					entryPoint: 'main',
					targets: [{ format }]
				}
			});

			// Create uniform buffer
			uniformBuffer = device.createBuffer({
				size: 256, // Enough for all uniforms
				usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
			});

			// Create background texture
			createBackgroundTexture();
			
			// Capture background content
			setTimeout(() => captureBackgroundContent(), 100);

			return true;
		} catch (error) {
			console.error('WebGPU initialization failed:', error);
			return false;
		}
	}

	function createBackgroundTexture() {
		if (!device) return;

		backgroundTexture = device.createTexture({
			size: [canvas.width, canvas.height],
			format: 'rgba8unorm',
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
		});
	}

	function captureBackgroundContent() {
		if (!canvas || !device || !backgroundTexture) return;

		// Create a temporary canvas to render background content
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = canvas.width;
		tempCanvas.height = canvas.height;
		const ctx = tempCanvas.getContext('2d');
		
		if (!ctx) return;

		// Create procedural background that simulates content
		createProceduralBackground(ctx);
	}

	function createProceduralBackground(ctx: CanvasRenderingContext2D) {
		// Create a rich background with various elements to refract
		const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
		gradient.addColorStop(0, 'rgba(139, 92, 246, 0.8)');
		gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.8)');
		gradient.addColorStop(1, 'rgba(59, 130, 246, 0.8)');
		
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		
		// Add grid of colorful shapes that will be visible through refraction
		for (let i = 0; i < 16; i++) {
			const x = (i % 4) * (canvas.width / 4) + 20;
			const y = Math.floor(i / 4) * (canvas.height / 4) + 20;
			const size = canvas.width / 6;
			
			// Create varying shapes and colors
			const shapeGradient = ctx.createRadialGradient(x + size/2, y + size/2, 0, x + size/2, y + size/2, size/2);
			shapeGradient.addColorStop(0, `hsl(${(i * 45) % 360}, 80%, 70%)`);
			shapeGradient.addColorStop(1, `hsl(${(i * 45 + 90) % 360}, 80%, 40%)`);
			
			ctx.fillStyle = shapeGradient;
			
			// Alternate between circles and rectangles
			if (i % 2 === 0) {
				ctx.beginPath();
				ctx.arc(x + size/2, y + size/2, size/3, 0, Math.PI * 2);
				ctx.fill();
			} else {
				ctx.fillRect(x + 10, y + 10, size - 20, size - 20);
			}
		}

		// Add some text content that will be distorted
		ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
		ctx.font = 'bold 32px Arial';
		ctx.textAlign = 'center';
		ctx.fillText('GLASS', canvas.width * 0.25, canvas.height * 0.4);
		
		ctx.fillStyle = 'rgba(100, 200, 255, 0.8)';
		ctx.font = 'bold 24px Arial';
		ctx.fillText('REFRACTION', canvas.width * 0.75, canvas.height * 0.7);

		// Add some line patterns
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.lineWidth = 2;
		for (let i = 0; i < 10; i++) {
			ctx.beginPath();
			ctx.moveTo(0, i * (canvas.height / 10));
			ctx.lineTo(canvas.width, i * (canvas.height / 10));
			ctx.stroke();
		}

		// Upload to GPU texture
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		device.queue.writeTexture(
			{ texture: backgroundTexture },
			imageData.data,
			{ bytesPerRow: canvas.width * 4 },
			{ width: canvas.width, height: canvas.height }
		);
	}

	function updateUniforms() {
		if (!device || !uniformBuffer) return;

		const data = new Float32Array([
			canvas.width, canvas.height, // resolution
			performance.now() / 1000, 0, // time + padding
			mousePosition[0] || canvas.width / 2, mousePosition[1] || canvas.height / 2, // mouse position
			thickness, refractionIndex, // thickness, refractionIndex
			dispersionStrength, fresnelPower, // dispersionStrength, fresnelPower
			blurRadius, cornerRadius, // blurRadius, cornerRadius
			0, 0, // padding
			...backgroundColor, // backgroundColor (4 values)
			...tintColor // tintColor (4 values)
		]);

		device.queue.writeBuffer(uniformBuffer, 0, data);
	}

	function render() {
		if (!device || !context || !renderPipeline || !uniformBuffer || !backgroundTexture || !isVisible) {
			return;
		}

		updateUniforms();

		const encoder = device.createCommandEncoder();
		const renderPass = encoder.beginRenderPass({
			colorAttachments: [{
				view: context.getCurrentTexture().createView(),
				clearValue: { r: 0, g: 0, b: 0, a: 0 },
				loadOp: 'clear',
				storeOp: 'store'
			}]
		});

		// Create bind group
		const sampler = device.createSampler({
			magFilter: 'linear',
			minFilter: 'linear'
		});

		const bindGroup = device.createBindGroup({
			layout: renderPipeline.getBindGroupLayout(0),
			entries: [
				{ binding: 0, resource: { buffer: uniformBuffer } },
				{ binding: 1, resource: sampler },
				{ binding: 2, resource: backgroundTexture.createView() }
			]
		});

		renderPass.setBindGroup(0, bindGroup);
		renderPass.setPipeline(renderPipeline);
		renderPass.draw(6);
		renderPass.end();

		device.queue.submit([encoder.finish()]);

		if (enabled) {
			animationId = requestAnimationFrame(render);
		}
	}

	function startAnimation() {
		if (enabled && isVisible) {
			render();
		}
	}

	function stopAnimation() {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
	}

	onMount(async () => {
		if (await initWebGPU()) {
			// Set up intersection observer
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						isVisible = entry.isIntersecting;
						if (isVisible) {
							startAnimation();
						} else {
							stopAnimation();
						}
					});
				},
				{ threshold: 0.1 }
			);

			observer.observe(canvas);
		}
	});

	onDestroy(() => {
		stopAnimation();
		if (observer) {
			observer.disconnect();
		}
		if (device && uniformBuffer) {
			uniformBuffer.destroy();
		}
		if (device && backgroundTexture) {
			backgroundTexture.destroy();
		}
	});

	$: if (canvas) {
		canvas.width = width;
		canvas.height = height;
		if (backgroundTexture) {
			createBackgroundTexture();
		}
	}

	$: if (enabled) {
		startAnimation();
	} else {
		stopAnimation();
	}
</script>

<canvas
	bind:this={canvas}
	{width}
	{height}
	class="liquid-glass-canvas"
	style="width: {width}px; height: {height}px;"
/>

<style>
	.liquid-glass-canvas {
		border-radius: var(--radius, 8px);
		box-shadow: var(--glass-shadow-elevated);
		backdrop-filter: blur(1px);
		display: block;
	}
</style>