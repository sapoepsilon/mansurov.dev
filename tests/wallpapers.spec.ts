import { test, expect } from '@playwright/test';

test.describe('Wallpapers Page', () => {
	test('should display wallpapers page with wallpaper packs', async ({ page }) => {
		await page.goto('http://localhost:5173/wallpapers');
		
		await expect(page).toHaveURL('/wallpapers');
		await expect(page.locator('h1')).toContainText('Wallpapers');
		await expect(page.getByText('Curated collections of beautiful wallpapers')).toBeVisible();
	});

	test('should display wallpaper packs with preview images', async ({ page }) => {
		await page.goto('http://localhost:5173/wallpapers');
		
		// Verify pack titles are displayed
		await expect(page.getByRole('heading', { name: 'Mountain Serenity' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Ocean Depths' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Abstract Geometry' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Forest Canopy' })).toBeVisible();
		
		// Verify preview images are present
		await expect(page.getByText('Desktop')).toBeVisible();
		await expect(page.getByText('Mobile')).toBeVisible();
	});

	test('should display tags and themes for wallpaper packs', async ({ page }) => {
		await page.goto('http://localhost:5173/wallpapers');
		
		// Verify tags are displayed
		await expect(page.getByText('nature')).toBeVisible();
		await expect(page.getByText('mountains')).toBeVisible();
		await expect(page.getByText('ocean')).toBeVisible();
		await expect(page.getByText('abstract')).toBeVisible();
		
		// Verify theme indicators
		await expect(page.getByText('light')).toBeVisible();
		await expect(page.getByText('dark')).toBeVisible();
		await expect(page.getByText('colorful')).toBeVisible();
	});

	test('should be responsive on mobile devices', async ({ page }) => {
		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('http://localhost:5173/wallpapers');
		
		// Verify wallpapers page is accessible on mobile
		await expect(page.locator('h1')).toContainText('Wallpapers');
		await expect(page.getByRole('heading', { name: 'Mountain Serenity' })).toBeVisible();
		
		// Verify preview images are visible on mobile
		await expect(page.getByText('Desktop')).toBeVisible();
		await expect(page.getByText('Mobile')).toBeVisible();
	});

	test('should show preview images on desktop', async ({ page }) => {
		// Test desktop viewport
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto('http://localhost:5173/wallpapers');
		
		// Both desktop and mobile previews should be visible
		await expect(page.getByText('Desktop')).toBeVisible();
		await expect(page.getByText('Mobile')).toBeVisible();
	});

	test('should have working navbar navigation to wallpapers', async ({ page }) => {
		await page.goto('http://localhost:5173/about');
		
		// Click on Wallpapers in navigation
		await page.click('a[href="/wallpapers"]');
		
		// Verify navigation worked
		await expect(page).toHaveURL('/wallpapers');
		await expect(page.locator('h1')).toContainText('Wallpapers');
	});

	test('should display wallpaper preview images', async ({ page }) => {
		await page.goto('http://localhost:5173/wallpapers');
		
		// Verify preview images are visible
		await expect(page.locator('img[alt*="desktop wallpaper"]')).toBeVisible();
		await expect(page.locator('img[alt*="mobile wallpaper"]')).toBeVisible();
		
		// Verify images have proper alt text
		await expect(page.locator('img[alt*="Mountain Serenity"]')).toBeVisible();
		await expect(page.locator('img[alt*="Ocean Depths"]')).toBeVisible();
	});

	test('should display wallpack descriptions and metadata', async ({ page }) => {
		await page.goto('http://localhost:5173/wallpapers');
		
		// Verify descriptions are shown
		await expect(page.getByText('Breathtaking mountain landscapes')).toBeVisible();
		await expect(page.getByText('Stunning underwater photography')).toBeVisible();
		await expect(page.getByText('Modern geometric patterns')).toBeVisible();
		await expect(page.getByText('Peaceful forest scenes')).toBeVisible();
		
		// Verify resolution info is displayed
		await expect(page.getByText('Available for desktop (2560x1600) and mobile (1080x1920)')).toBeVisible();
	});
});