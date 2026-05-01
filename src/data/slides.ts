import type { TargetAndTransition } from 'motion/react'

export type Dir = 'up' | 'down' | 'left' | 'right'

export const REV: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' }

export const SLIDES = [
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

export const SLIDE_IMAGES = [
  '/opt/IMG20260419134932.webp',
  '/opt/IMG20260419130432.webp',
  '/opt/IMG20260419132429.webp',
  '/opt/IMG20260419132834.webp',
  '/opt/IMG20260419134101.webp',
  '/opt/IMG20260419144336.webp',
  '/opt/IMG20260419163602.webp',
  '/opt/IMG20260419165503.webp',
  '/opt/IMG20260419131110.webp',
]

const ENTER: Record<Dir, TargetAndTransition> = {
  up:    { y: '100%'  },
  down:  { y: '-100%' },
  left:  { x: '100%'  },
  right: { x: '-100%' },
}

const EXIT_P: Record<Dir, TargetAndTransition> = {
  up:    { y: '-100%' },
  down:  { y: '100%'  },
  left:  { x: '-100%' },
  right: { x: '100%'  },
}

export const slideVariants = {
  initial: (d: Dir): TargetAndTransition => ENTER[d],
  animate: { x: 0, y: 0 } as TargetAndTransition,
  exit:    (d: Dir): TargetAndTransition => EXIT_P[d],
}
