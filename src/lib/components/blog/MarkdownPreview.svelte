<script>
    export let renderedMarkdown = '';
</script>

<div class="border-2 rounded-md p-6 prose dark:prose-invert max-w-none min-h-[250px] bg-gray-50 dark:bg-gray-900 shadow-inner">
    {@html renderedMarkdown || '<p class="text-gray-400 text-center italic mt-12">Preview will appear here...</p>'}
</div>
