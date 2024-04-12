<script>
    import { onMount } from "svelte";
    import ColorThief from "colorthief";
    import iana from "$lib/assets/iana.jpeg";
    import cherry from "$lib/assets/cherry.jpeg";

    let currentIndex = 0;
    let mainColor = "linear-gradient(135deg, #ffffff, #ffffff)"; // Start with a default white gradient
    const images = [
        {
            url: iana,
        },
        {
            url: cherry,
        },
    ];

    let animationClass = "";

    onMount(() => {
        loadMainColors(images[0].url);
    });

    async function loadMainColors(url) {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => {
            const colorThief = new ColorThief();
            const palette = colorThief.getPalette(img, 2); // Get two dominant colors
            mainColor = `linear-gradient(135deg, rgb(${palette[0].join(",")}), rgb(${palette[1].join(",")}))`;
        };
    }

    function changeImage(direction) {
        animationClass = direction;
        setTimeout(() => {
            animationClass = "";
            currentIndex =
                direction === "next"
                    ? (currentIndex + 1) % images.length
                    : (currentIndex - 1 + images.length) % images.length;
            loadMainColors(images[currentIndex].url);
        }, 250); // Halfway through the animation to switch the image
    }
</script>

<main style="background: {mainColor}; transition: background 0.5s ease;">
    <button on:click={() => changeImage("previous")}>←</button>
    <div class="image-container">
        <img
            class={animationClass}
            src={images[currentIndex].url}
            alt="Displayed wallpaper"
        />
    </div>
    <button on:click={() => changeImage("next")}>→</button>
</main>

<style>
    main {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        padding: 10px;
        position: relative;
    }
    .image-container {
        width: 80%;
        height: 80vh;
        overflow: hidden;
        position: relative;
    }
    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        position: absolute;
        transition: transform 0.5s ease;
    }
    img.next {
        transform: translateX(100%);
    }
    img.previous {
        transform: translateX(-100%);
    }
    button {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        padding: 10px 20px;
        color: white;
        text-shadow: 1px 1px 2px black;
        z-index: 1;
    }
</style>
