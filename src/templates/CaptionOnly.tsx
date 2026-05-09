import { LOREM_ARTICLE } from './_content'

/**
 * CAPTION-ONLY
 * The article is told entirely through image captions. There is no body
 * prose. Five photographs in a row, each with a single italic-Caslon
 * sentence. The reader has to assemble the story from the gaps between
 * pictures.
 *
 * Honest assessment of why this is dumb: most stories don't survive
 * removal of their body. SEO is dead. The reader who skims will get
 * nothing. The 70-year-old reader will get nothing.
 *
 * Why we ship it anyway: the actual experience of being at Spiral Jetty
 * is *also* mostly silent — captions can be more honest than prose.
 * Field Mag does this for shorter pieces and it works.
 */
export function CaptionOnly() {
  const a = LOREM_ARTICLE
  const captions = [
    'The drive in is longer than you think. Forty-five minutes of nothing, then a sign that lies about distance.',
    'You arrive when the lake is decided. Today it is decided to keep the work.',
    'The basalt is exactly as warm as you would expect — a body temperature you didn\'t know rocks could hold.',
    'Most of the people who came are just sitting. There is nothing to do at a piece of land art.',
    'On the drive out, every other car you pass is also leaving. Nobody comes here for half a day.',
  ]
  return (
    <article className="font-serif text-ink editorial -mx-5 sm:mx-0">
      <div className="px-5 sm:px-0 mb-6">
        <p className="smallcaps">A story in five captions</p>
        <p className="font-display italic text-twilight text-2xl leading-snug mt-2">
          {a.location}, in pictures.
        </p>
      </div>

      {a.images.slice(0, 5).map((src, i) => (
        <div key={src} className={i === 0 ? '' : 'mt-8'}>
          <img
            src={src}
            alt=""
            className={`w-full object-cover ${
              i === 0
                ? 'aspect-[4/3]'
                : i === 1 || i === 4
                ? 'aspect-square'
                : 'aspect-[3/2]'
            }`}
          />
          <p
            className="font-display italic text-ink leading-snug mt-3 px-5 sm:px-0"
            style={{ fontSize: 'clamp(1.05rem, 4.6vw, 1.35rem)' }}
          >
            {captions[i]}
          </p>
        </div>
      ))}

      <div className="px-5 sm:px-0 mt-10">
        <hr className="border-sandstone/50" />
        <p className="smallcaps mt-3">— That is the article.</p>
      </div>
    </article>
  )
}
