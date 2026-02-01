import { test, expect } from '@playwright/test';

test.describe('Wallpapers Page', () => {
	test('should load wallpapers page successfully', async ({ page }) => {
		await page.goto('/wallpapers');
		
		// Check page title
		await expect(page).toHaveTitle(/Wallpapers \| Ismatulla Mansurov/);
		
		// Check main heading
		await expect(page.getByRole('heading', { name: 'Wallpapers' })).toBeVisible();
		
		// Check description
		await expect(page.getByText('Curated collections of beautiful wallpapers for your devices')).toBeVisible();
	});

	test('should display Timpanogos Trip wallpaper pack', async ({ page }) => {
		await page.goto('/wallpapers');
		
		// Check that the Timpanogos Trip pack is displayed
		await expect(page.getByRole('heading', { name: 'Timpanogos Trip' })).toBeVisible();
		await expect(page.getByText('Beautiful moments from the Timpanogos hiking adventure')).toBeVisible();
		
		// Check that the pack link is present
		const packLink = page.getByRole('link', { name: /Timpanogos Trip/ });
		await expect(packLink).toBeVisible();
		await expect(packLink).toHaveAttribute('href', '/wallpapers/timpanogos-trip');
	});

	test('should navigate to individual wallpaper pack page', async ({ page }) => {
		await page.goto('/wallpapers');
		
		// Click on the Timpanogos Trip pack
		await page.getByRole('link', { name: /Timpanogos Trip/ }).click();
		
		// Check that we're on the correct page
		await expect(page).toHaveURL('/wallpapers/timpanogos-trip');
		await expect(page).toHaveTitle(/Timpanogos Trip - Wallpapers \| Ismatulla Mansurov/);
		
		// Check page content
		await expect(page.getByRole('heading', { name: 'Timpanogos Trip' })).toBeVisible();
		await expect(page.getByText('Beautiful moments from the Timpanogos hiking adventure')).toBeVisible();
		
		// Check that mobile and desktop sections are present
		await expect(page.getByRole('heading', { name: 'Mobile' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Desktop' })).toBeVisible();
		
		// Check that wallpaper images are present
		await expect(page.getByAltText('Timpanogos Trip mobile wallpaper')).toBeVisible();
		await expect(page.getByAltText('Timpanogos Trip desktop wallpaper')).toBeVisible();
		
		// Check that download button is present
		await expect(page.getByRole('button', { name: 'Download' })).toBeVisible();
		
		// Check back navigation link
		const backLink = page.getByRole('link', { name: 'Back to Wallpapers' });
		await expect(backLink).toBeVisible();
		await expect(backLink).toHaveAttribute('href', '/wallpapers');
	});

	test('should navigate back to wallpapers page from individual pack', async ({ page }) => {
		// Start on the individual pack page
		await page.goto('/wallpapers/timpanogos-trip');
		
		// Click back to wallpapers
		await page.getByRole('link', { name: 'Back to Wallpapers' }).click();
		
		// Should be back on the main wallpapers page
		await expect(page).toHaveURL('/wallpapers');
		await expect(page.getByRole('heading', { name: 'Wallpapers' })).toBeVisible();
	});

	test('should have working navbar navigation to wallpapers', async ({ page }) => {
		await page.goto('/about');
		
		// Click on Wallpapers in navigation
		await page.getByRole('link', { name: 'Wallpapers' }).click();
		
		// Verify navigation worked
		await expect(page).toHaveURL('/wallpapers');
		await expect(page.getByRole('heading', { name: 'Wallpapers' })).toBeVisible();
	});

	test('wallpaper card overlay should not turn white on hover in dark mode', async ({ page }) => {
		await page.goto('/wallpapers');

		// Enable dark mode by adding the .dark class to the html element
		await page.evaluate(() => document.documentElement.classList.add('dark'));

		// Find the wallpaper card overlay (the div that sits on top of the image)
		const overlay = page.locator('article.group .absolute.inset-0').first();
		await expect(overlay).toBeVisible();

		// Get the overlay's classes and verify it does NOT use bg-primary on hover
		const classes = await overlay.getAttribute('class');
		expect(classes).not.toContain('group-hover:bg-primary');

		// Hover over the wallpaper card
		const card = page.locator('article.group').first();
		await card.hover();

		// Wait for transition
		await page.waitForTimeout(400);

		// Get the computed background color of the overlay while hovered
		const bgColor = await overlay.evaluate((el) => {
			return window.getComputedStyle(el).backgroundColor;
		});

		// The background should remain dark (not white/near-white)
		// Parse the rgba value and check that it's not a light color
		const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
		if (match) {
			const [, r, g, b] = match.map(Number);
			// In dark mode on hover, RGB values should be low (dark), not high (white)
			// White would be rgb(250+, 250+, 250+)
			const isLight = r > 200 && g > 200 && b > 200;
			expect(isLight).toBe(false);
		}
	});

	test('should be responsive on mobile devices', async ({ page }) => {
		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/wallpapers');
		
		// Verify wallpapers page is accessible on mobile
		await expect(page.getByRole('heading', { name: 'Wallpapers' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Timpanogos Trip' })).toBeVisible();
	});

	test('download button should fetch full-resolution image as blob', async ({ page }) => {
		await page.goto('/wallpapers/timpanogos-trip');

		// Wait for wallpapers to load
		await page.waitForSelector('text=Loading wallpapers...', { state: 'hidden', timeout: 20000 });
		await page.waitForTimeout(1000);

		const mobileDownloadButton = page.getByRole('button', { name: 'Download' }).first();
		await expect(mobileDownloadButton).toBeVisible({ timeout: 10000 });

		// Intercept the fetch to the full-resolution image
		const requestPromise = page.waitForRequest((req) =>
			req.url().includes('wallapappers.mansurov.dev') && req.url().endsWith('.jpg')
		, { timeout: 10000 });

		await mobileDownloadButton.click();

		const request = await requestPromise;
		const requestUrl = request.url();

		// Verify it fetches full-resolution JPG directly (not preview WebP)
		expect(requestUrl).toContain('wallapappers.mansurov.dev');
		expect(requestUrl).toMatch(/\.jpg$/);
		expect(requestUrl).not.toContain('preview');
		expect(requestUrl).not.toContain('.webp');

		// Verify it does NOT go through the old server proxy
		expect(requestUrl).not.toContain('/api/download');
	});

	test('download button should show loading spinner while downloading', async ({ page }) => {
		await page.goto('/wallpapers/timpanogos-trip');

		// Wait for wallpapers to load
		await page.waitForSelector('text=Loading wallpapers...', { state: 'hidden', timeout: 20000 });
		await page.waitForTimeout(1000);

		const mobileDownloadButton = page.getByRole('button', { name: 'Download' }).first();
		await expect(mobileDownloadButton).toBeVisible({ timeout: 10000 });

		// Slow down the image fetch so we can observe the loading state
		await page.route('**/wallapappers.mansurov.dev/**/*.jpg', async (route) => {
			await new Promise(resolve => setTimeout(resolve, 2000));
			await route.continue();
		});

		await mobileDownloadButton.click();

		// Button should show "Downloading..." text and spinner
		await expect(page.getByText('Downloading...').first()).toBeVisible({ timeout: 3000 });

		// Button should be disabled during download
		await expect(mobileDownloadButton).toBeDisabled();

		// Spinner element should be present
		const spinner = page.locator('.animate-spin').first();
		await expect(spinner).toBeVisible();
	});

	test('should download wallpaper via client-side blob on timpanogos page', async ({ page }) => {
		// Mock the wallpaper image fetch to return a small JPEG blob
		// This avoids CORS issues in the test environment
		await page.route('**/wallapappers.mansurov.dev/**/*.jpg', async (route) => {
			const jpegHeader = Buffer.from([
				0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
				0x49, 0x46, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
				0x00, 0x01, 0x00, 0x00, 0xFF, 0xD9
			]);
			await route.fulfill({
				status: 200,
				contentType: 'image/jpeg',
				body: jpegHeader,
			});
		});

		await page.goto('/wallpapers/timpanogos-trip');

		// Wait for wallpapers to load
		await page.waitForSelector('text=Loading wallpapers...', { state: 'hidden', timeout: 20000 });
		await page.waitForTimeout(1000);

		const mobileDownloadButton = page.getByRole('button', { name: 'Download' }).first();
		await expect(mobileDownloadButton).toBeVisible({ timeout: 10000 });

		// Set up download listener before clicking
		const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

		await mobileDownloadButton.click();

		// Wait for download to start
		const download = await downloadPromise;

		// Verify download filename
		const filename = download.suggestedFilename();
		expect(filename).toBeTruthy();
		expect(filename).toMatch(/\.jpg$/);

		// Test desktop download if viewport is wide enough
		if (page.viewportSize()?.width && page.viewportSize()!.width > 768) {
			const desktopDownloadButton = page.getByRole('button', { name: 'Download Desktop' });
			if (await desktopDownloadButton.isVisible()) {
				const desktopDownloadPromise = page.waitForEvent('download', { timeout: 30000 });
				await desktopDownloadButton.click();
				const desktopDownload = await desktopDownloadPromise;
				expect(desktopDownload.suggestedFilename()).toMatch(/\.jpg$/);
			}
		}
	});
});