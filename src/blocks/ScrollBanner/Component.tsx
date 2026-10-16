'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useRef } from 'react'

import type { ScrollBannerBlock as ScrollBannerBlockProps } from '@/payload-types'

import { PortfolioImage, type PortfolioImageValue } from '@/components/PortfolioImage'
import { cn } from '@/utilities/ui'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export type ScrollBannerData = {
  eyebrow?: null | string
  image?: PortfolioImageValue
  location?: null | string
  overlay?: null | number
  subtitle?: null | string
  title?: null | string
}

type Props = ScrollBannerBlockProps & {
  className?: string
}

export const ScrollBannerBlock: React.FC<Props> = (props) => {
  const { className, eyebrow, image, location, overlay, subtitle, title } = props

  return (
    <ScrollBannerView
      className={className}
      eyebrow={eyebrow}
      image={image}
      location={location}
      overlay={overlay}
      subtitle={subtitle}
      title={title}
    />
  )
}

export const ScrollBannerView: React.FC<ScrollBannerData & { className?: string }> = ({
  className,
  eyebrow,
  image,
  location,
  overlay,
  subtitle,
  title,
}) => {
  const root = useRef<HTMLElement>(null)

  const words = (title || '').split(' ').filter(Boolean)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          motion: '(prefers-reduced-motion: no-preference)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { reduce } = context.conditions as { reduce: boolean }

          if (reduce) {
            gsap.set('[data-word], [data-meta], [data-cue]', { clearProps: 'all' })
            return
          }

          const intro = gsap.timeline({ defaults: { ease: 'expo.out' } })

          intro
            .from('[data-media]', { duration: 1.6, scale: 1.14 }, 0)
            .from(
              '[data-word]',
              { duration: 1.05, opacity: 0, stagger: 0.07, yPercent: 120 },
              0.15,
            )
            .from('[data-meta]', { duration: 0.9, opacity: 0, stagger: 0.1, y: 26 }, 0.55)
            .from('[data-cue]', { duration: 0.8, opacity: 0 }, 0.85)

          gsap.to('[data-media]', {
            ease: 'none',
            scrollTrigger: {
              end: 'bottom top',
              scrub: true,
              start: 'top top',
              trigger: root.current,
            },
            yPercent: 16,
          })

          gsap.to('[data-content]', {
            ease: 'none',
            opacity: 0,
            scrollTrigger: {
              end: 'bottom top',
              scrub: true,
              start: 'center center',
              trigger: root.current,
            },
            yPercent: -12,
          })

          gsap.to('[data-cue-line]', {
            ease: 'none',
            scaleY: 0,
            scrollTrigger: {
              end: '18% top',
              scrub: true,
              start: 'top top',
              trigger: root.current,
            },
            transformOrigin: 'top center',
          })
        },
      )

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      className={cn(
        'relative isolate flex min-h-[88svh] w-full flex-col justify-end overflow-hidden bg-foreground text-background',
        className,
      )}
      ref={root}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden" data-media>
        <PortfolioImage fill image={image} priority sizes="100vw" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20"
          style={{ opacity: typeof overlay === 'number' ? overlay / 100 : 0.45 }}
        />
      </div>

      <div className="container relative w-full pb-10 pt-32 md:pb-16 md:pt-40">
        <div className="flex flex-col gap-6" data-content>
          {eyebrow && (
            <p
              className="text-[0.7rem] uppercase tracking-[0.4em] text-white/65"
              data-meta
            >
              {eyebrow}
            </p>
          )}

          <h1 className="max-w-[18ch] text-[clamp(2.6rem,9vw,8.5rem)] font-medium leading-[0.92] tracking-[-0.035em] text-white">
            {words.map((word, index) => (
              <span
                className="inline-block overflow-hidden pb-[0.08em] align-bottom"
                key={`${word}-${index}`}
              >
                <span className="inline-block pr-[0.24em] will-change-transform" data-word>
                  {word}
                </span>
              </span>
            ))}
          </h1>

          {subtitle && (
            <p className="max-w-[48ch] text-base text-white/70 md:text-lg" data-meta>
              {subtitle}
            </p>
          )}
        </div>

        <div className="mt-10 flex items-end justify-between border-t border-white/15 pt-5 md:mt-14">
          <span
            className="text-[0.7rem] uppercase tracking-[0.3em] text-white/55"
            data-meta
          >
            {location || ''}
          </span>

          <span
            className="flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-white/55"
            data-cue
          >
            Scroll
            <span className="relative block h-10 w-px overflow-hidden bg-white/20">
              <span className="absolute inset-0 block origin-top bg-white/70" data-cue-line />
            </span>
          </span>
        </div>
      </div>
    </section>
  )
}
