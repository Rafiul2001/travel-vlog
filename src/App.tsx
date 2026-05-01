import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react'

/* ─── Easing curves ─────────────────────────────────────────────────────── */
const EXPO   = [0.16, 1, 0.3, 1]   as const
const CINEMA = [0.76, 0, 0.24, 1]  as const

/* ─── Slide system ───────────────────────────────────────────────────────── */
type Dir = 'up' | 'down' | 'left' | 'right'
const REV: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' }

const SLIDES = [
  { label: 'Start', dir: 'up' as Dir },
  { label: '01',    dir: 'up' as Dir },
  { label: '02',    dir: 'up' as Dir },
  { label: '03',    dir: 'up' as Dir },
  { label: '04',    dir: 'up' as Dir },
  { label: '05',    dir: 'up' as Dir },
  { label: '06',    dir: 'up' as Dir },
  { label: '07',    dir: 'up' as Dir },
  { label: '08',    dir: 'up' as Dir },
]

import type { TargetAndTransition } from 'motion/react'

/* New slide enters from these positions */
const ENTER: Record<Dir, TargetAndTransition> = {
  up:    { y: '100%'  },
  down:  { y: '-100%' },
  left:  { x: '100%'  },
  right: { x: '-100%' },
}
/* Old slide exits to these positions */
const EXIT_P: Record<Dir, TargetAndTransition> = {
  up:    { y: '-100%' },
  down:  { y: '100%'  },
  left:  { x: '-100%' },
  right: { x: '100%'  },
}
const slideVariants = {
  initial: (d: Dir): TargetAndTransition => ENTER[d],
  animate: { x: 0, y: 0 } as TargetAndTransition,
  exit:    (d: Dir): TargetAndTransition => EXIT_P[d],
}

/* ─── useIsMobile ────────────────────────────────────────────────────────── */
const useIsMobile = () => {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024)
  useEffect(() => {
    const fn = () => setM(window.innerWidth < 1024)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return m
}

/* ─── Icons ─────────────────────────────────────────────────────────────── */
const ArrowDown = () => (
  <svg width="16" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor" />
  </svg>
)
const ArrowRight = () => (
  <svg width="20" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="#fbd784" />
  </svg>
)

/* ─── Gallery images ────────────────────────────────────────────────────── */
const galleryImages = [
  '/opt/IMG20260419131110.webp',
  '/opt/IMG20260419131905.webp',
  '/opt/IMG20260419153321.webp',
  '/opt/IMG20260419153558.webp',
  '/opt/IMG20260419163826.webp',
]

/* ─── Per-slide image to preload (index matches SLIDES) ─────────────────── */
const SLIDE_IMAGES = [
  '/opt/IMG20260419134932.webp',  // 0 hero
  '/opt/IMG20260419130432.webp',  // 1
  '/opt/IMG20260419132429.webp',  // 2
  '/opt/IMG20260419132834.webp',  // 3
  '/opt/IMG20260419134101.webp',  // 4
  '/opt/IMG20260419144336.webp',  // 5
  '/opt/IMG20260419163602.webp',  // 6
  '/opt/IMG20260419165503.webp',  // 7
  '/opt/IMG20260419131110.webp',  // 8 gallery first image
]

/* ─── ScrollBar (mobile only) ────────────────────────────────────────────── */
const ScrollBar = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.75 bg-accent origin-left z-60"
      style={{ scaleX }}
    />
  )
}

