import { motion } from 'motion/react'
import { SLIDES } from '../../data/slides'

type SliderIndicatorProps = {
  current: number
  total: number
  onGo?: (index: number) => void
}

export const SliderIndicator = ({ current, total, onGo }: SliderIndicatorProps) => {
  const BAR_H = 240
  const fillH = total > 1 ? (current / (total - 1)) * BAR_H : 0

  return (
    <motion.div
      className="hidden xl:flex fixed right-6 z-50 items-start"
      style={{ top: '33%' }}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.9, type: 'spring', stiffness: 80, damping: 20 }}
    >
      <div className="relative mr-6" style={{ height: BAR_H }}>
        {SLIDES.slice(0, total).map(({ label }, i) => (
          <span
            key={label}
            onClick={() => onGo?.(i)}
            className={`absolute right-0 font-barlow font-bold text-lg transition-colors duration-300 -translate-y-1/2 whitespace-nowrap ${
              onGo ? 'cursor-pointer hover:text-white' : ''
            } ${i === current ? 'text-white' : 'text-white/30'}`}
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
