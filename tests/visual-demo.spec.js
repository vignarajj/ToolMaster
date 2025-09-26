import { test, expect } from '@playwright/test';

test.describe('Visual Demo of ToolMaster UI', () => {
  test('Complete UI Demo - Desktop View', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173/');
    
    // Wait for app to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Set to desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    
    console.log('=== CHECKING DESKTOP VIEW ===');
    
    // Check if hamburger menu is visible (it should be hidden)
    const hamburgerMenu = page.locator('[data-testid="button-mobile-menu"]');
    const isHamburgerVisible = await hamburgerMenu.isVisible();
    console.log('Hamburger menu visible on desktop:', isHamburgerVisible);
    
    // Check if navigation is visible
    const desktopNav = page.locator('header nav');
    const isNavVisible = await desktopNav.isVisible();
    console.log('Desktop navigation visible:', isNavVisible);
    
    // Take a screenshot
    await page.screenshot({ path: 'desktop-view-before-theme.png', fullPage: true });
    
    // Check theme toggle button
    const themeToggle = page.locator('[data-testid="button-theme-toggle"]');
    const isThemeToggleVisible = await themeToggle.isVisible();
    console.log('Theme toggle visible:', isThemeToggleVisible);
    
    // Check initial theme
    const htmlElement = page.locator('html');
    const initialTheme = await htmlElement.getAttribute('class');
    console.log('Initial theme class:', initialTheme);
    
    await page.waitForTimeout(2000);
    
    // Click theme toggle
    console.log('=== CLICKING THEME TOGGLE ===');
    await themeToggle.click();
    await page.waitForTimeout(2000);
    
    // Check theme after toggle
    const newTheme = await htmlElement.getAttribute('class');
    console.log('Theme after toggle:', newTheme);
    
    // Take screenshot after theme change
    await page.screenshot({ path: 'desktop-view-after-theme.png', fullPage: true });
    
    // Test navigation buttons
    console.log('=== TESTING NAVIGATION BUTTONS ===');
    const navButtons = await page.locator('header nav button').all();
    console.log('Number of navigation buttons found:', navButtons.length);
    
    for (let i = 0; i < Math.min(navButtons.length, 3); i++) {
      const button = navButtons[i];
      const buttonText = await button.textContent();
      console.log(`Button ${i + 1}: ${buttonText}`);
      
      // Hover over button to see color change
      await button.hover();
      await page.waitForTimeout(1000);
      
      // Get button background color
      const bgColor = await button.evaluate(el => window.getComputedStyle(el).backgroundColor);
      console.log(`Button ${i + 1} hover background: ${bgColor}`);
    }
    
    // Test a page navigation
    if (navButtons.length > 1) {
      console.log('=== TESTING PAGE NAVIGATION ===');
      await navButtons[1].click();
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      console.log('Current URL after navigation:', currentUrl);
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'desktop-view-final.png', fullPage: true });
    
    // Keep browser open for a few more seconds
    await page.waitForTimeout(5000);
    
    console.log('=== DEMO COMPLETE ===');
  });
  
  test('Mobile View Demo', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173/');
    
    // Wait for app to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Set to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    console.log('=== CHECKING MOBILE VIEW ===');
    
    // Check if hamburger menu is visible (it should be visible on mobile)
    const hamburgerMenu = page.locator('[data-testid="button-mobile-menu"]');
    const isHamburgerVisible = await hamburgerMenu.isVisible();
    console.log('Hamburger menu visible on mobile:', isHamburgerVisible);
    
    // Take mobile screenshot
    await page.screenshot({ path: 'mobile-view.png', fullPage: true });
    
    // Keep browser open
    await page.waitForTimeout(3000);
    
    console.log('=== MOBILE DEMO COMPLETE ===');
  });
});