const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to mobile size
  await page.setViewportSize({ width: 390, height: 844 });
  
  // Navigate to the live site
  console.log('Loading https://manuga-dc5c2.web.app...');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'networkidle' });
  
  // Clear localStorage
  await page.evaluate(() => {
    localStorage.clear();
  });
  
  // Reload
  await page.reload({ waitUntil: 'networkidle' });
  
  // Wait for Welcome sequence to complete (let it play through)
  console.log('Waiting for Welcome sequence to complete...');
  await page.waitForTimeout(8000);
  
  // Now try to find the button
  const startButton = await page.locator('button').filter({ hasText: /시작하기/ });
  const count = await startButton.count();
  
  console.log(`Found ${count} "시작하기" buttons`);
  
  if (count > 0) {
    console.log('✅ Button found!');
    await page.screenshot({ path: 'welcome_final.png' });
  } else {
    console.log('❌ Button still not found');
    // Get all text
    const text = await page.locator('body').textContent();
    console.log('Page text:', text.substring(0, 300));
    
    // Take screenshot anyway
    await page.screenshot({ path: 'welcome_final.png' });
  }
  
  await browser.close();
})();
