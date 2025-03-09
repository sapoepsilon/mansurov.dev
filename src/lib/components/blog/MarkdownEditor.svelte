<script lang="ts">
    import { Textarea } from "$lib/components/ui/textarea";
    import * as Form from "$lib/components/ui/form";
    
    export let form;
    export let formData;
    export let wordCount = 0;
    export let charCount = 0;
    
    // Function to insert text at cursor position
    function insertAtCursor(textToInsert) {
        const textarea = document.querySelector('textarea');
        if (!textarea) return;
        
        const cursorPos = textarea.selectionStart;
        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
        const replacement = selectedText ? textToInsert.replace('{}', selectedText) : textToInsert;
        
        formData.content = 
            formData.content.substring(0, textarea.selectionStart) + 
            replacement + 
            formData.content.substring(textarea.selectionEnd);
    }
    
    // Formatting functions
    function insertBold() {
        insertAtCursor('**{}**');
    }
    
    function insertItalic() {
        insertAtCursor('*{}*');
    }
    
    function insertStrikethrough() {
        insertAtCursor('~~{}~~');
    }
    
    function insertH1() {
        insertAtCursor('# {}');
    }
    
    function insertH2() {
        insertAtCursor('## {}');
    }
    
    function insertH3() {
        insertAtCursor('### {}');
    }
    
    function insertLink() {
        insertAtCursor('[{}](url)');
    }
    
    function insertBulletList() {
        insertAtCursor('\n- List item 1\n- List item 2\n- List item 3\n');
    }
    
    function insertNumberedList() {
        insertAtCursor('\n1. First item\n2. Second item\n3. Third item\n');
    }
    
    function insertBlockquote() {
        insertAtCursor('> {}');
    }
    
    function insertCodeBlock() {
        insertAtCursor('```\n{}\n```');
    }
</script>

<Form.Field {form} name="content">
    <Form.Control let:attrs>
        <Form.Label class="text-lg font-medium">Content (Markdown)</Form.Label>
        <div class="relative">
            <Textarea 
                {...attrs} 
                bind:value={$formData.content} 
                rows="12"
                class="w-full resize-y min-h-[250px] border-2 focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="Write your blog post content using Markdown..." 
            />
            <div class="absolute bottom-3 right-3 flex flex-wrap gap-2 bg-white dark:bg-gray-700 p-2 rounded-lg shadow-md">
                <div class="flex gap-1">
                    <button 
                        type="button" 
                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm font-bold transition-colors"
                        title="Insert bold text"
                        on:click={insertBold}
                    >
                        B
                    </button>
                    <button 
                        type="button" 
                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm italic transition-colors"
                        title="Insert italic text"
                        on:click={insertItalic}
                    >
                        I
                    </button>
                    <button 
                        type="button" 
                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                        title="Insert strikethrough"
                        on:click={insertStrikethrough}
                    >
                        S
                    </button>
                </div>
                
                <div class="flex gap-1">
                    <button 
                        type="button" 
                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                        title="Insert H1 heading"
                        on:click={insertH1}
                    >
                        H1
                    </button>
                    <button 
                        type="button" 
                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                        title="Insert H2 heading"
                        on:click={insertH2}
                    >
                        H2
                    </button>
                    <button 
                        type="button" 
                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                        title="Insert H3 heading"
                        on:click={insertH3}
                    >
                        H3
                    </button>
                </div>
                
                <div class="flex gap-1">
                    <button 
                        type="button" 
                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                        title="Insert link"
                        on:click={insertLink}
                    >
                        🔗
                    </button>
                    <button 
                        type="button" 
                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                        title="Insert bullet list"
                        on:click={insertBulletList}
                    >
                        •
                    </button>
                    <button 
                        type="button" 
                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                        title="Insert numbered list"
                        on:click={insertNumberedList}
                    >
                        1.
                    </button>
                    <button 
                        type="button" 
                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                        title="Insert blockquote"
                        on:click={insertBlockquote}
                    >
                        "
                    </button>
                    <button 
                        type="button" 
                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                        title="Insert code block"
                        on:click={insertCodeBlock}
                    >
                        &lt;/&gt;
                    </button>
                </div>
            </div>
            
            <div class="absolute bottom-3 left-3 text-xs text-gray-500">
                {wordCount} words | {charCount} characters
            </div>
            
            <!-- AI Content Generation -->
            <div class="absolute top-3 right-3">
                <slot name="ai-button"></slot>
            </div>
        </div>
    </Form.Control>
    <Form.FieldErrors class="text-red-500 mt-1" />
</Form.Field>
