const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.setViewportSize({ width: 390, height: 844 });
  
  console.log('Loading site...');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'networkidle' });
  
  // Clear and reload
  await page.evaluate(() => {
    localStorage.clear();
  });
  
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(8000);
  
  // Complete onboarding quickly
  console.log('Completing onboarding...');
  
  let startBtn = await page.locator('button').filter({ hasText: /시작하기/ });
  await startBtn.click();
  await page.waitForTimeout(1500);
  
  const answers = [
    /남성/, /20대/, /8시간 이상/, /8시간 이상/, /2시간 이상/, 
    /1시간 이상/, /매우높음/, /주5회 이상/
  ];
  
  for (const pattern of answers) {
    const btn = await page.locator('button').filter({ hasText: pattern });
    if (await btn.count() > 0) {
      await btn.first().click();
      await page.waitForTimeout(800);
    }
  }
  
  // Q9
  let btn = await page.locator('button').filter({ hasText: /눈건강/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(300);
  
  btn = await page.locator('button').filter({ hasText: /운동회복/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(300);
  
  btn = await page.locator('button').filter({ hasText: /다음|완료/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(800);
  
  // Q10
  btn = await page.locator('button').filter({ hasText: /눈피로/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(300);
  
  btn = await page.locator('button').filter({ hasText: /만성피로/ });
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
  
  console.log('On analysis-result page now...');
  
  // Add first nutrient to cabinet
  console.log('Adding nutrient to cabinet...');
  const addBtn = await page.locator('button').filter({ hasText: /캐비닛에 담기/ });
  if (await addBtn.count() > 0) {
    await addBtn.first().click();
    await page.waitForTimeout(1000);
  }
  
  // Navigate to home
  console.log('Navigating to home...');
  const homeLink = await page.locator('a, button').filter({ hasText: /홈/ });
  if (await homeLink.count() > 0) {
    await homeLink.first().click();
    await page.waitForTimeout(2000);
  }
  
  // Check nutrient checkbox
  console.log('Checking nutrient...');
  const checkboxes = await page.locator('input[type="checkbox"]').all();
  if (checkboxes.length > 0) {
    await checkboxes[0].check();
    await page.waitForTimeout(1000);
  }
  
  // Get localStorage data
  const data = await page.evaluate(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;
    
    return {
      todayDate: todayDate,
      streakDates: localStorage.getItem('streakDates'),
      homeChecks: localStorage.getItem('homeChecks'),
      cabinetItems: JSON.parse(localStorage.getItem('cabinetItems') || '[]'),
    };
  });
  
  console.log('\n=== 스트릭 테스트 결과 ===');
  console.log('오늘 날짜:', data.todayDate);
  console.log('streakDates:', data.streakDates);
  
  if (data.streakDates) {
    const dates = JSON.parse(data.streakDates);
    console.log('  ✅ streakDates 배열:', dates);
    console.log('  ✅ 오늘 포함 여부:', dates.includes(data.todayDate) ? 'YES' : 'NO');
    console.log('  ✅ 배열 길이:', dates.length);
  } else {
    console.log('  ❌ streakDates가 localStorage에 저장되지 않음');
  }
  
  console.log('\ncabinetItems:', data.cabinetItems.length, '개');
  if (data.cabinetItems.length > 0) {
    console.log('  ✅ 첫 항목:', data.cabinetItems[0].name);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'streak_test_result.png' });
  console.log('\n✅ Screenshot saved: streak_test_result.png');
  
  await browser.close();
})();
