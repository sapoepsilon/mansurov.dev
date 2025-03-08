<!-- routes/blog/create/blog-form.svelte -->
<script lang="ts">
    import { Textarea } from "$lib/components/ui/textarea";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
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
    let activeTab = 'edit'; // 'edit' or 'preview'
    let searchQuery = '';
    let searchResults = [];
    let isSearching = false;
    let dragActive = false;
    let unsplashPage = 1;
    let hasMoreResults = false;
    let imageWidth = 800;
    let imageHeight = 600;
    let wordCount = 0;
    let charCount = 0;
    let templates = [
        { 
            name: "Tutorial", 
            title: "How to: [Your Topic]",
            content: "## Introduction\n\nBriefly explain what this tutorial will cover and why it's useful.\n\n## Prerequisites\n\n- Requirement 1\n- Requirement 2\n\n## Step 1: Getting Started\n\nExplain the first step in detail.\n\n## Step 2: Main Process\n\nDescribe the core part of your tutorial.\n\n## Step 3: Finishing Up\n\nExplain the final steps.\n\n## Conclusion\n\nSummarize what the reader has learned."
        },
        { 
            name: "Review", 
            title: "Review: [Product/Service Name]",
            content: "## Overview\n\nBrief introduction to what you're reviewing.\n\n## Pros\n\n- Advantage 1\n- Advantage 2\n- Advantage 3\n\n## Cons\n\n- Disadvantage 1\n- Disadvantage 2\n\n## Verdict\n\nYour final thoughts and recommendation."
        },
        { 
            name: "News", 
            title: "Breaking: [News Headline]",
            content: "## What Happened\n\nDescribe the main news event.\n\n## Key Details\n\nProvide important information and context.\n\n## Why It Matters\n\nExplain the significance of this news.\n\n## What's Next\n\nDiscuss potential future developments."
        }
    ];

    $: {
        // Update rendered markdown when content changes
        renderedMarkdown = marked($formData.content);
        
        // Update word and character count
        if ($formData.content) {
            // Remove markdown syntax for more accurate counting
            const plainText = $formData.content.replace(/\*\*|__|\*|_|`|#|>|\[.*?\]\(.*?\)|!\[.*?\]\(.*?\)|^\s*[-*+]\s+/gm, '');
            wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
            charCount = plainText.length;
        } else {
            wordCount = 0;
            charCount = 0;
        }
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

    // Function to search for images using Lorem Picsum
    async function searchImages(loadMore = false) {
        if (!searchQuery.trim() && !loadMore) return;
        
        if (!loadMore) {
            unsplashPage = 1;
            searchResults = [];
        }
        
        isSearching = true;
        try {
            // Using Lorem Picsum API - no API key required
            const response = await fetch(`https://picsum.photos/v2/list?page=${unsplashPage}&limit=12`);
            
            if (response.ok) {
                const data = await response.json();
                
                // Filter images by search query if provided
                let filteredData = data;
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    filteredData = data.filter(img => 
                        img.author.toLowerCase().includes(query) || 
                        img.id.toString().includes(query)
                    );
                }
                
                // Transform data to match our expected format
                const formattedResults = filteredData.map(img => ({
                    id: img.id,
                    urls: {
                        small: `https://picsum.photos/id/${img.id}/300/200`,
                        regular: `https://picsum.photos/id/${img.id}/800/600`
                    },
                    alt_description: `Photo by ${img.author}`,
                    user: {
                        name: img.author,
                        links: { html: img.url || "#" }
                    },
                    width: img.width,
                    height: img.height
                }));
                
                if (loadMore) {
                    searchResults = [...searchResults, ...formattedResults];
                } else {
                    searchResults = formattedResults;
                }
                
                // Picsum has 30+ pages of images
                hasMoreResults = true;
                unsplashPage++;
            } else {
                console.error('Failed to fetch images');
                // Generate random image placeholders using Picsum
                const placeholders = Array(12).fill().map((_, i) => {
                    const randomId = Math.floor(Math.random() * 1000);
                    return {
                        id: randomId,
                        urls: {
                            small: `https://picsum.photos/seed/${randomId}/300/200`,
                            regular: `https://picsum.photos/seed/${randomId}/800/600`
                        },
                        alt_description: `Random image ${i+1}`,
                        user: {
                            name: "Lorem Picsum",
                            links: { html: "https://picsum.photos" }
                        }
                    };
                });
                
                if (loadMore) {
                    searchResults = [...searchResults, ...placeholders];
                } else {
                    searchResults = placeholders;
                }
                hasMoreResults = true;
            }
        } catch (error) {
            console.error('Error searching images:', error);
            // Generate random image placeholders using Picsum
            const placeholders = Array(12).fill().map((_, i) => {
                const randomId = Math.floor(Math.random() * 1000);
                return {
                    id: randomId,
                    urls: {
                        small: `https://picsum.photos/seed/${randomId}/300/200`,
                        regular: `https://picsum.photos/seed/${randomId}/800/600`
                    },
                    alt_description: `Random image ${i+1}`,
                    user: {
                        name: "Lorem Picsum",
                        links: { html: "https://picsum.photos" }
                    }
                };
            });
            
            if (loadMore) {
                searchResults = [...searchResults, ...placeholders];
            } else {
                searchResults = placeholders;
            }
            hasMoreResults = true;
        } finally {
            isSearching = false;
        }
    }

    function selectImage(imageUrl) {
        $formData.imageUrl = imageUrl;
    }
    
    // Function to get a random image
    function getRandomImage() {
        const randomSeed = Math.random().toString(36).substring(2, 8);
        $formData.imageUrl = `https://picsum.photos/seed/${randomSeed}/${imageWidth}/${imageHeight}`;
    }
    
    // Function to apply a template
    function applyTemplate(template) {
        if (confirm("This will replace your current title and content. Continue?")) {
            $formData.title = template.title;
            $formData.content = template.content;
        }
    }

    // Handle file drop
    function handleDragOver(e) {
        e.preventDefault();
        dragActive = true;
    }

    function handleDragLeave() {
        dragActive = false;
    }

    function handleDrop(e) {
        e.preventDefault();
        dragActive = false;
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    $formData.imageUrl = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    }

    // Insert markdown for images
    function insertImageMarkdown(imageUrl) {
        const imageMarkdown = `![Image](${imageUrl})`;
        const textarea = document.querySelector('textarea');
        const cursorPos = textarea.selectionStart;
        
        $formData.content = 
            $formData.content.substring(0, cursorPos) + 
            imageMarkdown + 
            $formData.content.substring(cursorPos);
    }

    // Handle paste from clipboard
    async function handlePaste(e) {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = (event) => {
                    $formData.imageUrl = event.target.result;
                };
                reader.readAsDataURL(blob);
                break;
            }
        }
    }

    // Take screenshot from webcam
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
            <div class="flex flex-col md:flex-row gap-4">
                <Form.Field {form} name="title" class="flex-grow">
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
                
                <div class="w-full md:w-auto">
                    <label class="text-lg font-medium block mb-2">Templates</label>
                    <div class="relative">
                        <select 
                            class="w-full md:w-48 h-10 pl-3 pr-8 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => {
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
                </div>
            </div>

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
                            <div class="absolute bottom-3 right-3 flex flex-wrap gap-2 bg-white dark:bg-gray-700 p-2 rounded-lg shadow-md">
                                <div class="flex gap-1">
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
                                        title="Insert strikethrough"
                                        on:click={() => {
                                            const textarea = document.querySelector('textarea');
                                            const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                                            const replacement = selectedText ? `~~${selectedText}~~` : '~~strikethrough~~';
                                            $formData.content = 
                                                $formData.content.substring(0, textarea.selectionStart) + 
                                                replacement + 
                                                $formData.content.substring(textarea.selectionEnd);
                                        }}
                                    >
                                        S
                                    </button>
                                </div>
                                
                                <div class="flex gap-1">
                                    <button 
                                        type="button" 
                                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                                        title="Insert H1 heading"
                                        on:click={() => {
                                            const textarea = document.querySelector('textarea');
                                            const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                                            const replacement = selectedText ? `# ${selectedText}` : '# Heading 1';
                                            $formData.content = 
                                                $formData.content.substring(0, textarea.selectionStart) + 
                                                replacement + 
                                                $formData.content.substring(textarea.selectionEnd);
                                        }}
                                    >
                                        H1
                                    </button>
                                    <button 
                                        type="button" 
                                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                                        title="Insert H2 heading"
                                        on:click={() => {
                                            const textarea = document.querySelector('textarea');
                                            const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                                            const replacement = selectedText ? `## ${selectedText}` : '## Heading 2';
                                            $formData.content = 
                                                $formData.content.substring(0, textarea.selectionStart) + 
                                                replacement + 
                                                $formData.content.substring(textarea.selectionEnd);
                                        }}
                                    >
                                        H2
                                    </button>
                                    <button 
                                        type="button" 
                                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                                        title="Insert H3 heading"
                                        on:click={() => {
                                            const textarea = document.querySelector('textarea');
                                            const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                                            const replacement = selectedText ? `### ${selectedText}` : '### Heading 3';
                                            $formData.content = 
                                                $formData.content.substring(0, textarea.selectionStart) + 
                                                replacement + 
                                                $formData.content.substring(textarea.selectionEnd);
                                        }}
                                    >
                                        H3
                                    </button>
                                </div>
                                
                                <div class="flex gap-1">
                                    <button 
                                        type="button" 
                                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                                        title="Insert link"
                                        on:click={() => {
                                            const textarea = document.querySelector('textarea');
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
                                        title="Insert bullet list"
                                        on:click={() => {
                                            const textarea = document.querySelector('textarea');
                                            const replacement = "\n- List item 1\n- List item 2\n- List item 3\n";
                                            $formData.content = 
                                                $formData.content.substring(0, textarea.selectionStart) + 
                                                replacement + 
                                                $formData.content.substring(textarea.selectionEnd);
                                        }}
                                    >
                                        •
                                    </button>
                                    <button 
                                        type="button" 
                                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                                        title="Insert numbered list"
                                        on:click={() => {
                                            const textarea = document.querySelector('textarea');
                                            const replacement = "\n1. First item\n2. Second item\n3. Third item\n";
                                            $formData.content = 
                                                $formData.content.substring(0, textarea.selectionStart) + 
                                                replacement + 
                                                $formData.content.substring(textarea.selectionEnd);
                                        }}
                                    >
                                        1.
                                    </button>
                                    <button 
                                        type="button" 
                                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                                        title="Insert blockquote"
                                        on:click={() => {
                                            const textarea = document.querySelector('textarea');
                                            const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
                                            const replacement = selectedText ? `> ${selectedText}` : '> Blockquote text';
                                            $formData.content = 
                                                $formData.content.substring(0, textarea.selectionStart) + 
                                                replacement + 
                                                $formData.content.substring(textarea.selectionEnd);
                                        }}
                                    >
                                        "
                                    </button>
                                    <button 
                                        type="button" 
                                        class="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-sm transition-colors"
                                        title="Insert code block"
                                        on:click={() => {
                                            const textarea = document.querySelector('textarea');
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
                            
                            <div class="absolute bottom-3 left-3 text-xs text-gray-500">
                                {wordCount} words | {charCount} characters
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
                                Find Images
                            </h4>
                            
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
                                
                                <Button 
                                    type="button" 
                                    on:click={() => searchImages()} 
                                    disabled={isSearching}
                                    variant="outline"
                                    class="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
                                >
                                    {isSearching ? 'Loading...' : 'Browse Images'}
                                </Button>
                            </div>
                            
                            <div class="mt-2">
                                <Input 
                                    type="text" 
                                    bind:value={searchQuery} 
                                    placeholder="Filter by author or ID..." 
                                    class="w-full"
                                    on:keydown={(e) => e.key === 'Enter' && searchImages()}
                                />
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
