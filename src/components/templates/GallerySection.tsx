import { forwardRef } from 'react'
import { motion } from 'motion/react'
import { NAV_LINKS } from '../../data/nav'

const GALLERY_IMAGES = [
  '/opt/IMG20260419131110.webp',
  '/opt/IMG20260419131905.webp',
  '/opt/IMG20260419153321.webp',
  '/opt/IMG20260419153558.webp',
  '/opt/IMG20260419163826.webp',
]

const FOOTER_LINKS = [
  { label: 'Home', href: '/', slideIndex: 0 },
  ...NAV_LINKS,
]

const Content = ({ onGo }: { onGo?: (index: number) => void }) => (
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
        {GALLERY_IMAGES.map((src, i) => (
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
                {FOOTER_LINKS.map(({ label, href, slideIndex }) => (
                  <li key={label}>
                    <a
                      href={href}
                      onClick={onGo && slideIndex != null ? (e) => { e.preventDefault(); onGo(slideIndex) } : undefined}
                      className="hover:text-accent transition-colors"
                    >
                      {label}
                    </a>
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

type GallerySectionProps = {
  desktopMode?: boolean
  onGo?: (index: number) => void
}

export const GallerySection = forwardRef<HTMLDivElement, GallerySectionProps>(
  ({ desktopMode = false, onGo }, ref) => {
    if (desktopMode) {
      return (
        <div ref={ref} className="h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 flex flex-col items-center gap-16 pt-28 pb-20">
            <Content onGo={onGo} />
          </div>
        </div>
      )
    }
    return <Content />
  }
)

GallerySection.displayName = 'GallerySection'
