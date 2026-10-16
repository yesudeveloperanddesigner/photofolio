'use client'

import React from 'react'

import type { Header as HeaderType, Setting } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

type Props = {
  cta?: NonNullable<Setting['header']>['cta']
  data: HeaderType
  showSearch?: boolean
}

export const HeaderNav: React.FC<Props> = ({ cta, data, showSearch = true }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex items-center gap-3">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      {cta?.label && cta?.url && (
        <CMSLink
          type="custom"
          url={cta.url}
          label={cta.label}
          newTab={cta.newTab ?? true}
          appearance="default"
          size="sm"
        />
      )}
      {showSearch && (
        <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>
      )}
    </nav>
  )
}
