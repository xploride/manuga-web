const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 400, height: 800 });
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    const screenshotPath = path.join(__dirname, 'home-screen.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log('✅ Screenshot saved:', screenshotPath);
  } finally {
    await browser.close();
  }
})();
