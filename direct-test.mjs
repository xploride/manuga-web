import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  console.log('🌐 라이브 사이트 접속...');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'load' });

  // localStorage에 테스트 데이터 직접 설정
  console.log('\n1️⃣ localStorage에 설문 완료 데이터 설정');
  await page.evaluate(() => {
    // 설문 완료
    localStorage.setItem('onboardingAnswers', JSON.stringify({
      'q1': 'a1', 'q2': 'a1', 'q3': 'a1', 'q4': 'a1', 'q5': 'a1',
      'q6': 'a1', 'q7': 'a1', 'q8': 'a1', 'q9': 'a1', 'q10': 'a1',
      'q11': 'a1', 'q12': 'a1'
    }));
    
    // 캐비닛: 분석 추천 항목 (source: analysis, category 포함)
    const cabinetData = [
      {
        name: '루테인',
        addedAt: '2026.06.19',
        memo: '눈 건강 테스트',
        source: 'analysis',
        category: '눈 건강',
        reason: '휴식 시간 부족'
      }
    ];
    localStorage.setItem('cabinetItems', JSON.stringify(cabinetData));
    
    // 스트릭: 오늘만 있음 (1일째)
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('streakDates', JSON.stringify([today]));
    
    // 홈 체크: 항목 체크됨
    const checks = { '루테인': true };
    localStorage.setItem('homeChecks', JSON.stringify(checks));
  });
  console.log('✅ 데이터 설정 완료');

  // 홈 화면에서 스트릭 확인
  console.log('\n2️⃣ 홈 화면에서 스트릭 확인');
  await page.goto('https://manuga-dc5c2.web.app/#/', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  
  const streakElement = await page.locator('text=/\d+일째/').first();
  const streakText = await streakElement.textContent({ timeout: 5000 }).catch(() => '찾을 수 없음');
  console.log(`🔹 스트릭 표시: "${streakText}"`);
  
  if (streakText === '1일째') {
    console.log('✅ 스트릭 1일째 정상 작동!');
  } else {
    console.log('❌ 스트릭이 1일째가 아님');
  }
  
  await page.screenshot({ path: 'live-test-home.png', fullPage: false });
  console.log('📸 스크린샷: live-test-home.png');

  // 캐비닛 상세에서 출처 태그 확인
  console.log('\n3️⃣ 캐비닛 상세 → 출처 태그 확인');
  const nutrientUrl = 'https://manuga-dc5c2.web.app/#/cabinet/' + encodeURIComponent('루테인');
  await page.goto(nutrientUrl, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  
  const sourceTagElement = await page.locator('text=/분석 추천|직접 추가/').first();
  const tagVisible = await sourceTagElement.isVisible({ timeout: 5000 }).catch(() => false);
  
  if (tagVisible) {
    const tagText = await sourceTagElement.textContent();
    console.log(`🔹 출처 태그: "${tagText}"`);
    
    if (tagText.includes('분석 추천') && tagText.includes('눈 건강')) {
      console.log('✅ 분석 추천 태그 정상 작동! (눈 건강)');
    } else {
      console.log(`⚠️  태그는 표시되지만 예상과 다름: ${tagText}`);
    }
  } else {
    console.log('❌ 출처 태그가 표시되지 않음');
  }
  
  await page.screenshot({ path: 'live-test-cabinet.png', fullPage: false });
  console.log('📸 스크린샷: live-test-cabinet.png');

  console.log('\n✅ 라이브 테스트 완료!');

} catch (error) {
  console.error('❌ 에러:', error.message);
} finally {
  await browser.close();
}