/* ─── SliderIndicator (fixed, desktop) ───────────────────────────────────── */
const SliderIndicator = ({ current, total }: { current: number; total: number }) => {
  const BAR_H = 240
  const fillH = total > 1 ? (current / (total - 1)) * BAR_H : 0

  return (
    <motion.div
      className="hidden xl:flex fixed right-6 z-50 items-start pointer-events-none"
      style={{ top: '33%' }}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.9, type: 'spring', stiffness: 80, damping: 20 }}
    >
      <div className="relative mr-6" style={{ height: BAR_H }}>
        {SLIDES.slice(0, total).map(({ label }, i) => (
          <span
            key={label}
            className={`absolute right-0 font-barlow font-bold text-lg transition-colors duration-300 -translate-y-1/2 whitespace-nowrap ${
              i === current ? 'text-white' : 'text-white/30'
            }`}
            style={{ top: `${total > 1 ? (i / (total - 1)) * 100 : 0}%` }}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="relative w-0.75" style={{ height: BAR_H }}>
        <div className="absolute inset-0 bg-white/30" />
        <motion.div
          className="absolute top-0 w-full bg-white"
          animate={{ height: fillH }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
    </motion.div>
  )
}

/* ─── ContentBlock ──────────────────────────────────────────────────────── */
type ContentBlockProps = {
  id?: string
  number: string
  tagline: string
  title: string
  body: React.ReactNode
  imageSrc: string
  imageLeft?: boolean
  imageObjectPosition?: string
}

const ContentBlock = ({
  id, number, tagline, title, body, imageSrc,
  imageLeft = false, imageObjectPosition = 'center',
}: ContentBlockProps) => {
  const words = title.split(' ')

  return (
    <motion.div
      id={id}
      className="relative w-full max-w-7xl"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <motion.span
        className="hidden lg:block absolute top-[5%] font-barlow font-bold text-[200px] leading-none text-white/10 select-none pointer-events-none"
        style={{ left: imageLeft ? '50%' : '0' }}
        variants={{
          hidden:   { opacity: 0, scale: 1.7, y: 40 },
          visible:  { opacity: 1, scale: 1,   y: 0,
            transition: { duration: 1.4, ease: EXPO } },
        }}
      >
        {number}
      </motion.span>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:h-150">

        <motion.div
          className={`relative z-10 flex flex-col gap-5 lg:gap-7 justify-center py-10 lg:py-0
            ${imageLeft ? 'lg:order-2 lg:pl-16 xl:pl-20' : 'lg:order-1 lg:pr-10'}`}
          variants={{
            hidden:  {},
            visible: { transition: { staggerChildren: 0.11, delayChildren: 0.18 } },
          }}
        >
          <motion.span
            className="lg:hidden font-barlow font-bold text-[80px] leading-[0.85] text-white/10 select-none -mb-4"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }}
          >
            {number}
          </motion.span>

          <motion.div
            className="flex items-center gap-6"
            variants={{
              hidden:  { opacity: 0, x: imageLeft ? 32 : -32 },
              visible: { opacity: 1, x: 0,
                transition: { type: 'spring', stiffness: 80, damping: 20 } },
            }}
          >
            <motion.div
              className="h-0.5 bg-accent shrink-0"
              variants={{
                hidden:  { width: 0 },
                visible: { width: 72,
                  transition: { duration: 0.65, ease: 'easeOut', delay: 0.12 } },
              }}
            />
            <span className="font-barlow font-extrabold text-accent text-sm lg:text-lg tracking-[6px] uppercase whitespace-nowrap">
              {tagline}
            </span>
          </motion.div>

          <h2 className="font-playfair font-semibold text-3xl md:text-4xl lg:text-[56px] text-white leading-tight">
            {words.map((word, i) => (
              <span
                key={i}
                className="inline-block mr-[0.28em] overflow-hidden"
                style={{ verticalAlign: 'bottom' }}
              >
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden:  { y: '115%' },
                    visible: { y: 0,
                      transition: { type: 'spring', stiffness: 70, damping: 16,
                        delay: i * 0.07 } },
                  }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.div
            className="font-barlow font-bold text-base lg:text-lg text-white/75 leading-7 lg:leading-8"
            variants={{
              hidden:  { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0,
                transition: { duration: 0.7, ease: 'easeOut' } },
            }}
          >
            {body}
          </motion.div>

          <motion.a
            href="#gallery"
            className="flex items-center gap-3 group w-fit"
            variants={{
              hidden:  { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0,
                transition: { duration: 0.5, ease: 'easeOut' } },
            }}
            whileHover={{ x: 10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
          >
            <span className="font-barlow font-bold text-accent text-lg group-hover:underline">
              view gallery
            </span>
            <ArrowRight />
          </motion.a>
        </motion.div>

        <motion.div
          className={`h-64 sm:h-80 md:h-96 lg:h-full overflow-hidden
            ${imageLeft ? 'lg:order-1' : 'lg:order-2'}`}
          variants={{
            hidden:  { clipPath: imageLeft ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
            visible: { clipPath: 'inset(0 0 0 0)',
              transition: { duration: 1.2, ease: CINEMA } },
          }}
        >
          <motion.img
            src={imageSrc}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ objectPosition: imageObjectPosition }}
            variants={{
              hidden:  { scale: 1.25 },
              visible: { scale: 1,
                transition: { duration: 1.5, ease: EXPO } },
            }}
            whileHover={{ scale: 1.05, transition: { duration: 0.7, ease: 'easeOut' } }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ─── Shared nav links ───────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Trails',  href: '#trails' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: 'mailto:rafiul.kadir@headless.ltd' },
]

/* ─── App ────────────────────────────────────────────────────────────────── */
const App: React.FC = () => {
  const [slide, setSlide]         = useState(0)
  const [dir, setDir]             = useState<Dir>('up')
  const [animating, setAnimating] = useState(false)
  const cooldown   = useRef(false)
  const galleryRef = useRef<HTMLDivElement>(null)
  const isMobile   = useIsMobile()

  /* Mobile parallax */
  const heroRef  = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()
  const heroBgY  = useTransform(scrollY, [0, 900], [0, 180])

  /* ── navigation ──────────────────────────────────────────────────────── */
  const go = useCallback((next: number) => {
    if (animating || cooldown.current || next === slide) return
    if (next < 0 || next >= SLIDES.length) return
    const forward = next > slide
    setDir(forward ? SLIDES[next].dir : REV[SLIDES[slide].dir])
    setSlide(next)
    setAnimating(true)
    cooldown.current = true
    setTimeout(() => { cooldown.current = false }, 650)
  }, [animating, slide])

  /* ── preload adjacent slide images ──────────────────────────────────── */
  useEffect(() => {
    if (isMobile) return
    ;[slide - 1, slide + 1].forEach(i => {
      if (i >= 0 && i < SLIDE_IMAGES.length) {
        const img = new Image()
        img.src = SLIDE_IMAGES[i]
      }
    })
  }, [slide, isMobile])

  /* ── wheel (desktop) ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (isMobile) return
    const onWheel = (e: WheelEvent) => {
      const isLast = slide === SLIDES.length - 1
      const el     = galleryRef.current
      if (isLast && el) {
        const atTop    = el.scrollTop <= 0
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2
        if (e.deltaY > 0 && !atBottom) return
        if (e.deltaY < 0 && !atTop)    return
      }
      e.preventDefault()
      go(e.deltaY > 0 ? slide + 1 : slide - 1)
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [isMobile, slide, go])

  /* ── keyboard (desktop) ──────────────────────────────────────────────── */
  useEffect(() => {
    if (isMobile) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(slide + 1)
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  go(slide - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMobile, slide, go])

  /* ══════════════════════════ SHARED CONTENT ═════════════════════════════ */
  const trailBlocks = [
    <ContentBlock key="01" id="trails" number="01" tagline="Where It Begins" title="Step Into the Forest"
      imageSrc="/opt/IMG20260419130432.webp"
      body={<p>Before the steep climbs and rocky crossings, there is this — a sun-washed green clearing where the trail first announces itself. Tall trees frame the far edge like a gateway, their roots deep in soil that has guided hikers for generations. This is the moment to tighten your laces, calibrate your pace, and let the forest set its own quiet tempo. Every great trail starts with a single, deliberate first step.</p>}
    />,
    <ContentBlock key="02" number="02" tagline="Navigate the Wild" title="Cross the Wild Stream"
      imageSrc="/opt/IMG20260419132429.webp" imageLeft
      body={<><p className="mb-4">At every bend in the trail, another crossing waits. Smooth, water-worn sandstone stretches across the stream bed — polished into shallow channels by years of seasonal flow, beautiful to photograph and demanding to navigate.</p><p>Reading the rock is an art: find where the water runs shallowest, test each foothold before committing, and use your poles for balance. Each crossing builds your confidence and your connection to the trail itself.</p></>}
    />,
    <ContentBlock key="03" number="03" tagline="Hidden Wonders" title="Chase the Hidden Cascade"
      imageSrc="/opt/IMG20260419132834.webp"
      body={<p>You hear it before you see it — a thin ribbon of water sliding down a staircase of moss-edged rock, caught between walls of dense jungle. This natural cascade is the trail's reward for those who push past the easy stretches. The cool mist drifting off the falls is instant relief on a long, humid hike. Sit here, eat your snacks, and let the sound of running water reset your energy.</p>}
    />,
    <ContentBlock key="04" number="04" tagline="Push Your Limits" title="Face the Canyon Wall"
      imageSrc="/opt/IMG20260419134101.webp" imageLeft imageObjectPosition="top"
      body={<p>Suddenly the forest parts and there it stands — a sheer wall of ancient rock, streaked with mineral veins and softened at the crown by a thick fringe of jungle green. No trail cuts through the stone; you skirt its base or find the flanking ridgeline path. Either way, you leave with new respect for how the earth shapes itself over millennia.</p>}
    />,
    <ContentBlock key="05" number="05" tagline="Rest & Revive" title="Rest by the River"
      imageSrc="/opt/IMG20260419144336.webp"
      body={<p>Midway through the hike the jungle opens to a wide, still river fringed by clean sandy banks and ringed by forested hills that roll away into the hazy distance. The water is slow and clear; the air genuinely cool in the shade of the overhanging trees. Fill your water, eat your lunch, let your boots dry in the sun. The river does not hurry, and neither should you.</p>}
    />,
    <ContentBlock key="06" number="06" tagline="Trail Companions" title="Walk with the Jungle"
      imageSrc="/opt/IMG20260419163602.webp" imageLeft
      body={<><p className="mb-4">Hiking is better with someone beside you — someone to steady your nerves at a tricky crossing, share a laugh when the mud claims a boot, or simply walk quietly beside you when the forest asks for silence.</p><p>Two figures moving toward the last light of day, stream beside them and canopy above, capture everything the trail is meant to give.</p></>}
    />,
    <ContentBlock key="07" number="07" tagline="The Golden Hour" title="Follow the Light Home"
      imageSrc="/opt/IMG20260419165503.webp"
      body={<p>When the sun drops below the ridge and angles its last rays through the canopy, the jungle transforms. Every leaf glows amber, every root and stone casts a long warm shadow, and the path you have walked all day suddenly looks like a painting. Move with intention, watch your footing, and carry that light all the way back to the trailhead with you.</p>}
    />,
  ]

  const galleryAndFooter = (
    <>
      <motion.div
        id="gallery"
        className="w-full max-w-7xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.div
          className="flex items-center gap-6 mb-8"
          variants={{
            hidden:  { opacity: 0, x: -30 },
            visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, damping: 20 } },
          }}
        >
          <motion.div
            className="h-0.5 bg-accent shrink-0"
            variants={{
              hidden:  { width: 0 },
              visible: { width: 72, transition: { duration: 0.65, ease: 'easeOut', delay: 0.15 } },
            }}
          />
          <span className="font-barlow font-extrabold text-accent text-sm lg:text-lg tracking-[6px] uppercase whitespace-nowrap">
            Trail Moments
          </span>
        </motion.div>

        <div className="overflow-hidden mb-12">
          <motion.h2
            className="font-playfair font-semibold text-3xl md:text-4xl lg:text-5xl text-white"
            variants={{
              hidden:  { y: 70, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 70, damping: 18, delay: 0.1 } },
            }}
          >
            More from the Trail
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
          {galleryImages.map((src, i) => (
            <motion.div
              key={src}
              className="aspect-3/4 overflow-hidden"
              variants={{
                hidden:  { opacity: 0, y: 60, scale: 0.88 },
                visible: { opacity: 1, y: 0, scale: 1,
                  transition: { type: 'spring', stiffness: 80, damping: 18, delay: 0.25 + i * 0.1 } },
              }}
              whileHover={{ scale: 1.04, transition: { duration: 0.35 } }}
            >
              <motion.img
                src={src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover cursor-pointer"
                whileHover={{ scale: 1.12, transition: { duration: 0.6, ease: 'easeOut' } }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <footer id="contact" className="w-full max-w-7xl border-t border-white/10 pt-12 lg:pt-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={{
            hidden:  {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
          }}
        >
          <motion.div
            className="flex flex-col lg:flex-row gap-12 lg:gap-0 lg:justify-between"
            variants={{
              hidden:  { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 20 } },
            }}
          >
            <div className="max-w-xs">
              <a href="/">
                <img
                  src="/Rafiul%20Logo%20Light%204x.png"
                  alt="Rafiul"
                  loading="lazy"
                  className="h-14 object-contain"
                  style={{ mixBlendMode: 'screen' }}
                />
              </a>
              <p className="font-barlow font-bold text-lg leading-8 mt-8 lg:mt-10 text-white">
                Capturing the trails of Bangladesh —<br />one hike at a time.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-10 sm:gap-16 lg:gap-24">
              <div>
                <h3 className="font-barlow font-bold text-2xl text-accent leading-8">Explore</h3>
                <ul className="mt-10 lg:mt-14 space-y-4 lg:space-y-8 font-barlow font-medium text-lg text-white">
                  {[
                    { label: 'Home',    href: '/' },
                    { label: 'Trails',  href: '#trails' },
                    { label: 'Gallery', href: '#gallery' },
                    { label: 'Contact', href: 'mailto:rafiul.kadir@headless.ltd' },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} className="hover:text-accent transition-colors">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
          <motion.p
            className="mt-12 lg:mt-16 font-barlow font-medium text-lg text-white/50 leading-8"
            variants={{
              hidden:  { opacity: 0 },
              visible: { opacity: 1, transition: { delay: 0.35 } },
            }}
          >
            Copyright 2026 Shah Md. Rafiul Kadir. All rights reserved.
          </motion.p>
        </motion.div>
      </footer>
    </>
  )

  /* ══════════════════════════════ MOBILE LAYOUT ══════════════════════════ */
  if (isMobile) {
    return (
      <div className="bg-bg text-white overflow-x-hidden">
        <ScrollBar />

        <section ref={heroRef} className="relative h-150 md:h-187.5 overflow-hidden">
          <motion.img
            src="/opt/IMG20260419134932.webp"
            alt=""
            fetchPriority="high"
            className="absolute inset-0 w-full h-[115%] top-[-7%] object-cover object-[50%_40%] pointer-events-none"
            style={{ y: heroBgY }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 14, ease: 'easeOut' }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(-19.67deg, rgba(11,29,38,0) 31.06%, #0b1d26 108.93%)' }}
          />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-b from-transparent to-bg pointer-events-none" />

          <motion.nav
            className="absolute top-0 inset-x-0 z-20"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.2 }}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center h-22">
              <a href="/" className="shrink-0">
                <motion.img
                  src="/Rafiul%20Logo%20Light%204x.png"
                  alt="Rafiul"
                  className="h-14 object-contain"
                  style={{ mixBlendMode: 'screen' }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                />
              </a>
              <div className="hidden md:flex gap-8 mx-auto font-barlow font-bold text-lg">
                {NAV_LINKS.map(({ label, href }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    className="relative hover:text-accent transition-colors"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.1, type: 'spring', stiffness: 100, damping: 20 }}
                    whileHover={{ y: -2 }}
                  >
                    {label}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.nav>

          <div className="absolute inset-0 z-10 flex items-center pt-22">
            <div className="max-w-7xl mx-auto w-full px-6 md:px-8">
              <motion.div
                className="flex items-center gap-6"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55, type: 'spring', stiffness: 80, damping: 20 }}
              >
                <motion.div
                  className="h-0.5 bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: 72 }}
                  transition={{ delay: 0.75, duration: 0.7, ease: 'easeOut' }}
                />
                <span className="font-barlow font-extrabold text-accent text-sm tracking-[6px] uppercase whitespace-nowrap">
                  A Forest Hiking Guide
                </span>
              </motion.div>
              <h1 className="font-playfair font-semibold text-4xl sm:text-5xl md:text-6xl capitalize mt-6 mb-6 max-w-175">
                {'Venture Deep — the Jungle Trail Awaits!'.split(' ').map((word, i) => (
                  <span key={i} className="inline-block mr-[0.25em] overflow-hidden" style={{ verticalAlign: 'bottom' }}>
                    <motion.span
                      className="inline-block"
                      initial={{ y: '120%' }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.9 + i * 0.07, type: 'spring', stiffness: 70, damping: 18 }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h1>
              <motion.a
                href="#trails"
                className="flex items-center gap-4 group w-fit"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.65, type: 'spring', stiffness: 80, damping: 20 }}
                whileHover={{ x: 8 }}
              >
                <span className="font-barlow font-bold text-lg group-hover:text-accent transition-colors">scroll down</span>
                <motion.span
                  animate={{ y: [0, 7, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                >
                  <ArrowDown />
                </motion.span>
              </motion.a>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-center gap-16 md:gap-24 lg:gap-45 pt-12 pb-20">
          {trailBlocks}
          {galleryAndFooter}
        </div>
      </div>
    )
  }

  /* ══════════════════════════════ DESKTOP LAYOUT ═════════════════════════ */

  const heroSlide = (
    <section className="relative w-full h-full overflow-hidden">
      <motion.img
        src="/opt/IMG20260419134932.webp"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover object-[50%_40%] pointer-events-none"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 14, ease: 'easeOut' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(-19.67deg, rgba(11,29,38,0) 31.06%, #0b1d26 108.93%)' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-b from-transparent to-bg pointer-events-none" />

      {/* Email sidebar */}
      <motion.div
        className="hidden xl:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-20"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.9, type: 'spring', stiffness: 80, damping: 20 }}
      >
        <motion.a
          href="mailto:rafiul.kadir@headless.ltd"
          className="font-barlow font-bold text-lg whitespace-nowrap hover:text-accent transition-colors"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          whileHover={{ scale: 1.05 }}
        >
          Contact me
        </motion.a>
      </motion.div>

      <div className="absolute inset-0 z-10 flex items-center pt-22">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-8 lg:px-10">
          <div className="lg:ml-[22%]">
            <motion.div
              className="flex items-center gap-6"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, type: 'spring', stiffness: 80, damping: 20 }}
            >
              <motion.div
                className="h-0.5 bg-accent"
                initial={{ width: 0 }}
                animate={{ width: 72 }}
                transition={{ delay: 0.75, duration: 0.7, ease: 'easeOut' }}
              />
              <span className="font-barlow font-extrabold text-accent text-sm lg:text-lg tracking-[6px] uppercase whitespace-nowrap">
                A Forest Hiking Guide
              </span>
            </motion.div>

            <h1 className="font-playfair font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-[88px] lg:leading-25 capitalize mt-6 mb-6 lg:mt-8 lg:mb-8 max-w-175 lg:max-w-212.5">
              {'Venture Deep — the Jungle Trail Awaits!'.split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-[0.25em] overflow-hidden" style={{ verticalAlign: 'bottom' }}>
                  <motion.span
                    className="inline-block"
                    initial={{ y: '120%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.9 + i * 0.07, type: 'spring', stiffness: 70, damping: 18 }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.button
              onClick={() => go(1)}
              className="flex items-center gap-4 group w-fit cursor-pointer bg-transparent border-0 p-0 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.65, type: 'spring', stiffness: 80, damping: 20 }}
              whileHover={{ x: 8 }}
            >
              <span className="font-barlow font-bold text-lg group-hover:text-accent transition-colors">scroll down</span>
              <motion.span
                animate={{ y: [0, 7, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              >
                <ArrowDown />
              </motion.span>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )

  const trailSlides = trailBlocks.map((block) => (
    <div key={(block as React.ReactElement).key} className="h-full flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-6 md:px-8 lg:px-10">
        {block}
      </div>
    </div>
  ))

  const gallerySlide = (
    <div ref={galleryRef} className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 flex flex-col items-center gap-16 pt-28 pb-20">
        {galleryAndFooter}
      </div>
    </div>
  )

  const allSlides = [heroSlide, ...trailSlides, gallerySlide]

  return (
    <div className="bg-bg text-white h-screen overflow-hidden relative">

      {/* Fixed nav */}
      <motion.nav
        className="fixed top-0 inset-x-0 z-40"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 flex items-center h-22">
          <a href="/" className="shrink-0">
            <motion.img
              src="/Rafiul%20Logo%20Light%204x.png"
              alt="Rafiul"
              className="h-14 object-contain"
              style={{ mixBlendMode: 'screen' }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
            />
          </a>
          <div className="hidden md:flex gap-8 lg:gap-28.75 mx-auto font-barlow font-bold text-lg">
            {NAV_LINKS.map(({ label, href }, i) => (
              <motion.a
                key={label}
                href={href}
                className="relative hover:text-accent transition-colors"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + i * 0.1, type: 'spring', stiffness: 100, damping: 20 }}
                whileHover={{ y: -2 }}
              >
                {label}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Fixed slider indicator */}
      <SliderIndicator current={slide} total={SLIDES.length} />

      {/* Slides */}
      <AnimatePresence
        mode="sync"
        custom={dir}
        onExitComplete={() => setAnimating(false)}
      >
        <motion.div
          key={slide}
          custom={dir}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.6, ease: CINEMA }}
          className="absolute inset-0 bg-bg"
        >
          {allSlides[slide]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
