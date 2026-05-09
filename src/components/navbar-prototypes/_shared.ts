import { useEffect, type RefObject } from 'react'

/**
 * One breadcrumb segment. Each segment knows its own label, the parent's label
 * (used for the "Also in X" eyebrow inside dropdowns) and its sibling list.
 */
export interface NavSibling {
  label: string
  href: string
  /** Optional summary line — italic Caslon under the link in editorial variants. */
  summary?: string
  /** Optional tier mark for variants that show one. */
  tier?: 'S' | 'A' | 'B' | 'C' | 'D' | 'F'
  /** Marks the currently-selected sibling. */
  current?: boolean
}

export interface NavSegment {
  /** Stable identifier — used for the "open dropdown" state. */
  key: string
  /** Display label, set in tracked smallcaps in the bar. */
  label: string
  /**
   * Heading for the dropdown ("Also in Culture & Arts").
   * Falls back to label when omitted.
   */
  groupLabel?: string
  siblings: NavSibling[]
}

export const BREADCRUMB: NavSegment[] = [
  {
    key: 'source',
    label: 'Great Work',
    groupLabel: 'Sections',
    siblings: [
      {
        label: 'Great Work',
        href: '#',
        current: true,
        summary: 'A travel guide to Utah\u2019s great work, and the people behind it.',
      },
      { label: 'Places You Can Work', href: '#', summary: 'The directory of teams hiring right now.' },
      { label: 'Tier System', href: '#', summary: 'How we rank \u2014 and why we\u2019re willing to.' },
      { label: 'Hand-Raise Board', href: '#', summary: 'Senior people quietly open to the right thing.' },
    ],
  },
  {
    key: 'domain',
    label: 'Culture & Arts',
    groupLabel: 'Also in Great Work',
    siblings: [
      { label: 'Culture & Arts', href: '#', current: true, summary: 'Land art, festivals, museums, the lake.' },
      { label: 'Biotech', href: '#', summary: 'Drug discovery, diagnostics, the next Recursion.' },
      { label: 'Climate', href: '#', summary: 'Energy, water, dust, smoke.' },
      { label: 'Education', href: '#', summary: 'Schools, programs, mentors, scholars.' },
      { label: 'Government', href: '#', summary: 'How Utah governs the building of things.' },
      { label: 'History', href: '#', summary: 'Old roads, old names, old reasons.' },
      { label: 'People', href: '#', summary: 'The Utahns doing the work right now.' },
      { label: 'Science', href: '#', summary: 'Labs, papers, telescopes, discoveries.' },
    ],
  },
  {
    key: 'entry',
    label: 'Spiral Jetty',
    groupLabel: 'Also in Culture & Arts',
    siblings: [
      { label: 'Spiral Jetty', href: '#', current: true, tier: 'S', summary: 'Robert Smithson\u2019s 1,500-foot coil at the edge of the lake.' },
      { label: 'Sundance Film Festival', href: '#', tier: 'S', summary: 'Park City\u2019s annual indie-film mecca.' },
      { label: 'Bonneville Salt Flats', href: '#', tier: 'A', summary: 'A 30,000-acre dry lake bed where land speed records are set.' },
      { label: 'Mormon Battalion', href: '#', tier: 'B', summary: 'The longest infantry march in U.S. military history.' },
      { label: 'John M. Browning', href: '#', tier: 'A', summary: 'The Ogden gunsmith whose designs still arm half the world.' },
      { label: 'Utah Symphony', href: '#', tier: 'B', summary: 'A full-scale orchestra in the desert since 1940.' },
      { label: 'Topaz War Relocation Center', href: '#', tier: 'A', summary: 'The high-desert internment camp \u2014 and what it taught the state.' },
    ],
  },
]

/**
 * Detects pointer-down outside the referenced element and the segment buttons.
 * Used by every variant to dismiss its dropdown.
 */
export function useDismissOnOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onDismiss: () => void,
  enabled: boolean,
): void {
  useEffect(() => {
    if (!enabled) return
    function onPointerDown(e: PointerEvent) {
      const node = ref.current
      if (!node) return
      const target = e.target
      if (!(target instanceof Node)) return
      if (node.contains(target)) return
      onDismiss()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onDismiss()
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [ref, onDismiss, enabled])
}
