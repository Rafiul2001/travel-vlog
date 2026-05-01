import { motion, useScroll, useTransform } from 'motion/react'
import { Nav } from './Nav'
import { ArrowDown } from '../icons/ArrowDown'

type HeroProps = {
  /** Show the nav bar inside this component (mobile). On desktop the nav is fixed globally. */
  showNav?: boolean
  /** Desktop: called when the "scroll down" button is clicked. */
  onScrollDown?: () => void
}

export const Hero = ({ showNav = false, onScrollDown }: HeroProps) => {
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 900], [0, 180])

  const headline = 'Venture Deep — the Jungle Trail Awaits!'

  return (
    <section
      className={`relative overflow-hidden ${
        showNav ? 'h-150 md:h-187.5' : 'w-full h-full'
      }`}
    >
      {/* Background image */}
      <motion.img
        src="/opt/IMG20260419134932.webp"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover object-[50%_40%] pointer-events-none"
        style={showNav ? { y: bgY, height: '115%', top: '-7%' } : {}}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 14, ease: 'easeOut' }}
      />

      {/* Gradient overlays */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(-19.67deg, rgba(11,29,38,0) 31.06%, #0b1d26 108.93%)' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-b from-transparent to-bg pointer-events-none" />

      {/* Nav — mobile only (desktop nav is fixed in App) */}
      {showNav && <Nav position="absolute" gapClass="" />}

      {/* Email sidebar — desktop only */}
      {!showNav && (
        <motion.div
          className="hidden xl:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-20"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.9, type: 'spring', stiffness: 80, damping: 20 }}
        >
          <motion.a
            href="mailto:rafiul13062001@gmail.com"
            className="font-barlow font-bold text-lg whitespace-nowrap hover:text-accent transition-colors"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            whileHover={{ scale: 1.05 }}
          >
            Contact me
          </motion.a>
        </motion.div>
      )}

      {/* Copy */}
      <div className={`absolute inset-0 z-10 flex items-center ${showNav ? 'pt-22' : 'pt-22'}`}>
        <div className="max-w-7xl mx-auto w-full px-6 md:px-8 lg:px-10">
          <div className={!showNav ? 'lg:ml-[22%]' : ''}>

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
              {headline.split(' ').map((word, i) => (
                <span
                  key={i}
                  className="inline-block mr-[0.25em] overflow-hidden"
                  style={{ verticalAlign: 'bottom' }}
                >
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

            {onScrollDown ? (
              <motion.button
                onClick={onScrollDown}
                className="flex items-center gap-4 group w-fit cursor-pointer bg-transparent border-0 p-0 text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.65, type: 'spring', stiffness: 80, damping: 20 }}
                whileHover={{ x: 8 }}
              >
                <span className="font-barlow font-bold text-lg group-hover:text-accent transition-colors">scroll down</span>
                <motion.span animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
                  <ArrowDown />
                </motion.span>
              </motion.button>
            ) : (
              <motion.a
                href="#trails"
                className="flex items-center gap-4 group w-fit"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.65, type: 'spring', stiffness: 80, damping: 20 }}
                whileHover={{ x: 8 }}
              >
                <span className="font-barlow font-bold text-lg group-hover:text-accent transition-colors">scroll down</span>
                <motion.span animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
                  <ArrowDown />
                </motion.span>
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
