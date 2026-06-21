const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to mobile size
  await page.setViewportSize({ width: 390, height: 844 });
  
  // Navigate to the live site
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'networkidle' });
  
  // Clear localStorage to start fresh
  await page.evaluate(() => {
    localStorage.clear();
  });
  
  // Reload to get fresh state
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Step 1: Click "시작하기" button on Welcome screen
  console.log('Step 1: Clicking "시작하기" button...');
  await page.click('button:has-text("시작하기")');
  await page.waitForTimeout(1000);
  
  // Step 2: Answer onboarding questions (12 questions)
  const answers = [
    { selector: 'button:has-text("30분 이상")', label: "컴퓨터 사용 시간" },
    { selector: 'button:has-text("주 2-3회")', label: "운동 횟수" },
    { selector: 'button:has-text("6-7시간")', label: "수면 시간" },
    { selector: 'button:has-text("3끼 모두")', label: "식사 횟수" },
    { selector: 'button:has-text("적당량 섭취")', label: "물 섭취" },
    { selector: 'button:has-text("1-2종류")', label: "건강기능식품" },
    { selector: 'button:has-text("없음")', label: "음주 빈도" },
    { selector: 'button:has-text("없음")', label: "흡연 여부" },
    { selector: 'button:has-text("목, 어깨")', label: "피로 부위" },
    { selector: 'button:has-text("주의깊음")', label: "스트레스 관리" },
    { selector: 'button:has-text("양호")', label: "소화 상태" },
    { selector: 'button:has-text("없음")', label: "질환 여부" }
  ];
  
  for (const answer of answers) {
    console.log(`  Answering: ${answer.label}`);
    await page.click(answer.selector);
    await page.waitForTimeout(500);
  }
  
  // Step 3: Click analysis result button
  console.log('\nStep 2: Navigating to analysis...');
  await page.click('button:has-text("분석 결과 보기")');
  await page.waitForTimeout(2000);
  
  // Step 4: Add first nutrient to cabinet
  console.log('\nStep 3: Adding nutrient to cabinet...');
  // Find the first "캐비닛에 담기" button
  const addButtons = await page.locator('button:has-text("캐비닛에 담기")').all();
  if (addButtons.length > 0) {
    await addButtons[0].click();
    console.log('  ✅ Added to cabinet');
    await page.waitForTimeout(1000);
  }
  
  // Step 5: Navigate to home screen
  console.log('\nStep 4: Navigating to home screen...');
  await page.click('a:has-text("홈")');
  await page.waitForTimeout(2000);
  
  // Step 6: Check and click a nutrient item
  console.log('\nStep 5: Checking nutrient item...');
  const checkboxes = await page.locator('input[type="checkbox"]').all();
  if (checkboxes.length > 0) {
    await checkboxes[0].check();
    console.log('  ✅ Checked nutrient item');
    await page.waitForTimeout(1000);
  }
  
  // Step 7: Get localStorage data
  const localStorageData = await page.evaluate(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;
    
    return {
      streakDates: localStorage.getItem('streakDates'),
      homeChecks: localStorage.getItem('homeChecks'),
      cabinetItems: localStorage.getItem('cabinetItems'),
      todayDate: todayDate
    };
  });
  
  console.log('\n=== localStorage Data ===');
  console.log('todayDate:', localStorageData.todayDate);
  console.log('streakDates:', localStorageData.streakDates);
  console.log('homeChecks:', localStorageData.homeChecks);
  console.log('cabinetItems (first 100 chars):', localStorageData.cabinetItems ? localStorageData.cabinetItems.substring(0, 100) : 'null');
  
  // Step 8: Take screenshot
  await page.screenshot({ path: 'home_screen_with_streak.png' });
  console.log('\n✅ Screenshot saved: home_screen_with_streak.png');
  
  await browser.close();
})();
