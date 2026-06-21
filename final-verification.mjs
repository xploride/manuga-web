import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  console.log('🌐 라이브 사이트: https://manuga-dc5c2.web.app\n');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'load' });

  // 1️⃣ localStorage 초기화
  console.log('1️⃣ localStorage 초기화...');
  await page.evaluate(() => {
    localStorage.clear();
  });
  console.log('✅ 완료\n');

  // 페이지 새로고침
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(500);

  // 2️⃣ 웰컴 시퀀스 통과
  console.log('2️⃣ 웰컴 시퀀스 (8초)...');
  await page.waitForTimeout(8000);
  
  try {
    const startBtn = page.locator('button:has-text("시작하기")').first();
    await startBtn.click({ timeout: 2000 });
    await page.waitForTimeout(800);
  } catch (e) {
    // 버튼이 없을 수도 있음
  }
  console.log('✅ 완료\n');

  // 3️⃣ 설문 자동 진행
  console.log('3️⃣ 설문 12문항 자동 진행...');
  for (let i = 0; i < 12; i++) {
    const buttons = await page.locator('button').all();
    let clicked = false;
    
    for (const btn of buttons) {
      const text = await btn.textContent().catch(() => '');
      if (text && text.length > 0 && text.length < 50 && 
          !text.includes('뒤로') && !text.includes('다음')) {
        try {
          await btn.click({ timeout: 1000 });
          await page.waitForTimeout(300);
          clicked = true;
          break;
        } catch (e) {
          // 계속 시도
        }
      }
    }
    
    if (!clicked) break;
  }
  console.log('✅ 완료\n');

  // 4️⃣ 분석 결과 페이지 대기
  console.log('4️⃣ 분석 결과 대기...');
  await page.waitForTimeout(3000);
  console.log('✅ 완료\n');

  // 5️⃣ 첫 번째 카테고리 클릭
  console.log('5️⃣ 첫 번째 카테고리 클릭...');
  try {
    const categories = await page.locator('button').all();
    for (const btn of categories) {
      const text = await btn.textContent();
      if (text && (text.includes('건강') || text.includes('관리'))) {
        await btn.click({ timeout: 2000 });
        await page.waitForTimeout(1000);
        const categoryName = text.trim().substring(0, 30);
        console.log(`✅ 선택: ${categoryName}`);
        break;
      }
    }
  } catch (e) {
    console.log('⚠️  카테고리 선택 실패');
  }
  console.log('');

  // 6️⃣ 캐비닛에 담기
  console.log('6️⃣ "캐비닛에 담기" 버튼 클릭...');
  try {
    const addBtn = page.locator('button:has-text("캐비닛에 담기")').first();
    await addBtn.click({ timeout: 2000 });
    await page.waitForTimeout(1000);
    console.log('✅ 완료\n');
  } catch (e) {
    console.log('❌ 실패\n');
  }

  // 7️⃣ 캐비닛으로 이동
  console.log('7️⃣ 캐비닛 탭 이동...');
  try {
    const cabinetTab = page.locator('text=캐비닛').first();
    await cabinetTab.click({ timeout: 2000 });
    await page.waitForTimeout(1200);
    console.log('✅ 완료\n');
  } catch (e) {
    console.log('❌ 실패\n');
  }

  // 8️⃣ 캐비닛 항목 클릭
  console.log('8️⃣ 캐비닛 항목 클릭...');
  try {
    const item = page.locator('button').filter({
      hasText: /비타민|오메가|루테인|유산균|마그네슘|아연|단백질|칼슘/
    }).first();
    await item.click({ timeout: 2000 });
    await page.waitForTimeout(1200);
    console.log('✅ 완료\n');
  } catch (e) {
    console.log('❌ 실패\n');
  }

  // 9️⃣ 출처 태그 확인
  console.log('9️⃣ 출처 태그 확인...');
  const sourceTag = page.locator('text=/분석 추천|직접 추가/').first();
  const isVisible = await sourceTag.isVisible({ timeout: 3000 }).catch(() => false);
  
  if (isVisible) {
    const tagText = await sourceTag.textContent();
    console.log(`✅ 출처 태그 표시: "${tagText}"`);
    
    if (tagText.includes('분석 추천')) {
      console.log('✅ "분석 추천" 태그 정상 작동!\n');
    } else {
      console.log('⚠️  출처 태그는 표시되지만 예상과 다름\n');
    }
  } else {
    console.log('❌ 출처 태그 미표시\n');
  }

  // 🔟 스크린샷
  console.log('🔟 캐비닛 상세 화면 스크린샷 캡처...');
  await page.screenshot({ path: 'source-tag-verification.png', fullPage: false });
  console.log('✅ 저장: source-tag-verification.png\n');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('테스트 완료!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

} catch (error) {
  console.error('❌ 에러:', error.message);
} finally {
  await browser.close();
}
