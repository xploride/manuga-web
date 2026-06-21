import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

try {
  await page.goto('https://manuga-dc5c2.web.app/', { waitUntil: 'load' });

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

  // 홈 화면
  await page.goto('https://manuga-dc5c2.web.app/#/', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verification-home.png' });
  console.log('✅ home screenshot saved');

  // 캐비닛
  await page.goto('https://manuga-dc5c2.web.app/#/cabinet', { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verification-cabinet.png' });
  console.log('✅ cabinet screenshot saved');

} finally {
  await browser.close();
}
