const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.setViewportSize({ width: 390, height: 844 });
  
  console.log('Setting up localStorage with all required data...');
  
  // Create a blank page and inject data
  await page.goto('about:blank');
  
  await page.evaluate(() => {
    // Set onboarding answers
    const answers = {
      1: ["남성"],
      2: ["20대"],
      3: ["8시간 이상"],
      4: ["8시간 이상"],
      5: ["2시간 이상"],
      6: ["1시간 이상"],
      7: ["매우높음"],
      8: ["주5회 이상"],
      9: ["눈건강", "운동회복"],
      10: ["눈피로"],
      11: ["균형있게"],
      12: ["매우좋음"]
    };
    
    localStorage.setItem('onboardingAnswers', JSON.stringify(answers));
    
    // Set cabinet items
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const addedAt = `${year}.${month}.${day}`;
    
    const items = [
      {
        name: '비타민C',
        addedAt: addedAt,
        memo: '',
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
    
    localStorage.setItem('cabinetItems', JSON.stringify(items));
    
    console.log('Data injected');
  });
  
  // Now load the app
  console.log('Loading app with injected data...');
  await page.goto('https://manuga-dc5c2.web.app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Check current URL
  const url = page.url();
  console.log('Current URL:', url);
  
  // Check if we're on home
  if (url.includes('/')) {
    console.log('✅ On home page');
    
    // Look for checkboxes
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    console.log('Checkboxes found:', checkboxes.length);
    
    if (checkboxes.length > 0) {
      console.log('Clicking first checkbox...');
      await checkboxes[0].check();
      await page.waitForTimeout(1500);
      
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
          streakArray: localStorage.getItem('streakDates') ? JSON.parse(localStorage.getItem('streakDates')) : null
        };
      });
      
      console.log('\n=== 스트릭 테스트 결과 ===');
      console.log('오늘:', data.todayDate);
      console.log('streakArray:', data.streakArray);
      
      if (data.streakArray && data.streakArray.includes(data.todayDate)) {
        console.log('✅ streakDates에 오늘 날짜가 저장됨!');
        console.log('✅ 스트릭 기능이 정상 작동합니다!');
      } else {
        console.log('❌ streakDates가 저장되지 않음');
        console.log('  Expected:', data.todayDate);
        console.log('  Got:', data.streakArray);
      }
      
      console.log('\nhomeChecks:', data.homeChecks);
    }
  }
  
  // Screenshot
  await page.screenshot({ path: 'complete_test_result.png' });
  console.log('\n✅ Screenshot saved');
  
  await browser.close();
})();
