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
  
  // Complete onboarding...
  console.log('Completing onboarding...');
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
  
  // Q9
  btn = await page.locator('button').filter({ hasText: /눈건강/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(300);
  btn = await page.locator('button').filter({ hasText: /운동회복/ });
  if (await btn.count() > 0) await btn.first().click();
  btn = await page.locator('button').filter({ hasText: /다음|완료/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(800);
  
  // Q10
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
  
  // Now navigate directly to home
  console.log('Navigating to home...');
  await page.goto('https://manuga-dc5c2.web.app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  
  // First, add some items to cabinet by clicking cabinet items
  // Click on one of the visible nutrient buttons
  const addButtons = await page.locator('button').filter({ hasText: /Plus|비타민|아연/ });
  if (await addButtons.count() > 0) {
    console.log('Adding nutrient to cabinet...');
    await addButtons.first().click();
    await page.waitForTimeout(1000);
  }
  
  // Now click home tab/button to make sure we're on home
  const navItems = await page.locator('a, button').allTextContents();
  console.log('Nav items:', navItems);
  
  // Click a checkbox to trigger streak
  console.log('Checking nutrient...');
  const checkboxes = await page.locator('input[type="checkbox"]').all();
  if (checkboxes.length > 0) {
    await checkboxes[0].check();
    await page.waitForTimeout(1000);
  }
  
  // Get data
  const data = await page.evaluate(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;
    
    return {
      todayDate,
      streakDates: localStorage.getItem('streakDates'),
      homeChecks: localStorage.getItem('homeChecks'),
      cabinetItems: JSON.parse(localStorage.getItem('cabinetItems') || '[]'),
      streakDatesArray: localStorage.getItem('streakDates') ? JSON.parse(localStorage.getItem('streakDates')) : null
    };
  });
  
  console.log('\n=== 최종 테스트 결과 ===');
  console.log('오늘 날짜:', data.todayDate);
  console.log('\ncabinetItems:', data.cabinetItems.length, '개');
  
  if (data.cabinetItems.length > 0) {
    data.cabinetItems.forEach(item => {
      console.log(`  - ${item.name} (추가일: ${item.addedAt})`);
    });
  }
  
  console.log('\nstreakDates:', data.streakDatesArray);
  if (data.streakDatesArray && data.streakDatesArray.length > 0) {
    console.log('✅ 스트릭 배열에 데이터 있음');
    if (data.streakDatesArray.includes(data.todayDate)) {
      console.log('✅ 오늘 날짜 포함됨');
    } else {
      console.log('❌ 오늘 날짜 미포함 (배열 내용:', data.streakDatesArray, ')');
    }
  } else {
    console.log('❌ streakDates가 저장되지 않음');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'final_home_test.png' });
  console.log('\n✅ Screenshot saved: final_home_test.png');
  
  await browser.close();
})();
