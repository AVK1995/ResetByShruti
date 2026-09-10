/* ============================================================================
   RESET · funnel content
   ----------------------------------------------------------------------------
   STRUCTURE PROVENANCE — this file is shaped to the CONVERGENT hierarchy of the
   two live reference funnels (teamfitarjun.com + thefoodfreedomco.com), read
   page by page on 2026-07-23, not to a summary of them.

   `bold:` arrays mark the clauses that carry mixed-weight emphasis, because
   both references write these as ONE paragraph with a bolded clause rather
   than a bold lead + separate body.

   PROVENANCE RULE unchanged: every number, name and condition comes from the
   strategy document or the transformation stories. `gap:` marks a fact we are
   not allowed to invent; it renders as a visible chip mapped to a question in
   QUESTIONS-FOR-CLIENT.txt.
   ========================================================================== */

/* ---- HERO ---------------------------------------------------------------
   Both references put the condition list INSIDE the hero, as the tail of the
   reach sentence — not as a separate section further down. */
export const CONDITIONS = [
  'Thyroid',
   'PCOS, Hormonal Acne ',
    'Insulin Resistance',
    'Endometriosis',
    'Gut Issues'

];

/* ---- STAT CARDS ×4 ------------------------------------------------------
   ARJ's cards are three-line: VALUE / LABEL / SUB-LABEL. FFC's count up.
   Both put the entry price in the fourth card — the price framed as a stat,
   not a cost. */
export const STATS = [
  { value: '300+', label: 'Women Coached Globally', sub: null },
  { value: '12wk', label: 'Avg. Transformation Time', sub: null},
  { value: '5.0⭐', label: 'Client Rating', sub: null },
  { value: '₹97', label: 'To Start', sub: null},
];

/* ---- "THIS IS FOR YOU IF" ×5 -------------------------------------------
   Exactly five in both references. Each is a CARD with a circled tick, and
   the copy is one paragraph carrying a bolded clause — the bold moves
   position card to card (start, middle, end), which is what stops five cards
   reading like a template. */
export const FIT_CARDS = [
  [
    { t: 'You have tried every diet, workout or nutrition plan, but your weight just wont budge. ', b: true },
    { t: 'You are tired of putting in the effort without seeing results and wondering if something deeper is stopping your progress.' },
  ],
  [
    { t: 'You are dealing with PCOS, Thyroid or Insulin Resistance, and feel like your body is working against you. ', b: true },
    { t: 'Weight gain, fatigue, sugar cravings, irregular periods or constant bloating have become your new normal.' }
  ],
  [
    { t: 'You are busy balancing work and life, leaving little time to focus on your own health. ', b:true },
    { t: 'You need an approach that fits into your lifestyle, not one that expects you to spend hours meal prepping or living in the gym.' }
  ],
  [
    { t: 'You want to lose weight without giving up roti, rice or the foods you actually enjoy. ', b:true},
    { t: 'You are looking for a sustainable way of eating that works in real life, not another restrictive diet you will eventually quit.'}
  ],
  [
    { t: 'You are done chasing quick fixes and ready to address the real reason your weight isn’t moving. ', b: true },
    { t: 'You want to improve your hormone and metabolic health so your results finally last, instead of starting over every few months.' },
  ],
];

/* ---- §PROOF · video testimonials ---------------------------------------
   Speaker identity UNRESOLVED — the client named Hima, Shirley and Arya but
   did not map them to files, and none appears in the transformation stories.
   Q13.1 / Q13.2. Posters are DERIVED from a seeked #t= frame (C16). */
export const VIDEOS = [
  { id: 'v1', envKey: 'VIDEO_1', name: 'Shirley'},
  { id: 'v2', envKey: 'VIDEO_2', name: 'Hima'},
  { id: 'v3', envKey: 'VIDEO_3', name: 'Arya' },
  { id: 'v4', envKey: 'VIDEO_4', name: 'Ganga' },
  /* Sania is hosted on VIMEO, not on the Spaces CDN like the four above, so it
     renders through an iframe player rather than a <video> element (S04Proof
     branches on the URL). The URL is inline rather than env-gated on purpose:
     the others read from NEXT_PUBLIC_VIDEO_* and simply do not render when the
     var is missing, and an unset var in production would make this card vanish
     silently. envKey is still honoured first, so it can be overridden per
     environment without a code change. */
  { id: 'v5', envKey: 'VIDEO_5', name: 'Sania Kulkarni',
    url: 'https://player.vimeo.com/video/1225511417' },
];

