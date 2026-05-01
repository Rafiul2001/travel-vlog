import React from 'react'
import type { ContentBlockProps } from '../components/templates/ContentBlock'

export type TrailData = ContentBlockProps & { key: string }

export const TRAILS: TrailData[] = [
  {
    key: '01', id: 'trails', number: '01',
    tagline: 'Where It Begins', title: 'Step Into the Forest',
    imageSrc: '/opt/IMG20260419130432.webp',
    body: (
      <p>Before the steep climbs and rocky crossings, there is this — a sun-washed green clearing where the trail first announces itself. Tall trees frame the far edge like a gateway, their roots deep in soil that has guided hikers for generations. This is the moment to tighten your laces, calibrate your pace, and let the forest set its own quiet tempo. Every great trail starts with a single, deliberate first step.</p>
    ),
  },
  {
    key: '02', number: '02',
    tagline: 'Navigate the Wild', title: 'Cross the Wild Stream',
    imageSrc: '/opt/IMG20260419132429.webp', imageLeft: true,
    body: (
      <>
        <p className="mb-4">At every bend in the trail, another crossing waits. Smooth, water-worn sandstone stretches across the stream bed — polished into shallow channels by years of seasonal flow, beautiful to photograph and demanding to navigate.</p>
        <p>Reading the rock is an art: find where the water runs shallowest, test each foothold before committing, and use your poles for balance. Each crossing builds your confidence and your connection to the trail itself.</p>
      </>
    ),
  },
  {
    key: '03', number: '03',
    tagline: 'Hidden Wonders', title: 'Chase the Hidden Cascade',
    imageSrc: '/opt/IMG20260419132834.webp',
    body: (
      <p>You hear it before you see it — a thin ribbon of water sliding down a staircase of moss-edged rock, caught between walls of dense jungle. This natural cascade is the trail's reward for those who push past the easy stretches. The cool mist drifting off the falls is instant relief on a long, humid hike. Sit here, eat your snacks, and let the sound of running water reset your energy.</p>
    ),
  },
  {
    key: '04', number: '04',
    tagline: 'Push Your Limits', title: 'Face the Canyon Wall',
    imageSrc: '/opt/IMG20260419134101.webp', imageLeft: true, imageObjectPosition: 'top',
    body: (
      <p>Suddenly the forest parts and there it stands — a sheer wall of ancient rock, streaked with mineral veins and softened at the crown by a thick fringe of jungle green. No trail cuts through the stone; you skirt its base or find the flanking ridgeline path. Either way, you leave with new respect for how the earth shapes itself over millennia.</p>
    ),
  },
  {
    key: '05', number: '05',
    tagline: 'Rest & Revive', title: 'Rest by the River',
    imageSrc: '/opt/IMG20260419144336.webp',
    body: (
      <p>Midway through the hike the jungle opens to a wide, still river fringed by clean sandy banks and ringed by forested hills that roll away into the hazy distance. The water is slow and clear; the air genuinely cool in the shade of the overhanging trees. Fill your water, eat your lunch, let your boots dry in the sun. The river does not hurry, and neither should you.</p>
    ),
  },
  {
    key: '06', number: '06',
    tagline: 'Trail Companions', title: 'Walk with the Jungle',
    imageSrc: '/opt/IMG20260419163602.webp', imageLeft: true,
    body: (
      <>
        <p className="mb-4">Hiking is better with someone beside you — someone to steady your nerves at a tricky crossing, share a laugh when the mud claims a boot, or simply walk quietly beside you when the forest asks for silence.</p>
        <p>Two figures moving toward the last light of day, stream beside them and canopy above, capture everything the trail is meant to give.</p>
      </>
    ),
  },
  {
    key: '07', number: '07',
    tagline: 'The Golden Hour', title: 'Follow the Light Home',
    imageSrc: '/opt/IMG20260419165503.webp',
    body: (
      <p>When the sun drops below the ridge and angles its last rays through the canopy, the jungle transforms. Every leaf glows amber, every root and stone casts a long warm shadow, and the path you have walked all day suddenly looks like a painting. Move with intention, watch your footing, and carry that light all the way back to the trailhead with you.</p>
    ),
  },
]
