const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 500, height: 500 } });

  const testUrl = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=700&q=80';
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { width: 500px; height: 500px; background: #f8fafc; display: flex; align-items: center; justify-content: center; overflow: hidden; }
          .container { position: relative; width: 460px; height: 460px; display: flex; align-items: center; justify-content: center; }
          img { width: 100%; height: 100%; object-fit: contain; }
          .brand-text {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-weight: 900;
            font-size: 24px;
            letter-spacing: 5px;
            color: #ffffff;
            text-shadow: 0 1px 2px rgba(0,0,0,0.6);
            user-select: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${testUrl}" />
          <div class="brand-text">SINATRA</div>
        </div>
      </body>
    </html>
  `);

  await page.waitForLoadState('networkidle');
  const outPath = path.resolve(__dirname, '../public/images/products/test-output.png');
  await page.screenshot({ path: outPath, quality: 90, type: 'jpeg' });
  await browser.close();
  console.log('Saved to:', outPath);
}

run().catch(console.error);
