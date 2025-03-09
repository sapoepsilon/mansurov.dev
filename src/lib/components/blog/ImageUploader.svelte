<script>
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import * as Form from "$lib/components/ui/form";
    
    export let form;
    export let formData;
    export let imagePreview = '';
    export let dragActive = false;
    export let imageWidth = 800;
    export let imageHeight = 600;
    export let insertImageMarkdown;
    
    // Function to get a random image
    function getRandomImage() {
        const randomSeed = Math.random().toString(36).substring(2, 8);
        $formData.imageUrl = `https://picsum.photos/seed/${randomSeed}/${imageWidth}/${imageHeight}`;
    }
    
    // Camera functionality
    let stream = null;
    let videoElement;
    let isCameraActive = false;

    async function toggleCamera() {
        if (isCameraActive) {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                stream = null;
            }
            isCameraActive = false;
            return;
        }

        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoElement) {
                videoElement.srcObject = stream;
                isCameraActive = true;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please check permissions.");
        }
    }

    function takePhoto() {
        if (!videoElement || !isCameraActive) return;
        
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0);
        
        $formData.imageUrl = canvas.toDataURL('image/png');
        toggleCamera(); // Turn off camera after taking photo
    }
</script>

<div class="space-y-4 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
    <h3 class="text-lg font-medium flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Featured Image
    </h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
            class={`border-2 border-dashed rounded-lg p-6 text-center transition-colors h-64 flex flex-col items-center justify-center ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300'}`}
        >
            {#if imagePreview}
                <div class="relative w-full h-full">
                    <img src={imagePreview} alt="Preview" class="mx-auto max-h-full object-contain" />
                    <div class="absolute top-2 right-2 flex space-x-2">
                        <button 
                            type="button" 
                            class="bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                            on:click={() => $formData.imageUrl = ''}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <button 
                            type="button" 
                            class="bg-blue-500 text-white rounded-full p-1.5 hover:bg-blue-600 transition-colors shadow-md"
                            on:click={() => insertImageMarkdown(imagePreview)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            {:else}
                <div class="py-4 flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="text-gray-500 mb-4">Drag & drop an image here or paste from clipboard</p>
                    <Form.Field {form} name="imageUrl">
                        <Form.Control let:attrs>
                            <Input 
                                {...attrs} 
                                bind:value={$formData.imageUrl} 
                                type="url" 
                                placeholder="https://example.com/image.jpg"
                                class="max-w-md mx-auto"
                            />
                        </Form.Control>
                        <Form.FieldErrors class="text-red-500 mt-1" />
                    </Form.Field>
                </div>
            {/if}
        </div>
        
        <div class="space-y-4">
            <div class="flex flex-wrap gap-2">
                <button 
                    type="button" 
                    class="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm"
                    on:click={toggleCamera}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {isCameraActive ? 'Turn Off Camera' : 'Take Photo'}
                </button>
                
                {#if isCameraActive}
                    <button 
                        type="button" 
                        class="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-sm"
                        on:click={takePhoto}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Capture
                    </button>
                {/if}
            </div>
            
            {#if isCameraActive}
                <div class="relative border rounded-md overflow-hidden bg-black">
                    <video 
                        bind:this={videoElement} 
                        autoplay 
                        playsinline 
                        class="w-full h-40 object-cover"
                    ></video>
                </div>
            {/if}
            
            <!-- Image size controls -->
            <div class="mb-3 grid grid-cols-2 gap-2">
                <div>
                    <label class="text-xs text-gray-500 mb-1 block">Width</label>
                    <div class="flex items-center">
                        <input 
                            type="range" 
                            min="400" 
                            max="1200" 
                            step="50" 
                            bind:value={imageWidth}
                            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span class="ml-2 text-xs w-10">{imageWidth}px</span>
                    </div>
                </div>
                <div>
                    <label class="text-xs text-gray-500 mb-1 block">Height</label>
                    <div class="flex items-center">
                        <input 
                            type="range" 
                            min="300" 
                            max="900" 
                            step="50" 
                            bind:value={imageHeight}
                            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span class="ml-2 text-xs w-10">{imageHeight}px</span>
                    </div>
                </div>
            </div>
            
            <div class="flex flex-wrap gap-2">
                <Button 
                    type="button" 
                    on:click={getRandomImage} 
                    variant="outline"
                    class="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
                >
                    Random Image
                </Button>
                
                <slot name="image-search-button"></slot>
            </div>
            
            <slot name="image-search-input"></slot>
        </div>
    </div>
    
    <slot name="search-results"></slot>
</div>