/* ---- §PROOF · written case files ---------------------------------------
   Attribution matches the reference pattern exactly: NAME / AGE · PROFESSION ·
   CITY / ★★★★★ / narrative. Complete for Sneha only — cities are Q13.3. */
export const CASES = [
  {
    name: 'Sneha Vaswendra',
    meta: '26 · CORPORATE LAWYER · FARIDABAD',
    story: 'PCOS and insulin resistance on 12-16 hour days, and three years with other dieticians and coaches that left her heavier than when she started. Working with Shruti she came down from 104 kg to 95 kg, lost six inches off her waist and five off her hips, without a gym and without giving up the food she actually eats.',
    metrics: [
      { v: '104 → 95 kg', k: 'Weight' },
      { v: '46″ → 40″', k: 'Waist'},
      { v: '50″ → 45″', k: 'Hips' },
    ],
  },
  {
    name: 'Simran Jha',
    meta: '25 · CORPORATE COMMUNICATIONS',
    // metaGap: 'city · Q13.3',
    story: 'Hypothyroid with a TSH of 6.51, and years of restrictive dieting that had turned every meal into a negotiation. Over twelve weeks her TSH came down to 1.83, she released 4.75 kg, and she went from XXL to XL, but the change she talks about is that food stopped being something she had to win against.',
    metrics: [
      { v: '6.51 → 1.83', k: 'TSH, in 12 weeks' },
      { v: '93 → 88.75 kg', k: 'Weight'},
      { v: 'XXL → XL', k: 'Clothing' },
    ],
  },
  {
    name: 'Adithi',
    meta: '27 · PhD SCHOLAR',
    // metaGap: 'city · Q13.3',
    story: 'PCOS, insulin resistance, subclinical thyroid and pre-diabetic markers all at once, plus acanthosis nigricans, hair fall and acne, all while running lab work, vivas and submissions. She lost 2.5 kg in the first two weeks, had her HbA1c and fasting glucose back in range by week three, and finished at 56.7 kg.',
    metrics: [
      { v: '62.7 → 56.7 kg', k: 'Weight' },
      { v: 'Week 3', k: 'HbA1c back in range' },
      { v: '2.5 kg', k: 'First two weeks' },
    ],
  },
  {
    name: 'Urvashi',
    meta: '25 · PSYCHOLOGIST',
    // metaGap: 'city · Q13.3',
    story: 'PCOD, irregular cycles and low energy, spending her days looking after everyone else’s wellbeing and none of her own. In eight weeks she released 3.5 kg and an inch and a half, her acne settled, and her cycle became regular for the first time in years, without ever being told to cut out her favourite foods.',
    metrics: [
      { v: '63.2 → 59.6 kg', k: 'Weight' },
      { v: '1.5 inches', k: 'In 8 weeks' },
      { v: 'Regular', k: 'Cycle returned' },
    ],
  },
  {
    name: 'Devika',
    meta: '25',
    // metaGap: 'profession + city · Q13.3',
    story: 'PCOS and thyroid together: the overlap that makes the scale barely move no matter how carefully she eats. Over twelve weeks she released 5.15 kg through gradual, steady change rather than restriction, and came out of it with a routine she could keep running on her own.',
    metrics: [
      { v: '80 → 74.85 kg', k: 'Weight' },
      { v: '5.15 kg', k: 'Total fat loss' },
      { v: '12 weeks', k: 'Duration' },
    ],
  },
];

/* ---- §TRANSFORMATION STRIP ---------------------------------------------
   ARJ runs a before/after gallery here; FFC runs a scrolling NAME · KGS ·
   CONDITION marquee. We have neither a before/after set nor kg-per-client
   data for a marquee, so this slot holds the chat wall — same position in the
   hierarchy, different component. */
export const CHAT_SHOTS = Array.from({ length: 14 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { src: `/img/chat/chat-${n}.jpg`, alt: 'Message from a Reset client' };
});

/* ---- §WHAT'S INCLUDED ---------------------------------------------------
   Both references make the NAMED MECHANISM one of these components rather
   than giving it its own section — ARJ's "Custom Execution Blueprint™" is
   item 02, FFC's "Metabolic Reversal Framework" is item 04. The Overlap Reset
   sits at 02 here, with the four-week sequence inside its body. */
