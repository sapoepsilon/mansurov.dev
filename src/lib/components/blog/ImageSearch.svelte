<script>
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    
    export let searchQuery = '';
    export let searchResults = [];
    export let isSearching = false;
    export let searchImages;
    export let selectImage;
    export let hasMoreResults = false;
    
    function handleKeydown(e) {
        if (e.key === 'Enter') {
            searchImages();
        }
    }
</script>

<div>
    <h4 class="font-medium mb-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Find Images
    </h4>
    
    <div class="mt-2">
        <Input 
            type="text" 
            bind:value={searchQuery} 
            placeholder="Filter by author or ID..." 
            class="w-full"
            on:keydown={handleKeydown}
        />
    </div>
</div>

{#if searchResults.length > 0}
    <div class="mt-4">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
            {#each searchResults as image}
                <div 
                    class="relative cursor-pointer border rounded-md overflow-hidden hover:opacity-90 transition-opacity group"
                    on:click={() => selectImage(image.urls.regular)}
                >
                    <img 
                        src={image.urls.small} 
                        alt={image.alt_description || 'Search result'} 
                        class="w-full h-24 object-cover"
                        loading="lazy"
                    />
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <div class="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                            <button class="bg-white text-gray-800 rounded-full p-1.5 shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                        By: {image.user.name}
                    </div>
                </div>
            {/each}
        </div>
        
        <div class="flex justify-center mt-4">
            <div class="flex gap-2">
                <button 
                    type="button"
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors text-sm"
                    on:click={() => searchImages(true)}
                    disabled={isSearching}
                >
                    {isSearching ? 'Loading...' : 'Load more images'}
                </button>
                
                <div class="flex items-center gap-2">
                    <button 
                        type="button"
                        class="px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 rounded-md transition-colors text-sm"
                        on:click={() => {
                            const randomId = Math.floor(Math.random() * 1000);
                            selectImage(`https://picsum.photos/id/${randomId}/800/600`);
                        }}
                    >
                        Random
                    </button>
                    
                    <button 
                        type="button"
                        class="px-3 py-2 bg-purple-100 hover:bg-purple-200 dark:bg-purple-800 dark:hover:bg-purple-700 rounded-md transition-colors text-sm"
                        on:click={() => {
                            const randomId = Math.floor(Math.random() * 1000);
                            selectImage(`https://picsum.photos/id/${randomId}/800/600?grayscale`);
                        }}
                    >
                        Grayscale
                    </button>
                    
                    <button 
                        type="button"
                        class="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-800 dark:hover:bg-indigo-700 rounded-md transition-colors text-sm"
                        on:click={() => {
                            const randomId = Math.floor(Math.random() * 1000);
                            selectImage(`https://picsum.photos/id/${randomId}/800/600?blur=2`);
                        }}
                    >
                        Blur
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
