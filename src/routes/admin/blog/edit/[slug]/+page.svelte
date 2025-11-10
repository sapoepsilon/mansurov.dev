<script lang="ts">
	import { slugify } from '../../schema';
	import MarkdownEditor from '$lib/components/admin/MarkdownEditor.svelte';
	import { cn } from '$lib/utils';
	import { goto } from '$app/navigation';
	import type { Post } from '$lib/types';

	export let data: { post: Post };

	let title = data.post.title;
	let slug = data.post.slug;
	let content = data.post.content;
	let isDraft = data.post.published_at === null;

	let isGeneratingSlug = false;
	let isSubmitting = false;
	let errors: Record<string, string[]> = {};
	let errorMessage = '';
	let successMessage = '';

	function handleSlugInput() {
		isGeneratingSlug = false;
	}

	function handleTitleInput() {
		if (isGeneratingSlug) {
			slug = slugify(title);
		}
	}

	function handleCancel() {
		if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
			goto(`/blog/${data.post.slug}`);
		}
	}

	async function handleSubmit() {
		errors = {};
		errorMessage = '';
		successMessage = '';

		if (!title) {
			errors.title = ['Title is required'];
		}
		if (!slug) {
			errors.slug = ['Slug is required'];
		}
		if (!content) {
			errors.content = ['Content is required'];
		}

		if (Object.keys(errors).length > 0) {
			return;
		}

		isSubmitting = true;

		try {
			const response = await fetch('/api/admin/update-post', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: data.post.id,
					title,
					slug,
					content,
					isDraft,
					publishedAt: !isDraft ? data.post.published_at || new Date().toISOString() : undefined
				})
			});

			const responseData = await response.json();

			if (!response.ok || !responseData.success) {
				if (responseData.errors) {
					errors = responseData.errors;
				} else {
					errorMessage = responseData.message || 'Failed to update post';
				}
				return;
			}

			successMessage = 'Post updated successfully!';

			setTimeout(() => {
				goto(`/blog/${responseData.post.slug}`);
			}, 1000);
		} catch (err) {
			console.error('Submit error:', err);
			errorMessage = 'An error occurred. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Edit: {data.post.title} | Blog Admin</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class="text-3xl font-bold">Edit Blog Post</h1>
		<p class="text-muted-foreground mt-2">
			Editing: <strong>{data.post.title}</strong>
		</p>
	</div>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<div class="grid gap-6 md:grid-cols-2">
			<div class="space-y-2">
				<label for="title" class="text-sm font-medium">
					Title <span class="text-destructive">*</span>
				</label>
				<input
					id="title"
					type="text"
					bind:value={title}
					on:input={handleTitleInput}
					disabled={isSubmitting}
					placeholder="Enter post title"
					class={cn(
						'w-full px-3 py-2 border rounded-md bg-background',
						'focus:outline-none focus:ring-2 focus:ring-primary',
						errors.title && 'border-destructive'
					)}
				/>
				{#if errors.title}
					<p class="text-sm text-destructive">{errors.title[0]}</p>
				{/if}
			</div>

			<div class="space-y-2">
				<label for="slug" class="text-sm font-medium">
					Slug <span class="text-destructive">*</span>
				</label>
				<input
					id="slug"
					type="text"
					bind:value={slug}
					on:input={handleSlugInput}
					disabled={isSubmitting}
					placeholder="post-url-slug"
					class={cn(
						'w-full px-3 py-2 border rounded-md bg-background font-mono text-sm',
						'focus:outline-none focus:ring-2 focus:ring-primary',
						errors.slug && 'border-destructive'
					)}
				/>
				{#if errors.slug}
					<p class="text-sm text-destructive">{errors.slug[0]}</p>
				{/if}
				<p class="text-xs text-muted-foreground">
					The slug will be used in the URL: /blog/{slug || 'your-slug'}
				</p>
			</div>
		</div>

		<div class="space-y-2">
			<label for="content" class="text-sm font-medium">
				Content <span class="text-destructive">*</span>
			</label>
			<MarkdownEditor bind:value={content} postSlug={slug} disabled={isSubmitting} />
			{#if errors.content}
				<p class="text-sm text-destructive">{errors.content[0]}</p>
			{/if}
		</div>

		<div class="flex items-center gap-6">
			<div class="flex items-center space-x-2">
				<input
					id="isDraft"
					type="checkbox"
					bind:checked={isDraft}
					disabled={isSubmitting}
					class="w-4 h-4 rounded border-border"
				/>
				<label for="isDraft" class="text-sm font-medium cursor-pointer"> Save as Draft </label>
			</div>

			{#if !isDraft}
				<div class="text-sm text-muted-foreground">Post is published</div>
			{:else}
				<div class="text-sm text-muted-foreground">Post is a draft</div>
			{/if}
		</div>

		{#if errorMessage}
			<div class="p-4 border border-destructive bg-destructive/10 rounded-md">
				<p class="text-sm text-destructive">{errorMessage}</p>
			</div>
		{/if}

		{#if successMessage}
			<div class="p-4 border border-green-500 bg-green-500/10 rounded-md">
				<p class="text-sm text-green-700 dark:text-green-400">{successMessage}</p>
			</div>
		{/if}

		<div class="flex items-center gap-4">
			<button
				type="submit"
				disabled={isSubmitting}
				class={cn(
					'px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium',
					'hover:bg-primary/90 transition-colors',
					'disabled:opacity-50 disabled:cursor-not-allowed'
				)}
			>
				{#if isSubmitting}
					<span class="flex items-center gap-2">
						<span
							class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
						></span>
						Updating...
					</span>
				{:else}
					Update Post
				{/if}
			</button>

			<button
				type="button"
				on:click={handleCancel}
				disabled={isSubmitting}
				class="px-6 py-2 border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
			>
				Cancel
			</button>
		</div>
	</form>
</div>
