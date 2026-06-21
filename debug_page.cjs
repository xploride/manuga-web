const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to mobile size
  await page.setViewportSize({ width: 390, height: 844 });
  
  // Navigate to the live site
  console.log('Loading https://manuga-dc5c2.web.app...');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'networkidle' });
  
  await page.waitForTimeout(2000);
  
  // Take a screenshot to see what's on the page
  await page.screenshot({ path: 'initial_page.png' });
  
  // Get all text on the page
  const bodyText = await page.locator('body').textContent();
  console.log('\n=== Page Text Content ===');
  console.log(bodyText.substring(0, 500));
  
  // Get all buttons
  const buttons = await page.locator('button').all();
  console.log(`\n=== Total buttons found: ${buttons.length} ===`);
  
  for (let i = 0; i < Math.min(10, buttons.length); i++) {
    const text = await buttons[i].textContent();
    console.log(`Button ${i}: "${text.trim()}"`);
  }
  
  await browser.close();
})();
