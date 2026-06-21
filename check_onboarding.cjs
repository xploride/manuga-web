const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to mobile size
  await page.setViewportSize({ width: 390, height: 844 });
  
  // Navigate to the live site
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'networkidle' });
  
  await page.evaluate(() => {
    localStorage.clear();
  });
  
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(8000);
  
  // Click "시작하기"
  const startButton = await page.locator('button').filter({ hasText: /시작하기/ });
  await startButton.click();
  await page.waitForTimeout(2000);
  
  // Take screenshot to see onboarding page
  await page.screenshot({ path: 'onboarding_page.png' });
  
  // Get all button texts
  const buttons = await page.locator('button').all();
  console.log('Buttons on onboarding page:');
  for (let i = 0; i < Math.min(15, buttons.length); i++) {
    const text = await buttons[i].textContent();
    console.log(`  ${i}: "${text.trim()}"`);
  }
  
  // Get page title/heading
  const headings = await page.locator('h1, h2, h3, p').all();
  console.log('\nHeadings/paragraphs:');
  for (let i = 0; i < Math.min(5, headings.length); i++) {
    const text = await headings[i].textContent();
    console.log(`  "${text.trim()}"`);
  }
  
  await browser.close();
})();
