<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { cn } from '$lib/utils';

	export let value: string = '';
	export let postSlug: string = '';
	export let disabled: boolean = false;

	const dispatch = createEventDispatcher();

	let textarea: HTMLTextAreaElement;
	let isDragging = false;
	let isUploading = false;
	let uploadError: string | null = null;

	function handleInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		value = target.value;
		dispatch('input', value);
	}

	function insertText(text: string) {
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const before = value.substring(0, start);
		const after = value.substring(end);

		value = before + text + after;
		dispatch('input', value);

		setTimeout(() => {
			const newPosition = start + text.length;
			textarea.setSelectionRange(newPosition, newPosition);
			textarea.focus();
		}, 0);
	}

	function insertBold() {
		insertText('**bold text**');
	}

	function insertItalic() {
		insertText('*italic text*');
	}

	function insertLink() {
		insertText('[link text](url)');
	}

	function insertHeading() {
		insertText('\n## Heading\n');
	}

	function insertCode() {
		insertText('`code`');
	}

	function insertCodeBlock() {
		insertText('\n```\ncode block\n```\n');
	}

	async function uploadImage(file: File) {
		if (!postSlug) {
			uploadError = 'Please enter a slug before uploading images';
			return;
		}

		isUploading = true;
		uploadError = null;

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('postSlug', postSlug);

			const response = await fetch('/api/admin/upload-image', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Upload failed');
			}

			const data = await response.json();

			if (data.success && data.url) {
				const imageMarkdown = `\n![${file.name}](${data.url})\n`;
				insertText(imageMarkdown);
			} else {
				throw new Error('Invalid response from server');
			}
		} catch (error) {
			console.error('Upload error:', error);
			uploadError = error instanceof Error ? error.message : 'Failed to upload image';
		} finally {
			isUploading = false;
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		const files = event.dataTransfer?.files;
		if (files && files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) {
				uploadImage(file);
			} else {
				uploadError = 'Please drop an image file';
			}
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handlePaste(event: ClipboardEvent) {
		const items = event.clipboardData?.items;
		if (!items) return;

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			if (item.type.startsWith('image/')) {
				event.preventDefault();
				const file = item.getAsFile();
				if (file) {
					uploadImage(file);
				}
				break;
			}
		}
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			uploadImage(file);
		}
	}
</script>

<div class="space-y-2">
	<div class="flex items-center gap-2 flex-wrap border-b pb-2">
		<button
			type="button"
			on:click={insertBold}
			{disabled}
			class="px-3 py-1 text-sm border rounded hover:bg-muted transition-colors"
			title="Bold"
		>
			<strong>B</strong>
		</button>
		<button
			type="button"
			on:click={insertItalic}
			{disabled}
			class="px-3 py-1 text-sm border rounded hover:bg-muted transition-colors"
			title="Italic"
		>
			<em>I</em>
		</button>
		<button
			type="button"
			on:click={insertHeading}
			{disabled}
			class="px-3 py-1 text-sm border rounded hover:bg-muted transition-colors"
			title="Heading"
		>
			H
		</button>
		<button
			type="button"
			on:click={insertLink}
			{disabled}
			class="px-3 py-1 text-sm border rounded hover:bg-muted transition-colors"
			title="Link"
		>
			🔗
		</button>
		<button
			type="button"
			on:click={insertCode}
			{disabled}
			class="px-3 py-1 text-sm border rounded hover:bg-muted transition-colors"
			title="Inline Code"
		>
			&lt;/&gt;
		</button>
		<button
			type="button"
			on:click={insertCodeBlock}
			{disabled}
			class="px-3 py-1 text-sm border rounded hover:bg-muted transition-colors"
			title="Code Block"
		>
			{'{ }'}
		</button>

		<div class="ml-auto">
			<input
				type="file"
				accept="image/*"
				on:change={handleFileSelect}
				{disabled}
				class="hidden"
				id="image-upload"
			/>
			<label
				for="image-upload"
				class={cn(
					'px-3 py-1 text-sm border rounded cursor-pointer transition-colors',
					disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'
				)}
			>
				📷 Upload Image
			</label>
		</div>
	</div>

	<div
		class={cn(
			'relative border-2 border-dashed rounded-lg transition-colors',
			isDragging ? 'border-primary bg-primary/5' : 'border-border',
			disabled && 'opacity-50'
		)}
		on:drop={handleDrop}
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
	>
		<textarea
			bind:this={textarea}
			bind:value
			on:input={handleInput}
			on:paste={handlePaste}
			{disabled}
			placeholder="Write your blog post content in markdown... You can drag & drop images or paste them here."
			class="w-full min-h-[400px] p-4 bg-transparent resize-y focus:outline-none font-mono text-sm"
		></textarea>

		{#if isDragging}
			<div
				class="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg pointer-events-none"
			>
				<div class="text-center">
					<svg
						class="w-12 h-12 mx-auto mb-2 text-primary"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						></path>
					</svg>
					<p class="text-lg font-medium text-primary">Drop image here</p>
				</div>
			</div>
		{/if}

		{#if isUploading}
			<div
				class="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg"
			>
				<div class="text-center">
					<div
						class="w-12 h-12 mx-auto mb-2 border-4 border-primary border-t-transparent rounded-full animate-spin"
					></div>
					<p class="text-sm text-muted-foreground">Uploading image...</p>
				</div>
			</div>
		{/if}
	</div>

	{#if uploadError}
		<p class="text-sm text-destructive">{uploadError}</p>
	{/if}

	<div class="space-y-1">
		<p class="text-xs text-muted-foreground">
			Supports markdown formatting. Drag & drop images, paste from clipboard, or click the upload
			button.
		</p>
		<p class="text-xs text-muted-foreground">
			<strong>Tip:</strong> Use double line breaks (blank lines) between paragraphs for proper spacing.
			Use <code>&gt;</code> for blockquotes.
		</p>
	</div>
</div>
