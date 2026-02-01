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
		
		// Check that wallpaper images are present (alt text uses individual image name)
		// Two mobile IPhoneFrame instances exist (md:hidden for mobile, hidden md:block for desktop)
		// On desktop viewport, the second one (hidden md:block) is visible
		await expect(page.getByAltText('Summit mobile wallpaper').nth(1)).toBeVisible();
		await expect(page.getByAltText('Summit desktop wallpaper')).toBeVisible();
		
		// Check that download button is present
		await expect(page.getByRole('button', { name: 'Download', exact: true })).toBeVisible();
		
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

	test('download button should use pre-signed URL redirect for full-resolution image', async ({ page }) => {
		await page.goto('/wallpapers/timpanogos-trip');

		// Wait for wallpapers to load
		await page.waitForSelector('text=Loading wallpapers...', { state: 'hidden', timeout: 20000 });
		await page.waitForTimeout(1000);

		const mobileDownloadButton = page.getByRole('button', { name: 'Download' }).first();
		await expect(mobileDownloadButton).toBeVisible({ timeout: 10000 });

		// Intercept the navigation to /api/download
		const requestPromise = page.waitForRequest((req) =>
			req.url().includes('/api/download')
		, { timeout: 10000 });

		await mobileDownloadButton.click();

		const request = await requestPromise;
		const requestUrl = new URL(request.url());

		// Verify it goes through the download endpoint
		expect(requestUrl.pathname).toBe('/api/download');

		// Verify the url param points to the full-resolution JPG (not preview WebP)
		const imageUrl = requestUrl.searchParams.get('url');
		expect(imageUrl).toBeTruthy();
		expect(imageUrl).toContain('wallapappers.mansurov.dev');
		expect(imageUrl).toMatch(/\.jpg$/);
		expect(imageUrl).not.toContain('preview');
		expect(imageUrl).not.toContain('.webp');

		// Verify a filename is provided
		const filename = requestUrl.searchParams.get('filename');
		expect(filename).toBeTruthy();
		expect(filename).toMatch(/\.jpg$/);
	});

	test('mobile image should render on initial page load without interaction', async ({ page }) => {
		// Test at mobile viewport where only the md:hidden IPhoneFrame is shown
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/wallpapers/timpanogos-trip');

		// Wait for wallpapers to load
		await page.waitForSelector('text=Loading wallpapers...', { state: 'hidden', timeout: 20000 });

		// Mobile image inside iPhone frame should be visible immediately
		const mobileImage = page.getByAltText('Summit mobile wallpaper').first();
		await expect(mobileImage).toBeVisible({ timeout: 5000 });

		// Image should have non-zero dimensions (not collapsed)
		const box = await mobileImage.boundingBox();
		expect(box).toBeTruthy();
		expect(box!.width).toBeGreaterThan(50);
		expect(box!.height).toBeGreaterThan(50);
	});

	test('download buttons should have independent loading states', async ({ page }) => {
		await page.goto('/wallpapers/timpanogos-trip');

		// Wait for wallpapers to load
		await page.waitForSelector('text=Loading wallpapers...', { state: 'hidden', timeout: 20000 });
		await page.waitForTimeout(1000);

		const mobileDownloadButton = page.getByRole('button', { name: 'Download' }).first();
		await expect(mobileDownloadButton).toBeVisible({ timeout: 10000 });

		// Slow down the /api/download response so we can observe the loading state
		await page.route('**/api/download**', async (route) => {
			await new Promise(resolve => setTimeout(resolve, 5000));
			await route.continue();
		});

		await mobileDownloadButton.click();

		// Mobile button should show spinner
		await expect(page.getByText('Downloading...').first()).toBeVisible({ timeout: 3000 });
		await expect(mobileDownloadButton).toBeDisabled();
		const spinner = page.locator('.animate-spin').first();
		await expect(spinner).toBeVisible();

		// Desktop button should NOT be affected (only visible on desktop viewports)
		if (page.viewportSize()?.width && page.viewportSize()!.width > 768) {
			const desktopDownloadButton = page.getByRole('button', { name: 'Download Desktop' });
			if (await desktopDownloadButton.isVisible()) {
				await expect(desktopDownloadButton).toBeEnabled();
			}
		}
	});
});