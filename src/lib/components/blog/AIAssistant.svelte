<script>
    export let aiPrompt = '';
    export let isGeneratingContent = false;
    export let generateContent;
    
    function openDialog() {
        document.getElementById('aiPromptDialog').showModal();
    }
    
    function closeDialog() {
        document.getElementById('aiPromptDialog').close();
    }
</script>

<button 
    type="button"
    class="flex items-center px-3 py-1.5 bg-purple-100 hover:bg-purple-200 dark:bg-purple-800 dark:hover:bg-purple-700 text-purple-800 dark:text-purple-200 rounded-md transition-colors text-sm font-medium"
    on:click={openDialog}
>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
    AI Assist
</button>

<!-- AI Content Generation Dialog -->
<dialog id="aiPromptDialog" class="p-0 rounded-lg shadow-xl backdrop:bg-black backdrop:bg-opacity-50">
    <div class="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h3 class="text-lg font-bold mb-4">AI Content Assistant</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Describe what you want the AI to write about, and it will generate content for your blog post.
        </p>
        
        <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Your prompt</label>
            <textarea 
                bind:value={aiPrompt}
                class="w-full p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="e.g., Write an introduction about machine learning"
            ></textarea>
        </div>
        
        <div class="flex justify-end gap-2">
            <button 
                type="button"
                class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
                on:click={closeDialog}
            >
                Cancel
            </button>
            <button 
                type="button"
                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center"
                on:click={generateContent}
                disabled={isGeneratingContent || !aiPrompt.trim()}
            >
                {#if isGeneratingContent}
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                {:else}
                    Generate Content
                {/if}
            </button>
        </div>
    </div>
</dialog>
