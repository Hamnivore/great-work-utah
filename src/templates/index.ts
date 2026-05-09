import type { ComponentType } from 'react'
import { Manuscript } from './Manuscript'
import { Magazine } from './Magazine'
import { PhotoEssay } from './PhotoEssay'
import { Quiet } from './Quiet'
import { Postcard } from './Postcard'
import { Manifesto } from './Manifesto'
import { FieldGuide } from './FieldGuide'
import { Letterpress } from './Letterpress'
import { FrontPage } from './FrontPage'
import { CoverStory } from './CoverStory'
import { Contents } from './Contents'
import { Marginalia } from './Marginalia'
import { Gutter } from './Gutter'
import { FullBleed } from './FullBleed'
import { Dispatch } from './Dispatch'
import { Reverse } from './Reverse'
import { VerticalTitle } from './VerticalTitle'
import { CaptionOnly } from './CaptionOnly'
import { Whisper } from './Whisper'
import { AllPullQuotes } from './AllPullQuotes'
import { Index } from './Index'
import { InvertedPyramid } from './InvertedPyramid'
import { Ransom } from './Ransom'
import { TitleFirst } from './TitleFirst'
import { Receipt } from './Receipt'
import { Erasure } from './Erasure'

export interface TemplateMeta {
  id: string
  name: string
  /** A short editorial blurb explaining the template's *vibe* */
  blurb: string
  /** A second line — the "mistake on purpose" or the move that defines it */
  move: string
  /**
   * Trash-heap experiment. Most of these are bad on purpose — risky
   * non-consensus moves we'd never put in production. A few might
   * actually be great. We ship them all so the great ones can be found.
   */
  experimental?: boolean
  /** Short, honest reason the experiment is probably a bad idea. */
  whyDumb?: string
  Component: ComponentType
}

/**
 * The order is the order they appear on the showroom — front matter
 * first (Cover, Contents), then the long-reads, then quieter forms.
 */
