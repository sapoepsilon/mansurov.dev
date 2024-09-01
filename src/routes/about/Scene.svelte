<script lang="ts">
    import { T, useFrame } from '@threlte/core'
    import { useGltf } from '@threlte/extras'
    import { spring } from 'svelte/motion'
    import { onMount } from 'svelte'
    import * as THREE from 'three'

    // Load the GLTF model
    const gltf = useGltf('./ismatulla.glb')

    // Set up rotation, scale, and camera position springs
    const rotation = spring({ x: 0, y: 0, z: 0 })
    const scale = spring(0.5) // Start small
    const cameraPosition = spring({ x: 0, y: 0, z: 30 }) // Start far away

    // Animation state
    let animationProgress = 0
    const zoomDuration = 0.3 // Zoom happens in the first 30% of the scroll
    const rotateDuration = 0.7 // Rotation happens in the remaining 70%

    // Infographics data
    const infographics = [
        { y: 0.2, text: "Web Developer" },
        { y: 0.4, text: "UI/UX Designer" },
        { y: 0.6, text: "3D Enthusiast" },
        { y: 0.8, text: "Problem Solver" }
    ]

    // Track scroll position
    let scrollY = 0

    onMount(() => {
        const handleScroll = () => {
            scrollY = window.scrollY / (document.body.offsetHeight - window.innerHeight)
            animationProgress = Math.min(scrollY / 0.5, 1) // Animation completes halfway through the scroll
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    })

    // Update model based on scroll position
    useFrame(() => {
        if (animationProgress < zoomDuration) {
            // Zoom in phase
            const zoomProgress = animationProgress / zoomDuration
            scale.set(0.5 + zoomProgress * 5.5) // Scale from 0.5 to 6
            cameraPosition.set({ x: 0, y: 0, z: 30 - zoomProgress * 20 }) // Move camera from z=30 to z=10
        } else {
            // Rotation phase
            const rotateProgress = (animationProgress - zoomDuration) / rotateDuration
            rotation.set({ x: 0, y: rotateProgress * Math.PI * 2, z: 0 }) // Full 360 degree rotation
        }
    })

    // Function to create text texture
    function createTextTexture(text: string) {
        const canvas = document.createElement('canvas')
        canvas.width = 256
        canvas.height = 128
        const context = canvas.getContext('2d')
        if (context) {
            context.fillStyle = 'white'
            context.font = '24px Arial'
            context.fillText(text, 10, 64)
        }
        return canvas
    }
</script>

<T.PerspectiveCamera
        makeDefault
        position={[$cameraPosition.x, $cameraPosition.y, $cameraPosition.z]}
        fov={50}
/>

<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[10, 10, 10]} />

{#await gltf}
    <T.Mesh>
        <T.SphereGeometry args={[1, 32, 32]} />
        <T.MeshStandardMaterial color="#cccccc" />
    </T.Mesh>
{:then data}
    <T is={data.scene} rotation={[$rotation.x, $rotation.y, $rotation.z]} scale={$scale} />
{/await}

{#each infographics as info}
    {#if scrollY > info.y - 0.1 && scrollY < info.y + 0.1}
        <T.Sprite scale={1} position={[6, (info.y - 0.5) * 8, 0]}>
            <T.SpriteMaterial>
                <T.CanvasTexture args={[createTextTexture(info.text)]} />
            </T.SpriteMaterial>
        </T.Sprite>
    {/if}
{/each}
