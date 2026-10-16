'use client'

import React, { useEffect, useState } from 'react'

type Display = 'currentDate' | 'currentDateTime' | 'currentTime' | 'custom' | 'none'

type Props = {
  customText?: null | string
  display?: Display | null
  label?: null | string
  timezone?: null | string
}

const format = (display: Display, timezone?: null | string): string => {
  const now = new Date()
  const timeZone = timezone || undefined

  try {
    if (display === 'currentDate') {
      return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone }).format(now)
    }

    if (display === 'currentTime') {
      return new Intl.DateTimeFormat('en-GB', { timeStyle: 'medium', timeZone }).format(now)
    }

    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone,
    }).format(now)
  } catch {
    return ''
  }
}

/**
 * Renders the footer date/time on the client so it never causes a hydration
 * mismatch and can tick for time-based displays.
 */
export const FooterDateTime: React.FC<Props> = ({ customText, display, label, timezone }) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (!display || display === 'none') return

    if (display === 'custom') {
      setValue(customText || '')
      return
    }

    const update = () => setValue(format(display, timezone))
    update()

    const interval = setInterval(update, display === 'currentDate' ? 60_000 : 1_000)

    return () => clearInterval(interval)
  }, [customText, display, timezone])

  if (!display || display === 'none') return null
  if (!value) return null

  return (
    <span>
      {label ? `${label}: ` : ''}
      <span className="tabular-nums">{value}</span>
    </span>
  )
}
