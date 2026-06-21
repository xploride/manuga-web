const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.setViewportSize({ width: 390, height: 844 });
  
  console.log('Loading add nutrient page...');
  await page.goto('https://manuga-dc5c2.web.app/cabinet/add', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  
  // Click the first + button (for 비타민B군)
  console.log('Clicking + button for first nutrient...');
  
  // Get all buttons and find the Plus buttons
  const buttons = await page.locator('button').all();
  
  // Each nutrient has 2 buttons: chevron and plus
  // The plus buttons should be every other button after the nutrient icons
  for (let i = 0; i < buttons.length; i++) {
    const aria = await buttons[i].getAttribute('aria-label');
    const content = await buttons[i].textContent();
    
    if (content.trim() === '+' || aria === undefined) {
      console.log(`Clicking button ${i}...`);
      await buttons[i].click();
      await page.waitForTimeout(1000);
      
      // Check localStorage
      const data = await page.evaluate(() => {
        const items = localStorage.getItem('cabinetItems');
        return {
          cabinetItems: items ? JSON.parse(items) : null,
          count: items ? JSON.parse(items).length : 0
        };
      });
      
      console.log('cabinetItems after click:', data.cabinetItems);
      if (data.count > 0) {
        console.log('✅ Item added to cabinet!');
        
        // Go to cabinet
        await page.goto('https://manuga-dc5c2.web.app/cabinet', { waitUntil: 'networkidle' });
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'cabinet_with_item.png' });
        break;
      }
    }
  }
  
  await browser.close();
})();
