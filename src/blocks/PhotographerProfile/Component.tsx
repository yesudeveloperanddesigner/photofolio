'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import React, { useRef } from 'react'

import type { PhotographerProfileBlock as PhotographerProfileBlockProps } from '@/payload-types'

import { PortfolioImage, type PortfolioImageValue } from '@/components/PortfolioImage'
import { cn } from '@/utilities/ui'

gsap.registerPlugin(useGSAP, ScrollTrigger, TextPlugin)

type Props = PhotographerProfileBlockProps & {
  className?: string
}

export const PhotographerProfileBlock: React.FC<Props> = ({
  className,
  eyebrow,
  heading,
  bio,
  images,
  photos,
}) => {
  const root = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const photoDocs = (photos || []).filter(
    (photo): photo is Exclude<typeof photo, number | string> =>
      Boolean(photo && typeof photo === 'object'),
  )

  const cluster: { id?: null | number | string; image: unknown }[] =
    photoDocs.length > 0
      ? photoDocs.map((photo) => ({ id: photo.id, image: photo }))
      : (images || []).map((item) => ({ id: item?.id, image: item?.image }))

  const masonryAspects = [
    'aspect-[3/4]',
    'aspect-[4/5]',
    'aspect-square',
    'aspect-[5/7]',
    'aspect-[4/5]',
    'aspect-[3/4]',
  ]

  useGSAP(
    () => {
      const section = root.current
      const grid = gridRef.current
      if (!section || !grid) return

      const mm = gsap.matchMedia()

      // Reduce motion: leave the finished layout — full text, images in place.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(gsap.utils.toArray('[data-caret]', section), { autoAlpha: 0 })
        gsap.set('[data-masonry]', { clearProps: 'all' })
      })

      const build = (pinned: boolean) => {
        const images = gsap.utils.toArray<HTMLElement>('[data-masonry]', section)
        const eyebrow = section.querySelector<HTMLElement>('[data-about-text="eyebrow"]')
        const headingEl = section.querySelector<HTMLElement>('[data-about-text="heading"]')
        const bioEl = section.querySelector<HTMLElement>('[data-about-text="bio"]')
        const carets = {
          bio: section.querySelector<HTMLElement>('[data-caret="bio"]'),
          eyebrow: section.querySelector<HTMLElement>('[data-caret="eyebrow"]'),
          heading: section.querySelector<HTMLElement>('[data-caret="heading"]'),
        }

        // Capture the copy before clearing it, reserve each block's height so the
        // typewriter doesn't reflow the layout, then empty the text (hidden first).
        const copy = {
          bio: bioEl?.textContent ?? '',
          eyebrow: eyebrow?.textContent ?? '',
          heading: headingEl?.textContent ?? '',
        }

        gsap.utils.toArray<HTMLElement>('[data-about-text]', section).forEach((el) => {
          const parent = el.parentElement
          if (parent) gsap.set(parent, { minHeight: parent.offsetHeight })
          gsap.set(el, { text: '' })
        })

        gsap.set(gsap.utils.toArray('[data-caret]', section), { autoAlpha: 0 })

        // Scatter the images into a mess; desktop spreads them left over the copy.
        const w = section.clientWidth
        const h = section.clientHeight

        images.forEach((el) => {
          gsap.set(el, {
            opacity: gsap.utils.random(0.35, 1),
            rotation: gsap.utils.random(-28, 28),
            scale: gsap.utils.random(0.55, 1.15),
            x: gsap.utils.random(pinned ? -w * 0.55 : -w * 0.35, -w * 0.02),
            y: gsap.utils.random(-h * 0.2, h * 0.2),
          })
        })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            anticipatePin: 1,
            end: pinned ? '+=' + Math.round(window.innerHeight * 1.6) : 'bottom 65%',
            invalidateOnRefresh: true,
            pin: pinned ? grid : false,
            scrub: true,
            // Pin once the grid reaches the middle of the viewport so the copy
            // and images stay vertically centred while the sequence plays.
            start: pinned ? 'center center' : 'top 78%',
            trigger: grid,
          },
        })

        // Images fly from the mess into their slots on the right.
        tl.to(
          images,
          {
            duration: 1.5,
            ease: 'power3.out',
            opacity: 1,
            rotation: 0,
            scale: 1,
            stagger: 0.08,
            x: 0,
            y: 0,
          },
          0,
        )

        const type = (
          el: HTMLElement | null,
          caret: HTMLElement | null,
          value: string,
          at: number,
          dur: number,
        ) => {
          if (!el || !value) return
          if (caret) tl.set(caret, { autoAlpha: 1 }, at)
          tl.to(el, { duration: dur, text: { delimiter: '', value } }, at)
          if (caret) tl.set(caret, { autoAlpha: 0 }, at + dur)
        }

        type(eyebrow, carets.eyebrow, copy.eyebrow, 0.45, 0.3)
        type(headingEl, carets.heading, copy.heading, 0.85, 1.05)
        type(bioEl, carets.bio, copy.bio, 1.95, 1.5)
      }

      // Desktop pins the grid while the sequence plays; smaller screens scrub it
      // as the section passes through the viewport (no pinning to clip the stack).
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => build(true))
      mm.add('(prefers-reduced-motion: no-preference) and (max-width: 1023px)', () => build(false))

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      className={cn('relative border-t border-border bg-background py-24 md:py-32', className)}
      ref={root}
    >
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-12" ref={gridRef}>
          <div className="flex flex-col gap-6 lg:col-span-6 xl:col-span-5">
            {eyebrow && (
              <p className="text-[0.7rem] uppercase tracking-[0.4em] text-muted-foreground">
                <span data-about-text="eyebrow">{eyebrow}</span>
                <span
                  aria-hidden
                  className="ml-[0.15em] inline-block h-[0.85em] w-[2px] translate-y-[0.08em] bg-current align-baseline invisible"
                  data-caret="eyebrow"
                />
              </p>
            )}

            <h2 className="text-[clamp(1.9rem,4.6vw,3.6rem)] font-medium leading-[1.04] tracking-[-0.03em]">
              <span data-about-text="heading">{heading}</span>
              <span
                aria-hidden
                className="ml-[0.12em] inline-block h-[0.8em] w-[3px] translate-y-[0.02em] bg-current align-baseline invisible"
                data-caret="heading"
              />
            </h2>

            {bio && (
              <p className="max-w-[56ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                <span data-about-text="bio">{bio}</span>
                <span
                  aria-hidden
                  className="ml-[0.1em] inline-block h-[0.9em] w-[2px] translate-y-[0.08em] bg-current align-baseline invisible"
                  data-caret="bio"
                />
              </p>
            )}
          </div>

          {cluster.length > 0 && (
            <div className="lg:col-span-6 xl:col-span-7" data-masonry-cluster>
              <div className="columns-2 gap-2 sm:columns-3 sm:gap-3 lg:gap-2 xl:gap-3">
                {cluster.map((item, index) => (
                  <figure
                    className={cn(
                      'relative mb-2 break-inside-avoid overflow-hidden bg-muted sm:mb-3 lg:mb-2 xl:mb-3',
                      masonryAspects[index % masonryAspects.length],
                    )}
                    data-masonry
                    key={item?.id ?? index}
                  >
                    <div className="absolute inset-0" data-masonry-inner>
                      <PortfolioImage
                        fill
                        image={item?.image as PortfolioImageValue}
                        imgClassName="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.05]"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
