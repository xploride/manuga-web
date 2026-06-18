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

    // localStorage 초기화하고 홈 화면 로드
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
    await page.evaluate(() => localStorage.clear())
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
    
    console.log('\n✅ Dev 서버 정상 작동 확인 완료!')

  } catch (error) {
    console.error('❌ 오류:', error.message)
  } finally {
    await browser.close()
  }
})()
