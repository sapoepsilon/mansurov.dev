<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  export let intensity = 0.3;
  export let roughness = 0.1;
  export let metallic = 0.8;

  let canvas: HTMLCanvasElement;
  let device: GPUDevice | null = null;
  let context: GPUCanvasContext | null = null;
  let renderPipeline: GPURenderPipeline | null = null;
  let animationId: number;
  let lastTime = 0;
  let isVisible = true;
  let observer: IntersectionObserver;

  const vertexShaderCode = `
    @vertex
    fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4f {
      var pos = array<vec2f, 6>(
        vec2f(-1.0, -1.0),
        vec2f( 1.0, -1.0),
        vec2f(-1.0,  1.0),
        vec2f(-1.0,  1.0),
        vec2f( 1.0, -1.0),
        vec2f( 1.0,  1.0)
      );
      return vec4f(pos[vertexIndex], 0.0, 1.0);
    }
  `;

  function getFragmentShaderCode(time: number) {
    return `
      @fragment
      fn fs_main(@builtin(position) coord: vec4f) -> @location(0) vec4f {
        let resolution = vec2f(800.0, 600.0);
        let uv = coord.xy / resolution;
        
        // Glass reflection simulation with fluid motion
        let time = ${time};
        let distortion = sin(uv.y * 8.0 + time * 0.5) * 0.02;
        let distortedUV = vec2f(uv.x + distortion, uv.y);
        
        // 3D-like refraction
        let normal = normalize(vec3f(
          sin(distortedUV.x * 10.0 + time * 0.3) * 0.1,
          sin(distortedUV.y * 10.0 + time * 0.4) * 0.1,
          1.0
        ));
        
        let viewDir = normalize(vec3f(distortedUV - 0.5, 1.0));
        let reflection = reflect(viewDir, normal);
        
        // Enhanced Fresnel effect for liquid glass
        let fresnel = pow(1.0 - dot(viewDir, vec3f(0.0, 0.0, 1.0)), 2.0);
        
        // Animated environment mapping
        let envColor1 = vec3f(0.8, 0.95, 1.0);
        let envColor2 = vec3f(0.9, 0.85, 0.95);
        let envMix = 0.5 + 0.5 * sin(reflection.x * 5.0 + reflection.y * 5.0 + time * 0.2);
        let envColor = mix(envColor1, envColor2, envMix);
        
        // Iridescent glass tint
        let glassColor = vec3f(
          0.95 + 0.05 * sin(uv.x * 20.0 + time * 0.1),
          0.98,
          1.0 + 0.02 * sin(uv.y * 20.0 - time * 0.1)
        );
        
        // Liquid glass blend
        let finalColor = mix(glassColor, envColor, fresnel * ${intensity});
        
        // Add subtle shimmer
        let shimmer = 0.98 + 0.02 * sin(uv.x * 50.0 + uv.y * 50.0 + time);
        finalColor *= shimmer;
        
        return vec4f(finalColor, ${1.0 - roughness});
      }
    `;
  }

  async function initWebGPU() {
    if (!browser || !navigator.gpu) {
      console.warn('WebGPU not supported, falling back to CSS reflections');
      return false;
    }

    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        console.warn('No WebGPU adapter found');
        return false;
      }

      device = await adapter.requestDevice();
      context = canvas.getContext('webgpu');
      
      if (!context) {
        console.warn('WebGPU context not available');
        return false;
      }

      const format = navigator.gpu.getPreferredCanvasFormat();
      context.configure({
        device,
        format,
        alphaMode: 'premultiplied'
      });

      // Create shaders
      const vertexShader = device.createShaderModule({
        code: vertexShaderCode
      });

      // Initial shader will be created in render loop

      // Store vertex shader and format for later use
      const pipelineData = { vertexShader, format };
      
      // Initial pipeline creation
      const fragmentShader = device.createShaderModule({
        code: getFragmentShaderCode(0)
      });
      
      renderPipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
          module: pipelineData.vertexShader,
          entryPoint: 'vs_main'
        },
        fragment: {
          module: fragmentShader,
          entryPoint: 'fs_main',
          targets: [{
            format: pipelineData.format,
            blend: {
              color: {
                srcFactor: 'src-alpha',
                dstFactor: 'one-minus-src-alpha'
              },
              alpha: {
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha'
              }
            }
          }]
        },
        primitive: {
          topology: 'triangle-list'
        }
      });

      return true;
    } catch (error) {
      console.warn('WebGPU initialization failed:', error);
      return false;
    }
  }

  function render(currentTime: number) {
    if (!device || !context || !renderPipeline || !isVisible) return;
    
    // Throttle to 30 FPS for performance
    const deltaTime = currentTime - lastTime;
    if (deltaTime < 33) { // ~30 FPS
      animationId = requestAnimationFrame(render);
      return;
    }
    lastTime = currentTime;
    
    // Update shader with time for fluid animations
    const time = currentTime * 0.001;
    
    try {
      const commandEncoder = device.createCommandEncoder();
      const textureView = context.getCurrentTexture().createView();

      const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [{
          view: textureView,
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear',
          storeOp: 'store'
        }]
      });

      renderPass.setPipeline(renderPipeline);
      renderPass.draw(6);
      renderPass.end();

      device.queue.submit([commandEncoder.finish()]);
    } catch (error) {
      console.warn('WebGPU render error:', error);
    }
    
    if (isVisible) {
      animationId = requestAnimationFrame(render);
    }
  }

  onMount(async () => {
    // Set up intersection observer for performance
    if (browser) {
      observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0].isIntersecting;
          if (isVisible && !animationId && device) {
            animationId = requestAnimationFrame(render);
          }
        },
        { threshold: 0.1 }
      );
      
      if (canvas) {
        observer.observe(canvas);
      }
    }
    
    if (await initWebGPU()) {
      animationId = requestAnimationFrame(render);
    }
  });

  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (observer) {
      observer.disconnect();
    }
    if (device) {
      device.destroy();
    }
  });
</script>

<canvas 
  bind:this={canvas}
  class="absolute inset-0 w-full h-full pointer-events-none opacity-30 mix-blend-overlay"
  width="800"
  height="600"
  style="filter: blur(1px);"
/>

<style>
  canvas {
    image-rendering: optimizeSpeed;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: optimize-contrast;
  }
</style>