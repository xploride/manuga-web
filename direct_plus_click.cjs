const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.setViewportSize({ width: 390, height: 844 });
  
  console.log('Loading add nutrient page...');
  await page.goto('https://manuga-dc5c2.web.app/cabinet/add', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  
  // Use page.click with a more specific selector
  // Find the first Plus icon within SVG elements
  console.log('Finding plus button...');
  
  const allButtons = await page.locator('button').count();
  console.log('Total buttons:', allButtons);
  
  // Get the 3rd button (should be Plus for 비타민B군)
  const btn3 = await page.locator('button').nth(2);
  const aria = await btn3.getAttribute('aria-label');
  const text = await btn3.textContent();
  
  console.log(`Button 2: text="${text}", aria="${aria}"`);
  
  // Click it
  console.log('Clicking button 2...');
  try {
    await btn3.click();
    console.log('Click successful');
  } catch (e) {
    console.log('Click failed:', e.message);
  }
  
  await page.waitForTimeout(1500);
  
  // Check localStorage
  const data = await page.evaluate(() => {
    return {
      cabinetItems: localStorage.getItem('cabinetItems'),
      cabinetCount: JSON.parse(localStorage.getItem('cabinetItems') || '[]').length
    };
  });
  
  console.log('Cabinet items:', data.cabinetCount);
  console.log('Data:', data.cabinetItems);
  
  // Take a screenshot to see current state
  await page.screenshot({ path: 'after_plus_click.png' });
  
  await browser.close();
})();
