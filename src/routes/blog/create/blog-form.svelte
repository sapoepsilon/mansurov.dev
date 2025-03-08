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
        class="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        on:dragover={handleDragOver}
        on:dragleave={handleDragLeave}
        on:drop={handleDrop}
    >
        <h1 class="text-2xl font-bold text-center mb-6">Create New Blog Post</h1>
        
        <div class="space-y-4">
            <Form.Field {form} name="title">
                <Form.Control let:attrs>
                    <Form.Label class="text-lg font-medium">Title</Form.Label>
                    <Input {...attrs} bind:value={$formData.title} class="w-full" placeholder="Enter a catchy title" />
                </Form.Control>
                <Form.FieldErrors class="text-red-500" />
            </Form.Field>

            <!-- Tabs for Edit/Preview -->
            <div class="border-b border-gray-200 dark:border-gray-700">
                <div class="flex space-x-4">
                    <button 
                        type="button"
                        class={`py-2 px-4 font-medium ${activeTab === 'edit' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        on:click={() => activeTab = 'edit'}
                    >
                        Edit
                    </button>
                    <button 
                        type="button"
                        class={`py-2 px-4 font-medium ${activeTab === 'preview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        on:click={() => activeTab = 'preview'}
                    >
                        Preview
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
                                class="w-full resize-y min-h-[200px]" 
                                placeholder="Write your blog post content using Markdown..." 
                            />
                            <div class="absolute bottom-2 right-2 flex space-x-2">
                                <button 
                                    type="button" 
                                    class="p-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
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
                                    class="p-1 bg-gray-100 hover:bg-gray-200 rounded text-sm italic"
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
                                    class="p-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
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
                            </div>
                        </div>
                    </Form.Control>
                    <Form.FieldErrors class="text-red-500" />
                </Form.Field>
            {:else}
                <div class="border rounded-md p-4 prose dark:prose-invert max-w-none min-h-[200px] bg-gray-50 dark:bg-gray-900">
                    {@html renderedMarkdown || '<p class="text-gray-400">Preview will appear here...</p>'}
                </div>
            {/if}

            <!-- Featured Image Section -->
            <div class="space-y-4">
                <h3 class="text-lg font-medium">Featured Image</h3>
                
                <div class={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300'}`}>
                    {#if imagePreview}
                        <div class="relative">
                            <img src={imagePreview} alt="Preview" class="mx-auto max-h-64 object-contain" />
                            <button 
                                type="button" 
                                class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                on:click={() => $formData.imageUrl = ''}
                            >
                                ✕
                            </button>
                            <button 
                                type="button" 
                                class="mt-2 text-blue-500 hover:text-blue-700"
                                on:click={() => insertImageMarkdown(imagePreview)}
                            >
                                Insert into content
                            </button>
                        </div>
                    {:else}
                        <div class="py-4">
                            <p class="text-gray-500 mb-2">Drag & drop an image here or paste a URL</p>
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
                                <Form.FieldErrors class="text-red-500" />
                            </Form.Field>
                        </div>
                    {/if}
                </div>

                <!-- Image Search -->
                <div class="mt-4">
                    <h4 class="font-medium mb-2">Search for images</h4>
                    <div class="flex space-x-2">
                        <Input 
                            type="text" 
                            bind:value={searchQuery} 
                            placeholder="Search for images..." 
                            class="flex-grow"
                        />
                        <Button 
                            type="button" 
                            on:click={searchImages} 
                            disabled={isSearching}
                            variant="outline"
                        >
                            {isSearching ? 'Searching...' : 'Search'}
                        </Button>
                    </div>
                    
                    {#if searchResults.length > 0}
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                            {#each searchResults as image}
                                <div 
                                    class="relative cursor-pointer border rounded overflow-hidden hover:opacity-90 transition-opacity"
                                    on:click={() => selectImage(image.urls.regular)}
                                >
                                    <img 
                                        src={image.urls.small} 
                                        alt={image.alt_description || 'Search result'} 
                                        class="w-full h-24 object-cover"
                                    />
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>

            <div class="pt-4">
                <Form.Button 
                    disabled={$submitting}
                    class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors"
                >
                    {$submitting ? 'Creating Post...' : 'Create Post'}
                </Form.Button>
                
                {#if $submitting}
                    <div class="mt-4 text-blue-600 flex items-center justify-center">
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
