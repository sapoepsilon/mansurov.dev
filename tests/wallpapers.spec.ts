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

	test('download button should use server proxy and download full-resolution image', async ({ page }) => {
		await page.goto('/wallpapers/timpanogos-trip');

		// Wait for wallpapers to load
		await page.waitForSelector('text=Loading wallpapers...', { state: 'hidden', timeout: 20000 });
		await page.waitForTimeout(1000);

		const mobileDownloadButton = page.getByRole('button', { name: 'Download' }).first();
		await expect(mobileDownloadButton).toBeVisible({ timeout: 10000 });

		// Intercept the navigation/request triggered by clicking download
		const requestPromise = page.waitForRequest((req) =>
			req.url().includes('/api/download')
		, { timeout: 10000 });

		await mobileDownloadButton.click();

		const request = await requestPromise;
		const requestUrl = new URL(request.url());

		// Verify it goes through the server-side download proxy
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

	test('should test wallpaper download functionality on timpanogos page', async ({ page, context }) => {
		// Set up console logging
		const consoleLogs: string[] = [];
		page.on('console', msg => consoleLogs.push(`${msg.type()}: ${msg.text()}`));
		
		// Navigate to the specific wallpaper page using localhost
		await page.goto('/wallpapers/timpanogos-trip');
		
		// Take a screenshot right after navigation
		await page.screenshot({ path: 'test-results/timpanogos-page-initial.png', fullPage: true });
		
		// Wait for wallpapers to load (wait for loading to disappear)
		await page.waitForSelector('text=Loading wallpapers...', { state: 'hidden', timeout: 20000 });
		
		// Wait a bit more for the page to stabilize
		await page.waitForTimeout(2000);
		
		// Take a screenshot after loading
		await page.screenshot({ path: 'test-results/timpanogos-page-loaded.png', fullPage: true });
		
		// Check if there are any images loaded - look for mobile download button specifically
		const mobileDownloadButton = page.getByRole('button', { name: 'Download' }).first();
		await expect(mobileDownloadButton).toBeVisible({ timeout: 10000 });
		
		// Set up download promise before clicking (using the context API)
		const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
		
		// Click the mobile download button
		await mobileDownloadButton.click();
		
		try {
			// Wait for download to start
			const download = await downloadPromise;
			
			// Verify download properties
			const filename = download.suggestedFilename();
			expect(filename).toBeTruthy();
			expect(filename).toMatch(/\.jpg$/);
			
			// Save the download to verify it worked
			const downloadPath = `test-results/downloaded-${filename}`;
			await download.saveAs(downloadPath);
			
			console.log(`Download successful: ${filename}`);
			
		} catch (error) {
			// Take screenshot if download fails
			await page.screenshot({ path: 'test-results/download-error-screenshot.png', fullPage: true });
			
			// Log console messages
			console.log('Console logs during test:', consoleLogs);
			
			// Check for any error messages on page
			const errorElements = await page.locator('text=/error|Error|ERROR/i').all();
			if (errorElements.length > 0) {
				console.log('Error elements found on page:', await Promise.all(errorElements.map(el => el.textContent())));
			}
			
			throw new Error(`Download failed: ${error}`);
		}
		
		// Test desktop download if on desktop viewport
		if (page.viewportSize()?.width && page.viewportSize()!.width > 768) {
			const desktopDownloadButton = page.getByRole('button', { name: 'Download Desktop' });
			
			// Check if desktop button exists and is visible
			const isDesktopButtonVisible = await desktopDownloadButton.isVisible();
			if (isDesktopButtonVisible) {
				const desktopDownloadPromise = page.waitForEvent('download', { timeout: 30000 });
				await desktopDownloadButton.click();
				
				try {
					const desktopDownload = await desktopDownloadPromise;
					const desktopFilename = desktopDownload.suggestedFilename();
					
					const desktopDownloadPath = `test-results/downloaded-${desktopFilename}`;
					await desktopDownload.saveAs(desktopDownloadPath);
					
					console.log(`Desktop download successful: ${desktopFilename}`);
					
				} catch (desktopError) {
					await page.screenshot({ path: 'test-results/desktop-download-error-screenshot.png', fullPage: true });
					throw new Error(`Desktop download failed: ${desktopError}`);
				}
			}
		}
		
		// Final screenshot after test completion
		await page.screenshot({ path: 'test-results/timpanogos-page-final.png', fullPage: true });
		
		// Log final console messages
		console.log('Final console logs:', consoleLogs);
	});
});