import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  console.log('🌐 라이브 사이트 접속: https://manuga-dc5c2.web.app\n');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'load' });

  // 1️⃣ localStorage 완전 초기화
  console.log('1️⃣ localStorage 완전 초기화...');
  await page.evaluate(() => {
    localStorage.clear();
  });
  console.log('✅ 초기화 완료\n');

  // 페이지 새로고침
  await page.reload({ waitUntil: 'load' });

  // 2️⃣ 웰컴 시퀀스 통과
  console.log('2️⃣ 웰컴 화면 시퀀스 통과 (8초 대기)...');
  await page.waitForTimeout(8000);

  // 시작하기 버튼 클릭
  try {
    const startBtn = await page.locator('button:has-text("시작하기")').first();
    await startBtn.click();
    await page.waitForTimeout(800);
    console.log('✅ 설문 시작\n');
  } catch (e) {
    console.log('⚠️  시작하기 버튼 클릭 실패\n');
  }

  // 3️⃣ 설문 12문항 자동 응답
  console.log('3️⃣ 설문 12문항 자동 진행...');
  for (let q = 0; q < 12; q++) {
    // 모든 버튼 찾기
    const buttons = await page.locator('button').all();
    
    // 선택 버튼 필터링 (첫 번째 선택지 선택)
    let clicked = false;
    for (const btn of buttons) {
      const text = await btn.textContent();
      if (text && text.trim().length > 0 && 
          !text.includes('뒤로') && !text.includes('다음') &&
          text.length < 50) {
        try {
          await btn.click();
          await page.waitForTimeout(400);
          clicked = true;
          break;
        } catch (e) {
          // 클릭 실패, 다음 버튼 시도
        }
      }
    }
    
    if (!clicked && q === 0) {
      console.log('⚠️  첫 문항 클릭 실패');
    }
  }
  
  console.log('✅ 설문 완료\n');
  await page.waitForTimeout(2000);

  // 4️⃣ 분석 결과 페이지 대기
  console.log('4️⃣ 분석 결과 페이지 로드...');
  await page.waitForTimeout(2000);

  // 분석 탭으로 이동 (또는 자동 이동됨)
  try {
    const analysisTab = await page.locator('text=분석').first();
    await analysisTab.click();
    await page.waitForTimeout(1000);
  } catch (e) {
    // 이미 분석 결과 페이지일 수 있음
  }

  // 첫 번째 카테고리 클릭
  console.log('5️⃣ 첫 번째 카테고리 클릭...');
  const categoryButtons = await page.locator('button').all();
  let categoryClicked = false;
  
  for (const btn of categoryButtons) {
    const text = await btn.textContent();
    if (text && (text.includes('건강') || text.includes('관리'))) {
      try {
        await btn.click();
        await page.waitForTimeout(1000);
        console.log(`✅ 카테고리 선택: ${text.trim()}\n`);
        categoryClicked = true;
        break;
      } catch (e) {
        // 클릭 실패, 다음 시도
      }
    }
  }

  if (!categoryClicked) {
    console.log('⚠️  카테고리 선택 실패');
  }

  // 6️⃣ 캐비닛에 담기 버튼 클릭
  console.log('6️⃣ "캐비닛에 담기" 버튼 클릭...');
  try {
    const addBtn = await page.locator('button:has-text("캐비닛에 담기")').first();
    await addBtn.click();
    await page.waitForTimeout(1000);
    console.log('✅ 영양소 추가 완료\n');
  } catch (e) {
    console.log('⚠️  캐비닛에 담기 버튼 클릭 실패');
  }

  // 7️⃣ 캐비닛으로 이동
  console.log('7️⃣ 캐비닛 페이지 이동...');
  try {
    const cabinetTab = await page.locator('text=캐비닛').first();
    await cabinetTab.click();
    await page.waitForTimeout(1200);
    console.log('✅ 캐비닛 페이지 로드\n');
  } catch (e) {
    console.log('⚠️  캐비닛 탭 클릭 실패');
  }

  // 8️⃣ 캐비닛의 첫 번째 항목 클릭
  console.log('8️⃣ 캐비닛 항목 클릭...');
  try {
    const nutrientBtn = await page.locator('button').filter({
      hasText: /비타민|오메가|루테인|유산균|마그네슘|아연|단백질|칼슘/
    }).first();
    
    await nutrientBtn.click();
    await page.waitForTimeout(1200);
    console.log('✅ 캐비닛 상세 페이지 로드\n');
  } catch (e) {
    console.log('⚠️  캐비닛 항목 클릭 실패');
  }

  // 9️⃣ 출처 태그 확인
  console.log('9️⃣ 출처 태그 확인...');
  const sourceTagElement = await page.locator('text=/분석 추천|직접 추가/').first();
  const tagVisible = await sourceTagElement.isVisible({ timeout: 3000 }).catch(() => false);
  
  if (tagVisible) {
    const tagText = await sourceTagElement.textContent();
    console.log(`✅ 출처 태그 표시: "${tagText}"\n`);
  } else {
    console.log('❌ 출처 태그가 표시되지 않음\n');
  }

  // 🔟 스크린샷 캡처
  console.log('🔟 캐비닛 상세 화면 스크린샷 캡처...');
  await page.screenshot({ path: 'live-cabinet-detail-source.png', fullPage: false });
  console.log('✅ 스크린샷 저장: live-cabinet-detail-source.png\n');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ 실제 라이브 테스트 완료!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

} catch (error) {
  console.error('❌ 테스트 중 에러:', error.message);
} finally {
  // 브라우저 열린 상태로 유지 (스크린샷 확인용)
  await page.waitForTimeout(3000);
  await browser.close();
}
