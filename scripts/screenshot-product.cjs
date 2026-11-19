const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots', { recursive: true });
  }

  const browser = await chromium.launch();

  // 1. Mobile Dark
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/product/sinatra-classic-hoodie');
    await page.evaluate(() => {
      localStorage.setItem('sinatra_theme', 'dark');
      localStorage.setItem('sinatra_wishlist', '[]');
    });
    await page.reload();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'screenshots/product-mobile-dark.png' });
    await page.screenshot({ path: 'screenshots/product-mobile-dark-full.png', fullPage: true });
    await context.close();
  }

  // 2. Mobile Light
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/product/sinatra-classic-hoodie');
    await page.evaluate(() => {
      localStorage.setItem('sinatra_theme', 'light');
      localStorage.setItem('sinatra_wishlist', '[]');
    });
    await page.reload();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'screenshots/product-mobile-light.png' });
    await page.screenshot({ path: 'screenshots/product-mobile-light-full.png', fullPage: true });
    await context.close();
  }

  // 3. Desktop Dark
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/product/sinatra-classic-hoodie');
    await page.evaluate(() => {
      localStorage.setItem('sinatra_theme', 'dark');
      localStorage.setItem('sinatra_wishlist', '[]');
    });
    await page.reload();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'screenshots/product-desktop-dark.png' });
    await page.screenshot({ path: 'screenshots/product-desktop-dark-full.png', fullPage: true });
    await context.close();
  }

  // 4. Desktop Light
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/product/sinatra-classic-hoodie');
    await page.evaluate(() => {
      localStorage.setItem('sinatra_theme', 'light');
      localStorage.setItem('sinatra_wishlist', '[]');
    });
    await page.reload();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'screenshots/product-desktop-light.png' });
    await page.screenshot({ path: 'screenshots/product-desktop-light-full.png', fullPage: true });
    await context.close();
  }

  await browser.close();
  console.log('Product screenshots captured successfully.');
})();
