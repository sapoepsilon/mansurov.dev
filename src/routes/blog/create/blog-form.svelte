<!-- routes/blog/create/blog-form.svelte -->
<script lang="ts">
    import { blogSchema, type BlogSchema } from "./schema";
    import {
        type SuperValidated,
        type Infer,
        superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { marked } from 'marked'; // For markdown rendering
    import { onMount } from 'svelte';
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    
    // Import blog components
    import AIAssistant from "$lib/components/blog/AIAssistant.svelte";
    import AutoSave from "$lib/components/blog/AutoSave.svelte";
    import BlogTemplates from "$lib/components/blog/BlogTemplates.svelte";
    import ImageSearch from "$lib/components/blog/ImageSearch.svelte";
    import ImageUploader from "$lib/components/blog/ImageUploader.svelte";
    import MarkdownEditor from "$lib/components/blog/MarkdownEditor.svelte";
    import MarkdownPreview from "$lib/components/blog/MarkdownPreview.svelte";
    import SEOAnalyzer from "$lib/components/blog/SEOAnalyzer.svelte";

    // Define types
    interface ImageResult {
        id: string | number;
        urls: {
            small: string;
            regular: string;
        };
        alt_description: string;
        user: {
            name: string;
            links: { html: string };
        };
        width?: number;
        height?: number;
    }

    interface Template {
        name: string;
        title: string;
        content: string;
    }

    interface SEOScoreType {
        score: number;
        suggestions: string[];
    }

    export let data: SuperValidated<Infer<BlogSchema>>;

    const form = superForm(data, {
        validators: zodClient(blogSchema),
    });

    const { form: formData, enhance, submitting } = form;

    let renderedMarkdown = '';
    let imagePreview = '';
    let activeTab: 'edit' | 'preview' = 'edit';
    let searchQuery = '';
    let searchResults: ImageResult[] = [];
    let isSearching = false;
    let dragActive = false;
    let unsplashPage = 1;
    let hasMoreResults = false;
    let imageWidth = 800;
    let imageHeight = 600;
    let wordCount = 0;
    let charCount = 0;
    let isGeneratingContent = false;
    let aiPrompt = '';
    let lastSaved: Date | null = null;
    let autoSaveInterval: ReturnType<typeof setInterval> | null = null;
    let seoScore: SEOScoreType = { score: 0, suggestions: [] };
    let templates: Template[] = [
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
        // Ensure we're passing a string to marked and getting a string back
        renderedMarkdown = marked($formData.content || '').toString();
        
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
        
        // Set up auto-save
        autoSaveInterval = setInterval(() => {
            if ($formData.title || $formData.content) {
                saveToLocalStorage();
            }
        }, 30000); // Auto-save every 30 seconds
        
        // Try to load from localStorage
        loadFromLocalStorage();
        
        // Check SEO on content changes
        checkSEO();
        
        return () => {
            if (autoSaveInterval) clearInterval(autoSaveInterval);
        };
    });
    
    function saveToLocalStorage(): void {
        try {
            localStorage.setItem('blog_draft', JSON.stringify({
                title: $formData.title,
                content: $formData.content,
                imageUrl: $formData.imageUrl,
                timestamp: new Date().toISOString()
            }));
            lastSaved = new Date();
        } catch (e) {
            console.error('Failed to save draft:', e);
        }
    }
    
    function loadFromLocalStorage(): void {
        try {
            const saved = localStorage.getItem('blog_draft');
            if (saved) {
                const draft = JSON.parse(saved);
                if (!$formData.title && !$formData.content) {
                    $formData.title = draft.title || '';
                    $formData.content = draft.content || '';
                    $formData.imageUrl = draft.imageUrl || '';
                    lastSaved = draft.timestamp ? new Date(draft.timestamp) : null;
                }
            }
        } catch (e) {
            console.error('Failed to load draft:', e);
        }
    }
    
    function clearDraft(): void {
        if (confirm('Are you sure you want to clear your saved draft?')) {
            localStorage.removeItem('blog_draft');
            lastSaved = null;
        }
    }
    
    function checkSEO(): void {
        if (!$formData.title && !$formData.content) return;
        
        const suggestions: string[] = [];
        let score = 0;
        
        // Title checks
        if ($formData.title) {
            if ($formData.title.length < 10) {
                suggestions.push('Title is too short (aim for 50-60 characters)');
            } else if ($formData.title.length > 70) {
                suggestions.push('Title is too long (keep under 70 characters)');
            } else {
                score += 25;
            }
        } else {
            suggestions.push('Add a title to your post');
        }
        
        // Content checks
        if ($formData.content) {
            if (wordCount < 300) {
                suggestions.push('Content is too short (aim for at least 300 words)');
            } else {
                score += 25;
            }
            
            // Check for headings
            if (!$formData.content.includes('#')) {
                suggestions.push('Add headings to structure your content');
            } else {
                score += 15;
            }
            
            // Check for links
            if (!$formData.content.includes('](')) {
                suggestions.push('Add links to enhance your content');
            } else {
                score += 15;
            }
        } else {
            suggestions.push('Add content to your post');
        }
        
        // Image check
        if (!$formData.imageUrl) {
            suggestions.push('Add a featured image to improve engagement');
        } else {
            score += 20;
        }
        
        seoScore = { score, suggestions };
    }
    
    // Watch for content changes to update SEO
    $: if ($formData.title || $formData.content) {
        checkSEO();
    }

    // Function to search for images using Lorem Picsum
    async function searchImages(loadMore = false): Promise<void> {
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
                    filteredData = data.filter((img: any) => 
                        img.author.toLowerCase().includes(query) || 
                        img.id.toString().includes(query)
                    );
                }
                
                // Transform data to match our expected format
                const formattedResults: ImageResult[] = filteredData.map((img: any) => ({
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
                const placeholders: ImageResult[] = Array(12).fill(null).map((_, i) => {
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
            const placeholders: ImageResult[] = Array(12).fill(null).map((_, i) => {
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

    function selectImage(imageUrl: string): void {
        $formData.imageUrl = imageUrl;
    }
    
    // Function to get a random image
    function getRandomImage(): void {
        const randomSeed = Math.random().toString(36).substring(2, 8);
        $formData.imageUrl = `https://picsum.photos/seed/${randomSeed}/${imageWidth}/${imageHeight}`;
    }
    
    // Function to apply a template
    function applyTemplate(template: Template): void {
        if (confirm("This will replace your current title and content. Continue?")) {
            $formData.title = template.title;
            $formData.content = template.content;
            saveToLocalStorage();
        }
    }
    
    // Function to generate content with AI
    async function generateContent(): Promise<void> {
        if (!aiPrompt.trim()) {
            alert("Please enter a prompt for the AI");
            return;
        }
        
        isGeneratingContent = true;
        
        try {
            // This is a mock implementation - in a real app, you would call an API
            // like OpenAI, Anthropic, or your own backend service
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
            
            // Generate mock content based on the prompt
            const generatedContent = generateMockContent(aiPrompt);
            
            // Insert at cursor position or append
            const textarea = document.querySelector('textarea');
            if (textarea) {
                const cursorPos = textarea.selectionStart || 0;
                $formData.content = 
                    ($formData.content?.substring(0, cursorPos) || '') + 
                    generatedContent + 
                    ($formData.content?.substring(cursorPos) || '');
            } else {
                $formData.content = ($formData.content || '') + generatedContent;
            }
            
            aiPrompt = '';
            saveToLocalStorage();
            
        } catch (error) {
            console.error('Error generating content:', error);
            alert('Failed to generate content. Please try again.');
        } finally {
            isGeneratingContent = false;
        }
    }
    
    // Mock content generation (replace with actual AI API in production)
    function generateMockContent(prompt: string): string {
        const topics: Record<string, string> = {
            'introduction': '## Introduction\n\nWelcome to this article about ' + prompt + '. In the following sections, we will explore the key aspects and provide valuable insights on this topic.\n\n',
            'benefits': '## Benefits of ' + prompt + '\n\n- Improved efficiency and productivity\n- Enhanced user experience\n- Cost-effective solution\n- Scalable for future growth\n\n',
            'tutorial': '## How to Get Started with ' + prompt + '\n\n1. First, understand the basic concepts\n2. Set up your environment\n3. Follow best practices\n4. Test and iterate your approach\n\n',
            'conclusion': '## Conclusion\n\nIn summary, ' + prompt + ' offers significant advantages for those willing to invest the time to learn and implement it properly. The key takeaways from this article should help you get started on your journey.\n\n'
        };
        
        // Select a random section type or use a specific one based on the prompt
        let sectionType: string = 'introduction';
        if (prompt.toLowerCase().includes('benefit') || prompt.toLowerCase().includes('advantage')) {
            sectionType = 'benefits';
        } else if (prompt.toLowerCase().includes('how') || prompt.toLowerCase().includes('tutorial')) {
            sectionType = 'tutorial';
        } else if (prompt.toLowerCase().includes('conclusion') || prompt.toLowerCase().includes('summary')) {
            sectionType = 'conclusion';
        }
        
        return topics[sectionType] || topics['introduction'];
    }

    // Handle file drop
    function handleDragOver(e: DragEvent): void {
        e.preventDefault();
        dragActive = true;
    }

    function handleDragLeave(): void {
        dragActive = false;
    }

    function handleDrop(e: DragEvent): void {
        e.preventDefault();
        dragActive = false;
        
        if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        $formData.imageUrl = event.target.result.toString();
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    }

    // Insert markdown for images
    function insertImageMarkdown(imageUrl: string): void {
        const imageMarkdown = `![Image](${imageUrl})`;
        const textarea = document.querySelector('textarea');
        if (!textarea) return;
        
        const cursorPos = textarea.selectionStart || 0;
        
        $formData.content = 
            ($formData.content?.substring(0, cursorPos) || '') + 
            imageMarkdown + 
            ($formData.content?.substring(cursorPos) || '');
    }

    // Handle paste from clipboard
    function handlePaste(e: ClipboardEvent): void {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const blob = items[i].getAsFile();
                if (blob) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (event.target?.result) {
                            $formData.imageUrl = event.target.result.toString();
                        }
                    };
                    reader.readAsDataURL(blob);
                }
                break;
            }
        }
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
                    <BlogTemplates {templates} {applyTemplate} />
                </div>
            </div>
            
            <!-- Auto-save indicator -->
            <AutoSave lastSaved={lastSaved} {clearDraft} />
            
            <!-- SEO Score -->
            <SEOAnalyzer seoScore={{
                score: seoScore.score,
                suggestions: seoScore.suggestions
            }} />

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
                <div class="relative">
                    <MarkdownEditor {form} formData={$formData} {wordCount} {charCount}>
                        <svelte:fragment slot="ai-button">
                            <AIAssistant bind:aiPrompt {isGeneratingContent} {generateContent} />
                        </svelte:fragment>
                    </MarkdownEditor>
                </div>
            {:else}
                <MarkdownPreview renderedMarkdown={renderedMarkdown} />
            {/if}

            <!-- Featured Image Section -->
            <ImageUploader {form} formData={$formData} {imagePreview} {dragActive} {imageWidth} {imageHeight} {insertImageMarkdown}>
                <svelte:fragment slot="image-search-button">
                    <Button 
                        type="button" 
                        on:click={() => searchImages()} 
                        disabled={isSearching}
                        variant="outline"
                        class="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
                    >
                        {isSearching ? 'Loading...' : 'Browse Images'}
                    </Button>
                </svelte:fragment>
                
                <svelte:fragment slot="image-search-input">
                    <ImageSearch 
                        bind:searchQuery 
                        bind:searchResults 
                        bind:isSearching 
                        {searchImages} 
                        {selectImage} 
                        {hasMoreResults} 
                    />
                </svelte:fragment>
            </ImageUploader>

            <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="flex gap-2">
                    <Form.Button 
                        disabled={$submitting}
                        class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 rounded-md transition-all transform hover:scale-105 font-medium text-lg shadow-md"
                    >
                        {$submitting ? 'Creating Post...' : 'Create Post'}
                    </Form.Button>
                    
                    <button
                        type="button"
                        class="py-3 px-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
                        on:click={() => saveToLocalStorage()}
                    >
                        Save Draft
                    </button>
                </div>
                
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
