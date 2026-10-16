import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const settings = await getCachedGlobal('settings', 1)()

  const favicon =
    settings?.favicon && typeof settings.favicon === 'object'
      ? getMediaUrl(settings.favicon.url)
      : null

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        {favicon ? (
          <link href={favicon} rel="icon" />
        ) : (
          <>
            <link href="/favicon.ico" rel="icon" sizes="32x32" />
            <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
          </>
        )}
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedGlobal('settings', 1)()

  const siteName = settings?.siteName || 'Photography Portfolio'
  const title = settings?.seo?.metaTitle || siteName
  const description =
    settings?.seo?.metaDescription || settings?.description || undefined

  const ogImage =
    settings?.seo?.ogImage && typeof settings.seo.ogImage === 'object'
      ? getServerSideURL() +
        getMediaUrl(settings.seo.ogImage.sizes?.og?.url || settings.seo.ogImage.url)
      : undefined

  return {
    metadataBase: new URL(getServerSideURL()),
    title,
    description,
    openGraph: mergeOpenGraph(
      { description, images: ogImage ? [{ url: ogImage }] : undefined, siteName, title },
      { description, imageUrl: ogImage, siteName, title },
    ),
    twitter: {
      card: 'summary_large_image',
    },
  }
}
