/* ============================================================================
   RESET · commercial + third-party configuration — THE SINGLE SOURCE (C16)
   ----------------------------------------------------------------------------
   Every value is read from process.env.NEXT_PUBLIC_* so a price change is ONE
   edit to .env.local. Nothing here is inlined into a component.

   ⚠ Framework-inlined env vars are baked at build/start, NOT read at runtime.
   Editing .env.local without restarting the dev server leaves the OLD value on
   screen and produces a phantom "the fix didn't work". Restart, then verify in
   the rendered HTML rather than in the source.

   A value that is absent stays absent — components render a visible [gap] chip
   rather than silently dropping the line or inventing a number.
   ========================================================================== */

/* ⚠ EVERY process.env access below MUST be a LITERAL member expression.
   Next substitutes NEXT_PUBLIC_* into the CLIENT bundle by static text
   replacement — `process.env[someVar]` is never replaced, so a dynamic lookup
   silently returns undefined in the browser while still working on the server.
   That asymmetry is invisible until an embed fails to mount. */
const or = (v, fallback = null) => (v === undefined || v === '' ? fallback : v);

export const CONFIG = {
  /* ---- commercial ------------------------------------------------------ */
  ENTRY_PRICE: or(process.env.NEXT_PUBLIC_ENTRY_PRICE_INR, '97'),
  CURRENCY: '₹',
  PROGRAMME_WEEKS: or(process.env.NEXT_PUBLIC_PROGRAMME_WEEKS, '12'),
  PROGRAMME_DAYS: or(process.env.NEXT_PUBLIC_PROGRAMME_DAYS, '90'),
  CALL_MINUTES: or(process.env.NEXT_PUBLIC_CALL_MINUTES, '30'),

  /* ---- checkout offer (client-approved anchor) ------------------------- */
  /* The ₹999 anchor is client-authorised (unlike the landing page, which
     ships flat). Mirrors ARJ's checkout offer block: struck price, % OFF,
     an auto-applied code and a 15-min urgency timer. */
  ORIGINAL_PRICE: or(process.env.NEXT_PUBLIC_OFFER_ORIGINAL_PRICE, '999'),
  OFFER_CODE: or(process.env.NEXT_PUBLIC_OFFER_CODE, 'RESET90'),
  OFFER_WINDOW_MIN: or(process.env.NEXT_PUBLIC_OFFER_WINDOW_MIN, '15'),

  /* ---- third party ----------------------------------------------------- */
  CALENDLY_URL: or(process.env.NEXT_PUBLIC_CALENDLY_URL),
  VSL_VIMEO_URL: or(process.env.NEXT_PUBLIC_VSL_VIMEO_URL),
  RAZORPAY_KEY: or(process.env.NEXT_PUBLIC_RAZORPAY_KEY),

  /* ---- tracking / payments (public IDs only — secrets never live here) ----
     GA4 + Clarity default to the client's live IDs so they work immediately.
     The Meta pixel ID and the Razorpay KEY *id* are public (they ship in the
     browser by design). The CAPI access token, the Razorpay key SECRET, the
     webhook secret and the Pabbly URL are server-only and are read directly
     from process.env inside the API routes — never through CONFIG, so they
     can never be pulled into the client bundle. */
  GA4_ID: or(process.env.NEXT_PUBLIC_GA4_ID, 'G-QB5HH6PFM1'),
  CLARITY_ID: or(process.env.NEXT_PUBLIC_CLARITY_ID, 'xrczml459x'),
  META_PIXEL_ID: or(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  RAZORPAY_KEY_ID: or(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, or(process.env.NEXT_PUBLIC_RAZORPAY_KEY)),

  /* ---- LEGAL -----------------------------------------------------------
     The policy pages are modelled on the two reference funnels (Arjun, Food
     Freedom), which print only a contact email + phone — no registered entity,
     address, GSTIN or named grievance officer. Razorpay verifies the entity
     from the ACCOUNT (bank + KYC), not from text on the page, so we match the
     references and keep the pages free of anything the client cannot supply. */
  POLICY_UPDATED: or(process.env.NEXT_PUBLIC_POLICY_UPDATED, '24 July 2026'),

  /* ---- contact (the embed-failure human fallback, C16) ----------------- */
  /* wa.me accepts DIGITS ONLY — a leading "+" or spaces silently break the
     link. Sanitised here so every call site gets a working URL. */
  WHATSAPP_NUMBER: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').replace(/\D/g, '') || null,
  /* Display form keeps the +, for print on the policy pages. */
  WHATSAPP_DISPLAY: or(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  SUPPORT_EMAIL: or(process.env.NEXT_PUBLIC_SUPPORT_EMAIL),
  INSTAGRAM_URL: or(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  CANONICAL_HOST: or(process.env.NEXT_PUBLIC_CANONICAL_HOST, 'https://resetbyshrutisolanki.in'),

  /* ---- proof numbers — only what the source documents support ---------- */
  CLIENT_COUNT: or(process.env.NEXT_PUBLIC_CLIENT_COUNT, '300+'),
  SUCCESS_RATE: or(process.env.NEXT_PUBLIC_SUCCESS_RATE, '80–85%'),
  YEARS_COACHING: or(process.env.NEXT_PUBLIC_YEARS_COACHING),     // Q2.1
  RATING: or(process.env.NEXT_PUBLIC_RATING),                     // Q2.2
  GEOGRAPHY: or(process.env.NEXT_PUBLIC_GEOGRAPHY),               // Q4.1
  COUNTRIES: or(process.env.NEXT_PUBLIC_COUNTRIES),               // Q8.2
  KG_RANGE: or(process.env.NEXT_PUBLIC_KG_RANGE),                 // Q3.1

  /* ---- urgency --------------------------------------------------------- */
  // A countdown that resets on reload is fake scarcity and is not built.
  // Setting either of these switches the urgency beat on.
  COUNTDOWN_DEADLINE: or(process.env.NEXT_PUBLIC_COUNTDOWN_DEADLINE),   // Q7.1(a)
  MONTHLY_INTAKE_CAP: or(process.env.NEXT_PUBLIC_MONTHLY_INTAKE_CAP),   // Q7.1(b)

  /* ---- video testimonial CDN (see ASSETS.md) --------------------------- */
  VIDEO_1: or(process.env.NEXT_PUBLIC_VIDEO_1),
  VIDEO_2: or(process.env.NEXT_PUBLIC_VIDEO_2),
  VIDEO_3: or(process.env.NEXT_PUBLIC_VIDEO_3),
  VIDEO_4: or(process.env.NEXT_PUBLIC_VIDEO_4),
};

/* The ONE CTA string — NO-BRAINER's letter O, made physical. Repeated verbatim
   at every CTA down the page. Never write variants. */
export const CTA_STRING =
  'Click Here To Get Your Personalised Weight Loss & Hormone Reset Plan';
export const CTA_SHORT = 'Get My Reset Roadmap';   // sticky bar only

/* What this funnel CALLS the call. One constant so the post-booking screens
   cannot drift from the checkout, which bills it as the "1:1 Root Cause
   Clarity Call". The brief for the confirmation step said "Strategy Call" —
   that phrase appears nowhere in this funnel, and its own rule was to follow
   the site's naming, so this is the name that ships. */
export const CALL_NAME = 'Root Cause Clarity Call';

/* Convenience: the price with its symbol, used in a dozen places. */
export const PRICE = `${CONFIG.CURRENCY}${CONFIG.ENTRY_PRICE}`;
