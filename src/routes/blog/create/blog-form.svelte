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

<form method="POST" use:enhance>
    <Form.Field {form} name="title">
        <Form.Control let:attrs>
            <Form.Label>Title</Form.Label>
            <Input {...attrs} bind:value={$formData.title} />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="content">
        <Form.Control let:attrs>
            <Form.Label>Content (Markdown)</Form.Label>
            <Textarea {...attrs} bind:value={$formData.content} rows="10" />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="imageUrl">
        <Form.Control let:attrs>
            <Form.Label>Image URL (optional)</Form.Label>
            <Input {...attrs} bind:value={$formData.imageUrl} type="url" />
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <div class="mt-4">
        <h3>Markdown Preview:</h3>
        <div class="border p-4 mt-2">
            {@html renderedMarkdown}
        </div>
    </div>

    {#if imagePreview}
        <div class="mt-4">
            <h3>Image Preview:</h3>
            <img src={imagePreview} alt="Preview" class="mt-2 max-w-full h-auto" />
        </div>
    {/if}

    <Form.Button disabled={$submitting}>
        {$submitting ? 'Creating Post...' : 'Create Post'}
    </Form.Button>
</form>

{#if $submitting}
    <div class="mt-4 text-blue-600">Submitting your post...</div>
{/if}
