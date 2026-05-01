import { motion } from 'motion/react'
import { NAV_LINKS } from '../../data/nav'

type NavProps = {
  position?: 'fixed' | 'absolute'
  gapClass?: string
}

export const Nav = ({ position = 'fixed', gapClass = 'lg:gap-28.75' }: NavProps) => (
  <motion.nav
    className={`${position} top-0 inset-x-0 z-40`}
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
      <div className={`hidden md:flex gap-8 ${gapClass} mx-auto font-barlow font-bold text-lg`}>
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
)
