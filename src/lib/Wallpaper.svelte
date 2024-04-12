<script>
    import { onMount } from "svelte";
    import ColorThief from "colorthief";
    import iana from "$lib/assets/iana.jpeg";
    import cherry from "$lib/assets/cherry.jpeg";

    let currentIndex = 0; // Current image index
    let mainColor = "#fff"; // Default background color
    let currentImage; // Will hold the current image URL for animation

    const images = [
        {
            url: iana,
        },
        {
            url: cherry,
        },
        // Add more images as needed
    ];

    onMount(() => {
        currentImage = images[0].url;
        loadMainColor(currentImage);
    });

    async function loadMainColor(url) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
            const colorThief = new ColorThief();
            const [r, g, b] = colorThief.getColor(img);
            mainColor = `rgb(${r},${g},${b})`;
        };
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        currentImage = images[currentIndex].url;
        loadMainColor(currentImage);
    }

    function previousImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        currentImage = images[currentIndex].url;
        loadMainColor(currentImage);
    }
</script>

<main style="background-color: {mainColor};">
    <button on:click={previousImage}>←</button>
    <img
        src={currentImage}
        alt="Displayed wallpaper"
        class="fade"
        style="width: 100%; height: auto;"
    />
    <button on:click={nextImage}>→</button>
</main>

<style>
    main {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        padding: 10px;
    }
    button {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        padding: 10px 20px;
        color: white;
        text-shadow: 1px 1px 2px black;
    }
    img {
        max-width: 80%;
        max-height: 80vh;
        object-fit: contain;
    }
    .fade {
        animation: fadeIn 0.5s;
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
