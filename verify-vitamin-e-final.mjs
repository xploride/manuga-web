import { chromium } from 'playwright'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: 400, height: 800 })

  try {
    console.log('🧪 비타민E 영양소 추가 화면 확인\n')

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

    console.log('✅ 영양소 추가 화면 로드')
    console.log('----------------------------------------\n')

    // "전체 보기" 버튼 클릭
    const showAllBtn = await page.locator('button').filter({ hasText: '전체 보기' }).first()
    if (showAllBtn) {
      await showAllBtn.click()
      await page.waitForTimeout(400)
    }

    // Core12 항목 찾기
    const pageText = await page.textContent('body')
    
    // 모든 영양소 목록 출력
    const nutrients = []
    const spans = await page.locator('span:has-text("비타민"), span:has-text("마그"), span:has-text("아연"), span:has-text("단백"), span:has-text("칼슘"), span:has-text("루테"), span:has-text("유산"), span:has-text("오메"), span:has-text("비오"), span:has-text("✨")').allTextContents()
    
    // 스크린샷: 아래로 스크롤해서 비타민E와 비타민A 포함 부분 캡처
    await page.evaluate(() => {
      const container = document.querySelector('div.flex-1')
      if (container) container.scrollTop = container.scrollHeight / 2
    })
    await page.waitForTimeout(300)
    
    const screenshotPath = path.join(__dirname, 'add-nutrient-verification.png')
    await page.screenshot({ path: screenshotPath, fullPage: false })
    console.log('📸 영양소 추가 화면 캡처 (중간 부분)')

    // 텍스트 기반 확인
    const hasVitaminE = pageText.includes('비타민E')
    const hasBiotin = pageText.includes('비오틴')
    const hasVitaminA = pageText.includes('비타민A')
    
    console.log('\n✅ Core12 목록 확인:')
    console.log(`   - 비타민E: ${hasVitaminE ? '있음 ✅' : '없음 ❌'}`)
    console.log(`   - 비오틴: ${hasBiotin ? '있음 ❌ (제거되어야 함)' : '없음 ✅'}`)
    console.log(`   - 비타민A: ${hasVitaminA ? '있음 ✅' : '없음 ❌'}`)
    
    // 전체 항목 수 계산 (Core12 = 12개)
    const itemCount = (pageText.match(/\+|✓/g) || []).length
    console.log(`   - 총 항목 수: ${itemCount}개`)
    
    if (hasVitaminE && !hasBiotin && hasVitaminA) {
      console.log('\n✅ 비타민E 추가 완료! 비오틴 제거 완료!')
    }

  } catch (error) {
    console.error('❌ 오류:', error.message)
  } finally {
    await browser.close()
  }
})()
