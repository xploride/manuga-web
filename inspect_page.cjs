const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to mobile size
  await page.setViewportSize({ width: 390, height: 844 });
  
  // Navigate to the live site
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'networkidle' });
  
  // Clear localStorage
  await page.evaluate(() => {
    localStorage.clear();
  });
  
  // Reload
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Get page content
  const content = await page.content();
  
  // Find button with 시작하기
  const startButton = await page.locator('button').filter({ hasText: /시작하기/ });
  if (await startButton.count() > 0) {
    console.log('✅ Found "시작하기" button');
    await startButton.click();
    await page.waitForTimeout(1500);
    
    // Now check onboarding page
    const buttons = await page.locator('button').all();
    console.log(`\nFound ${buttons.length} buttons on page`);
    
    // Get first few button texts
    for (let i = 0; i < Math.min(5, buttons.length); i++) {
      const text = await buttons[i].textContent();
      console.log(`  Button ${i}: ${text}`);
    }
  } else {
    console.log('❌ Could not find "시작하기" button');
  }
  
  await browser.close();
})();
