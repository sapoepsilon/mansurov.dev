<script>
    export let templates = [];
    export let applyTemplate;
</script>

<div class="relative">
    <select 
        class="w-full md:w-48 h-10 pl-3 pr-8 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        on:change={(e) => {
            const selectedIndex = e.target.selectedIndex;
            if (selectedIndex > 0) {
                applyTemplate(templates[selectedIndex - 1]);
                e.target.selectedIndex = 0;
            }
        }}
    >
        <option value="">Select template</option>
        {#each templates as template}
            <option value={template.name}>{template.name}</option>
        {/each}
    </select>
    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
    </div>
</div>
