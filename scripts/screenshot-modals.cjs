const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();

  // Test Share Modal on Mobile Dark
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
    await page.waitForTimeout(400);

    // Click share button
    await page.click('button[aria-label="Share product"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/modal-share-mobile-dark.png' });
    await context.close();
  }

  // Test Size Guide Modal on Desktop Light
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
    await page.waitForTimeout(400);

    // Click Size Guide
    await page.click('text="Size Guide"');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/modal-size-guide.png' });
    await context.close();
  }

  // Test Lightbox on Desktop Dark
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/product/sinatra-classic-hoodie');
    await page.evaluate(() => {
      localStorage.setItem('sinatra_theme', 'dark');
    });
    await page.reload();
    await page.waitForTimeout(400);

    // Click image to open lightbox
    await page.click('button[aria-label="Open image viewer"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: 'screenshots/modal-lightbox.png' });
    await context.close();
  }

  await browser.close();
  console.log('Modal screenshots captured!');
})();
