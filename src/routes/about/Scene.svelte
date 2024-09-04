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
    const scale = spring(3) // Start with a visible size
    const cameraPosition = spring({ x: 0, y: 0, z: 15 }) // Start closer to the model

    // Lighting
    const lightPosition = spring({ x: 5, y: 5, z: 5 })

    // Animation state
    let animationProgress = 0
    const zoomDuration = 0.2
    const lightPanDuration = 0.8
    const rotateDuration = 0.4

    // Resume data
    const resumeInfo = [
        { text: "Ismatulla Mansurov", type: "header" },
        { text: "ismatulla@mansurov.dev | mansurov.dev | github.com/sapoepsilon", type: "subheader" },
        { text: "Lead Developer at Vius Built", type: "experience" },
        { text: "Software Engineer at Sorenson Communications", type: "experience" },
        { text: "Computer Science TA at Ensign College", type: "experience" },
        { text: "Job Match Analyzer Project", type: "project" },
        { text: "Jarvis Assistant Project", type: "project" },
        { text: "mansurov.dev GitHub Project", type: "project" },
        { text: "Bachelor of Science in Software Engineering", type: "education" },
        { text: "Skills: Python, Swift, TypeScript, Java, Django, Next.js, React, Docker, Kubernetes, AWS", type: "skills" }
    ]

    // Track scroll position
    let scrollY = 0

    onMount(() => {
        const handleScroll = () => {
            scrollY = window.scrollY / (document.body.offsetHeight - window.innerHeight)
            animationProgress = Math.min(scrollY / 0.5, 1)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    })

    // Update model based on scroll position
    useFrame(() => {
        if (animationProgress < zoomDuration) {
            const zoomProgress = animationProgress / zoomDuration
            scale.set(3 + zoomProgress * 3)
            cameraPosition.set({ x: 0, y: 0, z: 15 - zoomProgress * 5 })
        } else if (animationProgress < zoomDuration + lightPanDuration) {
            const panProgress = (animationProgress - zoomDuration) / lightPanDuration
            const panAngle = panProgress * Math.PI * 2
            const radius = 10
            lightPosition.set({
                x: Math.cos(panAngle) * radius + 7,
                y: 5 + Math.sin(panAngle) * 2,
                z: Math.sin(panAngle) * radius
            })
        } else {
            const rotateProgress = (animationProgress - zoomDuration - lightPanDuration) / rotateDuration
            rotation.set({
                x: -Math.PI / -8,
                y: rotateProgress * Math.PI * 2,
                z: 0
            })
        }

        // Log values for debugging
        console.log('Animation Progress:', animationProgress)
        console.log('Light Position:', $lightPosition)
        console.log('Camera Position:', $cameraPosition)
        console.log('Model Rotation:', $rotation)
    })

    function createTextTexture(text: string, color: string = 'white') {
        const canvas = document.createElement('canvas')
        canvas.width = 1024
        canvas.height = 128
        const context = canvas.getContext('2d')
        if (context) {
            const gradient = context.createLinearGradient(0, 0, canvas.width, 0)
            gradient.addColorStop(0, color)
            gradient.addColorStop(1, 'white')
            context.fillStyle = gradient
            context.font = 'bold 48px Arial'
            context.fillText(text, 10, 64)
        }
        return canvas
    }

    function getColorForType(type: string): string {
        switch (type) {
            case 'header': return '#FF6B6B';
            case 'subheader': return '#4ECDC4';
            case 'experience': return '#45B7D1';
            case 'project': return '#98D8C8';
            case 'education': return '#F7DC6F';
            case 'skills': return '#AED6F1';
            default: return 'white';
        }
    }
</script>

<T.PerspectiveCamera
        makeDefault
        position={[$cameraPosition.x, $cameraPosition.y, $cameraPosition.z]}
        fov={50}
/>

<T.AmbientLight intensity={0.4} />
<T.DirectionalLight position={[$lightPosition.x, $lightPosition.y, $lightPosition.z]} intensity={1.5} castShadow />
<T.PointLight position={[$lightPosition.x, $lightPosition.y, $lightPosition.z]} intensity={1} distance={20} />
<T.HemisphereLight intensity={0.5} />

{#await gltf}
    <T.Mesh>
        <T.SphereGeometry args={[1, 32, 32]} />
        <T.MeshStandardMaterial color="#cccccc" />
    </T.Mesh>
{:then data}
    <T is={data.scene} rotation={[$rotation.x, $rotation.y, $rotation.z]} scale={$scale} receiveShadow castShadow />
{/await}

{#each resumeInfo as info, index}
    <T.Sprite scale={1.5} position={[8, 10 - index * 2, 0]}>
        <T.SpriteMaterial opacity={Math.max(0, Math.min(1, 1 - Math.abs(scrollY * 10 - index)))} transparent={true}>
            <T.CanvasTexture args={[createTextTexture(info.text, getColorForType(info.type))]} />
        </T.SpriteMaterial>
    </T.Sprite>
{/each}
