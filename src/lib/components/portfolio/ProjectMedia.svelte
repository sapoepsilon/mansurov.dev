<script lang="ts">
	export let heroImage: string | undefined = undefined;
	export let heroVideo: string | undefined = undefined;
	export let galleryImages: string[] | undefined = undefined;
	
	let currentImageIndex = 0;
	
	function nextImage() {
		if (galleryImages && galleryImages.length > 0) {
			currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
		}
	}
	
	function prevImage() {
		if (galleryImages && galleryImages.length > 0) {
			currentImageIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
		}
	}
</script>

<section class="space-y-8 max-w-4xl mx-auto">
	<!-- Hero Media -->
	{#if heroVideo}
		<div class="relative rounded-xl overflow-hidden shadow-2xl max-h-[600px] bg-muted/50 flex items-center justify-center">
			<video
				controls
				class="w-full max-h-[600px] object-contain"
				poster={heroImage}
			>
				<source src={heroVideo} type="video/mp4">
				<track kind="captions">
				Your browser does not support the video tag.
			</video>
		</div>
	{:else if heroImage}
		<div class="relative rounded-xl overflow-hidden shadow-2xl max-h-[500px] bg-muted/50 flex items-center justify-center">
			<img
				src={heroImage}
				alt="Project hero"
				class="w-full max-h-[500px] object-contain"
			/>
		</div>
	{/if}

	<!-- Image Gallery -->
	{#if galleryImages && galleryImages.length > 0}
		<div class="space-y-4">
			<h3 class="text-2xl font-semibold text-center">Gallery</h3>

			<!-- Main Gallery Image -->
			<div class="relative rounded-lg overflow-hidden shadow-lg max-h-[450px] bg-muted/50 flex items-center justify-center">
				<img
					src={galleryImages[currentImageIndex]}
					alt="Gallery image {currentImageIndex + 1}"
					class="w-full max-h-[450px] object-contain"
				/>
				
				{#if galleryImages.length > 1}
					<!-- Navigation Buttons -->
					<button 
						on:click={prevImage}
						class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
						aria-label="Previous image"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
						</svg>
					</button>
					
					<button 
						on:click={nextImage}
						class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
						aria-label="Next image"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
						</svg>
					</button>
					
					<!-- Image Counter -->
					<div class="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
						{currentImageIndex + 1} / {galleryImages.length}
					</div>
				{/if}
			</div>
			
			<!-- Thumbnail Navigation -->
			{#if galleryImages.length > 1}
				<div class="flex gap-2 overflow-x-auto pb-2">
					{#each galleryImages as image, index}
						<button 
							on:click={() => currentImageIndex = index}
							class="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all {
								index === currentImageIndex ? 'border-primary' : 'border-transparent hover:border-muted-foreground'
							}"
						>
							<img 
								src={image} 
								alt="Thumbnail {index + 1}"
								class="w-full h-full object-cover"
							/>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</section>