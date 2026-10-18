'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useRef } from 'react'

import { PortfolioImage, type PortfolioImageValue } from '@/components/PortfolioImage'
import { cn } from '@/utilities/ui'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export type ScrollGalleryItem = {
  caption?: null | string
  id?: null | number | string
  image?: PortfolioImageValue
  meta?: null | string
}

type Props = {
  className?: string
  eyebrow?: null | string
  heading?: null | string
  intro?: null | string
  items: ScrollGalleryItem[]
}

export const ScrollGalleryView: React.FC<Props> = ({ className, eyebrow, heading, intro, items }) => {
  const root = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const track = trackRef.current
      const pin = pinRef.current
      if (!track || !pin) return

      // Avoid re-measuring (and jumping) when mobile browsers show/hide their
      // address bar, which changes the viewport height mid-scroll.
      ScrollTrigger.config({ ignoreMobileResize: true })

      const mm = gsap.matchMedia()

      // Vertical reveal for the section header — motion only.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-reveal]', {
          duration: 0.9,
          ease: 'expo.out',
          opacity: 0,
          stagger: 0.08,
          scrollTrigger: {
            start: 'top 82%',
            trigger: root.current,
          },
          y: 28,
        })
      })

      /**
       * Measures the row and returns everything the horizontal travel needs.
       *
       * The gallery is laid out by counting the cards and dividing the available
       * distance: it starts offset to the right (first card's right edge on the
       * viewport edge) and ends with the last card centred. `centers` are measured
       * in the track's untransformed space so they stay valid as the track moves.
       */
      const getMetrics = () => {
        const cards = gsap.utils.toArray<HTMLElement>('[data-item]', track)
        const count = cards.length
        const viewport = window.innerWidth

        if (!count) {
          return { centers: [] as number[], count: 0, endX: 0, startX: 0, travel: 0 }
        }

        const trackOffset = track.offsetLeft
        const centers = cards.map((el) => el.offsetLeft - trackOffset + el.offsetWidth / 2)
        const first = cards[0]
        const firstLeft = first.offsetLeft - trackOffset

        // Start offset to the right: first card's right edge sits on the viewport edge.
        const startX = viewport - first.offsetWidth - firstLeft
        // End: last card centred in the viewport.
        const endX = viewport / 2 - centers[count - 1]
        const travel = Math.max(0, startX - endX)

        return { centers, count, endX, startX, travel }
      }

      // Progress values (0–1) at which each card sits centred in the viewport.
      const getSnapPoints = () => {
        const { centers, count, endX, startX } = getMetrics()
        const span = endX - startX

        if (count < 2 || span === 0) return [0, 1]

        const viewport = window.innerWidth
        const points = [0]

        for (let i = 0; i < count; i += 1) {
          const p = (viewport / 2 - (centers[i] + startX)) / span
          if (p > 0.001 && p < 0.999) points.push(p)
        }

        points.push(1)
        return points.sort((a, b) => a - b)
      }

      // Pinned horizontal scroll, driven by vertical scroll at every viewport
      // (mobile through desktop). Card widths stay responsive; only the motion
      // model is shared. Reduced-motion users keep the native horizontal swipe
      // because this block only runs when motion is allowed.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The track is the element being translated, so it must not clip its own
        // overflow or the later cards would never become visible. Clipping happens
        // on the section instead, and making the track visible also disables native
        // horizontal scrolling while the tween drives it.
        gsap.set(track, { overflowX: 'visible' })

        const scrollTween = gsap.fromTo(
          track,
          { x: () => getMetrics().startX },
          {
            ease: 'none',
            x: () => getMetrics().endX,
            scrollTrigger: {
              anticipatePin: 1,
              end: () => '+=' + getMetrics().travel,
              invalidateOnRefresh: true,
              pin,
                  scrub: 2,
              // Pin once the gallery reaches the middle of the viewport so it
              // stays vertically centred while the section is pinned, instead of
              // parking against the top of the tall pinned scroll region.
              start: 'center center',
              trigger: pin,
              snap: {
                delay: 0.08,
                duration: { max: 0.5, min: 0.25 },
                ease: 'power2.out',
                snapTo: (value: number) => {
                  const points = getSnapPoints()
                  return points.reduce(
                    (best, p) => (Math.abs(p - value) < Math.abs(best - value) ? p : best),
                    points[0],
                  )
                },
              },
            },
          },
        )

        const { startX } = getMetrics()

        gsap.utils.toArray<HTMLElement>('[data-item]').forEach((item) => {
          const inner = item.querySelector('[data-parallax]')

          // Start offset to the right, then drift leftwards as the item enters.
          // Scaled up slightly so the parallax never exposes the frame edge.
          if (inner) {
            gsap.set(inner, { scale: 1.28 })
            gsap.fromTo(
              inner,
              { xPercent: 12 },
              {
                ease: 'none',
                scrollTrigger: {
                  containerAnimation: scrollTween,
                  end: 'right left',
              scrub: 3,
                  start: 'left right',
                  trigger: item,
                },
                xPercent: -12,
              },
            )
          }

          // Items already visible at the offset start stay visible; the rest
          // fade in from the right as they enter.
          const leftAtStart = item.offsetLeft - track.offsetLeft + startX
          if (leftAtStart < window.innerWidth * 0.92) {
            gsap.set(item, { opacity: 1 })
            return
          }

          gsap.fromTo(
            item,
            { opacity: 0 },
            {
              duration: 0.8,
              ease: 'power3.out',
              opacity: 1,
              scrollTrigger: {
                containerAnimation: scrollTween,
                start: 'left 92%',
                toggleActions: 'play none none reverse',
                trigger: item,
              },
            },
          )
        })
      })

      // Keep the pin distance and snap points accurate when images load or the
      // number of cards changes.
      const refresh = () => ScrollTrigger.refresh()
      const ro = new ResizeObserver(refresh)
      ro.observe(track)

      return () => {
        ro.disconnect()
        mm.revert()
      }
    },
    { scope: root },
  )

  if (!items || items.length === 0) return null

  return (
    <section
      className={cn('relative overflow-hidden bg-background py-24 md:py-32', className)}
      ref={root}
    >
      <div className="container">
        <div className="flex flex-col gap-5 md:max-w-[58ch]">
          {eyebrow && (
            <p
              className="text-[0.7rem] uppercase tracking-[0.4em] text-muted-foreground"
              data-reveal
            >
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2
              className="text-[clamp(1.9rem,4.6vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.03em]"
              data-reveal
            >
              {heading}
            </h2>
          )}
          {intro && (
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg" data-reveal>
              {intro}
            </p>
          )}
        </div>
      </div>

      <div className="mt-14 md:mt-20" ref={pinRef}>
        <div
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:gap-8 lg:snap-none lg:px-8 lg:pb-0"
          ref={trackRef}
        >
          {items.map((item, index) => (
            <figure
              className="group relative w-[80vw] shrink-0 snap-start sm:w-[58vw] lg:w-[38vw] xl:w-[32vw]"
              data-item
              key={item?.id ?? index}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <div className="absolute inset-0" data-parallax>
                  <PortfolioImage
                    fill
                    image={item?.image}
                    imgClassName="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 58vw, 38vw"
                  />
                </div>
              </div>

              {(item?.caption || item?.meta) && (
                <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="text-sm text-foreground">{item?.caption}</span>
                  <span className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                    {item?.meta}
                  </span>
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
