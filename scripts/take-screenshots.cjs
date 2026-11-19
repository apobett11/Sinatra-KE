const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots', { recursive: true });
  }

  const browser = await chromium.launch();

  // 1. Mobile Dark Theme (Exact iPhone viewport)
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:5173');
    await page.evaluate(() => {
      localStorage.setItem('sinatra_theme', 'dark');
      localStorage.setItem('sinatra_wishlist', '[]');
    });
    await page.reload();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'screenshots/mobile-dark.png' });
    await page.screenshot({ path: 'screenshots/mobile-dark-full.png', fullPage: true });
    console.log('Saved mobile-dark.png');
    await context.close();
  }

  // 2. Mobile Light Theme
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:5173');
    await page.evaluate(() => {
      localStorage.setItem('sinatra_theme', 'light');
      localStorage.setItem('sinatra_wishlist', '[]');
    });
    await page.reload();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'screenshots/mobile-light.png' });
    await page.screenshot({ path: 'screenshots/mobile-light-full.png', fullPage: true });
    console.log('Saved mobile-light.png');
    await context.close();
  }

  // 3. Desktop Dark Theme
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:5173');
    await page.evaluate(() => {
      localStorage.setItem('sinatra_theme', 'dark');
      localStorage.setItem('sinatra_wishlist', '[]');
    });
    await page.reload();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'screenshots/desktop-dark.png' });
    await page.screenshot({ path: 'screenshots/desktop-dark-full.png', fullPage: true });
    console.log('Saved desktop-dark.png');
    await context.close();
  }

  // 4. Desktop Light Theme
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:5173');
    await page.evaluate(() => {
      localStorage.setItem('sinatra_theme', 'light');
      localStorage.setItem('sinatra_wishlist', '[]');
    });
    await page.reload();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'screenshots/desktop-light.png' });
    await page.screenshot({ path: 'screenshots/desktop-light-full.png', fullPage: true });
    console.log('Saved desktop-light.png');
    await context.close();
  }

  await browser.close();
  console.log('All screenshots captured!');
})();
