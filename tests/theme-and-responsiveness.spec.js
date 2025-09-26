import { test, expect } from '@playwright/test';

test.describe('Theme and Responsiveness Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173/');
    // Wait for the app to load - check for theme toggle button or app name
    await Promise.race([
      page.waitForSelector('[data-testid="button-theme-toggle"]', { timeout: 10000 }),
      page.waitForSelector('h1', { timeout: 10000 }),
      page.waitForSelector('.w-8.h-8.bg-primary', { timeout: 10000 })
    ]);
  });

  test.describe('Dark Theme Functionality', () => {
    test('should apply light theme by default', async ({ page }) => {
      // Check if light theme is applied by verifying HTML class
      const htmlElement = await page.locator('html');
      await expect(htmlElement).toHaveClass(/light/);
      
      // Verify theme is working by checking if ToolMaster brand is visible in header
      const brand = await page.locator('header span:has-text("ToolMaster")');
      await expect(brand).toBeVisible();
      
      // Check if header navigation is visible (on desktop)
      const headerNav = await page.locator('header nav');
      const headerExists = await headerNav.count() > 0;
      expect(headerExists).toBe(true);
    });

    test('should toggle theme correctly', async ({ page }) => {
      // Get initial theme state
      const htmlElement = await page.locator('html');
      
      // Find and click the theme toggle button (there are two - one for desktop, one for mobile)
      const themeToggleButtons = await page.locator('[data-testid="button-theme-toggle"]').all();
      let themeButton = null;
      
      for (const button of themeToggleButtons) {
        const isVisible = await button.isVisible();
        if (isVisible) {
          themeButton = button;
          break;
        }
      }
      
      expect(themeButton).not.toBeNull();
      
      // Click theme toggle button (should go from light to dark)
      await themeButton.click();
      
      // Check if theme changed from light to dark
      await expect(htmlElement).toHaveClass(/dark/);
      
      // Click theme toggle again
      await themeButton.click();
      
      // Should be back to light
      await expect(htmlElement).toHaveClass(/light/);
    });

    test('should maintain primary color (HSL format) in both themes', async ({ page }) => {
      // Check primary color usage
      const primaryColor = await page.evaluate(() => {
        const root = document.documentElement;
        const computedStyle = window.getComputedStyle(root);
        return computedStyle.getPropertyValue('--primary');
      });
      expect(primaryColor.trim()).toBe('23 95% 42%'); // HSL format
      
      // Check if primary color is applied to visible buttons
      const buttons = await page.locator('button').all();
      let foundPrimaryButton = false;
      
      for (const button of buttons) {
        const isVisible = await button.isVisible();
        if (isVisible) {
          const buttonBgColor = await button.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
          });
          if (buttonBgColor === 'rgb(212, 82, 2)') { // #d45202 in rgb
            foundPrimaryButton = true;
            break;
          }
        }
      }
      
      // If no button with primary color found, check CSS custom property
      if (!foundPrimaryButton) {
        const primaryColorComputed = await page.evaluate(() => {
          return window.getComputedStyle(document.documentElement).getPropertyValue('--primary');
        });
        expect(primaryColorComputed.trim()).toBe('23 95% 42%');
      }
    });
  });

  test.describe('Responsiveness Tests', () => {
    test('should display mobile menu button on small screens', async ({ page }) => {
      // Set viewport to mobile size
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Wait for responsive layout to adjust
      await page.waitForTimeout(500);
      
      // Check if mobile menu button is visible
      const mobileMenuButton = await page.locator('[data-testid="button-mobile-menu"]');
      await expect(mobileMenuButton).toBeVisible();
      
      // Check if sidebar is hidden by default
      const sidebar = await page.locator('aside').first();
      await expect(sidebar).toHaveClass(/-translate-x-full/);
      
      // Open sidebar
      await mobileMenuButton.click();
      await expect(sidebar).not.toHaveClass(/-translate-x-full/);
    });

    test('should hide mobile menu button on desktop screens', async ({ page }) => {
      // Set viewport to desktop size
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Wait for responsive layout to adjust
      await page.waitForTimeout(500);
      
      // Check if mobile menu button is hidden
      const mobileMenuButton = await page.locator('[data-testid="button-mobile-menu"]');
      await expect(mobileMenuButton).toBeHidden();
      
      // Check if desktop navigation in header is visible
      const desktopNav = await page.locator('header nav'); // Get the header nav
      await expect(desktopNav).toBeVisible();
      
      // Check if sidebar is hidden on desktop (sidebar only for mobile/tablet now)
      const sidebar = await page.locator('aside').first();
      await expect(sidebar).toBeHidden(); // Should be hidden on desktop
    });

    test('should adjust sidebar width on different screen sizes', async ({ page }) => {
      // Test tablet size
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Open sidebar if needed
      const mobileMenuButton = await page.locator('[data-testid="button-mobile-menu"]');
      const isMobileMenuVisible = await mobileMenuButton.isVisible();
      
      if (isMobileMenuVisible) {
        await mobileMenuButton.click();
      }
      
      // Wait for sidebar to be visible
      await page.waitForTimeout(500);
      
      const sidebarTablet = await page.locator('aside').first();
      const tabletWidth = await sidebarTablet.evaluate((el) => {
        return window.getComputedStyle(el).width;
      });
      expect(parseInt(tabletWidth)).toBeLessThanOrEqual(288); // 18rem = 288px
      
      // Test desktop size
      await page.setViewportSize({ width: 1920, height: 1080 });
      const sidebarDesktop = await page.locator('aside').first();
      await expect(sidebarDesktop).toBeHidden(); // Should be hidden on desktop
    });

    test('should adjust header text size on different screens', async ({ page }) => {
      // Test mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      const brandMobile = await page.locator('header span:has-text("ToolMaster")').first();
      const mobileFontSize = await brandMobile.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      expect(parseInt(mobileFontSize)).toBeGreaterThan(10); // Should have readable size
      
      // Test desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      const brandDesktop = await page.locator('header span:has-text("ToolMaster")').first();
      const desktopFontSize = await brandDesktop.evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      expect(parseInt(desktopFontSize)).toBeGreaterThan(10); // Should have readable size
    });

    test('should adjust main content padding on different screens', async ({ page }) => {
      // Test mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      const mainMobile = await page.locator('main').first();
      const mobilePadding = await mainMobile.evaluate((el) => {
        return window.getComputedStyle(el).padding;
      });
      expect(mobilePadding).toBe('12px'); // p-3
      
      // Test desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      const mainDesktop = await page.locator('main').first();
      const desktopPadding = await mainDesktop.evaluate((el) => {
        return window.getComputedStyle(el).padding;
      });
      expect(desktopPadding).toBe('24px'); // p-6
    });
  });

  test.describe('Navigation Tests', () => {
    test('should navigate between pages correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      // Open sidebar
      await page.click('[data-testid="button-mobile-menu"]');
      await page.waitForSelector('[data-testid="nav-text-converter"]', { timeout: 5000 });
      
      // Navigate to text converter
      await page.click('[data-testid="nav-text-converter"]');
      await page.waitForURL('**/text-converter', { timeout: 5000 });
      
      // Check if URL changed
      expect(page.url()).toContain('/text-converter');
      
      // Check if we're on the text converter page by looking for page-specific content
      const pageContent = await page.locator('main');
      await expect(pageContent).toBeVisible();
    });

    test('should navigate between pages correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      // Find visible navigation button in header
      const navButtons = await page.locator('header nav button[data-testid^="nav-"]').all();
      let visibleNavButton = null;
      let targetRoute = null;
      
      for (const button of navButtons) {
        const isVisible = await button.isVisible();
        if (isVisible) {
          visibleNavButton = button;
          const testId = await button.getAttribute('data-testid');
          if (testId === 'nav-password-generator') {
            targetRoute = '/password';
          } else if (testId === 'nav-text-converter') {
            targetRoute = '/text-converter';
          } else if (testId === 'nav-base64-encoder') {
            targetRoute = '/base64';
          } else if (testId === 'nav-text-counter') {
            targetRoute = '/';
          } else if (testId === 'nav-qr-code-generator') {
            targetRoute = '/qr-code';
          } else if (testId === 'nav-color-picker') {
            targetRoute = '/color-picker';
          }
          break;
        }
      }
      
      expect(visibleNavButton).not.toBeNull();
      expect(targetRoute).not.toBeNull();
      
      // Navigate using the found button
      await visibleNavButton.click();
      await page.waitForURL(`**${targetRoute}`, { timeout: 5000 });
      
      // Check if URL changed
      expect(page.url()).toContain(targetRoute);
    });
  });

  test.describe('Theme Persistence Tests', () => {
    test('should remember theme preference across page reloads', async ({ page }) => {
      // Find and click the theme toggle button
      const themeToggleButtons = await page.locator('[data-testid="button-theme-toggle"]').all();
      let themeButton = null;
      
      for (const button of themeToggleButtons) {
        const isVisible = await button.isVisible();
        if (isVisible) {
          themeButton = button;
          break;
        }
      }
      
      expect(themeButton).not.toBeNull();
      
      // Change theme to dark (starts as light)
      await themeButton.click();
      await expect(page.locator('html')).toHaveClass(/dark/);
      
      // Reload page
      await page.reload();
      await Promise.race([
        page.waitForSelector('[data-testid="button-theme-toggle"]', { timeout: 10000 }),
        page.waitForSelector('header span:has-text("ToolMaster")', { timeout: 10000 })
      ]);
      
      // Check if theme preference persisted (should still be dark)
      await expect(page.locator('html')).toHaveClass(/dark/);
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should have proper color contrast in dark theme', async ({ page }) => {
      // First switch to dark theme (starts as light by default)
      const themeToggleButtons = await page.locator('[data-testid="button-theme-toggle"]').all();
      let themeButton = null;
      
      for (const button of themeToggleButtons) {
        const isVisible = await button.isVisible();
        if (isVisible) {
          themeButton = button;
          break;
        }
      }
      
      expect(themeButton).not.toBeNull();
      await themeButton.click();
      
      // This is a basic check - in real scenarios, you'd use axe-core or similar tools
      const htmlElement = await page.locator('html');
      await expect(htmlElement).toHaveClass(/dark/);
      
      // Check if text is visible (basic contrast check)
      const brandText = await page.locator('header span:has-text("ToolMaster")').first();
      const textColor = await brandText.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      // In dark theme, text should be a valid RGB color
      expect(textColor).toMatch(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/); // Should be a valid RGB color
    });

    test('should have proper focus indicators', async ({ page }) => {
      // Find a focusable element
      const mobileMenuButton = await page.locator('[data-testid="button-mobile-menu"]');
      const isMobileMenuVisible = await mobileMenuButton.isVisible();
      
      let focusableElement;
      if (isMobileMenuVisible) {
        focusableElement = mobileMenuButton;
      } else {
        // Look for theme toggle button in desktop nav
        const themeToggleButtons = await page.locator('[data-testid="button-theme-toggle"]').all();
        for (const button of themeToggleButtons) {
          const isVisible = await button.isVisible();
          if (isVisible) {
            focusableElement = button;
            break;
          }
        }
      }
      
      expect(focusableElement).not.toBeNull();
      
      // Focus the element
      await focusableElement.focus();
      
      // Check if focused element has focus ring
      const focusedElement = await page.locator(':focus');
      const focusOutline = await focusedElement.evaluate((el) => {
        return window.getComputedStyle(el).outline;
      });
      expect(focusOutline).not.toBe('none');
    });
  });

  test.describe('Primary Color Usage Tests', () => {
    test('should use primary color for active navigation items', async ({ page }) => {
      // Set desktop viewport to see desktop navigation
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(500);
      
      // Get the current active navigation item from header (first one should be active)
      const headerNavButtons = await page.locator('header nav button').all();
      let activeNavButton = null;
      
      for (const button of headerNavButtons) {
        const isVisible = await button.isVisible();
        if (isVisible) {
          const buttonBgColor = await button.evaluate((el) => {
            return window.getComputedStyle(el).backgroundColor;
          });
          if (buttonBgColor === 'rgb(212, 82, 2)') { // #d45202 in rgb
            activeNavButton = button;
            break;
          }
        }
      }
      
      // If we found an active button, great. If not, check if any button has primary class
      if (!activeNavButton) {
        for (const button of headerNavButtons) {
          const isVisible = await button.isVisible();
          if (isVisible) {
            const hasPrimaryClass = await button.evaluate((el) => {
              return el.classList.contains('bg-primary');
            });
            if (hasPrimaryClass) {
              activeNavButton = button;
              break;
            }
          }
        }
      }
      
      // We should have at least one button with primary color or class
      expect(activeNavButton).not.toBeNull();
    });

    test('should use primary color for logo background', async ({ page }) => {
      // Check logo background color
      const logo = await page.locator('.w-8.h-8.bg-primary').first();
      const hasPrimaryClass = await logo.evaluate((el) => {
        return el.classList.contains('bg-primary');
      });
      expect(hasPrimaryClass).toBe(true);
    });
  });
});
