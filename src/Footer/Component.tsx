import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { FooterDateTime } from '@/components/FooterDateTime'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const [footerData, settings] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getCachedGlobal('settings', 1)(),
  ])

  const navItems = footerData?.navItems || []
  const socials = settings?.socials || []
  const contact = settings?.contact
  const footer = settings?.footer

  const year = new Date().getFullYear()
  const copyright = (footer?.copyright || '').replace('{year}', String(year))
  const fallbackCopyright = settings?.siteName ? `© ${year} ${settings.siteName}` : ''

  const hasContact = Boolean(contact?.email || contact?.phone || contact?.location)

  return (
    <footer className="mt-auto border-t border-border bg-black text-white dark:bg-card">
      <div className="container flex flex-col gap-12 py-14 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <Link className="inline-flex items-center" href="/">
            <Logo
              className="text-white"
              siteName={settings?.siteName}
              logo={settings?.logo}
              logoDark={settings?.logoDark}
              logoText={settings?.logoText}
            />
          </Link>

          {settings?.tagline && (
            <p className="mt-4 text-[0.7rem] uppercase tracking-[0.3em] text-white/50">
              {settings.tagline}
            </p>
          )}

          {(footer?.description || settings?.description) && (
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              {footer?.description || settings?.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:gap-16">
          {navItems.length > 0 && (
            <div>
              <p className="mb-4 text-[0.7rem] uppercase tracking-[0.3em] text-white/45">Explore</p>
              <nav className="flex flex-col gap-3">
                {navItems.map(({ link }, i) => {
                  return <CMSLink className="text-white/80 hover:text-white" key={i} {...link} />
                })}
              </nav>
            </div>
          )}

          {socials.length > 0 && (
            <div>
              <p className="mb-4 text-[0.7rem] uppercase tracking-[0.3em] text-white/45">
                Elsewhere
              </p>
              <ul className="flex flex-col gap-3 text-sm">
                {socials.map((social, i) => (
                  <li key={social?.id ?? i}>
                    <a
                      className="inline-flex items-center gap-2 capitalize text-white/80 hover:text-white"
                      href={social?.url || '#'}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {social?.platform}
                      <span aria-hidden className="text-white/40">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasContact && (
            <div>
              <p className="mb-4 text-[0.7rem] uppercase tracking-[0.3em] text-white/45">Contact</p>
              <ul className="flex flex-col gap-3 text-sm text-white/80">
                {contact?.email && (
                  <li>
                    <a className="hover:text-white" href={`mailto:${contact.email}`}>
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact?.phone && (
                  <li>
                    <a
                      className="hover:text-white"
                      href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
                    >
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact?.location && <li className="text-white/60">{contact.location}</li>}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col-reverse items-start gap-4 py-6 text-[0.7rem] uppercase tracking-[0.2em] text-white/45 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            {footer?.dateTime?.show !== false && (
              <FooterDateTime
                customText={footer?.dateTime?.customText}
                display={footer?.dateTime?.display}
                label={footer?.dateTime?.label}
                timezone={footer?.dateTime?.timezone}
              />
            )}
            {footer?.note && <span className="normal-case tracking-normal">{footer.note}</span>}
          </div>

          <div className="flex flex-col-reverse items-start gap-4 md:flex-row md:items-center">
            <span className="normal-case tracking-normal text-white/55">
              {copyright || fallbackCopyright}
            </span>
            <ThemeSelector />
          </div>
        </div>
      </div>
    </footer>
  )
}
