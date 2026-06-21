const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.setViewportSize({ width: 390, height: 844 });
  
  // Go directly to add nutrient page
  console.log('Loading add nutrient page directly...');
  await page.goto('https://manuga-dc5c2.web.app/cabinet/add', { waitUntil: 'networkidle' });
  
  await page.waitForTimeout(2000);
  
  // Check if we have any nutrient items
  const buttons = await page.locator('button').allTextContents();
  console.log('Buttons on page:', buttons.slice(0, 20));
  
  // Take screenshot
  await page.screenshot({ path: 'add_nutrient_page.png' });
  
  await browser.close();
})();
