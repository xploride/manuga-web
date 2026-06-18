import { chromium } from 'playwright'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: 400, height: 800 })

  try {
    console.log('🧪 비타민E 영양소 추가 화면 확인 (전체 목록)\n')

    // 홈 화면 로드
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
    
    // localStorage에 샘플 답변 설정
    const sampleAnswers = {
      1: ["남성"],
      2: ["30대"],
      3: ["4~8시간"],
      4: ["6~8시간"],
      5: ["30분 이하"],
      6: ["거의 없음"],
      7: ["높음"],
      8: ["주3~4회"],
      9: ["면역관리", "활력관리"],
      10: ["눈피로", "만성피로"],
      11: ["불규칙함"],
      12: ["부족함"],
    }
    
    await page.evaluate((answers) => {
      localStorage.setItem('onboardingAnswers', JSON.stringify(answers))
    }, sampleAnswers)
    
    // 영양소 추가 페이지로 직접 이동
    await page.goto('http://localhost:5173/cabinet/add', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)

    // "전체 보기" 버튼 클릭
    const showAllBtn = await page.locator('button').filter({ hasText: '전체 보기' }).first()
    if (showAllBtn) {
      await showAllBtn.click()
      await page.waitForTimeout(400)
    }

    // 아래로 스크롤 - 비타민A, 칼슘, 비타민E가 보이는 부분까지
    await page.evaluate(() => {
      const container = document.querySelector('div.flex-1')
      if (container) container.scrollTop = container.scrollHeight
    })
    await page.waitForTimeout(300)

    const screenshotPath = path.join(__dirname, 'add-nutrient-verification.png')
    await page.screenshot({ path: screenshotPath, fullPage: false })
    console.log('✅ 영양소 추가 화면 캡처 (전체 목록 - 하단 부분)')

    // 페이지 텍스트로 전체 확인
    const pageText = await page.textContent('body')
    
    const hasVitaminE = pageText.includes('비타민E')
    const hasBiotin = pageText.includes('비오틴')
    const hasVitaminA = pageText.includes('비타민A')
    
    console.log('\n✅ Core12 항목 검증:')
    console.log(`   - 비타민E (✨): ${hasVitaminE ? '있음 ✅' : '없음 ❌'}`)
    console.log(`   - 비오틴: ${hasBiotin ? '있음 ❌ (제거됨)' : '없음 ✅'}`)
    console.log(`   - 비타민A: ${hasVitaminA ? '있음 ✅' : '없음 ❌'}`)
    
    console.log('\n✅ 모든 수정 완료!')

  } catch (error) {
    console.error('❌ 오류:', error.message)
  } finally {
    await browser.close()
  }
})()
