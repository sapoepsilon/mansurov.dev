<script lang="ts">
    export let imageUrl: string;
    export let alt: string = "Wallpaper preview";
    import macbookFrame from "$lib/assets/Macbook14.svg";
    import macbookDock from "$lib/assets/dock.png";
</script>

<div class="relative max-w-[1000px] mx-auto aspect-[16/10]">
    <!-- component width -->
    <!-- Screen wrapper (clipped area inside the frame) -->
    <div
        class="absolute inset-[2%] left-[10%] right-[10%] top-[2%] bottom-[10%] overflow-hidden rounded-lg z-20"
    >
        <!-- Background image -->
        <img src={imageUrl} {alt} class="w-full h-full object-cover" />

        <!-- Dock -->
        <div class="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[60%]">
            <div
                class="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-xl"
            ></div>
            <img
                src={macbookDock}
                alt="MacBook Dock"
                class="relative w-full h-auto"
            />
        </div>
    </div>

    <!-- Frame -->
    <img
        src={macbookFrame}
        alt="MacBook Frame"
        class="w-full h-auto relative z-30"
    />
</div>
