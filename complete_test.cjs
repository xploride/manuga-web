const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to mobile size
  await page.setViewportSize({ width: 390, height: 844 });
  
  // Navigate to the live site
  console.log('Step 1: Loading site and clearing data...');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'networkidle' });
  
  await page.evaluate(() => {
    localStorage.clear();
  });
  
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(8000); // Wait for Welcome sequence
  
  // Click "시작하기" button
  console.log('Step 2: Clicking "시작하기" button...');
  const startButton = await page.locator('button').filter({ hasText: /시작하기/ });
  await startButton.click();
  await page.waitForTimeout(1500);
  
  // Answer onboarding questions
  console.log('Step 3: Answering 12 onboarding questions...');
  
  // Q1: 컴퓨터 사용 시간
  let buttons = await page.locator('button').filter({ hasText: /30분 이상/ });
  await buttons.first().click();
  await page.waitForTimeout(800);
  
  // Q2: 운동 횟수
  buttons = await page.locator('button').filter({ hasText: /주 2-3회/ });
  await buttons.first().click();
  await page.waitForTimeout(800);
  
  // Q3: 수면 시간
  buttons = await page.locator('button').filter({ hasText: /6-7시간/ });
  await buttons.first().click();
  await page.waitForTimeout(800);
  
  // Q4: 식사 횟수
  buttons = await page.locator('button').filter({ hasText: /3끼 모두/ });
  await buttons.first().click();
  await page.waitForTimeout(800);
  
  // Q5: 물 섭취
  buttons = await page.locator('button').filter({ hasText: /적당량 섭취/ });
  await buttons.first().click();
  await page.waitForTimeout(800);
  
  // Q6: 건강기능식품
  buttons = await page.locator('button').filter({ hasText: /1-2종류/ });
  await buttons.first().click();
  await page.waitForTimeout(800);
  
  // Q7: 음주 빈도
  buttons = await page.locator('button').filter({ hasText: /없음/ });
  await buttons.first().click();
  await page.waitForTimeout(800);
  
  // Q8: 흡연 여부
  buttons = await page.locator('button').filter({ hasText: /없음/ });
  await buttons.last().click();
  await page.waitForTimeout(800);
  
  // Q9: 피로 부위
  buttons = await page.locator('button').filter({ hasText: /목/ });
  if (await buttons.count() > 0) {
    await buttons.first().click();
  }
  await page.waitForTimeout(800);
  
  // Q10: 스트레스 관리
  buttons = await page.locator('button').filter({ hasText: /주의깊음/ });
  await buttons.first().click();
  await page.waitForTimeout(800);
  
  // Q11: 소화 상태
  buttons = await page.locator('button').filter({ hasText: /양호/ });
  await buttons.first().click();
  await page.waitForTimeout(800);
  
  // Q12: 질환 여부
  buttons = await page.locator('button').filter({ hasText: /없음/ });
  if (await buttons.count() > 2) {
    await buttons.nth(2).click();
  }
  await page.waitForTimeout(1500);
  
  // Check if analysis page loaded
  console.log('Step 4: Checking analysis page...');
  const addButtons = await page.locator('button').filter({ hasText: /캐비닛에 담기/ });
  const addCount = await addButtons.count();
  console.log(`  Found ${addCount} "캐비닛에 담기" buttons`);
  
  if (addCount > 0) {
    // Add first nutrient to cabinet
    console.log('  Adding first nutrient to cabinet...');
    await addButtons.first().click();
    await page.waitForTimeout(1000);
  }
  
  // Navigate to home
  console.log('Step 5: Navigating to home...');
  const homeLink = await page.locator('a, button').filter({ hasText: /홈/ });
  if (await homeLink.count() > 0) {
    await homeLink.first().click();
    await page.waitForTimeout(2000);
  }
  
  // Check nutrient checkbox
  console.log('Step 6: Checking nutrient checkbox...');
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
    
    const streakDates = localStorage.getItem('streakDates');
    const homeChecks = localStorage.getItem('homeChecks');
    
    return {
      todayDate: todayDate,
      streakDates: streakDates,
      homeChecks: homeChecks,
      streakDatesArray: streakDates ? JSON.parse(streakDates) : null
    };
  });
  
  console.log('\n=== Test Results ===');
  console.log('Today\'s date:', data.todayDate);
  console.log('streakDates in localStorage:', data.streakDates);
  console.log('Parsed streakDates array:', data.streakDatesArray);
  console.log('homeChecks in localStorage:', data.homeChecks);
  
  // Take screenshot
  await page.screenshot({ path: 'home_with_streak.png' });
  console.log('\n✅ Screenshot saved: home_with_streak.png');
  
  await browser.close();
})();
