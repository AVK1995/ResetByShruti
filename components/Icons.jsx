/* C11 · ONE bespoke icon family, one stroke weight (1.6), coloured via
   currentColor from tokens. No emoji as UI, no icon fonts, no mixed weights.
   Rendered once at the document root; every component references by <use>. */
export default function Icons() {
  return (
    <svg style={{ display: 'none' }} aria-hidden="true">
      <symbol id="i-check" viewBox="0 0 24 24">
        <path d="M4 12.5l5.2 5.2L20 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="i-shield" viewBox="0 0 24 24">
        <path d="M12 2.6l7.5 3v6.1c0 4.6-3.1 8.4-7.5 9.7-4.4-1.3-7.5-5.1-7.5-9.7V5.6z" />
        <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
      </symbol>
      <symbol id="i-users" viewBox="0 0 24 24">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M2.8 20c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6" />
        <path d="M16.4 5.2a3.2 3.2 0 010 5.9M17.6 14.8c2.2.6 3.6 2.4 3.6 5.2" />
      </symbol>
      <symbol id="i-spark" viewBox="0 0 24 24">
        <path d="M12 2.8l2.2 5.6 5.6 2.2-5.6 2.2L12 18.4l-2.2-5.6L4.2 10.6l5.6-2.2z" />
      </symbol>
      <symbol id="i-play" viewBox="0 0 24 24"><path d="M8 5.2l11 6.8-11 6.8z" /></symbol>
      <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15M13 6l6 6-6 6" /></symbol>
      <symbol id="i-arrow-d" viewBox="0 0 24 24"><path d="M12 4.5v14M6 13l6 6 6-6" /></symbol>
      <symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></symbol>
      <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></symbol>
      <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5.4l3.4 2" /></symbol>
      <symbol id="i-lock" viewBox="0 0 24 24"><rect x="4.5" y="10.5" width="15" height="10" rx="2.2" /><path d="M8 10.5V7.8a4 4 0 018 0v2.7" /></symbol>
      <symbol id="i-cart" viewBox="0 0 24 24"><path d="M3 4.5h2.6l2.3 11h9.6l2.1-8H6.4" /><circle cx="9.4" cy="19" r="1.4" /><circle cx="17.2" cy="19" r="1.4" /></symbol>
      <symbol id="i-chev" viewBox="0 0 24 24"><path d="M6 9.5l6 6 6-6" /></symbol>
      <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2.2" /><path d="M3.6 6.8L12 12.6l8.4-5.8" /></symbol>
      {/* WhatsApp. A third-party BRAND MARK, so unlike every symbol above it is
          a filled glyph in its real form, not a 1.6-stroke outline — C12: a
          third-party mark is never redrawn or recoloured to fit our palette,
          the same exemption the payment logos and country flags carry. The
          fill/stroke are set on the path so they beat the shared .ico rule. */}
      <symbol id="i-whatsapp" viewBox="0 0 24 24">
        <path fill="currentColor" stroke="none" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </symbol>
      <symbol id="i-chat" viewBox="0 0 24 24"><path d="M20.5 11.6c0 4-3.8 7.2-8.5 7.2a9.7 9.7 0 01-2.8-.4L4.5 20l1.3-3.5a6.9 6.9 0 01-2.3-5c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.3z" /></symbol>
      <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.6l-5.9 3 1.2-6.5L2.5 9.5l6.6-.9z" /></symbol>
      <symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" /></symbol>
    </svg>
  );
}

export function Ico({ id, className = 'ico' }) {
  return <svg className={className} aria-hidden="true"><use href={`#i-${id}`} /></svg>;
}
