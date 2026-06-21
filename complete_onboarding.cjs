const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.setViewportSize({ width: 390, height: 844 });
  
  console.log('1. Loading site and clearing data...');
  await page.goto('https://manuga-dc5c2.web.app', { waitUntil: 'networkidle' });
  
  await page.evaluate(() => {
    localStorage.clear();
  });
  
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(8000);
  
  // Click "시작하기"
  console.log('2. Starting onboarding...');
  const startButton = await page.locator('button').filter({ hasText: /시작하기/ });
  await startButton.click();
  await page.waitForTimeout(1500);
  
  // Answer questions using button clicks (not checkboxes)
  const answerSequence = [
    /남성/,      // Q1: Gender
    /20대/,      // Q2: Age
    /8시간 이상/, // Q3: Computer time
    /8시간 이상/, // Q4: Sitting time
    /2시간 이상/, // Q5: Walking time
    /1시간 이상/, // Q6: Sunlight
    /매우높음/,   // Q7: Work intensity
    /주5회 이상/, // Q8: Exercise
  ];
  
  // Answer single-choice questions 1-8
  for (let i = 0; i < Math.min(8, answerSequence.length); i++) {
    console.log(`3.${i+1}. Answering Q${i+1}...`);
    const button = await page.locator('button').filter({ hasText: answerSequence[i] });
    if (await button.count() > 0) {
      await button.first().click();
      await page.waitForTimeout(1000); // Wait for auto-advance
    }
  }
  
  // Q9: Multi-select (건강 목표 - max 2)
  console.log('3.9. Answering Q9 (multi-select)...');
  let buttons = await page.locator('button').filter({ hasText: /눈건강/ });
  if (await buttons.count() > 0) {
    await buttons.first().click();
  }
  await page.waitForTimeout(500);
  
  buttons = await page.locator('button').filter({ hasText: /운동회복/ });
  if (await buttons.count() > 0) {
    await buttons.first().click();
  }
  await page.waitForTimeout(500);
  
  // Click "다음" button
  const nextButton = await page.locator('button').filter({ hasText: /다음|완료/ });
  if (await nextButton.count() > 0) {
    await nextButton.first().click();
    await page.waitForTimeout(1000);
  }
  
  // Q10: Multi-select (현재 고민 - max 3)
  console.log('3.10. Answering Q10 (multi-select)...');
  buttons = await page.locator('button').filter({ hasText: /눈피로/ });
  if (await buttons.count() > 0) {
    await buttons.first().click();
    await page.waitForTimeout(500);
  }
  
  buttons = await page.locator('button').filter({ hasText: /만성피로/ });
  if (await buttons.count() > 0) {
    await buttons.first().click();
    await page.waitForTimeout(500);
  }
  
  const nextBtn2 = await page.locator('button').filter({ hasText: /다음|완료/ });
  if (await nextBtn2.count() > 0) {
    await nextBtn2.first().click();
    await page.waitForTimeout(1000);
  }
  
  // Q11: Single (식습관)
  console.log('3.11. Answering Q11...');
  buttons = await page.locator('button').filter({ hasText: /균형있게/ });
  if (await buttons.count() > 0) {
    await buttons.first().click();
    await page.waitForTimeout(1000);
  }
  
  // Q12: Single (수면 상태)
  console.log('3.12. Answering Q12...');
  buttons = await page.locator('button').filter({ hasText: /매우좋음/ });
  if (await buttons.count() > 0) {
    await buttons.first().click();
    await page.waitForTimeout(2000); // Wait for navigation
  }
  
  // Check if we're on analysis-result page
  const url = page.url();
  console.log('\n4. Current URL:', url);
  
  if (url.includes('/analysis-result')) {
    console.log('✅ Onboarding completed successfully!');
  } else {
    console.log('⚠️ May still be on onboarding');
  }
  
  await page.screenshot({ path: 'onboarding_complete.png' });
  
  await browser.close();
})();
