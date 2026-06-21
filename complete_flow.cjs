const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.setViewportSize({ width: 390, height: 844 });
  
  console.log('Step 1: Setup & Onboarding');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(8000);
  
  // Onboarding
  let btn = await page.locator('button').filter({ hasText: /시작하기/ });
  await btn.click();
  await page.waitForTimeout(1500);
  
  const answers = [/남성/, /20대/, /8시간 이상/, /8시간 이상/, /2시간 이상/, /1시간 이상/, /매우높음/, /주5회 이상/];
  for (const pattern of answers) {
    btn = await page.locator('button').filter({ hasText: pattern });
    if (await btn.count() > 0) {
      await btn.first().click();
      await page.waitForTimeout(800);
    }
  }
  
  btn = await page.locator('button').filter({ hasText: /눈건강/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(300);
  btn = await page.locator('button').filter({ hasText: /운동회복/ });
  if (await btn.count() > 0) await btn.first().click();
  btn = await page.locator('button').filter({ hasText: /다음|완료/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(800);
  
  btn = await page.locator('button').filter({ hasText: /눈피로/ });
  if (await btn.count() > 0) await btn.first().click();
  btn = await page.locator('button').filter({ hasText: /다음|완료/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(800);
  
  btn = await page.locator('button').filter({ hasText: /균형있게/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(800);
  btn = await page.locator('button').filter({ hasText: /매우좋음/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(2000);
  
  console.log('Step 2: Navigate to Cabinet via button');
  btn = await page.locator('button').filter({ hasText: /캐비닛으로 이동/ });
  if (await btn.count() > 0) {
    await btn.click();
    await page.waitForTimeout(2000);
  }
  
  // Check URL
  let url = page.url();
  console.log('  URL:', url);
  
  console.log('Step 3: Click + button to add nutrient');
  btn = await page.locator('button').filter({ hasText: /Plus|영양소|추가/ });
  const allBtns = await page.locator('button').all();
  
  // Find the floating + button
  for (const b of allBtns) {
    const svg = await b.locator('svg').count();
    if (svg > 0) {
      // This might be the + button
      const text = await b.getAttribute('aria-label');
      if (text && text.includes('추가')) {
        console.log('  Found add button');
        await b.click();
        await page.waitForTimeout(2000);
        break;
      }
    }
  }
  
  console.log('Step 4: Add first nutrient from list');
  const addBtns = await page.locator('button').all();
  for (let i = 0; i < Math.min(5, addBtns.length); i++) {
    const text = await addBtns[i].textContent();
    if (text.includes('Plus') || text.includes('추가')) {
      await addBtns[i].click();
      console.log('  Added nutrient');
      await page.waitForTimeout(1000);
      break;
    }
  }
  
  console.log('Step 5: Navigate back to home');
  const homeBtn = await page.locator('a, button').filter({ hasText: /홈/ });
  if (await homeBtn.count() > 0) {
    await homeBtn.first().click();
    await page.waitForTimeout(2000);
  }
  
  console.log('Step 6: Check nutrient and verify streak');
  const checkboxes = await page.locator('input[type="checkbox"]').all();
  if (checkboxes.length > 0) {
    await checkboxes[0].check();
    await page.waitForTimeout(1000);
  }
  
  // Get final data
  const data = await page.evaluate(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;
    
    return {
      todayDate,
      streakDates: localStorage.getItem('streakDates'),
      cabinetItems: JSON.parse(localStorage.getItem('cabinetItems') || '[]'),
      homeChecks: localStorage.getItem('homeChecks')
    };
  });
  
  console.log('\n=== 최종 스트릭 테스트 결과 ===');
  console.log('오늘:', data.todayDate);
  console.log('캐비닛 항목:', data.cabinetItems.length);
  if (data.cabinetItems.length > 0) {
    console.log('  ' + data.cabinetItems.map(i => i.name).join(', '));
  }
  console.log('홈 체크 현황:', data.homeChecks);
  console.log('streakDates:', data.streakDates);
  
  if (data.streakDates) {
    const dates = JSON.parse(data.streakDates);
    console.log('✅ streakDates 저장됨:', dates);
    console.log('✅ 날짜 개수:', dates.length);
  } else {
    console.log('❌ streakDates 없음');
  }
  
  // Screenshot
  await page.screenshot({ path: 'final_streak_result.png' });
  
  await browser.close();
})();
