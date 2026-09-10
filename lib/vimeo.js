/* ============================================================================
   VIMEO — server-side thumbnail fetch (SERVER ONLY)
   ----------------------------------------------------------------------------
   The hero VSL is a click-to-load facade: we show the video's OWN Vimeo
   thumbnail with our branded play button and NO Vimeo chrome, then swap in the
   real player (with controls) only on click. To render the thumbnail without
   loading the Vimeo player, we resolve its image URL via Vimeo's public oEmbed
   endpoint at build/request time (cached a day). Public/unlisted videos work;
   if the fetch fails the facade falls back to a plain branded poster.
   ========================================================================== */

/** Extract the numeric video id from a player or canonical Vimeo URL. */
export function vimeoId(url) {
  if (!url) return null;
  const m = url.match(/\/video\/(\d+)/) || url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

/** True for any Vimeo URL. Lets a caller branch between an <iframe> player and
 *  a plain <video>, since the two cannot be swapped for one another. */
export function isVimeoUrl(url) {
  return typeof url === 'string' && /(^|\.)vimeo\.com\//.test(url);
}

/** oEmbed once, shaped for our callers: { thumbnail, width, height }.
 *  Width/height matter because the testimonial clips are portrait and an
 *  iframe, unlike <video>, has no intrinsic size to lay out from — without the
 *  real ratio the lightbox would guess and letterbox the clip. */
export async function getVimeoMeta(url) {
  const id = vimeoId(url);
  if (!id) return null;
  try {
    const res = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(`https://vimeo.com/${id}`)}&width=1280`,
      { next: { revalidate: 86400 } },   // cache for a day
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      thumbnail: data.thumbnail_url || null,
      width: Number(data.width) || null,
      height: Number(data.height) || null,
    };
  } catch {
    return null;
  }
}

/** Resolve the Vimeo thumbnail image URL, or null on any failure. */
export async function getVimeoPoster(url) {
  const meta = await getVimeoMeta(url);
  return meta ? meta.thumbnail : null;
}