export const INCLUDED = [
  {
    icon: 'sequence',
    title: 'The 4-Phase RESET Method',
    body: 'Rather than throwing you into another restrictive diet, your 12-week journey follows 4 carefully designed phases that reduce bloating, improve metabolism, support hormone health and help you build results that actually last.',
  },
  {
    icon: 'weekly',
    title: 'Personalised Weekly Nutrition Plans',
    body: 'Every recommendation is tailored to your health conditions, lifestyle, food preferences, work schedule and weekly progress, so your plan fits your life instead of forcing your life to fit the plan.',
  },
  {
    icon: 'layers',
    title: 'Condition-Specific Hormone Support',
    body: 'Instead of treating weight as the problem, we focus on improving the underlying hormonal and metabolic imbalances that are often driving PCOS, thyroid issues and insulin resistance.',
  },
  {
    icon: 'support',
    title: 'Weekly Progress Reviews & Coach Support',
    body: 'Every week, your progress is reviewed, your challenges are addressed and your nutrition is refined to keep you moving forward, instead of leaving you stuck on the same plan for months.',
  },
  {
    icon: 'training',
    title: 'Beginner-Friendly Home Workouts',
    body: 'No gym membership required. Follow easy-to-do workouts that support fat loss without overwhelming your schedule.',
  },
  {
    icon: 'progress',
    title: 'Sustainable Weight Loss That Lasts',
    body: 'No cutting out rice, roti or your favourite meals forever. You’ll build habits you can actually maintain for life.',
  },
];

/* ---- §GUARANTEE · what we ask in return --------------------------------- */
export const RECIPROCAL = [
  'You show up on time. The slot is held for you and it is not resold.',
  'You answer honestly, including the parts you would rather skip; the diagnosis is only as good as what you tell her.',
  'You say so on the call if it is not for you, so we can free the slot for someone else.',
];

/* ---- §FAQ ---------------------------------------------------------------
   Both references run the first question open with a "MOST ASKED" pill. The
   last answer is deliberately SLOWER than the reader hopes — that is the
   trust move, and it is not softened. */
export const FAQS = [
  {
    q: 'Is this a sales call?',
    mostAsked: true,
    a: 'No. This is a personalised health assessment. Shruti will understand your current lifestyle, eating habits, work schedule, medical history, symptoms, and the underlying factors that may be keeping your weight stuck, whether that’s PCOS, thyroid, insulin resistance, or a combination of them. The goal of the call is to help you understand why your body isn’t responding and whether RESET by Shruti Solanki is the right next step for you. If Shruti genuinely feels the programme isn’t the right fit, she’ll tell you honestly. No pressure. No unnecessary selling.',
  },
  {
    q: 'I’ve tried so many diets and still can’t lose weight. How is this different?',
    a: 'Most diets focus only on reducing calories. At RESET by Shruti Solanki, we first understand why your weight has become stuck. For many working women, PCOS, thyroid issues, insulin resistance, digestion and inflammation are all connected. Your plan is built around your body’s needs, not a generic calorie target.',
  },
  {
    q: 'I have a full-time job. Will I realistically be able to follow this programme?',
    a: 'Yes. Most of our clients are working professionals with busy schedules. Your nutrition plan is personalised around your work hours, travel, meetings and lifestyle, so it fits into your routine instead of expecting your routine to fit the plan.',
  },
  {
    q: 'Will I have to stop eating rice, roti or my favourite foods?',
    a: 'No. RESET by Shruti Solanki isn’t built around restriction. The goal is to help you lose weight while eating in a way that’s sustainable. Rather than eliminating foods you enjoy, we teach you how to include them in a way that supports your health and long-term results.',
  },
  {
    q: 'What if I’ve already worked with other dietitians or coaches before?',
    a: 'Many women join RESET by Shruti Solanki after trying multiple diets, nutritionists or fitness programmes without lasting success. If your previous plans focused only on the weighing scale and not on what’s driving your symptoms, it’s understandable why the results didn’t last. Our approach is designed to help you build changes you can actually maintain.',
  },
];

/* ---- BOOK-A-CALL · walk-away outcomes ×3 --------------------------------
   Pattern from both references: an honest diagnosis, a NAMED personal
   failure-point, and a 30-day map. */
export const WALKAWAY = [
  {
    title: 'An Honest Read On What Is Actually Keeping Your Weight Stuck',
    body: 'Where it is PCOS, where it is thyroid, where it is insulin, and where it is simply a week that no plan could survive. Named, not guessed.',
  },
  {
    title: 'The Exact Pattern In Your Week That Undoes The Other Six Days',
    body: 'The 4pm biscuit, the skipped lunch that becomes a 10pm dinner, the Sunday that resets everything. The specific point we structure around.',
  },
  {
    title: 'The Next 90 Days, Mapped',
    body: 'What changes first, what waits, and what you should realistically expect the scale to do, including the weeks it will not move at all.',
  },
];
