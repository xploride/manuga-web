import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  console.log('🌐 라이브 사이트 테스트\n');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'load' });

  // localStorage 직접 설정 (설문 완료 + 분석 결과 항목)
  console.log('1️⃣ 테스트 데이터 설정...');
  const testData = await page.evaluate(() => {
    // 설문 완료
    localStorage.setItem('onboardingAnswers', JSON.stringify({
      'q1': 'a1', 'q2': 'a1', 'q3': 'a1', 'q4': 'a1', 'q5': 'a1',
      'q6': 'a1', 'q7': 'a1', 'q8': 'a1', 'q9': ['눈건강'], 'q10': [], 'q11': 'a1', 'q12': 'a1'
    }));
    
    // 분석 추천 항목 (source: 'analysis' 포함)
    const cabinetData = [
      {
        name: '루테인',
        addedAt: '2026.06.19',
        memo: '',
        source: 'analysis',
        category: '눈 건강',
        reason: '건강 목표: 눈건강'
      }
    ];
    localStorage.setItem('cabinetItems', JSON.stringify(cabinetData));
    
    // 어제의 스트릭 (이미 저장된 항목)
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('streakDates', JSON.stringify([today]));
    
    return {
      cabinet: cabinetData,
      hasSetting: localStorage.getItem('onboardingAnswers') ? '✓' : '✗'
    };
  });

  console.log('✅ 데이터 설정 완료');
  console.log(`   - 캐비닛 항목: ${testData.cabinet[0].name}`);
  console.log(`   - 출처: ${testData.cabinet[0].source}`);
  console.log(`   - 카테고리: ${testData.cabinet[0].category}\n`);

  // 캐비닛 상세 페이지로 직접 이동
  console.log('2️⃣ 캐비닛 상세 페이지로 이동...');
  const nutrientUrl = 'https://manuga-dc5c2.web.app/#/cabinet/' + encodeURIComponent('루테인');
  await page.goto(nutrientUrl, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  console.log('✅ 페이지 로드\n');

  // 3️⃣ 출처 태그 확인
  console.log('3️⃣ 출처 태그 확인...');
  const pageText = await page.evaluate(() => document.body.innerText);
  
  const hasAnalysisTag = pageText.includes('분석 추천');
  const hasCategory = pageText.includes('눈 건강');
  
  console.log(`분석 추천 태그: ${hasAnalysisTag ? '✅ 있음' : '❌ 없음'}`);
  console.log(`카테고리명: ${hasCategory ? '✅ 있음' : '❌ 없음'}\n`);

  if (hasAnalysisTag && hasCategory) {
    console.log('✅ 출처 태그 "분석 추천 · 눈 건강" 정상 표시!\n');
  } else {
    console.log('❌ 출처 태그 미표시\n');
  }

  // 4️⃣ 스크린샷
  console.log('4️⃣ 스크린샷 캡처...');
  await page.screenshot({ path: 'source-tag-final.png', fullPage: false });
  console.log('✅ 저장: source-tag-final.png\n');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (hasAnalysisTag && hasCategory) {
    console.log('🎉 출처 태그 기능 정상 작동!');
  } else {
    console.log('⚠️  출처 태그 표시 안 됨 (스크린샷 확인)');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

} catch (error) {
  console.error('❌ 에러:', error.message);
} finally {
  await browser.close();
}
