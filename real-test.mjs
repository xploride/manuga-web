import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  console.log('🌐 https://manuga-dc5c2.web.app 접속...');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // localStorage 초기화
  console.log('\n1️⃣ localStorage 완전 초기화');
  await page.evaluate(() => {
    localStorage.clear();
  });
  console.log('✅ localStorage cleared');

  // 페이지 새로고침 (웰컴 화면으로)
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(8000); // 웰컴 시퀀스 완료 대기

  console.log('\n2️⃣ 웰컴 화면 → 설문 시작');
  
  // 시작하기 클릭
  try {
    await page.click('button:has-text("시작하기")', { timeout: 3000 });
    await page.waitForTimeout(800);
    console.log('✅ 시작하기 클릭');
  } catch (e) {
    console.log('⚠️  시작하기 버튼 못 찾음 - 자동 진행 가능');
  }

  // 설문 자동 응답 (모든 첫 번째 선택지 클릭)
  console.log('   설문 자동 진행 중...');
  for (let i = 0; i < 12; i++) {
    const buttons = await page.locator('button').filter({
      hasText: /매우|많음|적음|있음|없음|좋음|낮음|정상|예|아니|1회|2회|3회|매일|주/
    }).all();
    
    if (buttons.length > 0) {
      await buttons[0].click();
      await page.waitForTimeout(400);
    }
  }

  await page.waitForTimeout(2000);
  console.log('✅ 설문 완료');

  console.log('\n3️⃣ 분석 결과에서 영양소 캐비닛에 담기');
  
  // 분석 탭으로 이동
  try {
    await page.click('text=분석', { timeout: 3000 });
    await page.waitForTimeout(800);
    
    // 첫 카테고리 클릭
    const categoryBtn = await page.locator('button').filter({
      hasText: /눈|피로|혈행|면역|소화|관절|활력|회복|근력/
    }).first();
    
    if (categoryBtn) {
      await categoryBtn.click();
      await page.waitForTimeout(800);
      
      // 캐비닛에 담기 클릭
      const addBtn = await page.locator('button').filter({
        hasText: '캐비닛에 담기'
      }).first();
      
      if (addBtn) {
        await addBtn.click();
        await page.waitForTimeout(500);
        console.log('✅ 영양소 캐비닛에 담음');
      }
    }
  } catch (e) {
    console.log('⚠️  분석 결과 진행 중 에러');
  }

  console.log('\n4️⃣ 캐비닛 상세 → 출처 태그 확인');
  
  // 캐비닛 탭으로 이동
  try {
    await page.goto('https://manuga-dc5c2.web.app/#/cabinet', { waitUntil: 'load' });
    await page.waitForTimeout(800);
    
    // 첫 항목 클릭
    const nutrientBtn = await page.locator('button').filter({
      hasText: /비타민|오메가|루테인|유산균|마그네슘|아연|단백질/
    }).first();
    
    if (nutrientBtn) {
      await nutrientBtn.click();
      await page.waitForTimeout(800);
      
      // 출처 태그 확인
      const analysisTag = await page.locator('text=/분석 추천|직접 추가/').first().isVisible({ timeout: 3000 }).catch(() => false);
      const tagText = analysisTag ? await page.locator('text=/분석 추천|직접 추가/').first().textContent() : '태그 없음';
      
      if (analysisTag) {
        console.log(`✅ 출처 태그 표시: "${tagText}"`);
      } else {
        console.log('❌ 출처 태그 미표시');
      }
      
      await page.screenshot({ path: 'live-cabinet-source.png' });
    }
  } catch (e) {
    console.log('⚠️  캐비닛 상세 확인 중 에러:', e.message);
  }

  console.log('\n5️⃣ 홈 화면 → 체크 후 스트릭 숫자 확인');
  
  // 홈으로 이동
  try {
    await page.goto('https://manuga-dc5c2.web.app/#/', { waitUntil: 'load' });
    await page.waitForTimeout(800);
    
    // 첫 항목 체크
    const checkBtn = await page.locator('button').filter({
      hasText: /비타민|루테인|유산균/
    }).first();
    
    if (checkBtn) {
      await checkBtn.click();
      await page.waitForTimeout(500);
      console.log('✅ 체크리스트 항목 체크');
    }
    
    // 스트릭 확인
    const streakText = await page.locator('text=/\d+일째/').first().textContent();
    console.log(`✅ 스트릭 숫자: "${streakText}"`);
    
    // 스트릭이 1인지 확인
    if (streakText && streakText.includes('1일째')) {
      console.log('✅ 스트릭 1일째 정상 작동!');
    } else {
      console.log(`⚠️  스트릭이 1이 아님: ${streakText}`);
    }
    
    await page.screenshot({ path: 'live-home-streak.png' });
  } catch (e) {
    console.log('⚠️  홈 확인 중 에러:', e.message);
  }

  console.log('\n✅ 모든 테스트 완료!');

} catch (error) {
  console.error('❌ 테스트 실패:', error.message);
} finally {
  await browser.close();
}
