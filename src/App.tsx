import React from 'react'
import { motion, AnimatePresence } from 'motion/react'

import { SLIDES, slideVariants } from './data/slides'
import { TRAILS } from './data/trails'
import { CINEMA } from './lib/easing'

import { useIsMobile } from './hooks/useIsMobile'
import { useSlideNavigation } from './hooks/useSlideNavigation'

import { ScrollBar } from './components/atoms/ScrollBar'
import { SliderIndicator } from './components/atoms/SliderIndicator'
import { Nav } from './components/templates/Nav'
import { Hero } from './components/templates/Hero'
import { ContentBlock } from './components/templates/ContentBlock'
import { GallerySection } from './components/templates/GallerySection'

const App: React.FC = () => {
  const isMobile = useIsMobile()
  const { slide, dir, go, setAnimating, galleryRef } = useSlideNavigation(isMobile)

  /* ── Mobile: normal scroll layout ──────────────────────────────────── */
  if (isMobile) {
    return (
      <div className="bg-bg text-white overflow-x-hidden">
        <ScrollBar />
        <Hero showNav />
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col items-center gap-16 md:gap-24 lg:gap-45 pt-12 pb-20">
          {TRAILS.map(({ key, ...trail }) => (
            <ContentBlock key={key} {...trail} />
          ))}
          <GallerySection />
        </div>
      </div>
    )
  }

  /* ── Desktop: full-screen slide show ────────────────────────────────── */
  const allSlides = [
    <Hero key="hero" onScrollDown={() => go(1)} />,
    ...TRAILS.map(({ key, ...trail }) => (
      <div key={key} className="h-full flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-8 lg:px-10">
          <ContentBlock {...trail} />
        </div>
      </div>
    )),
    <GallerySection key="gallery" ref={galleryRef} desktopMode />,
  ]

  return (
    <div className="bg-bg text-white h-screen overflow-hidden relative">
      <Nav onGo={go} />
      <SliderIndicator current={slide} total={SLIDES.length} onGo={go} />

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
