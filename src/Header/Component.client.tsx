'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header, Setting } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  settings?: Setting | null
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, settings }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className="container relative z-20" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="flex items-center justify-between py-8">
        <Link aria-label={settings?.siteName || 'Home'} href="/">
          <Logo
            loading="eager"
            priority="high"
            siteName={settings?.siteName}
            logo={settings?.logo}
            logoDark={settings?.logoDark}
            logoText={settings?.logoText}
            className="h-8"
          />
        </Link>
        <HeaderNav
          data={data}
          cta={settings?.header?.cta}
          showSearch={settings?.header?.showSearch ?? true}
        />
      </div>
    </header>
  )
}
