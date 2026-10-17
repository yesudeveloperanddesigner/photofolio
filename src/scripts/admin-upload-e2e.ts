import { chromium } from '@playwright/test'

const BASE = 'http://localhost:3000'
const FILE_PATH = '/var/folders/60/vm27l4r524q0pwcz0p462r5c0000gp/T/opencode/vidcheck2/5224.mp4'

const main = async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  const page = await browser.newPage()

  await page.addInitScript({
    content: `
      (() => {
        const log = (...args) => console.log('[probe]', ...args)
        log('init script running')
        const OrigXHR = window.XMLHttpRequest
        class ProbeXHR extends OrigXHR {
          open(method, url, ...rest) {
            log('xhr.open', method, String(url).slice(0, 90))
            return super.open(method, url, ...rest)
          }
          send(body) {
            log('xhr.send', body && body.constructor && body.constructor.name)
            return super.send(body)
          }
        }
        window.XMLHttpRequest = ProbeXHR

        const origFetch = window.fetch.bind(window)
        window.fetch = (input, init) => {
          const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
          log('fetch', (init && init.method) || 'GET', url.slice(0, 90))
          return origFetch(input, init)
        }

        window.addEventListener('unhandledrejection', (event) => {
          log('unhandledrejection:', String(event.reason), event.reason && event.reason.stack ? String(event.reason.stack).slice(0, 600) : '')
        })
        window.addEventListener('error', (event) => {
          log('window error:', event.message, event.filename, event.lineno)
        })
      })()
    `,
  })

  const consoleLines: string[] = []
  page.on('console', (msg) => consoleLines.push(`[console.${msg.type()}] ${msg.text()}`))
  page.on('pageerror', (err) => consoleLines.push(`[pageerror] ${err.message}\nSTACK: ${err.stack}`))
  page.on('requestfailed', (req) =>
    consoleLines.push(`[requestfailed] ${req.method()} ${req.url()} — ${req.failure()?.errorText}`),
  )
  page.on('response', (res) => {
    const url = res.url()
    if (
      url.includes('/api/videos') ||
      url.includes('client-upload') ||
      url.includes('uploadthing.com')
    ) {
      consoleLines.push(
        `[response] ${res.status()} ${res.request().method()} ${url.slice(0, 140)}`,
      )
    }
  })

  console.log('→ login')
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' })
  await page.fill('#field-email', 'demo-author@example.com')
  await page.fill('#field-password', 'password')
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/admin(?!\/login)/, { timeout: 30000 })
  console.log('→ logged in:', page.url())

  console.log('→ open videos create form')
  await page.goto(`${BASE}/admin/collections/videos/create`, { waitUntil: 'networkidle' })

  await page.fill('#field-title', 'Playwright upload test')
  await page.setInputFiles('input[type="file"]', FILE_PATH)
  await page.waitForTimeout(1000)

  console.log('→ clicking save')
  await page.click('button[type="submit"], .btn--style-primary')

  const outcome = await Promise.race([
    page
      .waitForURL(/\/admin\/collections\/videos\/(?!create$)[a-z0-9-]+$/, { timeout: 60000 })
      .then(() => 'navigated to edit view'),
    page
      .waitForSelector('.payload-toast-container .toast', { timeout: 60000 })
      .then(async (el) => `toast: ${await el.textContent()}`),
  ]).catch((error) => `timeout: ${error.message}`)

  console.log('→ outcome:', outcome)
  console.log('→ url now:', page.url())

  await page.waitForTimeout(2000)

  console.log('--- page console/network trace ---')
  for (const line of consoleLines) console.log(line)

  await browser.close()
}

await main()
