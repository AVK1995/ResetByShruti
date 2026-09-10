/* ============================================================================
   SECTION 04 · Proof
   ----------------------------------------------------------------------------
   OWNED BY: session 4. Styles live in app/sections/s04-proof.css.

   ARJ equivalent: `<section className="af-proof">` in
   _reference/teamfitarjun/app/LandingView.tsx:556-601.
   Anatomy replicated 1:1 —
     .af-eyebrow  →  .proof .eyebrow
     h2 + em      →  .proof h2 + em (brand word + gradient underline bar)
     .af-section-lede → .proof .lede
     .af-tcards   →  .tcards        (grid repeat(2,1fr), gap 24, max 860, auto)
     .af-tcard    →  .tcard         (bg-alt, 1px border, r16, glow ::before, hover lift)
     .af-tphoto   →  .tphoto        (media plate — ours is portrait video, not
                                     their 5:3 before/after split: clients are
                                     private and no before/after set exists)
     .af-tcard-body → .tcard-body   (h4 17 / .meta 13 brand caps / .stars / p 14)
     .af-tcard-more → .tcard-more   (the dashed summary card that closes the grid)
   Stagger is ARJ's: card 1 no delay, then .08 / .16 / .24 … (data-d 1-5).
   ========================================================================== */
import { Ico } from '@/components/Icons';
import { Gap } from '@/components/Price';
import { CONFIG } from '@/lib/config';
import { VIDEOS, CASES } from '@/lib/content';
import { isVimeoUrl, getVimeoMeta } from '@/lib/vimeo';

export default async function S04Proof() {
  /* Resolve every card's source ONCE, server-side.
     Two hosts live side by side here: four clips on the Spaces CDN that play in
     a <video>, and Sania's on Vimeo which cannot. The Vimeo card shows the
     video's own oEmbed thumbnail as a still and hands the real player to the
     lightbox on click, so the grid stays visually uniform without loading a
     third-party iframe on first paint. */
  const cards = await Promise.all(VIDEOS.map(async (v) => {
    const src = (v.envKey && CONFIG[v.envKey]) || v.url || null;
    if (!src) return null;
    if (!isVimeoUrl(src)) return { ...v, src, vimeo: false };
    const meta = await getVimeoMeta(src);
    return {
      ...v,
      src,
      vimeo: true,
      poster: meta?.thumbnail || null,
      /* Passed to the lightbox so the iframe gets the clip's real shape; an
         iframe has no intrinsic size to lay out from. */
      ratio: meta?.width && meta?.height ? `${meta.width}/${meta.height}` : null,
    };
  }));

  return (
<section className="section proof">
  <div className="wrap">

    {/* ARJ: p.af-eyebrow → h2 (mb46) → p.af-section-lede (mb40) → .af-tcards */}
    <p className="eyebrow reveal">Real Working Women · Real Transformations</p>
    <h2 className="reveal" data-d="1">
      Working Women Who Finally Found<br className="br-mob" />{' '}
      Results That <em>Lasted</em>
    </h2>
    <p className="lede reveal" data-d="2">
      These are women like you. Lawyers, psychologists, researchers, corporate
      professionals and entrepreneurs.
    </p>

    {/* ── 13a · video testimonials — ARJ's .af-tcard shell, portrait media ── */}
    <div className="tcards tcards-vid">
      {cards.map((v, i) => {
        if (!v) return null;
        return (
          <button
            className="tcard tcard-vid reveal"
            key={v.id}
            data-video={v.src}
            data-ratio={v.ratio || undefined}
            data-d={i > 0 ? String(i) : undefined}
            type="button"
          >
            {/* display:block is load-bearing — a <span> inside a <button> is
                inline and ignores aspect-ratio, collapsing the plate. */}
            <span className="tphoto">
              {v.vimeo ? (
                /* Vimeo card. A still, not a looping clip: embedding the player
                   here would pull a third-party iframe (and its JS) into first
                   paint for every visitor who never clicks, which is exactly
                   the cost the <video> cards were rewritten to avoid. The
                   thumbnail is the video's own oEmbed frame, so it matches the
                   others rather than looking like a placeholder. */
                v.poster ? (
                  <img className="tposter" src={v.poster} alt="" loading="lazy" decoding="async" />
                ) : (
                  <span className="tposter tposter-blank" aria-hidden="true" />
                )
              ) : (
                /* Muted, inline, looping preview. iOS Safari does NOT paint a
                   seeked-frame poster from preload=metadata (the clip showed
                   blank on mobile), but it DOES render muted-inline video, so
                   FunnelEffects plays each only while it is on screen.

                   ⚠ NO src AND NO autoPlay HERE, deliberately. With both present
                   the browser began streaming all four clips on first paint,
                   regardless of the in-view gating, and `loop` kept them
                   streaming: 66 MB on a mobile trace, which also blew the page
                   out of the back/forward cache ("an active network connection
                   received too much data"). The URL rides on data-src and
                   FunnelEffects promotes it to src the first time the card
                   enters the viewport. */
                <video data-src={v.src} preload="none" muted loop playsInline />
              )}
              <span className="tglass" />
              <span className="tplay"><Ico id="play" /></span>
              <span className="tag ta">Video</span>
            </span>
            <span className="tcard-body">
              <span className="nm">{v.name}</span>
              {/* <span className="meta"><Gap>{v.gap}</Gap></span> */}
            </span>
          </button>
        );
      })}
    </div>

    {/* ── 13b · written case files — a MOVING CAROUSEL (mirrors the message-wall
        marquee: the set is authored twice so the -50% translate loops
        seamlessly; it is real HTML before JS and pauses on hover/focus). ── */}
    <div className="case-row" data-marquee="60" data-dir="ltr" aria-label="Client transformations">
      <div className="case-track">
        <CaseSet />
        <CaseSet clone />
      </div>
    </div>

  </div>
</section>
  );
}

/* One pass of the case cards + the closing count card. Rendered twice; the
   clone is decorative (aria-hidden, not focusable). */
function CaseSet({ clone = false }) {
  return (
    <div className="case-set" aria-hidden={clone || undefined}>
      {CASES.map((c) => (
        <article className="tcard case-card" key={c.name}>
          <div className="tcard-body">
            <h4>{c.name}</h4>
            <div className="meta">{c.meta}{c.metaGap && <> · <Gap>{c.metaGap}</Gap></>}</div>
            <div className="stars" aria-label="5 out of 5">★★★★★</div>
            <p>{c.story}</p>
            <div className="metrics">
              {c.metrics.map((m) => (
                <p className="metric" key={m.k}>
                  <span className="v">{m.v}</span>
                  <span className="k">{m.k} {m.gap && <Gap>{m.gap}</Gap>}</span>
                </p>
              ))}
            </div>
          </div>
        </article>
      ))}

      {/* <article className="tcard tcard-more case-card">
        <div>
          <div className="num">{CONFIG.CLIENT_COUNT}</div>
          <div className="ttl">Women Coached</div>
          <p>A handful of their stories are here. The rest stay private.</p>
        </div>
      </article> */}
    </div>
  );
}
