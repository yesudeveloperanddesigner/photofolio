import 'dotenv/config'
import { readFileSync } from 'fs'
import { getPayload } from 'payload'
import config from '@payload-config'

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3100'
const EMAIL = 'demo-author@example.com'
const PASSWORD = 'password'
const FILE_PATH = '/var/folders/60/vm27l4r524q0pwcz0p462r5c0000gp/T/opencode/vidcheck2/5224.mp4'

const main = async () => {
  const payload = await getPayload({ config })

  let user = (
    await payload.find({ collection: 'users', where: { email: { equals: EMAIL } }, limit: 1 })
  ).docs[0]

  if (!user) {
    user = await payload.create({
      collection: 'users',
      data: { email: EMAIL, password: PASSWORD },
      context: { disableRevalidate: true },
    })
    console.log('created temp user', user.id)
  }

  const loginRes = await fetch(`${BASE}/api/users/login`, {
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  })
  const loginBody = await loginRes.json()
  if (!loginRes.ok) throw new Error(`login failed ${loginRes.status}: ${JSON.stringify(loginBody)}`)

  const setCookie = loginRes.headers.get('set-cookie') || ''
  const token = loginBody.token || setCookie.split('payload-token=')[1]?.split(';')[0]
  const cookie = `payload-token=${token}`
  console.log('logged in, user id:', user.id)

  // Shim window.fetch so the uploadthing client can run in Node and the
  // endpoint requests carry the admin session cookie.
  const realFetch = globalThis.fetch
  ;(globalThis as unknown as { window: unknown }).window = {
    location: { href: `${BASE}/`, origin: BASE },
    fetch: (input: RequestInfo | URL, init: RequestInit = {}) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
      if (url.startsWith(BASE)) {
        const headers = new Headers(init.headers)
        headers.set('cookie', cookie)
        return realFetch(input as RequestInfo, { ...init, headers })
      }
      return realFetch(input as RequestInfo, init)
    },
  }

  // Minimal XMLHttpRequest shim over fetch (uploadthing's client uses XHR for
  // the presigned PUT).
  const realFetchForXhr = globalThis.fetch
  class FakeXHR {
    _headers: Record<string, string> = {}
    _listeners: Record<string, Array<() => void>> = {}
    _method = 'GET'
    _url = ''
    response: unknown = null
    responseType = ''
    status = 0
    statusText = ''
    upload = { addEventListener: () => {} }

    addEventListener(type: string, cb: () => void) {
      ;(this._listeners[type] ||= []).push(cb)
    }

    open(method: string, url: string) {
      this._method = method
      this._url = url
    }

    setRequestHeader(key: string, value: string) {
      this._headers[key] = value
    }

    abort() {}

    send(body: unknown) {
      realFetchForXhr(this._url, {
        body: body as BodyInit,
        headers: this._headers,
        method: this._method,
      })
        .then(async (res) => {
          this.status = res.status
          this.statusText = res.statusText
          const text = await res.text()
          this.response = this.responseType === 'json' ? JSON.parse(text) : text
          this._listeners.load?.forEach((cb) => cb())
        })
        .catch(() => this._listeners.error?.forEach((cb) => cb()))
    }
  }
  ;(globalThis as unknown as { XMLHttpRequest: unknown }).XMLHttpRequest = FakeXHR

  const { genUploader } = await import(
    '/Users/admin/Developer/Projects/photofolio/node_modules/.pnpm/uploadthing@7.3.0_next@16.3.3_@babel+core@7.29.7_supports-color@7.2.0__@playwright+test_5c576dea630bdbd9973e550de5ee0246/node_modules/uploadthing/client/index.js'
  )

  const file = new File([readFileSync(FILE_PATH)], '5224.mp4', { type: 'video/mp4' })

  const { uploadFiles } = genUploader({
    package: 'storage-uploadthing',
    url: `${BASE}/api/storage-uploadthing-client-upload-route?collectionSlug=videos`,
  } as never) as unknown as {
    uploadFiles: (
      endpoint: string,
      opts: { files: File[] },
    ) => Promise<
      Array<{ key: string; serverData?: { signedReceipt?: string } } | undefined> | undefined
    >
  }

  const res = await uploadFiles('uploader', { files: [file] })
  const uploaded = res?.[0]
  console.log('upload result key:', uploaded?.key)
  console.log('has receipt:', Boolean(uploaded?.serverData?.signedReceipt))

  if (!uploaded?.key || !uploaded.serverData?.signedReceipt) {
    throw new Error('no client upload receipt')
  }

  const form = new FormData()
  form.set('_payload', JSON.stringify({ title: 'Client upload test' }))
  form.set(
    'file',
    JSON.stringify({
      clientUploadContext: {
        key: uploaded.key,
        signedReceipt: uploaded.serverData.signedReceipt,
      },
      collectionSlug: 'videos',
      filename: '5224.mp4',
      mimeType: 'video/mp4',
      size: file.size,
    }),
  )

  const createRes = await fetch(`${BASE}/api/videos`, {
    body: form,
    headers: { cookie },
    method: 'POST',
  })
  const createText = await createRes.text()
  console.log('create status:', createRes.status)
  console.log('create body:', createText.slice(0, 400))

  // Cleanup: remove the created doc.
  try {
    const created = JSON.parse(createText)
    if (created?.doc?.id) {
      await payload.delete({
        collection: 'videos',
        id: created.doc.id,
        context: { disableRevalidate: true },
      })
      console.log('cleaned up doc', created.doc.id)
    }
  } catch {
    // nothing to clean
  }

  process.exit(createRes.ok ? 0 : 1)
}

await main()
