import { chromium } from 'playwright'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: 400, height: 800 })

  try {
    console.log('🧪 Dev 서버 정상 작동 확인\n')

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
    
    // 페이지 새로고침
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
    await page.waitForTimeout(800)

    console.log('✅ 홈 화면 로드 완료')
    console.log('----------------------------------------\n')

    // 스크린샷 저장
    const screenshotPath = path.join(__dirname, 'home-verification.png')
    await page.screenshot({ path: screenshotPath, fullPage: false })
    console.log(`📸 홈 화면 캡처 완료`)
    
    // 페이지 구조 확인
    const pageText = await page.textContent('body')
    const hasNav = pageText.includes('분석') && pageText.includes('캐비닛')
    const buttons = await page.locator('button').count()
    
    console.log(`\n✅ 페이지 요소 확인:`)
    console.log(`   - 버튼: ${buttons}개`)
    console.log(`   - 네비게이션: ${hasNav ? '있음 ✅' : '없음 ❌'}`)
    
    if (pageText.includes('에너지')) {
      console.log(`   - 홈 항목: 보임 ✅`)
    }
    
    console.log('\n✅ Dev 서버 정상 작동 확인 완료!')

  } catch (error) {
    console.error('❌ 오류:', error.message)
  } finally {
    await browser.close()
  }
})()
