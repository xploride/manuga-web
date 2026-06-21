const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.setViewportSize({ width: 390, height: 844 });
  
  console.log('Loading home page...');
  await page.goto('https://manuga-dc5c2.web.app/', { waitUntil: 'networkidle' });
  
  // Inject test data into localStorage
  console.log('Injecting test data...');
  await page.evaluate(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const addedAt = `${year}.${month}.${day}`;
    
    const testItems = [
      {
        name: '비타민C',
        addedAt: addedAt,
        memo: 'Test item',
        source: 'manual'
      },
      {
        name: '오메가3',
        addedAt: addedAt,
        memo: '',
        source: 'analysis',
        category: '혈행 건강'
      }
    ];
    
    localStorage.setItem('cabinetItems', JSON.stringify(testItems));
    console.log('Test data injected');
  });
  
  // Reload to see if items appear
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  console.log('Checking if items appear on home...');
  const checkboxes = await page.locator('input[type="checkbox"]').all();
  console.log('Checkboxes found:', checkboxes.length);
  
  if (checkboxes.length > 0) {
    console.log('✅ Items displayed on home screen!');
    
    // Click first checkbox
    console.log('Clicking first checkbox...');
    await checkboxes[0].check();
    await page.waitForTimeout(1500);
    
    // Check streakDates
    const data = await page.evaluate(() => {
      return {
        streakDates: localStorage.getItem('streakDates'),
        homeChecks: localStorage.getItem('homeChecks')
      };
    });
    
    console.log('streakDates:', data.streakDates);
    console.log('homeChecks:', data.homeChecks);
    
    if (data.streakDates) {
      console.log('✅ streakDates 저장됨!');
      const dates = JSON.parse(data.streakDates);
      console.log('  Dates:', dates);
    } else {
      console.log('❌ streakDates 저장 안 됨');
    }
  } else {
    console.log('❌ No checkboxes found');
  }
  
  // Screenshot
  await page.screenshot({ path: 'home_with_injected_data.png' });
  console.log('Screenshot saved');
  
  await browser.close();
})();
