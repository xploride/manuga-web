const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.setViewportSize({ width: 390, height: 844 });
  
  console.log('Step 1: Setup & Complete Onboarding');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'networkidle' });
  
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(8000);
  
  // Onboarding
  let btn = await page.locator('button').filter({ hasText: /시작하기/ });
  await btn.click();
  await page.waitForTimeout(1500);
  
  const answers = [/남성/, /20대/, /8시간 이상/, /8시간 이상/, /2시간 이상/, /1시간 이상/, /매우높음/, /주5회 이상/];
  for (const pattern of answers) {
    btn = await page.locator('button').filter({ hasText: pattern });
    if (await btn.count() > 0) {
      await btn.first().click();
      await page.waitForTimeout(800);
    }
  }
  
  // Q9
  btn = await page.locator('button').filter({ hasText: /눈건강/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(300);
  btn = await page.locator('button').filter({ hasText: /운동회복/ });
  if (await btn.count() > 0) await btn.first().click();
  btn = await page.locator('button').filter({ hasText: /다음|완료/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(800);
  
  // Q10
  btn = await page.locator('button').filter({ hasText: /눈피로/ });
  if (await btn.count() > 0) await btn.first().click();
  btn = await page.locator('button').filter({ hasText: /다음|완료/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(800);
  
  // Q11 & Q12
  btn = await page.locator('button').filter({ hasText: /균형있게/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(800);
  btn = await page.locator('button').filter({ hasText: /매우좋음/ });
  if (await btn.count() > 0) await btn.first().click();
  await page.waitForTimeout(2000);
  
  console.log('Step 2: On analysis-result page');
  
  // Click "캐비닛으로 이동" button
  console.log('Step 3: Clicking "캐비닛으로 이동"...');
  btn = await page.locator('button').filter({ hasText: /캐비닛으로 이동/ });
  await btn.click();
  await page.waitForTimeout(1500);
  
  // Check if modal appeared
  const modalTitle = await page.locator('h3').filter({ hasText: /캐비닛에 담겼어요/ });
  if (await modalTitle.count() > 0) {
    console.log('✅ Modal appeared');
    
    // Take screenshot of modal
    await page.screenshot({ path: 'modal_screenshot.png' });
    console.log('Screenshot saved: modal_screenshot.png');
    
    // Check cabinet items
    const data = await page.evaluate(() => {
      return {
        cabinetItems: JSON.parse(localStorage.getItem('cabinetItems') || '[]').map(i => i.name),
        itemCount: JSON.parse(localStorage.getItem('cabinetItems') || '[]').length
      };
    });
    
    console.log('Cabinet items added:', data.itemCount);
    console.log('Items:', data.cabinetItems);
  } else {
    console.log('❌ Modal did not appear');
  }
  
  await browser.close();
})();
