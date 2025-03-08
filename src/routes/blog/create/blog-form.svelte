<!-- routes/blog/create/blog-form.svelte -->
<script lang="ts">
    import { Textarea } from "$lib/components/ui/textarea";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { blogSchema, type BlogSchema } from "./schema";
    import {
        type SuperValidated,
        type Infer,
        superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { marked } from 'marked'; // For markdown rendering
    import { onMount } from 'svelte';

    export let data: SuperValidated<Infer<BlogSchema>>;

    const form = superForm(data, {
        validators: zodClient(blogSchema),
    });

    const { form: formData, enhance, submitting } = form;

    let renderedMarkdown = '';
    let imagePreview = '';

    $: {
        // Update rendered markdown when content changes
        renderedMarkdown = marked($formData.content);
    }

    $: {
        // Update image preview when imageUrl changes
        imagePreview = $formData.imageUrl || '';
    }

    onMount(() => {
        // Initialize marked options if needed
        marked.setOptions({
            breaks: true,
            gfm: true,
        });
    });
</script>

<div class="max-w-3xl mx-auto p-4">
    <form 
        method="POST" 
        use:enhance 
        class="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8"
        on:dragover={handleDragOver}
        on:dragleave={handleDragLeave}
        on:drop={handleDrop}
        on:paste={handlePaste}
    >
        <div class="flex items-center justify-center">
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-lg">
                <h1 class="text-2xl sm:text-3xl font-bold text-center bg-white dark:bg-gray-800 p-2 rounded">Create New Blog Post</h1>
            </div>
        </div>
        
        <div class="space-y-6">
            <Form.Field {form} name="title">
                <Form.Control let:attrs>
                    <Form.Label class="text-lg font-medium">Title</Form.Label>
                    <Input 
                        {...attrs} 
                        bind:value={$formData.title} 
                        class="w-full text-lg border-2 focus:ring-2 focus:ring-blue-500 transition-all" 
                        placeholder="Enter a catchy title" 
                    />
                </Form.Control>
                <Form.FieldErrors class="text-red-500 mt-1" />
            </Form.Field>

            <!-- Tabs for Edit/Preview -->
            <div class="border-b-2 border-gray-200 dark:border-gray-700">
                <div class="flex space-x-4">
                    <button 
                        type="button"
                        class={`py-2 px-4 font-medium transition-all ${activeTab === 'edit' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        on:click={() => activeTab = 'edit'}
                    >
                        <span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </span>
                    </button>
                    <button 
                        type="button"
                        class={`py-2 px-4 font-medium transition-all ${activeTab === 'preview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        on:click={() => activeTab = 'preview'}
                    >
                        <span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Preview
                        </span>
                    </button>
                </div>
            </div>

            {#if activeTab === 'edit'}
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
                            <div class="absolute bottom-3 right-3 flex flex-wrap gap-2 bg-white dark:bg-gray-700 p-1 rounded-lg shadow-md">
                                <button 
                                    type="button" 
                                    class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm font-bold transition-colors"
                                    title="Insert bold text"
                                    on:click={() => {
                                        const textarea = document.querySelector('textarea');
                                        const cursorPos = textarea.selectionStart;
                                        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                                        const replacement = selectedText ? `**${selectedText}**` : '**bold text**';
                                        $formData.content = 
                                            $formData.content.substring(0, textarea.selectionStart) + 
                                            replacement + 
                                            $formData.content.substring(textarea.selectionEnd);
                                    }}
                                >
                                    B
                                </button>
                                <button 
                                    type="button" 
                                    class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm italic transition-colors"
                                    title="Insert italic text"
                                    on:click={() => {
                                        const textarea = document.querySelector('textarea');
                                        const cursorPos = textarea.selectionStart;
                                        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                                        const replacement = selectedText ? `*${selectedText}*` : '*italic text*';
                                        $formData.content = 
                                            $formData.content.substring(0, textarea.selectionStart) + 
                                            replacement + 
                                            $formData.content.substring(textarea.selectionEnd);
                                    }}
                                >
                                    I
                                </button>
                                <button 
                                    type="button" 
                                    class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                                    title="Insert heading"
                                    on:click={() => {
                                        const textarea = document.querySelector('textarea');
                                        const cursorPos = textarea.selectionStart;
                                        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                                        const replacement = selectedText ? `## ${selectedText}` : '## Heading';
                                        $formData.content = 
                                            $formData.content.substring(0, textarea.selectionStart) + 
                                            replacement + 
                                            $formData.content.substring(textarea.selectionEnd);
                                    }}
                                >
                                    H
                                </button>
                                <button 
                                    type="button" 
                                    class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                                    title="Insert link"
                                    on:click={() => {
                                        const textarea = document.querySelector('textarea');
                                        const cursorPos = textarea.selectionStart;
                                        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                                        const replacement = selectedText ? `[${selectedText}](url)` : '[link text](url)';
                                        $formData.content = 
                                            $formData.content.substring(0, textarea.selectionStart) + 
                                            replacement + 
                                            $formData.content.substring(textarea.selectionEnd);
                                    }}
                                >
                                    🔗
                                </button>
                                <button 
                                    type="button" 
                                    class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                                    title="Insert list"
                                    on:click={() => {
                                        const textarea = document.querySelector('textarea');
                                        const cursorPos = textarea.selectionStart;
                                        const replacement = "\n- List item 1\n- List item 2\n- List item 3\n";
                                        $formData.content = 
                                            $formData.content.substring(0, cursorPos) + 
                                            replacement + 
                                            $formData.content.substring(cursorPos);
                                    }}
                                >
                                    •
                                </button>
                                <button 
                                    type="button" 
                                    class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                                    title="Insert code block"
                                    on:click={() => {
                                        const textarea = document.querySelector('textarea');
                                        const cursorPos = textarea.selectionStart;
                                        const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                                        const replacement = selectedText ? 
                                            "```\n" + selectedText + "\n```" : 
                                            "```\ncode block\n```";
                                        $formData.content = 
                                            $formData.content.substring(0, textarea.selectionStart) + 
                                            replacement + 
                                            $formData.content.substring(textarea.selectionEnd);
                                    }}
                                >
                                    &lt;/&gt;
                                </button>
                            </div>
                        </div>
                    </Form.Control>
                    <Form.FieldErrors class="text-red-500 mt-1" />
                </Form.Field>
            {:else}
                <div class="border-2 rounded-md p-6 prose dark:prose-invert max-w-none min-h-[250px] bg-gray-50 dark:bg-gray-900 shadow-inner">
                    {@html renderedMarkdown || '<p class="text-gray-400 text-center italic mt-12">Preview will appear here...</p>'}
                </div>
            {/if}

            <!-- Featured Image Section -->
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
                        
                        <!-- Image Search -->
                        <div>
                            <h4 class="font-medium mb-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Search for images
                            </h4>
                            <div class="flex space-x-2">
                                <Input 
                                    type="text" 
                                    bind:value={searchQuery} 
                                    placeholder="Search for images..." 
                                    class="flex-grow"
                                    on:keydown={(e) => e.key === 'Enter' && searchImages()}
                                />
                                <Button 
                                    type="button" 
                                    on:click={() => searchImages()} 
                                    disabled={isSearching}
                                    variant="outline"
                                    class="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
                                >
                                    {isSearching ? 'Searching...' : 'Search'}
                                </Button>
                            </div>
                        </div>
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
                                </div>
                            {/each}
                        </div>
                        
                        {#if hasMoreResults}
                            <div class="flex justify-center mt-4">
                                <button 
                                    type="button"
                                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors text-sm"
                                    on:click={() => searchImages(true)}
                                    disabled={isSearching}
                                >
                                    {isSearching ? 'Loading...' : 'Load more images'}
                                </button>
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>

            <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Form.Button 
                    disabled={$submitting}
                    class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 rounded-md transition-all transform hover:scale-105 font-medium text-lg shadow-md"
                >
                    {$submitting ? 'Creating Post...' : 'Create Post'}
                </Form.Button>
                
                {#if $submitting}
                    <div class="text-blue-600 flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting your post...
                    </div>
                {/if}
            </div>
        </div>
    </form>
</div>
