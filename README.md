# Jungle Trail — A Forest Hiking Guide

A personal hiking landing page by **Shah Md. Rafiul Kadir**, documenting forest trails in Bangladesh through photography and storytelling. Built as a polished, portfolio-quality web experience with a dual layout: a fullscreen slide show on desktop and a normal scroll layout on mobile.

---

## Project Summary

The site walks visitors through seven trail sections — from the first steps into the forest, across wild stream crossings and hidden cascades, up canyon walls, and finally out through golden-hour light. A photo gallery at the end collects extra trail moments. Every section is paired with a real photograph from a hike on 19 April 2026.

### Layout Modes

**Desktop** — fullscreen, one-slide-at-a-time presentation. Navigation via mouse wheel, keyboard arrow keys, the side slide indicator, or the nav bar links.

**Mobile** — standard vertical scroll with all sections stacked, so the full content is accessible without JS-driven slide logic.

### Key Features

- Animated slide transitions in four directions (up / down / left / right) powered by Motion
- Side slide indicator with clickable labels (`Start`, `01`–`08`) for direct jump navigation
- Nav bar "Trails" and "Gallery" links that slide-navigate on desktop and anchor-scroll on mobile
- Hero parallax background and word-by-word headline animation
- Photo gallery with staggered entrance and hover zoom
- Adjacent-slide image preloading to eliminate load flicker
- React Compiler enabled for automatic memoisation

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 4 |
| Animation | Motion (motion/react) |
| Deployment | Netlify |

---

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Production build
bun run build
```

---

## Project Structure

```
src/
├── components/
│   ├── atoms/          # ScrollBar, SliderIndicator
│   ├── icons/          # Arrow icons
│   └── templates/      # Hero, Nav, ContentBlock, GallerySection
├── data/
│   ├── nav.ts          # Nav links with slide indices
│   ├── slides.ts       # Slide metadata and animation variants
│   └── trails.tsx      # Trail section content
├── hooks/
│   ├── useIsMobile.ts  # Breakpoint detection
│   └── useSlideNavigation.ts  # Wheel, keyboard, and click navigation
└── lib/
    └── easing.ts       # Custom easing curves
```

---

Copyright 2026 Shah Md. Rafiul Kadir. All rights reserved.
