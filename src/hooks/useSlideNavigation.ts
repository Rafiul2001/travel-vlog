import { useState, useEffect, useCallback, useRef } from 'react'
import { SLIDES, SLIDE_IMAGES, REV, type Dir } from '../data/slides'

export const useSlideNavigation = (isMobile: boolean) => {
  const [slide, setSlide]         = useState(0)
  const [dir, setDir]             = useState<Dir>('up')
  const [animating, setAnimating] = useState(false)
  const cooldown   = useRef(false)
  const galleryRef = useRef<HTMLDivElement>(null)

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

  /* preload adjacent slides */
  useEffect(() => {
    if (isMobile) return
    ;[slide - 1, slide + 1].forEach(i => {
      if (i >= 0 && i < SLIDE_IMAGES.length) {
        const img = new Image()
        img.src = SLIDE_IMAGES[i]
      }
    })
  }, [slide, isMobile])

  /* wheel */
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

  /* keyboard */
  useEffect(() => {
    if (isMobile) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(slide + 1)
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  go(slide - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMobile, slide, go])

  return { slide, dir, go, animating, setAnimating, galleryRef }
}
