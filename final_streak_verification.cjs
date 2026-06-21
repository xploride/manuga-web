const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.setViewportSize({ width: 390, height: 844 });
  
  console.log('Step 1: Load site and inject data');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'networkidle' });
  
  // Now inject data
  await page.evaluate(() => {
    // Onboarding answers
    const answers = {
      1: ["남성"],
      2: ["20대"],
      3: ["8시간 이상"],
      4: ["8시간 이상"],
      5: ["2시간 이상"],
      6: ["1시간 이상"],
      7: ["매우높음"],
      8: ["주5회 이상"],
      9: ["눈건강"],
      10: ["눈피로"],
      11: ["균형있게"],
      12: ["매우좋음"]
    };
    localStorage.setItem('onboardingAnswers', JSON.stringify(answers));
    
    // Cabinet items
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayStr = `${year}.${month}.${day}`;
    
    const items = [
      { name: '비타민C', addedAt: todayStr, memo: '', source: 'manual' },
      { name: '오메가3', addedAt: todayStr, memo: '', source: 'analysis', category: '혈행건강' }
    ];
    localStorage.setItem('cabinetItems', JSON.stringify(items));
  });
  
  // Reload to initialize app with data
  console.log('Step 2: Reload to initialize');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Check location
  const url = page.url();
  console.log('URL:', url);
  
  // Check if we need to navigate to home
  if (!url.includes('/')) {
    console.log('Step 3: Navigate to home');
    await page.goto('https://manuga-dc5c2.web.app/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
  }
  
  console.log('Step 4: Check page content');
  const bodyText = await page.locator('body').textContent();
  console.log('Page has "오늘의 건강 관리":', bodyText.includes('오늘의 건강 관리'));
  console.log('Page has "비타민C":', bodyText.includes('비타민C'));
  
  // Check for checkboxes
  const checkboxes = await page.locator('input[type="checkbox"]').all();
  console.log('Checkboxes found:', checkboxes.length);
  
  if (checkboxes.length > 0) {
    console.log('Step 5: Click checkbox to trigger streak save');
    await checkboxes[0].click();
    await page.waitForTimeout(1000);
    
    // Check localStorage
    const result = await page.evaluate(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayDate = `${year}-${month}-${day}`;
      
      const streakDates = localStorage.getItem('streakDates');
      const homeChecks = localStorage.getItem('homeChecks');
      
      return {
        todayDate,
        streakDates: streakDates ? JSON.parse(streakDates) : null,
        homeChecks: homeChecks ? JSON.parse(homeChecks) : null,
        streakLength: streakDates ? JSON.parse(streakDates).length : 0
      };
    });
    
    console.log('\n=== 스트릭 테스트 결과 ===');
    console.log('오늘 날짜:', result.todayDate);
    console.log('streakDates:', result.streakDates);
    console.log('streak 길이:', result.streakLength);
    
    if (result.streakDates && result.streakDates.length > 0) {
      if (result.streakDates.includes(result.todayDate)) {
        console.log('\n✅ 스트릭이 정상 작동합니다!');
        console.log('   - streakDates에 오늘 날짜가 저장됨');
        console.log('   - 스트릭 일수:', result.streakLength);
      } else {
        console.log('\n⚠️ streakDates 배열은 있지만 오늘 날짜가 없음');
        console.log('   배열:', result.streakDates);
      }
    } else {
      console.log('\n❌ streakDates가 저장되지 않음');
    }
    
    console.log('\nhomeChecks:', result.homeChecks);
  } else {
    console.log('❌ 체크박스를 찾을 수 없음');
  }
  
  // Screenshot
  await page.screenshot({ path: 'streak_test_final.png' });
  console.log('\n✅ Screenshot saved: streak_test_final.png');
  
  await browser.close();
})();
