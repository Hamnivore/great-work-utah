import { Link } from 'react-router-dom'
import { AskBar } from '../AskBar'
import { ISSUE } from './_shared'

/**
 * THE QUESTION CLOUD  (trash heap)
 * The home is one enormous Ask bar floating in the middle of the page,
 * surrounded by italic questions arranged like a tag cloud. There is
 * no directory, no contents page, no list of entries. The reader's
 * only job is to ask something — anything — and the wiki writes back.
 *
 * Why it's dumb:
 * - The two purposes of the home are "get hooked on content" AND
 *   "let people search." This nukes the first one. A first-time
 *   visitor sees no actual content, so they have no reason to trust
 *   that the wiki has anything in it.
 * - "What kind of content does this thing have?" is unanswerable
 *   without going somewhere else first.
 * - Tag clouds are widely considered a UX dead-end.
 *
 * Why it might be great:
 * - It is the most honest expression of "Ask is the primary interface."
 *   Everything else on the home is, in theory, a distraction from it.
 * - The questions themselves leak content — read 30 italic questions
 *   and you already know what kind of place this is.
 */

interface Q {
  text: string
  /** Roughly proportional to type size — bigger = more inviting. */
  weight: 1 | 2 | 3 | 4
  /** Hand-tuned tilt, just enough to feel scrap-bookish. */
  tilt: number
}

const Q_BANK: Q[] = [
  { text: "What's the next Recursion?", weight: 4, tilt: -1.5 },
  { text: "Senior engineers who'd join a hard-tech team in Utah", weight: 3, tilt: 1 },
  { text: 'Fractional CFOs available right now', weight: 2, tilt: -0.5 },
  { text: "Who's making things in the desert?", weight: 3, tilt: 0.8 },
  { text: 'Investors who back deep tech in Utah', weight: 2, tilt: -0.6 },
  { text: 'Geothermal, but explain it like I\'m new', weight: 3, tilt: 1.4 },
  { text: 'What was Utah doing in 1969 that mattered?', weight: 4, tilt: -1 },
  { text: "Who's raised their hand this week?", weight: 2, tilt: 0.4 },
  { text: 'I\'m a chemist. Where could I land softly?', weight: 3, tilt: -0.8 },
  { text: "Utah's most surprising scientific moments", weight: 2, tilt: 0.6 },
  { text: "Where would Capecchi work today?", weight: 2, tilt: 1.2 },
  { text: 'Show me a labyrinth I could fall into for an afternoon', weight: 3, tilt: -1.4 },
  { text: 'What would Stewart Brand build here?', weight: 2, tilt: 0.7 },
  { text: 'Which BCI lab takes new postdocs?', weight: 1, tilt: -0.3 },
  { text: 'Who else is doing chronic electrode stability?', weight: 1, tilt: 0.5 },
  { text: 'A friend in oncology in Salt Lake', weight: 1, tilt: -0.4 },
  { text: 'Best Utah rocket-engine paper of the last decade', weight: 1, tilt: 0.9 },
  { text: 'Has anyone tried this in Provo?', weight: 1, tilt: -1 },
  { text: 'Three places worth a Saturday drive', weight: 2, tilt: 0.5 },
  { text: 'Who funds the unfundable in Utah?', weight: 3, tilt: -1.1 },
]

export function QuestionCloudHome() {
  return (
    <div className="min-h-screen bg-paper text-ink editorial flex flex-col">
      {/* Slim masthead, the only chrome */}
      <header className="max-w-3xl mx-auto w-full px-5 sm:px-8 pt-5 sm:pt-7 flex items-baseline justify-between gap-4">
        <Link to="/" className="block">
          <p className="font-display italic text-twilight text-xl leading-none">
            Great Work
          </p>
          <p className="smallcaps mt-1">Utah, USA</p>
        </Link>
        <p className="smallcaps text-right">
          {ISSUE.season}
        </p>
      </header>

      {/* THE STAGE */}
      <section className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="relative w-full max-w-4xl">
          {/* Floating questions — absolutely positioned in a soft halo */}
          <div className="relative h-[420px] sm:h-[540px] hidden md:block">
            {Q_BANK.map((q, i) => (
              <FloatingQuestion key={q.text} q={q} index={i} total={Q_BANK.length} />
            ))}
          </div>

          {/* Centered ask block — sits over the cloud on desktop, full bleed on mobile */}
          <div className="md:absolute md:inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto bg-paper/95 backdrop-blur-sm rounded-md border border-sandstone/40 shadow-[0_24px_60px_-24px_rgba(42,31,24,0.35)] px-5 sm:px-8 py-6 sm:py-8 max-w-xl w-full text-center">
              <p className="smallcaps mb-3">Ask the guide</p>
              <p
                className="font-display italic text-twilight leading-[0.95]"
                style={{ fontSize: 'clamp(1.8rem, 7vw, 2.6rem)' }}
              >
                Anything you want to know about Utah&rsquo;s great work.
              </p>
              <div className="mt-5">
                <AskBar autoFocus />
              </div>
              <p className="font-serif italic text-ink-soft text-sm mt-4 leading-snug">
                The guide writes you back an article.
                <br />
                Browser-back is the conversation history.
              </p>
            </div>
          </div>

          {/* Mobile fallback — stacked questions below the ask */}
          <ul className="md:hidden mt-8 space-y-2 text-center">
            {Q_BANK.slice(0, 8).map((q) => (
              <li key={q.text}>
                <a
                  href={`/ask?q=${encodeURIComponent(q.text)}`}
                  className="font-serif italic text-twilight underline decoration-twilight/30 underline-offset-3 hover:text-orange transition-colors"
                >
                  {q.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tiny tail — the ONE concession */}
      <footer className="max-w-3xl mx-auto w-full px-5 sm:px-8 py-8 text-center">
        <p className="smallcaps">
          <Link to="/directory" className="hover:text-twilight">
            Or browse the 251 entries →
          </Link>
        </p>
      </footer>
    </div>
  )
}

function FloatingQuestion({ q, index, total }: { q: Q; index: number; total: number }) {
  // Soft Fermat-like distribution around an off-center anchor, then tweaked by hand-friendly seeds.
  const angle = (index / total) * Math.PI * 2 + 0.15 * (index % 3)
  const radius = 38 + ((index * 13) % 18) // % units
  const cx = 50 + Math.cos(angle) * radius
  const cy = 50 + Math.sin(angle) * radius * 0.62
  const sizeClass =
    q.weight === 4
      ? 'text-2xl'
      : q.weight === 3
        ? 'text-xl'
        : q.weight === 2
          ? 'text-base'
          : 'text-sm'

  return (
    <a
      href={`/ask?q=${encodeURIComponent(q.text)}`}
      className={`absolute font-serif italic text-twilight/70 hover:text-orange transition-colors leading-snug ${sizeClass}`}
      style={{
        left: `${cx}%`,
        top: `${cy}%`,
        transform: `translate(-50%, -50%) rotate(${q.tilt}deg)`,
        maxWidth: '14rem',
        textAlign: 'center',
      }}
    >
      {q.text}
    </a>
  )
}
