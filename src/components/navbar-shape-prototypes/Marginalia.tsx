import { BREADCRUMB } from '../navbar-prototypes/_shared'
import { Sample } from './_sample'

/**
 * VARIANT F — Marginalia.
 *
 * The most editorial / least UI-feeling option. The top of the page barely
 * has a navbar at all \u2014 just a small italic \u201cGreat Work\u201d wordmark and an
 * \u201cAsk\u201d link tracked in smallcaps at the right. The breadcrumb \u201cyou are
 * here\u201d marker doesn\u2019t live in any bar; it lives as marginalia in the left
 * gutter, vertically aligned with the article title, the way a printed
 * book\u2019s running head sits in the outer margin.
 *
 * The whole top of the page becomes article. The navigation becomes
 * decoration.
 */
export function Marginalia() {
  return (
    <div className="bg-paper">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-4 pb-2 flex items-center justify-between">
        <p className="font-display italic text-twilight text-sm leading-none">Great Work</p>
        <button
          type="button"
          className="smallcaps !text-[0.6rem] !tracking-[0.22em] hover:text-twilight transition-colors"
        >
          Ask the guide
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 grid sm:grid-cols-[8rem_1fr] gap-x-6 pt-8">
        <nav aria-label="Breadcrumb" className="text-right hidden sm:block pt-3">
          <ul className="space-y-1.5">
            {BREADCRUMB.map((s) => (
              <li key={s.key}>
                <span className="smallcaps !text-[0.6rem] !tracking-[0.22em]">{s.label}</span>
              </li>
            ))}
          </ul>
          <hr className="border-sandstone/60 mt-3 ml-auto w-12" />
        </nav>
        <Sample bare />
      </div>
    </div>
  )
}
