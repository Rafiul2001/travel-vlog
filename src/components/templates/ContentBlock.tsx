import React from 'react'
import { motion } from 'motion/react'
import { EXPO, CINEMA } from '../../lib/easing'
import { ArrowRight } from '../icons/ArrowRight'

export type ContentBlockProps = {
  id?: string
  number: string
  tagline: string
  title: string
  body: React.ReactNode
  imageSrc: string
  imageLeft?: boolean
  imageObjectPosition?: string
}

export const ContentBlock = ({
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
          hidden:  { opacity: 0, scale: 1.7, y: 40 },
          visible: { opacity: 1, scale: 1,   y: 0,
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
                      transition: { type: 'spring', stiffness: 70, damping: 16, delay: i * 0.07 } },
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
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
            }}
          >
            {body}
          </motion.div>

          <motion.a
            href="#gallery"
            className="flex items-center gap-3 group w-fit"
            variants={{
              hidden:  { opacity: 0, y: 14 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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
              visible: { scale: 1, transition: { duration: 1.5, ease: EXPO } },
            }}
            whileHover={{ scale: 1.05, transition: { duration: 0.7, ease: 'easeOut' } }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
