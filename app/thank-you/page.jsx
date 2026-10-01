import Link from 'next/link';
import { Ico } from '@/components/Icons';
import { Gap } from '@/components/Price';
import UtilityFooter from '@/components/UtilityFooter';
import ConfirmationStep from '@/components/ConfirmationStep';
import { CONFIG, CALL_NAME } from '@/lib/config';

/* The tab title has to say what the tab IS. "Booking Confirmed" contradicted
   the screen the moment this page became a confirmation STEP, and it is the
   one label she sees when hunting through tabs to come back and finish. */
export const metadata = {
  title: `WAIT! Confirm Your ${CALL_NAME} · Reset by Shruti Solanki`,
  robots: { index: false, follow: false },
};

/* ============================================================================
   PAGE 4 · THANK-YOU
   STRUCTURE SOURCE: thefoodfreedomco.com/thank-you (live).
   Styles + full anatomy rationale: app/sections/p03-thankyou.css.

   FFC's element order, matched exactly:
     header logo
     → "BOOKING CONFIRMED" pill
     → one serif headline, the coach's NAME set italic-accent
     → card · "What We Will Cover On The Call"  (ruled tick list)
     → card · "Before You Show Up"               (ruled tick list)
     → minimal footer

   FFC ships this DARK; per the client's decision + SESSION-HANDOFF §3B this
   matches the STRUCTURE and HIERARCHY on our light surface in the brand hue.
   No video, no appointment card, no policy block, no CTA — FFC's thank-you
   sells nothing and asks for nothing. The only KPI here is show-up.
   ========================================================================== */

/* FFC "What We Will Cover on the Call" — five points, adapted to the overlap
   (PCOS · thyroid · insulin resistance). Every line maps to one of FFC's, so
   nothing here is invented; the last keeps our contractual refund posture. */
const COVER = [
  'What is actually happening underneath (whether it is PCOS, thyroid, insulin resistance, or all three at once) and why your body stopped responding to the things that used to work.',
  'Why the previous approaches did not last, and what that tells us about what your body actually needs right now.',
  'How your weight, your markers and your week are connected, and which one we start with.',
  'What it would realistically take to shift what you are experiencing, including the parts that take months rather than weeks.',
  'Whether Reset is the right fit for where you are right now. Shruti will tell you directly either way, with no pressure to enrol if it is not.',
];

/* FFC "Before You Show Up" — three rules, then the inbox/link note last. The
   note carries a VERIFY chip until QT.2 confirms what actually gets sent. */
const SHOW = [
  `Please be on time. We have ${CONFIG.CALL_MINUTES} minutes and Shruti wants every one of them to count for you.`,
  'Find a quiet space where you can speak freely. Not between meetings, not while driving.',
  'Think about what you most want to change, and how long you have been carrying it. The more honest you are, the more useful this is.',
  null, // sentinel → the inbox note, which carries markup + a Gap chip
];

export default function ThankYouPage() {
  return (
    <div className="typg">
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      {/* <header className="ty-topbar">
        <div className="wrap">
          <Link href="/" className="ty-mark" aria-label="Reset by Shruti Solanki, home">
            Reset
          </Link>
        </div>
      </header> */}

      {/* ── HERO · the confirmation STEP, not a confirmation ──────────────
          Replaces the former "Booking Confirmed / Is Locked In" hero. The slot
          being picked is step one; the call is only confirmed once she messages
          on WhatsApp, which is what this screen exists to get done. */}
      <ConfirmationStep />

      {/* ── BODY · the two ruled tick-list cards ─────────────────────────── */}
      <section className="ty-body">
        <div className="wrap ty-max">
          {/* Card 1 · what the call covers — FFC leads with exactly this. */}
          <div className="ty-card reveal">
            <h2>What We Will Cover On The Call</h2>
            <ul className="ty-list">
              {COVER.map((c) => (
                <li key={c}>
                  <span className="ty-tick" aria-hidden="true"><Ico id="check" className="" /></span>
                  <p>{c}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2 · before you show up — three rules, then the inbox note. */}
          <div className="ty-card reveal" data-d="1">
            <h2>Before You Show Up</h2>
            <ul className="ty-list">
              {SHOW.map((s, i) => (
                <li key={i}>
                  <span className="ty-tick" aria-hidden="true"><Ico id="check" className="" /></span>
                  {s ? (
                    <p>{s}</p>
                  ) : (
                    <p>
                      Your call link and details are on their way to your email. Check your spam
                      folder if you do not see it.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="ty-foot">
        <div className="wrap">
          <UtilityFooter />
        </div>
      </footer>
    </div>
  );
}
