import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  await page.goto('https://manuga-dc5c2.web.app/', { waitUntil: 'load' });

  // localStorage 설정
  await page.evaluate(() => {
    localStorage.setItem('onboardingAnswers', JSON.stringify({'q1':'a1'}));
    localStorage.setItem('cabinetItems', JSON.stringify([
      { name: '비타민B군', addedAt: '2026.06.19', memo: '피로 회복', source: 'analysis', category: '피로 관리', reason: '컴퓨터 사용 많음' },
      { name: '오메가3', addedAt: '2026.06.18', memo: '', source: 'manual' }
    ]));
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];
    localStorage.setItem('streakDates', JSON.stringify([twoDaysAgo, yesterday, today]));
  });

  // 홈 화면 (스트릭 확인)
  await page.goto('https://manuga-dc5c2.web.app/#/', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  
  const streakText = await page.locator('text=/\d+일째/').first().textContent();
  console.log(`✅ [1] 홈 화면 스트릭: "${streakText}"`);
  await page.screenshot({ path: 'final-home-streak.png' });

  // 캐비닛 목록
  await page.goto('https://manuga-dc5c2.web.app/#/cabinet', { waitUntil: 'load' });
  await page.waitForTimeout(800);
  
  console.log('✅ [2] 캐비닛 목록 로드');
  await page.screenshot({ path: 'final-cabinet-list.png' });

  console.log('✅ 최종 검증 완료 - 스크린샷 저장됨');

} catch (error) {
  console.error('❌ 에러:', error.message);
} finally {
  await browser.close();
}
