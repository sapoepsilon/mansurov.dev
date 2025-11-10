import { test, expect } from '@playwright/test';

test.describe('Blog Pages', () => {
	test('should display blog listing page', async ({ page }) => {
		await page.goto('http://localhost:5173/blog');

		await expect(page).toHaveURL('/blog');
		await expect(page.locator('h1')).toContainText('Blog');
		await expect(page.getByText('Technical articles, insights, and learnings')).toBeVisible();
	});

	test('should have Blog link in navbar', async ({ page }) => {
		await page.goto('http://localhost:5173/about');

		const blogLink = page.locator('a[href="/blog"]').first();
		await expect(blogLink).toBeVisible();
		await expect(blogLink).toContainText('Blog');
	});

	test('should navigate to blog from navbar', async ({ page }) => {
		await page.goto('http://localhost:5173/about');

		await page.click('a[href="/blog"]');
		await expect(page).toHaveURL('/blog');
		await expect(page.locator('h1')).toContainText('Blog');
	});

	test('should display error state gracefully when API is unavailable', async ({ page }) => {
		await page.goto('http://localhost:5173/blog');

		const errorIcon = page.locator('svg.text-destructive');
		const noPostsIcon = page.locator('svg.text-muted-foreground');

		const hasError = await errorIcon.count() > 0;
		const hasNoPosts = await noPostsIcon.count() > 0;

		expect(hasError || hasNoPosts).toBeTruthy();
	});

	test('should display posts when API is available', async ({ page }) => {
		await page.goto('http://localhost:5173/blog');

		await page.waitForLoadState('networkidle');

		const articles = page.locator('article');
		const articleCount = await articles.count();

		if (articleCount > 0) {
			await expect(articles.first()).toBeVisible();

			const firstArticleLink = articles.first().locator('a');
			await expect(firstArticleLink).toHaveAttribute('href', /\/blog\/.+/);

			await expect(articles.first().locator('h2')).toBeVisible();

			await expect(articles.first().getByText(/min read/)).toBeVisible();
			await expect(articles.first().getByText(/views/)).toBeVisible();
		}
	});

	test('should display post metadata correctly', async ({ page }) => {
		await page.goto('http://localhost:5173/blog');

		await page.waitForLoadState('networkidle');

		const articles = page.locator('article');
		const articleCount = await articles.count();

		if (articleCount > 0) {
			const firstArticle = articles.first();

			await expect(firstArticle.locator('time')).toBeVisible();

			await expect(firstArticle.getByText(/min read/)).toBeVisible();
			await expect(firstArticle.getByText(/views/)).toBeVisible();

			await expect(firstArticle.getByText('Read more')).toBeVisible();
		}
	});

	test('should navigate to individual post page', async ({ page }) => {
		await page.goto('http://localhost:5173/blog');

		await page.waitForLoadState('networkidle');

		const articles = page.locator('article');
		const articleCount = await articles.count();

		if (articleCount > 0) {
			const firstArticleLink = articles.first().locator('a');
			const href = await firstArticleLink.getAttribute('href');

			await firstArticleLink.click();

			await expect(page).toHaveURL(href!);

			await expect(page.locator('article')).toBeVisible();
		}
	});

	test('should display post content with proper formatting', async ({ page }) => {
		await page.goto('http://localhost:5173/blog');

		await page.waitForLoadState('networkidle');

		const articles = page.locator('article');
		const articleCount = await articles.count();

		if (articleCount > 0) {
			await articles.first().locator('a').click();

			await expect(page.locator('article h1')).toBeVisible();

			await expect(page.locator('time')).toBeVisible();
			await expect(page.getByText(/min read/)).toBeVisible();
			await expect(page.getByText(/views/)).toBeVisible();

			const proseContent = page.locator('.prose');
			await expect(proseContent).toBeVisible();

			const backLink = page.locator('a[href="/blog"]').first();
			await expect(backLink).toBeVisible();
			await expect(backLink).toContainText('Back to Blog');
		}
	});

	test('should handle back navigation from post to listing', async ({ page }) => {
		await page.goto('http://localhost:5173/blog');

		await page.waitForLoadState('networkidle');

		const articles = page.locator('article');
		const articleCount = await articles.count();

		if (articleCount > 0) {
			await articles.first().locator('a').click();

			await expect(page).toHaveURL(/\/blog\/.+/);

			await page.goBack();

			await expect(page).toHaveURL('/blog');
			await expect(page.locator('h1')).toContainText('Blog');
		}
	});

	test('should display 404 for non-existent post slug', async ({ page }) => {
		const response = await page.goto('http://localhost:5173/blog/non-existent-post-slug-12345');

		expect(response?.status()).toBe(404);
	});

	test('should have responsive design on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('http://localhost:5173/blog');

		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('h1')).toContainText('Blog');

		await page.waitForLoadState('networkidle');

		const articles = page.locator('article');
		const articleCount = await articles.count();

		if (articleCount > 0) {
			await expect(articles.first()).toBeVisible();
		}
	});

	test('should have responsive design on desktop', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto('http://localhost:5173/blog');

		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('h1')).toContainText('Blog');

		const container = page.locator('.max-w-6xl');
		await expect(container).toBeVisible();
	});

	test('should display proper meta tags for SEO', async ({ page }) => {
		await page.goto('http://localhost:5173/blog');

		const title = await page.title();
		expect(title).toContain('Blog');
		expect(title).toContain('Ismatulla Mansurov');

		const description = await page.locator('meta[name="description"]').getAttribute('content');
		expect(description).toBeTruthy();
		expect(description).toContain('Technical articles');
	});

	test('should display proper meta tags on individual post', async ({ page }) => {
		await page.goto('http://localhost:5173/blog');

		await page.waitForLoadState('networkidle');

		const articles = page.locator('article');
		const articleCount = await articles.count();

		if (articleCount > 0) {
			await articles.first().locator('a').click();

			const title = await page.title();
			expect(title).toContain('Ismatulla Mansurov');

			const description = await page.locator('meta[name="description"]').getAttribute('content');
			expect(description).toBeTruthy();

			const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
			expect(ogTitle).toContain('Ismatulla Mansurov');

			const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
			expect(ogType).toBe('article');
		}
	});

	test('should show updated date when post is edited', async ({ page }) => {
		await page.goto('http://localhost:5173/blog');

		await page.waitForLoadState('networkidle');

		const articles = page.locator('article');
		const articleCount = await articles.count();

		if (articleCount > 0) {
			await articles.first().locator('a').click();

			const updatedText = page.getByText(/Updated/);
			const hasUpdatedDate = await updatedText.count() > 0;

			if (hasUpdatedDate) {
				await expect(updatedText).toBeVisible();
			}
		}
	});

	test('should maintain theme consistency with rest of site', async ({ page }) => {
		await page.goto('http://localhost:5173/blog');

		const section = page.locator('section.bg-background');
		await expect(section).toBeVisible();

		const heading = page.locator('h1.text-4xl');
		await expect(heading).toBeVisible();
	});

	test('should display footer navigation on post page', async ({ page }) => {
		await page.goto('http://localhost:5173/blog');

		await page.waitForLoadState('networkidle');

		const articles = page.locator('article');
		const articleCount = await articles.count();

		if (articleCount > 0) {
			await articles.first().locator('a').click();

			const footer = page.locator('footer');
			await expect(footer).toBeVisible();

			const allPostsLink = footer.locator('a[href="/blog"]');
			await expect(allPostsLink).toBeVisible();
			await expect(allPostsLink).toContainText('All Posts');
		}
	});

	test('should handle markdown content rendering', async ({ page }) => {
		await page.goto('http://localhost:5173/blog');

		await page.waitForLoadState('networkidle');

		const articles = page.locator('article');
		const articleCount = await articles.count();

		if (articleCount > 0) {
			await articles.first().locator('a').click();

			const proseDiv = page.locator('.prose');
			await expect(proseDiv).toBeVisible();

			await expect(proseDiv).toHaveClass(/prose-lg/);
			await expect(proseDiv).toHaveClass(/dark:prose-invert/);
		}
	});

	test('should highlight active nav item when on blog page', async ({ page }) => {
		await page.goto('http://localhost:5173/blog');

		const blogNavLink = page.locator('a[href="/blog"]').first();
		await expect(blogNavLink).toHaveClass(/text-green-500/);
	});
});
