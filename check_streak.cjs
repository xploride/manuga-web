const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to mobile size
  await page.setViewportSize({ width: 390, height: 844 });
  
  // Navigate to the live site
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'networkidle' });
  
  // Wait a moment for the app to fully load
  await page.waitForTimeout(2000);
  
  // Get localStorage data
  const localStorageData = await page.evaluate(() => {
    return {
      streakDates: localStorage.getItem('streakDates'),
      homeChecks: localStorage.getItem('homeChecks'),
      onboardingAnswers: localStorage.getItem('onboardingAnswers') ? 'exists' : 'not exists'
    };
  });
  
  console.log('=== localStorage Data ===');
  console.log('streakDates:', localStorageData.streakDates);
  console.log('homeChecks:', localStorageData.homeChecks);
  console.log('onboardingAnswers:', localStorageData.onboardingAnswers);
  
  // Take screenshot
  await page.screenshot({ path: 'home_screen.png' });
  console.log('\n✅ Screenshot saved: home_screen.png');
  
  await browser.close();
})();
