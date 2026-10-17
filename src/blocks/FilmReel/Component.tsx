'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import React, { useRef } from 'react'

import type { FilmReelBlock as FilmReelBlockProps, Video } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Props = FilmReelBlockProps & {
  className?: string
}

type ResolvedClip = {
  id?: null | number | string
  label?: null | string
  meta?: null | string
  src: string
}

// A single sprocket hole, tiled down both edges of the film strip.
const SPROCKET_HOLES =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='40' viewBox='0 0 28 40'%3E%3Crect x='6' y='6' width='16' height='28' rx='4' fill='%23f2efe6' fill-opacity='0.85'/%3E%3C/svg%3E\")"

// Fractal noise tile used as the projected film grain.
const FILM_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")"

export const FilmReelBlock: React.FC<Props> = ({
  className,
  eyebrow,
  heading,
  description,
  videos,
}) => {
  const root = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const clips = (videos || [])
    .map((clip): ResolvedClip | null => {
      if (!clip) return null

      // Prefer the Videos library upload; fall back to the external URL.
      const media = clip.media && typeof clip.media === 'object' ? (clip.media as Video) : null
      const src = media?.url ? getMediaUrl(media.url) : clip.url

      if (!src) return null

      return { id: clip.id, label: clip.label, meta: clip.meta, src }
    })
    .filter((clip): clip is ResolvedClip => Boolean(clip))

  useGSAP(
    () => {
      const section = root.current
      const grid = gridRef.current
      const filmWindow = windowRef.current
      const track = trackRef.current
      if (!section || !grid || !filmWindow || !track) return

      const clipEls = gsap.utils.toArray<HTMLVideoElement>('[data-clip]', section)
      const frameEls = gsap.utils.toArray<HTMLElement>('[data-frame]', track)

      const centerOf = (el: HTMLElement) => el.offsetTop + el.offsetHeight / 2

      // Thread the strip so the first frame starts centred in the projector
      // window and the last frame ends centred, letting every clip take its
      // turn at the middle of the window.
      const startY = () =>
        frameEls[0] ? filmWindow.clientHeight / 2 - centerOf(frameEls[0]) : 0
      const endY = () =>
        frameEls[frameEls.length - 1]
          ? filmWindow.clientHeight / 2 - centerOf(frameEls[frameEls.length - 1])
          : -Math.max(0, track.offsetHeight - filmWindow.clientHeight)
      const travel = () => Math.max(0, startY() - endY())

      // Keep the pin distances stable when mobile browsers chrome
      // (address bar) changes the viewport mid-scroll.
      ScrollTrigger.config({ ignoreMobileResize: true })

      const mm = gsap.matchMedia()

      // Reduced motion: the film stays still and the clips stay paused.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        clipEls.forEach((clip) => clip.pause())
      })

      let activeIndex = -1

      const pauseAll = () => {
        activeIndex = -1
        clipEls.forEach((clip) => {
          clip.pause()
          clip.classList.add('grayscale')
        })
      }

      // Only one clip plays at a time: the frame sitting at the middle of the
      // projector window. Everything else stays paused and desaturated.
      const setActive = (index: number) => {
        if (index === activeIndex) return
        activeIndex = index
        clipEls.forEach((clip, i) => {
          if (i !== index) {
            clip.pause()
            clip.classList.add('grayscale')
            return
          }
          clip.classList.remove('grayscale')
          clip.muted = true
          const started = clip.play()
          if (started) {
            started.catch((error: DOMException) => {
              if (error?.name === 'AbortError') return
              clip.load()
              const retry = clip.play()
              if (retry) retry.catch(() => {})
            })
          }
        })
      }

      const syncActive = () => {
        if (!clipEls.length) return

        // A track point p appears at p + y in the window; find the frame whose
        // centre lands closest to the window's vertical middle.
        const y = Number(gsap.getProperty(track, 'y')) || 0
        const center = filmWindow.clientHeight / 2
        let best = 0
        let bestDist = Infinity

        frameEls.forEach((frame, i) => {
          const frameCenter = frame.offsetTop + frame.offsetHeight / 2
          const dist = Math.abs(frameCenter + y - center)
          if (dist < bestDist) {
            bestDist = dist
            best = i
          }
        })

        setActive(best)
      }

      const build = (pinned: boolean) => {
        if (travel() < 64) return

        gsap.fromTo(
          track,
          { y: startY },
          {
            ease: 'none',
            y: endY,
            scrollTrigger: {
              anticipatePin: 1,
              end: pinned ? () => '+=' + travel() : 'bottom 20%',
              invalidateOnRefresh: true,
              onRefresh: syncActive,
              onUpdate: syncActive,
              pin: pinned ? grid : false,
              scrub: true,
              start: pinned ? 'center center' : 'top 80%',
              trigger: filmWindow,
            },
          },
        )
      }

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Only decode clips while the projector is on screen, then keep the
        // frame at the middle of the window playing.
        const visibility = ScrollTrigger.create({
          end: 'bottom 10%',
          onToggle: (self) => (self.isActive ? syncActive() : pauseAll()),
          start: 'top 90%',
          trigger: filmWindow,
        })

        if (visibility.isActive) syncActive()

        // Projector flicker: the grain jumps a frame every few ticks.
        const grain = section.querySelector<HTMLElement>('[data-grain]')
        if (grain) {
          gsap.to(grain, {
            backgroundPosition: '0px 180px',
            duration: 1.1,
            ease: 'steps(3)',
            repeat: -1,
          })
        }

        // Right-hand column copy reveals as the section scrolls in.
        gsap.from('[data-reveal]', {
          duration: 0.9,
          ease: 'expo.out',
          opacity: 0,
          stagger: 0.08,
          scrollTrigger: {
            start: 'top 82%',
            trigger: section,
          },
          y: 28,
        })

        return () => pauseAll()
      })

      // Desktop threads the film while the section holds still; smaller
      // screens scrub it as the section passes through the viewport.
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => build(true))
      mm.add('(prefers-reduced-motion: no-preference) and (max-width: 1023px)', () => build(false))

      return () => mm.revert()
    },
    { scope: root },
  )

  if (clips.length === 0) return null

  const total = String(clips.length).padStart(2, '0')

  return (
    <section
      className={cn('relative border-t border-border bg-background py-24 md:py-32', className)}
      ref={root}
    >
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16" ref={gridRef}>
          <div className="lg:col-span-6">
            <div
              className="relative mx-auto aspect-[3/4] w-full max-w-[480px] overflow-hidden bg-neutral-950"
              ref={windowRef}
            >
              {/* The film strip: frames threaded between two rows of sprocket holes. */}
              <div
                className="absolute inset-x-0 top-0 flex flex-col gap-5 px-[13%] py-10 md:gap-6"
                data-film-track
                ref={trackRef}
              >
                {clips.map((clip, index) => (
                  <figure
                    className="relative aspect-[3/2] shrink-0 overflow-hidden rounded-[3px] bg-neutral-800 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    data-frame
                    key={clip.id ?? index}
                  >
                    <video
                      className="h-full w-full object-cover grayscale transition-[filter] duration-700 ease-out"
                      data-clip
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      src={clip.src}
                    />
                    <span className="pointer-events-none absolute bottom-2 left-2 rounded-[2px] bg-neutral-950/60 px-1.5 py-0.5 text-[0.55rem] tabular-nums tracking-[0.25em] text-white/75">
                      {String(index + 1).padStart(2, '0')} / {total}
                    </span>
                  </figure>
                ))}
              </div>

              {/* Sprocket holes along both edges of the film. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-[3.5%] z-10 w-[7%]"
                style={{ backgroundImage: SPROCKET_HOLES, backgroundRepeat: 'repeat-y', backgroundSize: '100% 40px' }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-[3.5%] z-10 w-[7%]"
                style={{ backgroundImage: SPROCKET_HOLES, backgroundRepeat: 'repeat-y', backgroundSize: '100% 40px' }}
              />

              {/* Projector light: top and bottom falloff, vignette, grain. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-neutral-950 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-neutral-950 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_90px_rgba(0,0,0,0.65)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 opacity-[0.14] mix-blend-overlay"
                data-grain
                style={{ backgroundImage: FILM_GRAIN, backgroundSize: '180px 180px' }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
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
                className="text-[clamp(1.9rem,4.6vw,3.6rem)] font-medium leading-[1.04] tracking-[-0.03em]"
                data-reveal
              >
                {heading}
              </h2>
            )}

            {description && (
              <p
                className="max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-lg"
                data-reveal
              >
                {description}
              </p>
            )}

            <ul className="mt-2 border-t border-border" data-reveal>
              {clips.map((clip, index) => (
                <li
                  className="flex items-baseline justify-between gap-4 border-b border-border py-3"
                  key={clip.id ?? index}
                >
                  <span className="text-sm text-foreground">
                    {clip.label || `Frame ${String(index + 1).padStart(2, '0')}`}
                  </span>
                  {clip.meta && (
                    <span className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
                      {clip.meta}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