export const TEMPLATES: TemplateMeta[] = [
  // ----- Front matter
  {
    id: 'cover-story',
    name: 'Cover Story',
    blurb: 'Obscura cover energy: masthead, single portrait, pull-quote subtitle.',
    move: 'Title set lowercase italic — most magazines shout, we whisper.',
    Component: CoverStory,
  },
  {
    id: 'contents',
    name: 'Contents',
    blurb: '"In this issue." Numbered TOC with kicker, blurb, and folio.',
    move: 'Big italic numerals do the walking.',
    Component: Contents,
  },
  {
    id: 'front-page',
    name: 'Front Page',
    blurb:
      'Top of the broadsheet. Tracked nameplate, dateline strip, weather, hero with hanging caption.',
    move: 'Hairline rules between scenes — the rhythm of newsprint.',
    Component: FrontPage,
  },

  // ----- Long-reads
  {
    id: 'magazine',
    name: 'Magazine long-read',
    blurb: 'Editorial muscle. Kicker, byline, hero, drop cap, pull-quote, sidebar, footnotes.',
    move: 'The flagship story of the issue.',
    Component: Magazine,
  },
  {
    id: 'full-bleed',
    name: 'Full Bleed',
    blurb: 'Field Mag energy. Cinematic top plate; title overlaid bottom-left; quiet body below.',
    move: 'No drop cap — the photograph is the drop cap.',
    Component: FullBleed,
  },
  {
    id: 'gutter',
    name: 'Gutter',
    blurb: 'Image lives in the gutter. Caption in display italic over the lower edge.',
    move: 'Caption gets the same dignity as body text.',
    Component: Gutter,
  },
  {
    id: 'photo-essay',
    name: 'Photo essay',
    blurb: 'Image-led. Multiple full-width plates with italic captions, captions occasionally pull quotes.',
    move: 'Text breathes between photographs, not the other way around.',
    Component: PhotoEssay,
  },
  {
    id: 'marginalia',
    name: 'Marginalia',
    blurb: 'Tufte-flavored. Body in a generous central column; figures and notes in the margin.',
    move: 'Caption set in display italic — same dignity as the body.',
    Component: Marginalia,
  },

  // ----- Reading-room
  {
    id: 'manuscript',
    name: 'Manuscript',
    blurb: 'Classical book chapter. Justified body, big drop cap, single inset pull quote.',
    move: 'I am sitting in a quiet library.',
    Component: Manuscript,
  },
  {
    id: 'reverse',
    name: 'Reverse',
    blurb: 'No opening image. The photograph lands at the end, like the back of a record sleeve.',
    move: 'Make the reader trust the typography first.',
    Component: Reverse,
  },
  {
    id: 'quiet',
    name: 'Quiet essay',
    blurb: 'No masthead, no drop cap, no images. Words only.',
    move: 'Trust the writing.',
    Component: Quiet,
  },

  // ----- Reference / argumentative
  {
    id: 'field-guide',
    name: 'Field Guide',
    blurb: 'Numbered sections, metadata strip, bullet lists. Look-up reference.',
    move: 'Almost academic — gives the page a folder-tab feel.',
    Component: FieldGuide,
  },
  {
    id: 'manifesto',
    name: 'Manifesto',
    blurb: 'Giant title, oversized body, no chrome. Each paragraph declares.',
    move: 'We believe.',
    Component: Manifesto,
  },

  // ----- Intimate / scrappy
  {
    id: 'dispatch',
    name: 'Dispatch',
    blurb: 'Letter from the field. Dateline, tilted stamp, "Dear reader," hand-letter cadence, postmark.',
    move: 'A taped-in Polaroid does the image work.',
    Component: Dispatch,
  },
  {
    id: 'postcard',
    name: 'Postcard',
    blurb: 'Small, intimate, signed. For short or unfinished entries — wish you were here.',
    move: 'A whole article, in 200 words and a photo.',
    Component: Postcard,
  },
  {
    id: 'letterpress',
    name: 'Letterpress broadside',
    blurb: 'Tracked all-caps title, ornaments, justified body. Heavy-paper energy.',
    move: 'This should be printed and nailed to a barn.',
    Component: Letterpress,
  },

  // ----- TRASH HEAP — experiments that are mostly bad on purpose
  {
    id: 'title-first',
    name: 'Title First',
    blurb: 'The headline takes the entire first viewport. The article is a reward for scrolling.',
    move: 'A magazine cover within the article itself.',
    experimental: true,
    whyDumb: 'Above-the-fold rule says "show the goods immediately." We hide them.',
    Component: TitleFirst,
  },
  {
    id: 'caption-only',
    name: 'Caption-only',
    blurb: 'Five photographs, five sentences. No body prose. The reader assembles the story.',
    move: 'The caption *is* the article.',
    experimental: true,
    whyDumb: 'Most stories don\'t survive removal of their body. SEO is dead. The skimmer gets nothing.',
    Component: CaptionOnly,
  },
  {
    id: 'whisper',
    name: 'Whisper',
    blurb: 'Title enormous. Body in 11px. Lean in to read it.',
    move: 'Hierarchy inverted to violence.',
    experimental: true,
    whyDumb: '11px on mobile fails accessibility, fails older eyes, and fails a phone in sunlight.',
    Component: Whisper,
  },
  {
    id: 'all-pull-quotes',
    name: 'All Pull-quotes',
    blurb: 'Every paragraph is a giant centered italic pull-quote. There is no body type.',
    move: 'Manifesto-shaped article.',
    experimental: true,
    whyDumb: 'Pull-quotes work because they stand against body type. Without contrast, they collapse.',
    Component: AllPullQuotes,
  },
  {
    id: 'inverted-pyramid',
    name: 'Inverted Pyramid',
    blurb: 'First paragraph display-sized. Each subsequent paragraph shrinks. Ends nearly invisible.',
    move: 'A graphic argument that the lede is the article.',
    experimental: true,
    whyDumb: 'A reader who skims to the bottom is punished. Body text exists at one size for reasons.',
    Component: InvertedPyramid,
  },
  {
    id: 'index',
    name: 'Index',
    blurb: 'The article rendered as the back-of-book index. A-Z concordance with page pointers.',
    move: 'Imply the world by listing its furniture.',
    experimental: true,
    whyDumb: 'Nobody reads an index for fun. It is a navigation aid for a book that does not exist here.',
    Component: Index,
  },
  {
    id: 'reverse-vertical',
    name: 'Vertical Title',
    blurb: 'The headline runs sideways down the spine of the page; body in a narrow column to its right.',
    move: 'The title becomes a tactile object.',
    experimental: true,
    whyDumb: 'The body column is too narrow for a comfortable measure, and screen readers will spell out the title letter-by-letter.',
    Component: VerticalTitle,
  },
  {
    id: 'erasure',
    name: 'Erasure',
    blurb: '~80% of the body is redacted to ink-black bars. An erasure poem of the original article.',
    move: 'Negative space carries the meaning.',
    experimental: true,
    whyDumb: 'An article with most of its words redacted is no longer an article. Accessibility is dead.',
    Component: Erasure,
  },
  {
    id: 'receipt',
    name: 'Receipt',
    blurb: 'The article rendered as a thermal receipt. Monospace, dotted lines, "TOTAL: one (1) article".',
    move: 'The form is the joke.',
    experimental: true,
    whyDumb: 'Monospace at body length is exhausting; Caslon was the promise we made the reader.',
    Component: Receipt,
  },
  {
    id: 'ransom',
    name: 'Ransom note',
    blurb: 'Every word in the body is a different size, weight, font, color, and rotation.',
    move: 'Hierarchy destroyed on purpose.',
    experimental: true,
    whyDumb: 'It is genuinely unreadable. Every typography teacher in the world would mark it failed.',
    Component: Ransom,
  },
]
