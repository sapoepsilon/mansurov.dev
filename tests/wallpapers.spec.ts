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

	test('should be responsive on mobile devices', async ({ page }) => {
		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/wallpapers');
		
		// Verify wallpapers page is accessible on mobile
		await expect(page.getByRole('heading', { name: 'Wallpapers' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Timpanogos Trip' })).toBeVisible();
	});
});