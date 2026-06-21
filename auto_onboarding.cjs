const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.setViewportSize({ width: 390, height: 844 });
  
  console.log('Loading site...');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'networkidle' });
  
  // Clear localStorage
  await page.evaluate(() => {
    localStorage.clear();
  });
  
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(8000);
  
  // Click "시작하기"
  const startButton = await page.locator('button').filter({ hasText: /시작하기/ });
  await startButton.click();
  await page.waitForTimeout(2000);
  
  console.log('Starting onboarding...');
  
  // Auto-answer all 12 questions
  for (let q = 1; q <= 12; q++) {
    console.log(`  Q${q}: Selecting first option...`);
    
    // Get all checkboxes
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    if (checkboxes.length > 0) {
      await checkboxes[0].check();
      await page.waitForTimeout(1500);
    }
  }
  
  console.log('Onboarding complete, waiting for navigation...');
  await page.waitForTimeout(3000);
  
  // Take screenshot to see result
  await page.screenshot({ path: 'after_onboarding.png' });
  
  // Check URL to see where we are
  const url = page.url();
  console.log('Current URL:', url);
  
  // Get page text
  const text = await page.locator('body').textContent();
  console.log('Page contains:', text.substring(0, 200));
  
  await browser.close();
})();
