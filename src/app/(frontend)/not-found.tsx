import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import { getCachedGlobal } from '@/utilities/getGlobals'

export default async function NotFound() {
  const settings = await getCachedGlobal('settings', 1)()

  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">
          This page could not be found{settings?.siteName ? ` on ${settings.siteName}` : ''}.
        </p>
      </div>
      <Button asChild variant="default">
        <Link href="/">Go home</Link>
      </Button>
    </div>
  )
}
