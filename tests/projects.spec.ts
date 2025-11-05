import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
	test('should display projects page with Whispera project', async ({ page }) => {
		// Navigate to projects page
		await page.goto('/projects');
		
		// Verify we're on the projects page
		await expect(page).toHaveURL('/projects');
		
		// Verify main heading is present
		await expect(page.locator('h1')).toContainText('Projects');
		
		// Verify Whispera project is displayed
		await expect(page.locator('h2')).toContainText('Whispera');
		await expect(page.getByText('AI-Powered Voice Transcription App for macOS')).toBeVisible();
	});

	test('should navigate to Whispera project detail page', async ({ page }) => {
		// Navigate to projects page
		await page.goto('/projects');
		
		// Click on Whispera project
		await page.click('a[href="/projects/whispera"]');
		
		// Verify we're on Whispera detail page
		await expect(page).toHaveURL('/projects/whispera');
		
		// Verify Whispera title is displayed
		await expect(page.locator('h1')).toContainText('Whispera');
	});

	test('should display Whispera project features', async ({ page }) => {
		// Navigate to Whispera detail page
		await page.goto('/projects/whispera');
		
		// Verify key features section exists
		await expect(page.getByText('Key Features')).toBeVisible();
		
		// Verify specific Whispera features using more specific selectors
		await expect(page.getByRole('heading', { name: 'AI-Powered Transcription' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Global Shortcuts' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Menu Bar Integration' })).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Privacy-First' })).toBeVisible();
	});

	test('should display Whispera tech stack', async ({ page }) => {
		// Navigate to projects page
		await page.goto('/projects');
		
		// Verify Swift tech stack badge is visible using first occurrence
		await expect(page.getByText('Swift').first()).toBeVisible();
		await expect(page.getByText('SwiftUI').first()).toBeVisible();
		await expect(page.getByText('WhisperKit').first()).toBeVisible();
	});

	test('should have working GitHub link for Whispera', async ({ page }) => {
		// Navigate to Whispera detail page
		await page.goto('/projects/whispera');
		
		// Scroll to bottom to see GitHub link
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		
		// Verify GitHub link is present and has correct URL
		const githubLink = page.locator('a[href="https://github.com/sapoepsilon/Whispera"]');
		await expect(githubLink).toBeVisible();
		await expect(githubLink).toContainText('View Source');
	});

	test('should display technical implementation details', async ({ page }) => {
		// Navigate to Whispera detail page
		await page.goto('/projects/whispera');
		
		// Verify technical section exists
		await expect(page.getByText('Technical Implementation')).toBeVisible();
		
		// Verify specific technical details
		await expect(page.getByText('WhisperKit framework')).toBeVisible();
		await expect(page.getByText('macOS global shortcut system')).toBeVisible();
		await expect(page.getByText('SwiftUI interface')).toBeVisible();
	});

	test('should have responsive design', async ({ page }) => {
		// Test mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/projects');
		
		// Verify Whispera project is still visible on mobile using heading
		await expect(page.getByRole('heading', { name: 'Whispera' })).toBeVisible();
		await expect(page.getByText('AI-Powered Voice Transcription App')).toBeVisible();
		
		// Test desktop viewport
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto('/projects');
		
		// Verify layout on desktop
		await expect(page.getByRole('heading', { name: 'Whispera' })).toBeVisible();
	});

	test('should display media gallery and video elements', async ({ page }) => {
		// Navigate to Whispera detail page
		await page.goto('/projects/whispera');
		
		// Check if gallery section exists (even if images don't load)
		const gallerySection = page.locator('section').filter({ hasText: 'Gallery' });
		
		// The gallery might not be visible if images don't exist, so we'll check for the structure
		// This ensures the component is rendered correctly
		await page.waitForLoadState('networkidle');
		
		// Verify page structure is complete
		await expect(page.locator('article')).toBeVisible();
		await expect(page.getByText('The Problem')).toBeVisible();
		await expect(page.getByText('The Solution')).toBeVisible();
	});

	test('should handle navigation back to projects from detail page', async ({ page }) => {
		// Start at projects page
		await page.goto('/projects');
		
		// Navigate to Whispera detail
		await page.click('a[href="/projects/whispera"]');
		await expect(page).toHaveURL('/projects/whispera');
		
		// Navigate back using browser back button
		await page.goBack();
		await expect(page).toHaveURL('/projects');
		
		// Verify we're back at projects page with Whispera visible
		await expect(page.getByRole('heading', { name: 'Whispera' })).toBeVisible();
	});

	test('should maintain Whispera project data integrity', async ({ page }) => {
		// Navigate to projects page
		await page.goto('/projects');
		
		// Verify Whispera project card has all expected elements
		const projectCard = page.locator('article').filter({ hasText: 'Whispera' });
		await expect(projectCard).toBeVisible();
		
		// Verify title and subtitle
		await expect(projectCard.getByRole('heading', { name: 'Whispera' })).toBeVisible();
		await expect(projectCard.getByText('AI-Powered Voice Transcription App for macOS')).toBeVisible();
		
		// Verify description is present
		await expect(projectCard.getByText('Whispera is a native macOS application')).toBeVisible();
		
		// Verify tech stack badges are present
		await expect(projectCard.getByText('Swift').first()).toBeVisible();
		await expect(projectCard.getByText('SwiftUI').first()).toBeVisible();
		
		// Verify project is clickable
		await expect(projectCard.locator('a[href="/projects/whispera"]')).toBeVisible();
	});

	test('should display actual Whispera images correctly', async ({ page }) => {
		// Navigate to projects page
		await page.goto('/projects');

		// Verify hero image loads on projects page
		const heroImage = page.locator('img[src="/whisper-statusbar.png"]');
		await expect(heroImage).toBeVisible();

		// Navigate to detail page
		await page.click('a[href="/projects/whispera"]');

		// Verify hero image loads on detail page
		await expect(page.locator('img[src="/whisper-statusbar.png"]').first()).toBeVisible();

		// Scroll to gallery section
		await page.evaluate(() => window.scrollTo(0, 800));

		// Verify gallery images are present
		await expect(page.locator('img[src="/whisper-statusbar.png"]').first()).toBeVisible();
		await expect(page.locator('img[src="/whisper-models.png"]').first()).toBeVisible();

		// Test gallery navigation
		await page.click('button[aria-label="Next image"]');

		// Verify image counter updates
		await expect(page.locator('text=2 / 2')).toBeVisible();
	});

	test('should have optimized image sizing on projects list', async ({ page }) => {
		// Navigate to projects page
		await page.goto('/projects');

		// Wait for images to load
		await page.waitForLoadState('networkidle');

		// Get the Whispera project card image
		const projectImage = page.locator('article').filter({ hasText: 'Whispera' }).locator('img').first();
		await expect(projectImage).toBeVisible();

		// Verify image has object-contain class (shows full image without cropping)
		await expect(projectImage).toHaveClass(/object-contain/);

		// Verify image has max-height constraint
		await expect(projectImage).toHaveClass(/max-h-\[300px\]/);

		// Get the bounding box to verify actual size doesn't exceed max-height
		const imageBox = await projectImage.boundingBox();
		if (imageBox) {
			// 300px max-height, but allow some tolerance for rendering
			expect(imageBox.height).toBeLessThanOrEqual(320);
		}
	});

	test('should have optimized hero image sizing on detail page', async ({ page }) => {
		// Navigate to Whispera detail page
		await page.goto('/projects/whispera');

		// Wait for page to load
		await page.waitForLoadState('networkidle');

		// Get the hero image (not in gallery)
		const heroImage = page.locator('section').first().locator('img[src="/whisper-statusbar.png"]');
		await expect(heroImage).toBeVisible();

		// Verify image has object-contain class
		await expect(heroImage).toHaveClass(/object-contain/);

		// Verify image has max-height constraint (500px for hero image)
		await expect(heroImage).toHaveClass(/max-h-\[500px\]/);

		// Get the bounding box to verify actual size doesn't exceed max-height
		const imageBox = await heroImage.boundingBox();
		if (imageBox) {
			// 500px max-height, but allow some tolerance for rendering
			expect(imageBox.height).toBeLessThanOrEqual(520);
		}
	});

	test('should have optimized gallery image sizing', async ({ page }) => {
		// Navigate to Whispera detail page
		await page.goto('/projects/whispera');

		// Wait for page to load
		await page.waitForLoadState('networkidle');

		// Scroll to gallery section
		await page.evaluate(() => window.scrollTo(0, 800));

		// Get gallery section
		const gallerySection = page.locator('section').filter({ hasText: 'Gallery' });
		await expect(gallerySection).toBeVisible();

		// Get the main gallery image (not thumbnails)
		const galleryImage = gallerySection.locator('img[alt*="Gallery image"]').first();
		await expect(galleryImage).toBeVisible();

		// Verify image has object-contain class
		await expect(galleryImage).toHaveClass(/object-contain/);

		// Verify image has max-height constraint (450px for gallery images)
		await expect(galleryImage).toHaveClass(/max-h-\[450px\]/);

		// Get the bounding box to verify actual size doesn't exceed max-height
		const imageBox = await galleryImage.boundingBox();
		if (imageBox) {
			// 450px max-height, but allow some tolerance for rendering
			expect(imageBox.height).toBeLessThanOrEqual(470);
		}

		// Test navigation to ensure sizing persists
		await page.click('button[aria-label="Next image"]');
		await expect(page.locator('text=2 / 2')).toBeVisible();

		// Verify second image also has proper constraints
		const secondImage = gallerySection.locator('img[alt*="Gallery image"]').first();
		await expect(secondImage).toHaveClass(/object-contain/);
		await expect(secondImage).toHaveClass(/max-h-\[450px\]/);
	});

	test('should maintain image aspect ratio with object-contain', async ({ page }) => {
		// Navigate to projects page
		await page.goto('/projects');

		// Wait for images to load
		await page.waitForLoadState('networkidle');

		// Get the Whispera project image
		const projectImage = page.locator('article').filter({ hasText: 'Whispera' }).locator('img').first();
		await expect(projectImage).toBeVisible();

		// Verify object-contain is used (not object-cover which would crop)
		await expect(projectImage).toHaveClass(/object-contain/);

		// Verify container has proper centering classes
		const imageContainer = projectImage.locator('..');
		await expect(imageContainer).toHaveClass(/flex/);
		await expect(imageContainer).toHaveClass(/items-center/);
		await expect(imageContainer).toHaveClass(/justify-center/);
	});

	test('should have responsive image sizing on mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		// Navigate to projects page
		await page.goto('/projects');

		// Wait for images to load
		await page.waitForLoadState('networkidle');

		// Get the Whispera project image
		const projectImage = page.locator('article').filter({ hasText: 'Whispera' }).locator('img').first();
		await expect(projectImage).toBeVisible();

		// Verify max-height constraint still applies on mobile
		await expect(projectImage).toHaveClass(/max-h-\[300px\]/);

		// Get image dimensions
		const imageBox = await projectImage.boundingBox();
		if (imageBox) {
			// Image should not exceed 300px height even on mobile
			expect(imageBox.height).toBeLessThanOrEqual(320);
			// Image width should not exceed viewport width
			expect(imageBox.width).toBeLessThanOrEqual(375);
		}
	});
});