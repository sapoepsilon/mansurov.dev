import { test, expect } from '@playwright/test';

async function openMobileDropdown(page: import('@playwright/test').Page) {
	const trigger = page.locator('[data-melt-dropdown-menu-trigger]');
	await expect(trigger).toBeVisible();
	// The dropdown trigger inside a menubar needs special handling.
	// Retry clicking until the menu opens (max 3 attempts).
	for (let i = 0; i < 3; i++) {
		await trigger.click({ force: true });
		await page.waitForTimeout(500);
		const state = await trigger.getAttribute('data-state');
		if (state === 'open') break;
	}
	const dropdownContent = page.locator('[role="menu"]');
	await expect(dropdownContent).toBeVisible();
}

test.describe('Mobile Navigation Dropdown', () => {
	test('hamburger menu should be visible on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/about');

		const hamburger = page.locator('[data-melt-dropdown-menu-trigger]');
		await expect(hamburger).toBeVisible();
	});

	test('dropdown should open and have visible background', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/about');
		await openMobileDropdown(page);

		const dropdownContent = page.locator('[role="menu"]');

		// Verify the dropdown has a background (not transparent)
		const bgColor = await dropdownContent.evaluate((el) => {
			return window.getComputedStyle(el).backgroundColor;
		});
		expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
		expect(bgColor).not.toBe('transparent');

		// Verify the dropdown has a border
		const borderWidth = await dropdownContent.evaluate((el) => {
			return window.getComputedStyle(el).borderWidth;
		});
		expect(borderWidth).not.toBe('0px');

		// Verify the dropdown has a box shadow
		const boxShadow = await dropdownContent.evaluate((el) => {
			return window.getComputedStyle(el).boxShadow;
		});
		expect(boxShadow).not.toBe('none');
	});

	test('menu items should be large enough to tap', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/about');
		await openMobileDropdown(page);

		const menuItems = page.locator('[role="menuitem"]');
		await expect(menuItems.first()).toBeVisible();

		const count = await menuItems.count();
		expect(count).toBeGreaterThan(0);

		for (let i = 0; i < count; i++) {
			const box = await menuItems.nth(i).boundingBox();
			expect(box).not.toBeNull();
			if (box) {
				expect(box.height).toBeGreaterThanOrEqual(40);
			}
		}
	});

	test('menu items should navigate correctly', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/about');
		await openMobileDropdown(page);

		const blogItem = page.locator('[role="menuitem"]', { hasText: 'Blog' });
		await expect(blogItem).toBeVisible();
		await blogItem.click();

		await expect(page).toHaveURL('/blog');
	});

	test('current page should be highlighted in dropdown', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/about');
		await openMobileDropdown(page);

		const aboutItem = page.locator('[role="menuitem"]', { hasText: 'About' });
		await expect(aboutItem).toBeVisible();
		await expect(aboutItem.locator('span')).toContainText('•');
	});

	test('desktop nav links should be hidden on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.goto('/about');

		const desktopNav = page.locator('.hidden.sm\\:flex');
		await expect(desktopNav).not.toBeVisible();
	});
});

test.describe('Desktop Navigation', () => {
	test('hamburger menu should be hidden on desktop', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto('/about');

		const hamburgerContainer = page.locator('.sm\\:hidden');
		await expect(hamburgerContainer).not.toBeVisible();
	});

	test('desktop nav links should be visible', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 720 });
		await page.goto('/about');

		const desktopNav = page.locator('.hidden.sm\\:flex');
		await expect(desktopNav).toBeVisible();

		await expect(desktopNav.getByText('About')).toBeVisible();
		await expect(desktopNav.getByText('Blog')).toBeVisible();
		await expect(desktopNav.getByText('Projects')).toBeVisible();
	});
});
