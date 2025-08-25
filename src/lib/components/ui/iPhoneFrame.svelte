<script lang="ts">
    export let imageUrl: string;
    export let alt: string = "Wallpaper preview";
    import iPhoneDock from "$lib/assets/iPhone dock.png";
</script>

<div class="relative w-[93%] h-[93%] max-w-xs mx-auto">
    <!-- iPhone Frame (on top) -->
    <div class="relative flex justify-center items-center">
        <img
            src="/src/lib/assets/Apple iPhone 16 Pro White Titanium.svg"
            alt="iPhone 16 Pro frame"
            class="object-contain z-[23] w-full h-full"
        />
        <div>
            <img
                src={imageUrl}
                {alt}
                class="absolute w-[96%] h-[97%] inset-0 m-auto object-cover z-[20] rounded-[28px]"
            />
            <!-- iPhone Dock -->
            <div
                class="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 w-[60%] h-auto z-[22]"
            >
                <div
                    class="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl"
                ></div>
                <img
                    src={iPhoneDock}
                    alt="iPhone dock"
                    class="relative w-full h-auto"
                />
            </div>
        </div>
    </div>
</div>
