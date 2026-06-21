const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.setViewportSize({ width: 390, height: 844 });
  
  console.log('Step 1: Loading and clearing...');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'networkidle' });
  
  await page.evaluate(() => {
    localStorage.clear();
  });
  
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(8000);
  
  // Complete onboarding
  console.log('Step 2: Completing onboarding...');
  let btn = await page.locator('button').filter({ hasText: /시작하기/ });
  await btn.click();
  await page.waitForTimeout(1500);
  
  const answers = [
    /남성/, /20대/, /8시간 이상/, /8시간 이상/, /2시간 이상/, 
    /1시간 이상/, /매우높음/, /주5회 이상/
  ];
  
  for (const pattern of answers) {
    btn = await page.locator('button').filter({ hasText: pattern });
    if (await btn.count() > 0) {
      await btn.first().click();
      await page.waitForTimeout(800);
    }
  }
  
  // Q9: Multi
  btn = await page.locator('button').filter({ hasText: /눈건강/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(300);
  btn = await page.locator('button').filter({ hasText: /운동회복/ });
  if (await btn.count() > 0) await btn.first().click();
  btn = await page.locator('button').filter({ hasText: /다음|완료/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(800);
  
  // Q10: Multi
  btn = await page.locator('button').filter({ hasText: /눈피로/ });
  if (await btn.count() > 0) await btn.first().click();
  btn = await page.locator('button').filter({ hasText: /다음|완료/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(800);
  
  // Q11 & Q12
  btn = await page.locator('button').filter({ hasText: /균형있게/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(800);
  
  btn = await page.locator('button').filter({ hasText: /매우좋음/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(2000);
  
  console.log('Step 3: On analysis-result page');
  
  // Click on first category to see details
  const categoryBtn = await page.locator('button, a').filter({ hasText: /눈건강|운동회복|혈행건강/ });
  if (await categoryBtn.count() > 0) {
    console.log('Step 4: Clicking first category...');
    await categoryBtn.first().click();
    await page.waitForTimeout(2000);
  }
  
  // Click "캐비닛에 담기" button
  let addBtn = await page.locator('button').filter({ hasText: /캐비닛에 담기/ });
  if (await addBtn.count() > 0) {
    console.log('Step 5: Adding to cabinet...');
    await addBtn.first().click();
    await page.waitForTimeout(1500);
  }
  
  // Now go back and navigate to home
  // Try clicking back button first
  const backBtn = await page.locator('button').filter({ hasText: /뒤로|돌아가|←/ });
  if (await backBtn.count() > 0) {
    await backBtn.first().click();
    await page.waitForTimeout(1000);
  }
  
  // Wait a bit more and try home button from bottom nav
  await page.waitForTimeout(2000);
  
  // Check if bottom nav is visible
  const navButtons = await page.locator('a, button').all();
  console.log('Step 6: Locating home in navigation...');
  
  let found = false;
  for (const navBtn of navButtons) {
    const text = await navBtn.textContent();
    if (text.includes('홈')) {
      console.log('  Found home button');
      await navBtn.click();
      found = true;
      break;
    }
  }
  
  if (!found) {
    console.log('  Home button not found in nav');
  }
  
  await page.waitForTimeout(2000);
  
  // Check URL
  const url = page.url();
  console.log('Step 7: Current URL:', url);
  
  // Get streakDates from localStorage
  const data = await page.evaluate(() => {
    return {
      streakDates: localStorage.getItem('streakDates'),
      cabinetItems: JSON.parse(localStorage.getItem('cabinetItems') || '[]').map(item => item.name),
      url: window.location.href
    };
  });
  
  console.log('\n=== Data Check ===');
  console.log('streakDates:', data.streakDates);
  console.log('Cabinet items:', data.cabinetItems);
  
  // Take screenshot
  await page.screenshot({ path: 'home_with_data.png' });
  console.log('\nScreenshot saved');
  
  await browser.close();
})();
