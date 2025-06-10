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

  const fragmentShaderCode = `
    @fragment
    fn fs_main(@builtin(position) coord: vec4f) -> @location(0) vec4f {
      let resolution = vec2f(800.0, 600.0);
      let uv = coord.xy / resolution;
      
      // Glass reflection simulation
      let time = ${Date.now() * 0.001};
      let reflection = reflect(normalize(vec3f(uv - 0.5, 1.0)), vec3f(0.0, 0.0, 1.0));
      
      // Fresnel effect
      let fresnel = pow(1.0 - dot(normalize(vec3f(uv - 0.5, 1.0)), vec3f(0.0, 0.0, 1.0)), 3.0);
      
      // Environment mapping simulation
      let envColor = vec3f(0.8, 0.9, 1.0) * (0.5 + 0.5 * sin(reflection.x * 10.0 + time));
      
      // Glass tint
      let glassColor = vec3f(0.9, 0.95, 1.0);
      
      // Combine reflection with glass properties
      let finalColor = mix(glassColor, envColor, fresnel * ${intensity});
      
      return vec4f(finalColor, ${1.0 - roughness});
    }
  `;

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

      const fragmentShader = device.createShaderModule({
        code: fragmentShaderCode
      });

      // Create render pipeline
      renderPipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
          module: vertexShader,
          entryPoint: 'vs_main'
        },
        fragment: {
          module: fragmentShader,
          entryPoint: 'fs_main',
          targets: [{
            format,
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

  function render() {
    if (!device || !context || !renderPipeline) return;

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
    
    animationId = requestAnimationFrame(render);
  }

  onMount(async () => {
    if (await initWebGPU()) {
      render();
    }
  });

  onDestroy(() => {
    if (animationId) {
      cancelAnimationFrame(animationId);
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