import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'

/**
 * /how-it-works — a note from the editors on what this thing actually is.
 *
 * Two audiences, one piece:
 *   1. A reader who wonders why this isn't LinkedIn or a state portal.
 *   2. A judge reading the Nucleus brief's "AI Approach Explanation"
 *      deliverable, who wants to see what's under the hood without
 *      having to grep our code.
 *
 * Same shape as /tier-system: a smallcaps kicker, a display H1, a
 * Caslon-italic deck, and prose-editorial body in the standard layout.
 */
export function HowItWorksPage() {
  return (
    <Layout backLabel="Back" backTo="/">
      <article className="prose-editorial">
        <p className="smallcaps">A note from the editors</p>
        <h1 className="font-display text-4xl sm:text-5xl text-ink mt-2 mb-3 leading-tight">
          How the guide works
        </h1>
        <p className="font-display italic text-2xl text-twilight leading-snug mb-8">
          A wiki you can ask &mdash; written by an agent who reads it back to you.
        </p>

        <p>
          Most ecosystem tools are databases pretending to be guides. You fill out
          a form, the form lands in a CRM, and a human eventually has to read it
          and decide who to introduce. The matching is good when the human is
          good and slow when the human is busy.
        </p>

        <p>
          Great Work inverts that. The thing in the middle isn&rsquo;t a database
          or a CRM &mdash; it&rsquo;s a <em>wiki</em>. A small, opinionated, hand-readable
          collection of markdown pages about Utah&rsquo;s ventures, people, helpers,
          and programs. An agent reads the wiki when you ask it a question, and
          writes back to the wiki when it learns something worth keeping. The
          guide compounds.
        </p>

        <h2>The wiki is the product</h2>

        <p>
          Everything you see on this site is rendered from one folder of plain
          markdown files. There is no admin UI, no schema migration, no CMS.
          Adding a new program or correcting a fact is a text edit &mdash; the kind a
          program officer or comms staffer can do without a developer.
        </p>

        <p>The folders are deliberately few:</p>

        <ul>
          <li>
            <strong>Ventures</strong> &mdash; Utah companies, labs, spinouts, and
            historically important work.{' '}
            <em>
              <Link to="/entry/places_you_can_work/recursion-pharmaceuticals">
                Recursion
              </Link>
              ,{' '}
              <Link to="/entry/places_you_can_work/fervo-energy">Fervo</Link>,{' '}
              <Link to="/entry/places_you_can_work/blackrock-neurotech">
                Blackrock Neurotech
              </Link>
              , and a dozen more.
            </em>
          </li>
          <li>
            <strong>People</strong> &mdash; founders, operators, researchers,
            students. Synthetic during the demo, real once readers raise their
            hands.
          </li>
          <li>
            <strong>Helpers</strong> &mdash; advisors, mentors, fractional execs,
            attorneys, accountants. First-class pages, not buried in a
            directory.
          </li>
          <li>
            <strong>Resources</strong> &mdash; programs, funds, accelerators, and
            state services. Nucleus Fund, Nucleus Grow, MarketEdge, UTIF, the
            Utah SBDC, and the rest of the GOEO catalog.
          </li>
          <li>
            <strong>Guides</strong> &mdash; the judgment layer. Contextual rankings,
            playbooks, and journey pages with their criteria visible.
          </li>
          <li>
            <strong>Matches</strong> &mdash; specific &ldquo;these people should
            talk&rdquo; artifacts.
          </li>
          <li>
            <strong>Sources</strong> &mdash; the citation layer. Every claim links
            back to a source page so the wiki is auditable.
          </li>
          <li>
            <strong>Answers</strong> &mdash; saved Ask articles that earned a
            permanent home.
          </li>
        </ul>

        <p>
          Facts and judgments live apart on purpose. The fact pages
          (ventures/people/helpers/resources) try to be calm and accurate.
          The judgment pages (guides/matches) are allowed to take a position,
          but only by citing the fact pages underneath them. That separation
          is what makes the recommendations argue-able instead of
          mysterious.
        </p>

        <h2>Asking the guide</h2>

        <p>
          The search bar at the top of every page isn&rsquo;t a search box.
          It&rsquo;s a request to the editor. You ask a question; the guide
          writes you back an article.
        </p>

        <ol className="list-decimal pl-6 space-y-2 my-6 [&_li]:font-serif [&_li]:text-ink [&_li]:leading-relaxed">
          <li>
            <span className="smallcaps mr-2 not-italic">Step one</span>
            The agent reads your question and writes a sentence or two of
            reasoning &mdash; you can watch it think in the panel above the
            article.
          </li>
          <li>
            <span className="smallcaps mr-2 not-italic">Step two</span>
            It searches the wiki by keyword, opens the most relevant pages,
            and reads them in full.
          </li>
          <li>
            <span className="smallcaps mr-2 not-italic">Step three</span>
            It drafts an answer with inline citations to the entries it
            used. You see tokens land as the article is written.
          </li>
          <li>
            <span className="smallcaps mr-2 not-italic">Step four</span>
            If the question revealed a gap &mdash; a venture, person, or topic
            that deserves a page but doesn&rsquo;t have one &mdash; the agent can
            file a new markdown page back to the wiki, with a real git commit
            attached. Tomorrow&rsquo;s reader gets a sharper guide than
            today&rsquo;s.
          </li>
        </ol>

        <p>
          Every article has a URL. You can text a friend the answer to{' '}
          <em>&ldquo;who in Utah is working on AI for biology?&rdquo;</em> the
          same way you&rsquo;d text them a magazine piece. Browser back is
          your conversation history; there is no chat thread to scroll up
          through.
        </p>

        <h2>Matching, in two passes</h2>

        <p>
          When a reader writes a short note in the{' '}
          <em>What are you looking for?</em> block on the home page, the
          guide answers in two stages.
        </p>

        <p>
          The first pass is local and instant. We tokenize the note,
          score every venture against it, and surface the three closest
          leads in under a hundred milliseconds. It&rsquo;s a sharper-than-
          keyword pass &mdash; weighted toward title, domain, and the wiki&rsquo;s
          tier marks &mdash; but it&rsquo;s still a first guess.
        </p>

        <p>
          The second pass is the agent. It takes the same note, plus the
          first pass&rsquo;s leads as starting points, and writes a short match
          brief. The brief follows the same structure every match page in
          the wiki uses, because that&rsquo;s the structure we believe an
          honest recommendation should have:
        </p>

        <ul>
          <li>
            <strong>What each side appears to need or offer.</strong> Stated
            specifically, with public evidence.
          </li>
          <li>
            <strong>Why the match makes sense.</strong> Not &ldquo;both are in
            tech&rdquo; &mdash; the actual non-obvious reason.
          </li>
          <li>
            <strong>Risks and unknowns.</strong> Where the match could fall
            apart. Said out loud.
          </li>
          <li>
            <strong>Suggested next step.</strong> A small, specific, low-cost
            thing the reader could do this week.
          </li>
        </ul>

        <p>
          You can read three end-to-end examples in the wiki&rsquo;s match
          set: an{' '}
          <em>
            executive paired with{' '}
            <Link to="/entry/places_you_can_work/fortem-technologies">
              Fortem Technologies
            </Link>
          </em>{' '}
          on counter-UAS commercialization, an{' '}
          <em>
            operator paired with{' '}
            <Link to="/entry/places_you_can_work/fervo-energy">
              Fervo Energy
            </Link>
          </em>{' '}
          on enhanced geothermal field execution, and a{' '}
          <em>student paired with a synthetic university spinout</em> for the
          research-commercialization case. Same structure each time. That
          structure is the product.
        </p>

        <h2>Built for Utah specifically</h2>

        <p>
          The wiki ships pre-loaded with real Utah work. Recursion, Fervo,
          Hexcel, Fortem, Merit Medical, FamilySearch, Sundance, Space
          Dynamics Laboratory, Blackrock Neurotech, Zanskar, the Telescope
          Array up at Delta &mdash; the categories the home page browses by are
          the actual deep-tech profile of this state, not a generic
          taxonomy. A guide that answered every question with &ldquo;you
          should look at the SaaS scene&rdquo; would be the wrong guide.
        </p>

        <p>
          Resource routing is similarly opinionated. A first-time founder
          asking about commercialization gets routed to{' '}
          <em>Nucleus MarketEdge</em>; a Utah technical company chasing
          SBIR/STTR gets <em>Nucleus Grow</em> and{' '}
          <em>UTIF</em>; an early-stage deep-tech venture ready for equity
          gets <em>Nucleus Fund</em>; a small business owner in Washington
          County gets the <em>Utah SBDC</em> and the{' '}
          <em>Women&rsquo;s Business Center</em>. The same explanation
          template that drives talent matches drives program routing &mdash;
          we&rsquo;re trying to argue why the door is the right door,
          not just point at it.
        </p>

        <h2>The AI approach, concretely</h2>

        <p>
          For judges and the curious, the moving parts:
        </p>

        <ul>
          <li>
            <strong>Storage:</strong> a markdown wiki in a Git repository.
            Humans and the agent edit the same files. Every change is a
            commit; every page is a permalink.
          </li>
          <li>
            <strong>Model:</strong> DeepSeek with{' '}
            <code>reasoning_content</code> streaming, so the chain-of-thought
            can be surfaced in the UI as the agent thinks. No prompt magic
            tricks &mdash; the wiki is the context.
          </li>
          <li>
            <strong>Tools:</strong> three of them. <code>search_wiki</code>{' '}
            grep&rsquo;s the markdown, <code>read_file</code> opens an entry
            in full, and <code>write_file</code> commits a new or updated
            page back to GitHub. The agent is allowed to learn.
          </li>
          <li>
            <strong>Realtime:</strong> Trigger.dev streams reasoning tokens
            and response tokens to the browser as the agent works, so
            you&rsquo;re reading the article over the editor&rsquo;s shoulder.
          </li>
          <li>
            <strong>Index:</strong> a static JSON bundle for the directory
            and the search panel&rsquo;s instant pass; the agent uses live
            grep over markdown for the slower, smarter pass.
          </li>
          <li>
            <strong>Citations:</strong> every recommendation links back to
            a wiki entry or a primary source page. No claims float free.
          </li>
        </ul>

        <h2>Updatable without a deploy</h2>

        <p>
          Because the wiki is markdown in Git, a Nucleus program officer
          who wants to add a new program or correct a fact has three good
          paths and zero bad ones:
        </p>

        <ul>
          <li>
            <em>Edit on GitHub.com.</em> Find the page, click the pencil
            icon, change the words, save. The site updates on the next
            push.
          </li>
          <li>
            <em>Submit prose, let the agent format it.</em> Paste a draft
            into the agent and ask it to file a new entry. The agent
            normalizes it into the wiki schema and commits it. Review the
            PR; merge or amend.
          </li>
          <li>
            <em>Edit any text editor.</em> Clone the repo, open the file,
            commit. The site is markdown. Markdown is forever.
          </li>
        </ul>

        <p>
          No redeploy is required for content. The schema is enforced by
          taste and a couple of lint checks &mdash; not by a database.
        </p>

        <h2>What we deliberately did not build</h2>

        <p>
          A few things are conspicuously missing, and that&rsquo;s on
          purpose:
        </p>

        <ul>
          <li>
            <strong>No CRM plumbing.</strong> Nucleus told us tight
            Squarespace + Affinity integration was a nice-to-have, not a
            requirement, and that they&rsquo;d rather see us solve the
            matching problem. We took them at their word.
          </li>
          <li>
            <strong>No accounts or chat threads.</strong> The wiki is the
            persistence layer. A reader&rsquo;s &ldquo;raised hand&rdquo;
            becomes a person page; a saved Ask article becomes an answer
            page. There&rsquo;s no separate userland to maintain.
          </li>
          <li>
            <strong>No universal score on every entity.</strong> Tier
            marks help readers triage breadth, but the real opinions live
            inside guides and match pages where the criteria are visible.
            We don&rsquo;t want a one-number verdict on a real company any
            more than you&rsquo;d want a Yelp star on a friend.
          </li>
          <li>
            <strong>No fully automated matching.</strong> The agent
            proposes; a human still introduces. We think that&rsquo;s the
            right division of labor for connections that involve real
            careers and real reputations.
          </li>
        </ul>

        <h2>Open questions</h2>

        <p>
          Things we&rsquo;re still arguing about &mdash; and that judges,
          founders, and Nucleus staff would help us settle:
        </p>

        <ul>
          <li>
            How much of the agent&rsquo;s reasoning should be visible to
            the reader by default? Streaming the chain-of-thought builds
            trust; it can also overwhelm a busy founder.
          </li>
          <li>
            When a match brief gets shown to both sides, which parts
            should each see? The risk-and-unknown section is honest and
            occasionally awkward.
          </li>
          <li>
            How fast is &ldquo;fast enough&rdquo; for the deep agent pass?
            The instant local pass is sub-100ms; the agent pass takes
            tens of seconds. We think the streaming UX earns the wait,
            but only just.
          </li>
        </ul>

        <p className="ornament">&mdash; &#x2766; &mdash;</p>

        <p className="font-serif italic text-ink-soft text-center">
          If you find a fact that&rsquo;s wrong, or a person we should
          know, or a program we&rsquo;ve missed &mdash;{' '}
          <Link to="/raise-hand" className="text-twilight">
            tell the guide
          </Link>
          .
        </p>
      </article>
    </Layout>
  )
}
