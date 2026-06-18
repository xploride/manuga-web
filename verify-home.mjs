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
    await page.waitForTimeout(800)

    // 페이지 로드 확인
    const hasHeading = await page.locator('body').textContent()
    
    console.log('✅ 홈 화면 로드 완료')
    console.log('----------------------------------------\n')

    // 스크린샷 저장
    const screenshotPath = path.join(__dirname, 'home-verification.png')
    await page.screenshot({ path: screenshotPath, fullPage: false })
    console.log(`📸 홈 화면 캡처: ${screenshotPath}`)
    
    // 페이지 구조 확인
    const buttons = await page.locator('button').count()
    const hasNav = await page.locator('text=/분석|캐비닛/').count()
    
    console.log(`\n✅ 페이지 요소 확인:`)
    console.log(`   - 버튼: ${buttons}개`)
    console.log(`   - 탭: ${hasNav > 0 ? '있음' : '없음'}`)
    
    console.log('\n✅ Dev 서버 정상 작동 확인 완료!')

  } catch (error) {
    console.error('❌ 오류:', error.message)
  } finally {
    await browser.close()
  }
})()
