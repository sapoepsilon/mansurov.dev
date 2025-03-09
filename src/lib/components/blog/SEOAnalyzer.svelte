<script>
    export let seoScore = { score: 0, suggestions: [] };
</script>

<div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
    <div class="flex justify-between items-center mb-2">
        <h3 class="font-medium">SEO Score: {seoScore.score}/100</h3>
        <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
                class="h-full rounded-full" 
                style="width: {seoScore.score}%; background-color: {
                    seoScore.score < 40 ? '#ef4444' : 
                    seoScore.score < 70 ? '#f59e0b' : 
                    '#10b981'
                };"
            ></div>
        </div>
    </div>
    
    {#if seoScore.suggestions.length > 0}
        <div class="text-sm">
            <p class="font-medium mb-1">Suggestions to improve:</p>
            <ul class="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                {#each seoScore.suggestions as suggestion}
                    <li>{suggestion}</li>
                {/each}
            </ul>
        </div>
    {/if}
</div>
