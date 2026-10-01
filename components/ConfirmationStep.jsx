import { Ico } from '@/components/Icons';
import { CONFIG, CALL_NAME } from '@/lib/config';

/* ============================================================================
   CONFIRMATION STEP · post-booking bridge
   ----------------------------------------------------------------------------
   The screen between "slot picked" and "call actually confirmed": it tells the
   visitor the booking is not finished and pushes the one action that finishes
   it, a WhatsApp message.

   THEME. Every value here resolves to a token the landing page already
   defines. The brief named --font-primary / --bg-primary / --text-primary /
   --color-accent; none of those exist in this project, so they map onto the
   real ones (--fh/--fb, --bg, --ink/--ink-soft, --brand). Styles live in
   app/globals.css under the page's own .ty- prefix rather than in a sibling
   ConfirmationStep.css, because this codebase ships exactly one stylesheet and
   a lone CSS file beside a component would be the only one of its kind.

   THE NUMBER IS NEVER HARDCODED. It comes from NEXT_PUBLIC_WHATSAPP_NUMBER via
   CONFIG.WHATSAPP_NUMBER, which strips every non-digit — wa.me and the api
   endpoint both silently fail on a leading "+" or a space. When the var is
   unset the CTA renders inert rather than linking nowhere, matching how
   /book-a-call already guards the same value.
   ========================================================================== */
export default function ConfirmationStep({
  /* shruti-2 over shruti-1 deliberately: shruti-1 is a wide shot and her face
     lands small once the frame is cropped to a circle. Overridable per use. */
  avatar = '/img/coach/shruti-2.jpg',
  sessionName = CALL_NAME,
}) {
  const phone = CONFIG.WHATSAPP_NUMBER;
  const waText = `Hey, I've booked a call. What's the next step to confirm my ${sessionName}?`;
  const waHref = phone
    ? `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(waText)}&type=phone_number&app_absent=0`
    : undefined;

  /* One node, rendered twice: inline in the flow and again in the mobile
     sticky bar. Keeping the markup in a local avoids the two drifting apart. */
  const cta = (
    <a
      className="ty-cs-cta"
      href={waHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={waHref ? undefined : true}
    >
      <Ico id="whatsapp" className="ico ty-cs-cta-ico" />
      <span>Click Here</span>
    </a>
  );

  return (
    <section className="ty-cs">
      <div className="wrap ty-cs-inner">
        <h1 className="ty-cs-h1">
          <span className="ty-cs-alert">WAIT!</span> Your {sessionName} Has Not Been Confirmed Yet…
        </h1>

        {/* Circular badge on the brand ring, echoing the coach plate on the
            landing page. eager + fetchPriority: it is the only image above the
            fold here, so lazy-loading it would leave a hole on first paint. */}
        <div className="ty-cs-avatar">
          <img src={avatar} alt="Shruti Solanki" loading="eager" fetchPriority="high" />
        </div>

        <p className="ty-cs-lead">
          You’ve just <strong>completed the first step</strong>.
        </p>
        <p className="ty-cs-lead">
          Connect on WhatsApp to{' '}
          <strong>get the next steps to confirm your {sessionName}</strong>.
        </p>

        <div className="ty-cs-cta-wrap">{cta}</div>
      </div>

      {/* MOBILE STICKY. Deliberately carries no `reveal` class: that system
          starts elements at opacity 0 until JS adds `.in`, which would be a
          visible delay on the one control this page exists to get tapped.
          aria-hidden on desktop is handled by CSS display:none, so the inline
          copy above is the only one in the a11y tree there. */}
      <div className="ty-cs-sticky">
        <div className="ty-cs-sticky-inner">{cta}</div>
      </div>
    </section>
  );
}
