import { test, expect } from '@playwright/test';

test.describe('Wallpapers Page', () => {
	test('should display wallpapers page with wallpaper packs', async ({ page }) => {
		await page.goto('http://localhost:5173/wallpapers');
		
		await expect(page).toHaveURL('/wallpapers');
		await expect(page.locator('h1')).toContainText('Wallpapers');
		await expect(page.getByText('Curated collections of beautiful wallpapers')).toBeVisible();
	});

	test('should display wallpaper packs with device frames', async ({ page }) => {
		await page.goto('http://localhost:5173/wallpapers');
		
		// Verify pack titles are displayed
		await expect(page.getByRole('heading', { name: 'Mountain Serenity' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Ocean Depths' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Abstract Geometry' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Forest Canopy' })).toBeVisible();
		
		// Verify device frames are present
		await expect(page.locator('.macbook-frame')).toBeVisible();
		await expect(page.locator('.iphone-frame')).toBeVisible();
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
		
		// On mobile, only iPhone frames should be visible (MacBook should be hidden)
		await expect(page.locator('.iphone-frame')).toBeVisible();
	});

	test('should show both device frames on desktop', async ({ page }) => {
		// Test desktop viewport
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto('http://localhost:5173/wallpapers');
		
		// Both iPhone and MacBook frames should be visible on desktop
		await expect(page.locator('.macbook-frame')).toBeVisible();
		await expect(page.locator('.iphone-frame')).toBeVisible();
	});

	test('should have working navbar navigation to wallpapers', async ({ page }) => {
		await page.goto('http://localhost:5173/about');
		
		// Click on Wallpapers in navigation
		await page.click('a[href="/wallpapers"]');
		
		// Verify navigation worked
		await expect(page).toHaveURL('/wallpapers');
		await expect(page.locator('h1')).toContainText('Wallpapers');
	});

	test('should display wallpaper images in device frames', async ({ page }) => {
		await page.goto('http://localhost:5173/wallpapers');
		
		// Verify images load in device frames
		await expect(page.locator('.macbook-frame img')).toBeVisible();
		await expect(page.locator('.iphone-frame img')).toBeVisible();
		
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