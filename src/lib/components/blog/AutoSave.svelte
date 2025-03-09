<script>
    export let lastSaved = null;
    export let clearDraft;
</script>

{#if lastSaved}
    <div class="flex justify-between items-center text-xs text-gray-500">
        <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Draft auto-saved at {lastSaved.toLocaleTimeString()}
        </div>
        <button 
            type="button" 
            class="text-red-500 hover:text-red-700"
            on:click={clearDraft}
        >
            Clear saved draft
        </button>
    </div>
{/if}
