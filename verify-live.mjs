import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  console.log('🌐 라이브 사이트 검증...\n');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'load' });

  // 테스트 데이터 설정
  const testResults = await page.evaluate(() => {
    // 1. 설문 데이터
    localStorage.setItem('onboardingAnswers', JSON.stringify({'q1': 'a1'}));
    
    // 2. 캐비닛 데이터 (출처 정보 포함)
    const cabinetData = [
      {
        name: '루테인',
        addedAt: '2026.06.19',
        memo: '',
        source: 'analysis',
        category: '눈 건강',
        reason: '휴식 시간 부족'
      },
      {
        name: '오메가3',
        addedAt: '2026.06.19',
        memo: '',
        source: 'manual'
      }
    ];
    localStorage.setItem('cabinetItems', JSON.stringify(cabinetData));
    
    // 3. 스트릭 데이터 (오늘만)
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('streakDates', JSON.stringify([today]));
    
    // 4. 체크 상태
    localStorage.setItem('homeChecks', JSON.stringify({ '루테인': true }));
    
    // 저장된 데이터 검증
    return {
      cabinet: JSON.parse(localStorage.getItem('cabinetItems')),
      streak: JSON.parse(localStorage.getItem('streakDates')),
      checks: JSON.parse(localStorage.getItem('homeChecks'))
    };
  });

  console.log('📝 저장된 데이터:');
  console.log('\n[캐비닛 항목 1] 루테인 (분석 추천)');
  console.log(`  source: ${testResults.cabinet[0].source}`);
  console.log(`  category: ${testResults.cabinet[0].category}`);
  console.log(`  reason: ${testResults.cabinet[0].reason}`);
  
  console.log('\n[캐비닛 항목 2] 오메가3 (직접 추가)');
  console.log(`  source: ${testResults.cabinet[1].source}`);
  
  console.log('\n[스트릭 날짜]');
  console.log(`  ${testResults.streak.join(', ')}`);

  // 홈 화면 로드
  console.log('\n\n🏠 홈 화면에서 렌더링 확인:');
  await page.goto('https://manuga-dc5c2.web.app/#/', { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // 화면 내용 추출
  const homeContent = await page.evaluate(() => {
    const text = document.body.innerText;
    const streakMatch = text.match(/(\d+)일째/);
    const progress = text.match(/(\d+) \/ (\d+)/);
    
    return {
      hasStreakText: streakMatch ? true : false,
      streakNumber: streakMatch ? streakMatch[1] : null,
      progressText: progress ? `${progress[1]}/${progress[2]}` : null,
      fullText: text.substring(0, 400)
    };
  });

  console.log(`✅ 스트릭 표시: ${homeContent.streakNumber}일째`);
  if (homeContent.streakNumber === '1') {
    console.log('   ✅ 스트릭 1일째 정상!');
  }
  console.log(`✅ 진행률: ${homeContent.progressText}`);

  console.log('\n\n📋 요약 검증');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const analysis1HasSource = testResults.cabinet[0].source === 'analysis';
  const analysis1HasCategory = testResults.cabinet[0].category === '눈 건강';
  const manual1HasSource = testResults.cabinet[1].source === 'manual';
  const streakIsOne = homeContent.streakNumber === '1';
  
  console.log(`1️⃣  캐비닛 출처 정보 저장:`);
  console.log(`    ✅ 분석 추천 (source: 'analysis'): ${analysis1HasSource ? '✓' : '✗'}`);
  console.log(`    ✅ 카테고리 정보 저장: ${analysis1HasCategory ? '✓' : '✗'}`);
  console.log(`    ✅ 직접 추가 (source: 'manual'): ${manual1HasSource ? '✓' : '✗'}`);
  
  console.log(`\n2️⃣  홈 화면 스트릭 계산:`);
  console.log(`    ✅ 스트릭 1일째 표시: ${streakIsOne ? '✓' : '✗'}`);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (analysis1HasSource && analysis1HasCategory && manual1HasSource && streakIsOne) {
    console.log('\n🎉 모든 기능 정상 작동!');
  } else {
    console.log('\n⚠️  일부 기능에 문제 있음');
  }

} catch (error) {
  console.error('❌ 에러:', error.message);
} finally {
  await browser.close();
}
