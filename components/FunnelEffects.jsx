'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CONFIG } from '@/lib/config';
import { captureParams, trackGa4Once, fireMetaAtcOnce } from '@/lib/track';

/* ============================================================================
   All funnel behaviour, mounted ONCE at the page root.

   Why event delegation on the document rather than per-component state:
   every section is a SERVER component, so the markup is real HTML before any
   JS runs. That is what makes the reveals genuinely fail-open (C7) — if this
   file never executes, the page is still complete and every CTA still works.

   Build-time rules honoured here (shape.md · Build-time gotchas):
     · never setState or read a ref's .current during render — everything is
       inside useEffect
     · rAF loops bail on document.hidden so they don't burn cycles or desync
     · the overlay is moved to document.body, never given a bigger z-index
   ========================================================================== */
export default function FunnelEffects() {
  /* ⚠ THE ROUTE KEY IS LOAD-BEARING, do not drop it back to [].
     This component is mounted in the ROOT LAYOUT, so it survives every
     client-side navigation. With an empty dependency array the effect ran once,
     on first load, and never again. Going landing → /checkout → back then left
     the page blank: `.armed` (which is what applies opacity:0) was still on
     <body> from the first run, but the landing page had been unmounted and
     remounted, so its .reveal elements were brand new and carried no `.in`
     class, and the IntersectionObserver was still watching the discarded nodes.
     Re-keying on pathname re-arms and re-observes the DOM that is actually on
     screen after every navigation. */
  const pathname = usePathname();

  /* ---------------------------------------------- LAND AT THE TOP, ALWAYS
     Browsers restore the previous scroll offset on a back navigation, so
     returning from /checkout dropped the visitor beside whichever CTA they had
     clicked, mid-page and with no context. Every arrival on a route starts at
     the hero instead.

     ⚠ DECLARED BEFORE the main effect on purpose. React runs effects in
     declaration order, and the reveal pass below measures
     getBoundingClientRect().top to decide what is already on screen. If the
     scroll were still at the restored offset when it measured, it would mark
     the wrong elements visible and the hero would arrive blank.

     A hash link (#vslframe) is honoured rather than overridden. */
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const cleanups = [];

    /* ------------------------------------------- ATTRIBUTION (LP → thank-you)
       First-touch capture of the utm params, fbclid and gclid into localStorage,
       so checkout can pack them into the Razorpay order.notes and the webhook can
       rebuild the full Pabbly row + high-EMQ `sales` event. Runs on every page;
       only writes on the first page that actually carries params. */
    captureParams();

    /* --------------------------------------- CTA TRACKING (add_to_cart / atc)
       One delegated, capture-phase listener covers EVERY checkout CTA — hero,
       mid-page, pricing, closing, and the sticky bar — including ones injected
       later. Capture phase + optimistic dedup flags mean the signal survives
       the navigation the click triggers. Fires GA4 `add_to_cart` (once) and the
       Meta `atc_event` beacon (once), both independent, both non-blocking. */
    const onCtaClick = (e) => {
      const t = e.target;
      const a = t && t.closest && t.closest('a.cta-big, a.stuck-cta, a[href="/checkout"]');
      if (!a) return;
      trackGa4Once('add_to_cart');
      fireMetaAtcOnce();
    };
    document.addEventListener('click', onCtaClick, true);
    cleanups.push(() => document.removeEventListener('click', onCtaClick, true));

    /* ------------------------------------------------- BOOK_CALL (GA4, iframe)
       Calendly books inside an iframe — no button of ours to attach to — so we
       listen for its postMessage. Origin-checked, fires GA4 `book_call` once on
       a real scheduled event. */
    const onCalendlyMsg = (e) => {
      if (typeof e.origin === 'string' && e.origin.endsWith('calendly.com')
        && e.data && e.data.event === 'calendly.event_scheduled') {
        trackGa4Once('book_call');
      }
    };
    window.addEventListener('message', onCalendlyMsg);
    cleanups.push(() => window.removeEventListener('message', onCalendlyMsg));

    /* ---------------------------------------------------- REVEAL (fail-open)
       The element is VISIBLE from the server. We add `.armed` to <body> only
       now, which is what actually applies opacity:0 — so content can never get
       stuck blank waiting on an observer that may never fire. Revealed on the
       FIRST of: intersection, already-above-fold, or a rAF sweep catching
       content already scrolled past (anchor jumps / restored scroll). */
    const revealEls = $$('.reveal');
    if (revealEls.length && !reduced && 'IntersectionObserver' in window) {
      document.body.classList.add('armed');
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
          });
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.02 }
      );
      revealEls.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.05) el.classList.add('in');
        else io.observe(el);
      });
      requestAnimationFrame(() => {
        revealEls.forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
        });
      });
      cleanups.push(() => { io.disconnect(); document.body.classList.remove('armed'); });
    }

    /* ------------------------------------------------------------- COUNT-UP
       The real value is already in the HTML, so a failed animation leaves the
       correct number on screen — never a zero. */
    const counters = $$('[data-count]');
    if (counters.length && !reduced && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            const el = e.target;
            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            if (Number.isNaN(target)) return;
            const start = performance.now();
            const tick = (now) => {
              if (document.hidden) { el.textContent = target + suffix; return; }
              const p = Math.min((now - start) / 1300, 1);
              el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    /* ------------------------------------------------------------------ FAQ
       R4/C6 — the CSS does the physical part (wash + stripe + indent + icon
       rotate). This only flips the class and ARIA. */
    const onFaq = (e) => {
      const btn = e.target.closest('.qa .q');
      if (!btn) return;
      const qa = btn.closest('.qa');
      const open = qa.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    };
    document.addEventListener('click', onFaq);
    cleanups.push(() => document.removeEventListener('click', onFaq));

    /* -------------------------------------------------- ORDER SUMMARY (R11) */
    /* The summary is only collapsible when it actually ships a toggle bar. The
       reference checkout renders it as an open panel, so on that layout there
       is no bar — guard rather than assume, or the whole effects file throws
       and takes every other behaviour on the page down with it. */
    const summary = $('#summary');
    const summaryBar = summary && $('.summary-bar', summary);
    if (summary && summaryBar) {
      if (window.innerWidth >= 860) summary.classList.add('is-open');
      const onSum = () => {
        const open = summary.classList.toggle('is-open');
        summaryBar.setAttribute('aria-expanded', String(open));
      };
      summaryBar.addEventListener('click', onSum);
      cleanups.push(() => summaryBar.removeEventListener('click', onSum));
    }

    /* -------------------------------------------------------- LIGHTBOX (C15)
       The node is authored in the layout at the page root. We defensively
       re-parent to <body> — an overlay inside a decorated section is trapped
       by that section's stacking context and painted over by page chrome. The
       fix is always to MOVE the node, never to raise the z-index. */
    const ov = $('#lightbox');
    if (ov) {
      if (ov.parentElement !== document.body) document.body.appendChild(ov);
      const slot = $('.overlay-inner', ov);
      let lastFocus = null;

      const close = () => {
        ov.classList.remove('open');
        document.body.classList.remove('locked');
        slot.replaceChildren();
        if (lastFocus) { try { lastFocus.focus(); } catch {} }
      };
      const open = (node) => {
        lastFocus = document.activeElement;
        slot.replaceChildren(node);
        ov.classList.add('open');
        document.body.classList.add('locked');
        $('.overlay-close', ov)?.focus();
      };

      const onOpen = (e) => {
        const vid = e.target.closest('[data-video]');
        if (vid) {
          const url = vid.dataset.video || '';
          /* Two hosts, two players. The Spaces clips are real media files and
             play in a <video>; a Vimeo URL is a PAGE and would fail silently in
             one, so it needs an iframe. dnt is deliberately absent here for the
             same reason it was removed from the hero VSL: it suppresses all of
             Vimeo's watch-time analytics. */
          if (/(^|\.)vimeo\.com\//.test(url)) {
            const wrap = document.createElement('div');
            wrap.className = 'overlay-embed';
            /* An iframe has no intrinsic size, so without the clip's real ratio
               (resolved server-side via oEmbed) it would letterbox. 9/16 is the
               fallback because these testimonials are shot portrait. */
            wrap.style.aspectRatio = vid.dataset.ratio || '9 / 16';
            const f = document.createElement('iframe');
            const sep = url.includes('?') ? '&' : '?';
            f.src = `${url}${sep}autoplay=1&playsinline=1&badge=0&autopause=0&title=0&byline=0&portrait=0`;
            f.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share';
            f.setAttribute('allowfullscreen', '');
            f.referrerPolicy = 'strict-origin-when-cross-origin';
            f.title = vid.querySelector('.nm')?.textContent?.trim() || 'Client testimonial';
            wrap.appendChild(f);
            open(wrap);
            return;
          }
          const v = document.createElement('video');
          v.src = url;
          v.controls = true; v.autoplay = true; v.playsInline = true; v.preload = 'metadata';
          open(v);
          return;
        }
        const img = e.target.closest('[data-img]');
        if (img) {
          const i = document.createElement('img');
          i.src = img.dataset.img;
          i.alt = img.dataset.alt || 'Client message';
          open(i);
        }
      };
      const onKey = (e) => { if (e.key === 'Escape' && ov.classList.contains('open')) close(); };

      document.addEventListener('click', onOpen);
      document.addEventListener('keydown', onKey);
      $('.overlay-close', ov).addEventListener('click', close);
      $('.overlay-bg', ov).addEventListener('click', close);
      cleanups.push(() => {
        document.removeEventListener('click', onOpen);
        document.removeEventListener('keydown', onKey);
      });
    }

    /* ------------------------------------------------------ STICKY CTA (R8)
       Hidden until past the hero; hides again at the final CTA so it never
       duplicates a CTA the user can already see. */
    const bar = $('#stickycta');
    const hero = $('#hero');
    if (bar && hero) {
      document.body.classList.add('has-sticky');   // reserve its height
      const finale = $('#finale');
      let ticking = false;
      const update = () => {
        const pastHero = hero.getBoundingClientRect().bottom < 0;
        const atFinale = finale ? finale.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
        bar.classList.toggle('in', pastHero && !atFinale);
      };
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { update(); ticking = false; });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      update();
      cleanups.push(() => {
        window.removeEventListener('scroll', onScroll);
        document.body.classList.remove('has-sticky');
      });
    }

    /* -------------------------------------------- JOURNEY SPINE (R9 · heavy)
       The rail fill and glowing head track scroll progress; each node ignites
       as the head reaches it. The page's one heavy moment. */
    const spine = $('#spine');
    if (spine) {
      const rows = $$('.stagerow', spine);
      if (reduced) {
        rows.forEach((r) => r.classList.add('lit'));
      } else {
        let ticking = false;
        const update = () => {
          if (document.hidden) return;
          const box = spine.getBoundingClientRect();
          const anchor = window.innerHeight * 0.55;
          const fill = Math.max(0, Math.min(1, (anchor - box.top) / box.height));
          spine.style.setProperty('--fill', fill.toFixed(4));
          spine.style.setProperty('--headop', fill > 0.001 && fill < 0.999 ? '1' : '0');
          rows.forEach((row) => row.classList.toggle('lit', row.getBoundingClientRect().top < anchor + 40));
        };
        const onScroll = () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => { update(); ticking = false; });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', update, { passive: true });
        update();
        cleanups.push(() => {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', update);
        });
      }
    }

    /* -------------------------------------- TESTIMONIAL VIDEO PREVIEWS
       Play each muted testimonial clip only while it is on screen — iOS needs a
       programmatic play() on a muted + inline element to paint a frame (a
       seeked-frame poster stays blank there), and gating by viewport keeps all
       four clips from decoding at once on a phone. */
    const previewVids = $$('.tcard-vid video');
    if (previewVids.length) {
      /* React does NOT reliably set the `muted` DOM PROPERTY from the JSX
         `muted` attribute — only the attribute — so iOS Safari sees the clip
         as unmuted and blocks inline autoplay, leaving the plate blank on
         phones (desktop is lenient, which is why it only shows there). Forcing
         the property (plus the inline-playback attributes) is what makes the
         looping preview appear on mobile too. */
      const prime = (v) => {
        v.muted = true;
        v.defaultMuted = true;
        v.setAttribute('muted', '');
        v.setAttribute('playsinline', '');
        v.setAttribute('webkit-playsinline', '');
      };
      /* The clip has no src until it is first needed (see S04Proof). Promoting
         data-src → src here is what keeps the initial page weight off the
         network; after the first promotion the element keeps its src so
         scrolling back and forth replays from cache rather than refetching. */
      const attach = (v) => {
        if (!v.getAttribute('src') && v.dataset.src) {
          v.setAttribute('src', v.dataset.src);
          v.load();
        }
      };
      const tryPlay = (v) => { prime(v); attach(v); const p = v.play && v.play(); if (p && p.catch) p.catch(() => {}); };
      previewVids.forEach(prime);
      if ('IntersectionObserver' in window) {
        const vio = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) tryPlay(e.target);
            else { try { e.target.pause(); } catch { /* ignore */ } }
          });
        }, { threshold: 0.25 });
        previewVids.forEach((v) => vio.observe(v));
        cleanups.push(() => vio.disconnect());
      } else {
        previewVids.forEach(tryPlay);
      }
    }

    /* ------------------------------------------ VSL · GA4 video_play (C16)
       The Vimeo player is rendered natively in the markup (it shows the
       thumbnail configured in Vimeo + its own play button). We attach the Vimeo
       Player SDK and fire GA4 `video_play` on the player's `play` event —
       trackGa4Once dedupes to once per browser even if the visitor replays.
       player.js loads afterInteractive, so we poll briefly until it's ready.
       Fail-open: if the SDK never loads, the video still plays, we just lose the
       GA4 signal. */
    const frame = $('#vslframe');
    if (frame && CONFIG.VSL_VIMEO_URL) {
      const facade = $('.vsl-facade', frame);
      if (facade) {
        const play = () => {
          const url = CONFIG.VSL_VIMEO_URL;
          const sep = url.includes('?') ? '&' : '?';
          const f = document.createElement('iframe');
          /* ⚠ DO NOT RE-ADD dnt=1.
             That parameter is Vimeo's Do Not Track switch: it blocks the player
             from recording ANY session data, cookies and analytics included.
             With it set, Vimeo still counted the embed loading (26 impressions,
             10 unique) but discarded every play, which is why the dashboard
             read 0 unique viewers and 00:00:00 for both total and average time
             watched. Removing it is what makes watch-time reporting work.

             Consequence to be aware of: the player now sets Vimeo cookies, so
             Vimeo belongs in the third-party list on /privacy. */
          f.src = `${url}${sep}autoplay=1&playsinline=1&badge=0&autopause=0&title=0&byline=0&portrait=0`;
          f.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share';
          f.setAttribute('allowfullscreen', '');
          f.referrerPolicy = 'strict-origin-when-cross-origin';
          f.title = 'Reset by Shruti Solanki: watch the short video';
          frame.appendChild(f);
          facade.remove();               // reveal the player (Vimeo controls now show)
          trackGa4Once('video_play');    // once per browser, on OUR play button
        };
        /* <button> so Enter/Space work natively; just wire the click. */
        facade.addEventListener('click', play);
      }
    }

    /* --------------------------------------------------- CONTINUOUS MARQUEES
       Every [data-marquee] row — the two message-wall rows and the case-file
       row — drifts via a compositor-only CSS translate (see .gal-track /
       .case-track in globals.css). That is what makes it butter-smooth: the
       animation runs off the main thread and never rounds to whole pixels the
       way a scrollLeft loop does. Pause-on-interaction is CSS too (hover +
       focus-within).

       This block does only two things, both progressive enhancements:
         1. copy the row's data-marquee (seconds per set) into --marq-dur;
         2. on touch, toggle .is-held on the track so a finger dragged across a
            chat on a phone pauses that row and lifting the finger resumes it
            (phones have no :hover, so CSS alone can't cover them).
       Fails open: without JS the rows still drift at the 40s/60s fallbacks and
       still pause on hover. */
    $$('[data-marquee]').forEach((row) => {
      const track = row.firstElementChild;
      if (!track) return;

      const durSec = Number(row.getAttribute('data-marquee'));
      if (durSec > 0) track.style.setProperty('--marq-dur', durSec + 's');

      /* Touch-only hold. Pointer events with pointerType 'touch' fire on the
         same gesture that scrolls the page vertically, so we only pause — never
         preventDefault — and release on up/cancel/leave. A tap still reaches
         the delegated [data-img] handler and opens the lightbox. */
      const hold = (e) => { if (e.pointerType === 'touch') track.classList.add('is-held'); };
      const release = () => track.classList.remove('is-held');
      row.addEventListener('pointerdown', hold, { passive: true });
      row.addEventListener('pointerup', release, { passive: true });
      row.addEventListener('pointercancel', release, { passive: true });
      row.addEventListener('pointerleave', release, { passive: true });

      cleanups.push(() => {
        row.removeEventListener('pointerdown', hold);
        row.removeEventListener('pointerup', release);
        row.removeEventListener('pointercancel', release);
        row.removeEventListener('pointerleave', release);
      });
    });

    /* --------------------------------------------------- COUNTDOWN (3-HOUR)
       The reference funnels run a 3-hour "OFFER ENDS IN HH : MM : SS" clock
       inside every CTA block, and it restarts on every page load. Ours keeps
       the same 3-hour window and the same HRS/MIN/SEC anatomy, but anchors the
       deadline in sessionStorage — so it counts down continuously across a
       visit instead of resetting each time she scrolls back or reloads.
       A real deadline or intake cap in config overrides it. */
    const urgencyHosts = $$('[data-urgency]');
    if (urgencyHosts.length) {
      /* Two paint modes against the SAME slot.
         · segments — the clock. Writes only the digit nodes CtaBlock already
           rendered, so nothing is destroyed and nothing reflows.
         · sentence — the intake-cap variant. Replaces the segments outright,
           so the host is flagged .cd-plain and the CSS stands the segment
           geometry down. */
      const paintClock = (h, m, s) => urgencyHosts.forEach((host) => {
        host.style.display = '';
        const seg = { h, m, s };
        const cells = $$('[data-cd]', host);
        if (!cells.length) {                       // markup without segments
          const t = $('.u-text', host);
          if (t) t.textContent = `${h} Hrs : ${m} Min : ${s} Sec`;
          return;
        }
        cells.forEach((cell) => {
          const next = seg[cell.getAttribute('data-cd')];
          if (next !== undefined && cell.textContent !== next) cell.textContent = next;
        });
      });

      const paintSentence = (txt) => urgencyHosts.forEach((host) => {
        host.style.display = '';
        host.classList.add('cd-plain');
        const t = $('.u-text', host);
        if (t) t.textContent = txt;
      });

      if (CONFIG.MONTHLY_INTAKE_CAP) {
        paintSentence(`Only ${CONFIG.MONTHLY_INTAKE_CAP} new clients taken each month`);
      } else {
        const WINDOW_MS = 5 * 60 * 60 * 1000;
        let end;
        if (CONFIG.COUNTDOWN_DEADLINE) {
          end = new Date(CONFIG.COUNTDOWN_DEADLINE).getTime();
        } else {
          const KEY = 'reset_cd_end';
          const stored = Number(sessionStorage.getItem(KEY));
          end = stored && stored > Date.now() ? stored : Date.now() + WINDOW_MS;
          try { sessionStorage.setItem(KEY, String(end)); } catch {}
        }

        const pad = (n) => String(n).padStart(2, '0');
        const tick = () => {
          const left = end - Date.now();
          if (left <= 0) { paintClock('00', '00', '00'); return; }
          const h = Math.floor(left / 36e5);
          const m = Math.floor((left % 36e5) / 6e4);
          const sec = Math.floor((left % 6e4) / 1000);
          paintClock(pad(h), pad(m), pad(sec));
        };
        tick();
        const id = setInterval(tick, 1000);
        cleanups.push(() => clearInterval(id));
      }
    }

    /* ------------------------------------------------------- CALENDLY (C16) */
    const cal = $('#calendly');
    if (cal && CONFIG.CALENDLY_URL && !cal.querySelector('iframe')) {
      const url = CONFIG.CALENDLY_URL;
      const sep = url.includes('?') ? '&' : '?';
      const f = document.createElement('iframe');
      f.src = `${url}${sep}hide_gdpr_banner=1`;
      f.title = 'Book your call with Shruti';
      f.loading = 'lazy';
      cal.appendChild(f);
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
