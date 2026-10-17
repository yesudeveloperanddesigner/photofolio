'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useRef } from 'react'

import type { PracticeBlock as PracticeBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Props = PracticeBlockProps & {
  className?: string
}

export const PracticeBlock: React.FC<Props> = ({ className, skills, contact, socials }) => {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!root.current) return

      const mm = gsap.matchMedia()

      // The columns simply reveal as they scroll in.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const enterVars = {
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { start: 'top 88%', trigger: root.current },
        }

        gsap.from('[data-skill]', { ...enterVars, opacity: 0, stagger: 0.06, y: 18 })
        gsap.from('[data-contact]', { ...enterVars, opacity: 0, stagger: 0.08, x: -24 })
        gsap.from('[data-social]', { ...enterVars, opacity: 0, stagger: 0.08, y: 18 })
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  const hasContent =
    (skills && skills.length > 0) ||
    contact?.email ||
    contact?.phone ||
    contact?.location ||
    (socials && socials.length > 0)

  if (!hasContent) return null

  return (
    <section
      className={cn('relative border-t border-border bg-background py-24 md:py-32', className)}
      ref={root}
    >
      <div className="container">
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {skills && skills.length > 0 && (
            <div>
              <p className="mb-5 text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
                Practice
              </p>
              <ul className="border-t border-border">
                {skills.map((skill, index) => (
                  <li
                    className="flex items-baseline justify-between gap-4 border-b border-border py-3"
                    data-skill
                    key={skill?.id ?? index}
                  >
                    <span className="text-sm text-foreground">{skill?.label}</span>
                    <span className="text-[0.7rem] tabular-nums text-muted-foreground">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(contact?.email || contact?.phone || contact?.location) && (
            <div>
              <p className="mb-5 text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
                Contact
              </p>
              <dl className="flex flex-col gap-3 text-sm">
                {contact?.email && (
                  <div className="flex flex-col gap-1" data-contact>
                    <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                      Email
                    </dt>
                    <dd>
                      <a className="link-underline text-foreground" href={`mailto:${contact.email}`}>
                        {contact.email}
                      </a>
                    </dd>
                  </div>
                )}
                {contact?.phone && (
                  <div className="flex flex-col gap-1" data-contact>
                    <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                      Phone
                    </dt>
                    <dd>
                      <a
                        className="link-underline text-foreground"
                        href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
                      >
                        {contact.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {contact?.location && (
                  <div className="flex flex-col gap-1" data-contact>
                    <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                      Studio
                    </dt>
                    <dd className="text-foreground">{contact.location}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {socials && socials.length > 0 && (
            <div>
              <p className="mb-5 text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
                Elsewhere
              </p>
              <ul className="flex flex-col gap-3 text-sm">
                {socials.map((social, index) => (
                  <li data-social key={social?.id ?? index}>
                    <a
                      className="link-underline inline-flex items-center gap-2 capitalize text-foreground"
                      href={social?.url || '#'}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {social?.platform}
                      <span aria-hidden className="text-muted-foreground">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
