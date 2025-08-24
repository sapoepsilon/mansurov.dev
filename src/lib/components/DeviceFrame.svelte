<script lang="ts">
	export let type: 'iphone' | 'macbook';
	export let wallpaperUrl: string;
	export let alt: string = 'Wallpaper preview';
</script>

{#if type === 'iphone'}
	<div class="iphone-frame">
		<div class="iphone-notch"></div>
		<div class="iphone-screen">
			<img src={wallpaperUrl} {alt} class="wallpaper-image" />
		</div>
		<div class="iphone-home-indicator"></div>
	</div>
{:else if type === 'macbook'}
	<div class="macbook-frame">
		<div class="macbook-screen">
			<img src={wallpaperUrl} {alt} class="wallpaper-image" />
		</div>
		<div class="macbook-bottom">
			<div class="macbook-logo"></div>
		</div>
	</div>
{/if}

<style>
	/* iPhone Frame */
	.iphone-frame {
		position: relative;
		width: 200px;
		height: 400px;
		background: #1a1a1a;
		border-radius: 32px;
		padding: 8px;
		box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
	}

	.iphone-notch {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 120px;
		height: 24px;
		background: #1a1a1a;
		border-radius: 0 0 16px 16px;
		z-index: 2;
	}

	.iphone-screen {
		width: 100%;
		height: 100%;
		border-radius: 24px;
		overflow: hidden;
		position: relative;
		background: #000;
	}

	.iphone-home-indicator {
		position: absolute;
		bottom: 8px;
		left: 50%;
		transform: translateX(-50%);
		width: 120px;
		height: 4px;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 2px;
		z-index: 2;
	}

	/* MacBook Frame */
	.macbook-frame {
		width: 320px;
		height: 220px;
		position: relative;
	}

	.macbook-screen {
		width: 100%;
		height: 180px;
		background: #1a1a1a;
		border-radius: 8px 8px 0 0;
		padding: 8px 12px;
		overflow: hidden;
		position: relative;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	.macbook-bottom {
		width: 100%;
		height: 40px;
		background: linear-gradient(135deg, #f0f0f0 0%, #d0d0d0 100%);
		border-radius: 0 0 12px 12px;
		position: relative;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	}

	.macbook-logo {
		position: absolute;
		bottom: 8px;
		left: 50%;
		transform: translateX(-50%);
		width: 16px;
		height: 16px;
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E") center/contain no-repeat;
		opacity: 0.6;
	}

	/* Common wallpaper image styles */
	.wallpaper-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: inherit;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.iphone-frame {
			width: 160px;
			height: 320px;
			border-radius: 24px;
			padding: 6px;
		}

		.iphone-notch {
			width: 100px;
			height: 20px;
			border-radius: 0 0 12px 12px;
		}

		.iphone-screen {
			border-radius: 18px;
		}

		.iphone-home-indicator {
			width: 100px;
			height: 3px;
		}

		.macbook-frame {
			width: 280px;
			height: 190px;
		}

		.macbook-screen {
			height: 155px;
			padding: 6px 10px;
		}

		.macbook-bottom {
			height: 35px;
		}

		.macbook-logo {
			width: 14px;
			height: 14px;
		}
	}
</style>