<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  export let intensity = 0.8;
  export let size = 150;
  export let corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-left';

  let canvas: HTMLCanvasElement;
  let device: GPUDevice | null = null;
  let context: GPUCanvasContext | null = null;
  let renderPipeline: GPURenderPipeline | null = null;
  let animationId: number;

  const getCornerPosition = (corner: string) => {
    switch (corner) {
      case 'top-left': return { x: 0.0, y: 0.0 };
      case 'top-right': return { x: 1.0, y: 0.0 };
      case 'bottom-left': return { x: 0.0, y: 1.0 };
      case 'bottom-right': return { x: 1.0, y: 1.0 };
      default: return { x: 0.0, y: 0.0 };
    }
  };

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
      let resolution = vec2f(${size}.0, ${size}.0);
      let uv = coord.xy / resolution;
      
      // Corner position
      let cornerPos = vec2f(${getCornerPosition(corner).x}, ${getCornerPosition(corner).y});
      
      // Distance from corner
      let dist = distance(uv, cornerPos);
      
      // Create radial gradient from corner
      let glare = 1.0 - smoothstep(0.0, 0.7, dist);
      
      // Add some sparkle effect
      let time = ${Date.now() * 0.002};
      let sparkle = sin(dist * 20.0 + time) * 0.1 + 0.9;
      glare *= sparkle;
      
      // Fresnel-like edge enhancement
      let edge = pow(glare, 2.0);
      
      // Final glare color with transparency
      let glareColor = vec3f(1.0, 1.0, 1.0);
      let alpha = edge * ${intensity};
      
      return vec4f(glareColor, alpha);
    }
  `;

  async function initWebGPU() {
    if (!browser || !navigator.gpu) {
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

      const vertexShader = device.createShaderModule({
        code: vertexShaderCode
      });

      const fragmentShader = device.createShaderModule({
        code: fragmentShaderCode
      });

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
      console.warn('WebGPU glare initialization failed:', error);
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

  $: positionClass = (() => {
    switch (corner) {
      case 'top-left': return 'top-0 left-0';
      case 'top-right': return 'top-0 right-0';
      case 'bottom-left': return 'bottom-0 left-0';
      case 'bottom-right': return 'bottom-0 right-0';
      default: return 'top-0 left-0';
    }
  })();
</script>

{#if browser}
<canvas 
  bind:this={canvas}
  class="absolute {positionClass} pointer-events-none mix-blend-screen"
  width={size}
  height={size}
  style="filter: blur(0.5px); opacity: 0.7;"
/>
{/if}

<style>
  canvas {
    image-rendering: optimizeSpeed;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: optimize-contrast;
  }
</style>