import React from 'react';
import { useApp } from '../../context/AppContext';

/* ============================================================
   All motion + paint CSS is self-contained here. Scoped with
   .hc-* prefix so it never bleeds into the Tailwind system.
   ============================================================ */
const HERO_CSS = `
  /* ── CLOUD BLOB BASE ──────────────────────────────────── */
  .hc-cloud {
    position: absolute;
    background: #ffffff;
    border-radius: 100px;
    will-change: transform;
    pointer-events: none;
    z-index: 1;
  }
  .hc-cloud::before,
  .hc-cloud::after {
    content: '';
    position: absolute;
    background: #ffffff;
    border-radius: 50%;
  }

  /* Cloud 1 — largest, slowest */
  .hc-c1 {
    width: 195px; height: 40px;
    top: 7%; opacity: .85;
    animation: hcDrift1 55s linear infinite;
  }
  .hc-c1::before { width: 88px; height: 88px; top: -52px; left: 24px; }
  .hc-c1::after  { width: 62px; height: 62px; top: -34px; left: 96px; }

  /* Cloud 2 — mid size, slowest drift */
  .hc-c2 {
    width: 145px; height: 30px;
    top: 17%; opacity: .62;
    animation: hcDrift2 70s linear infinite;
    animation-delay: -22s;
  }
  .hc-c2::before { width: 66px; height: 66px; top: -38px; left: 16px; }
  .hc-c2::after  { width: 48px; height: 48px; top: -24px; left: 68px; }

  /* Cloud 3 — smallest, fastest */
  .hc-c3 {
    width: 110px; height: 24px;
    top: 4%; opacity: .55;
    animation: hcDrift3 38s linear infinite;
    animation-delay: -12s;
  }
  .hc-c3::before { width: 52px; height: 52px; top: -30px; left: 12px; }
  .hc-c3::after  { width: 36px; height: 36px; top: -18px; left: 54px; }

  /* Cloud 4 — wide wispy, medium speed */
  .hc-c4 {
    width: 215px; height: 32px;
    top: 13%; opacity: .72;
    animation: hcDrift4 62s linear infinite;
    animation-delay: -40s;
  }
  .hc-c4::before { width: 76px; height: 76px; top: -44px; left: 36px; }
  .hc-c4::after  { width: 56px; height: 56px; top: -28px; left: 114px; }

  /* ── CLOUD DRIFT KEYFRAMES ────────────────────────────── */
  @keyframes hcDrift1 {
    from { transform: translateX(-420px); }
    to   { transform: translateX(calc(100vw + 420px)); }
  }
  @keyframes hcDrift2 {
    from { transform: translateX(-310px); }
    to   { transform: translateX(calc(100vw + 310px)); }
  }
  @keyframes hcDrift3 {
    from { transform: translateX(-240px); }
    to   { transform: translateX(calc(100vw + 240px)); }
  }
  @keyframes hcDrift4 {
    from { transform: translateX(-510px); }
    to   { transform: translateX(calc(100vw + 510px)); }
  }

  /* ── BIRD FLIGHT KEYFRAMES ────────────────────────────── */
  @keyframes hcFly1 {
    from { transform: translateX(-130px) translateY(0px); }
    to   { transform: translateX(calc(100vw + 130px)) translateY(-42px); }
  }
  @keyframes hcFly2 {
    from { transform: translateX(-95px) translateY(0px); }
    to   { transform: translateX(calc(100vw + 95px)) translateY(-40px); }
  }
  @keyframes hcFly3 {
    from { transform: translateX(-75px) translateY(0px); }
    to   { transform: translateX(calc(100vw + 75px)) translateY(-46px); }
  }

  /* ── WING FLAP KEYFRAMES ──────────────────────────────── */
  @keyframes hcFlapL {
    0%, 100% { transform: rotate(-12deg); }
    50%      { transform: rotate(26deg); }
  }
  @keyframes hcFlapR {
    0%, 100% { transform: rotate(12deg); }
    50%      { transform: rotate(-26deg); }
  }

  /* ── BIRD WRAPPERS ────────────────────────────────────── */
  .hc-bird { position: absolute; pointer-events: none; z-index: 2; }
  .hc-bird-1 { top: 18%; animation: hcFly1 24s linear infinite; }
  .hc-bird-2 { top: 10%; animation: hcFly2 30s linear infinite; animation-delay: -8s; }
  .hc-bird-3 { top: 24%; animation: hcFly3 22s linear infinite; animation-delay: -15s; }

  /* ── WING ANIMATION ON <g> ELEMENTS ──────────────────── */
  /* Left wing: bounding box bottom-right corner = meeting point (0,0) */
  .hc-wl {
    transform-box: fill-box;
    transform-origin: 100% 100%;
    animation: hcFlapL 0.62s ease-in-out infinite;
  }
  /* Right wing: bounding box bottom-left corner = meeting point (0,0) */
  .hc-wr {
    transform-box: fill-box;
    transform-origin: 0% 100%;
    animation: hcFlapR 0.62s ease-in-out infinite;
  }
  .hc-bird-2 .hc-wl, .hc-bird-2 .hc-wr { animation-duration: 0.55s; }
  .hc-bird-3 .hc-wl, .hc-bird-3 .hc-wr { animation-duration: 0.70s; }

  /* ── NAV INTERACTIVE STATES ───────────────────────────── */
  .hc-nav-link {
    font-size: 14px; font-weight: 500; color: #2a3d2a;
    background: none; border: none; cursor: pointer;
    text-decoration: none; padding: 5px 2px;
    transition: color 140ms ease;
    font-family: 'IBM Plex Sans', sans-serif;
    letter-spacing: -0.01em;
  }
  .hc-nav-link:hover, .hc-nav-link:focus-visible { color: #2E63B8; outline: none; }

  .hc-nav-start {
    padding: 9px 20px;
    background: #233324; color: #fff;
    border: none; border-radius: 8px; cursor: pointer;
    font-size: 13px; font-weight: 600; letter-spacing: -0.01em;
    transition: transform 140ms ease, background 140ms ease;
    font-family: 'IBM Plex Sans', sans-serif;
    white-space: nowrap;
  }
  .hc-nav-start:hover, .hc-nav-start:focus-visible {
    transform: translateY(-1px); background: #182618; outline: none;
  }

  /* ── CTA BUTTONS ──────────────────────────────────────── */
  .hc-cta-p {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 14px 30px;
    background: #2E63B8; color: #fff;
    font-size: 15px; font-weight: 600; letter-spacing: -0.01em;
    border: none; border-radius: 10px; cursor: pointer;
    box-shadow: 0 4px 18px rgba(46,99,184,.38);
    transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
    font-family: 'IBM Plex Sans', sans-serif;
    text-decoration: none;
    min-width: 162px;
  }
  .hc-cta-p:hover, .hc-cta-p:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(46,99,184,.46);
    background: #2557a3; outline: none;
  }

  .hc-cta-s {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 14px 20px;
    background: none; border: none; cursor: pointer;
    font-size: 15px; font-weight: 500; color: #233324;
    text-decoration: underline;
    text-decoration-color: rgba(35,51,36,.28);
    text-underline-offset: 3px;
    transition: text-decoration-color 160ms ease, color 160ms ease;
    font-family: 'IBM Plex Sans', sans-serif;
    letter-spacing: -0.01em;
  }
  .hc-cta-s:hover, .hc-cta-s:focus-visible {
    text-decoration-color: #233324; color: #111827; outline: none;
  }

  /* ── RESPONSIVE BREAKPOINTS ───────────────────────────── */
  @media (max-width: 839px)  { .hc-nav-links { display: none !important; } }
  @media (max-width: 479px)  {
    .hc-cta-row   { flex-direction: column !important; align-items: center !important; }
    .hc-stats-row { flex-direction: column !important; align-items: center !important; gap: 20px !important; }
    .hc-sun       { width: 62px !important; height: 62px !important; top: 5% !important; right: 6% !important; }
    .hc-sun-glow  { width: 260px !important; height: 260px !important; }
  }

  /* ── PREFERS-REDUCED-MOTION ───────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .hc-c1 { animation: none; transform: translateX(10%); }
    .hc-c2 { animation: none; transform: translateX(54%); }
    .hc-c3 { animation: none; transform: translateX(76%); }
    .hc-c4 { animation: none; transform: translateX(32%); }
    .hc-bird-1 { animation: none; transform: translateX(22%) translateY(-28px); }
    .hc-bird-2 { animation: none; transform: translateX(54%) translateY(-18px); }
    .hc-bird-3 { animation: none; transform: translateX(74%) translateY(-24px); }
    .hc-wl, .hc-wr { animation: none; transform: rotate(0deg); }
  }
`;

/* ── BIRD SHAPE ──────────────────────────────────────────── */
interface BirdProps {
  wingspan: number;   /* px — full tip-to-tip spread          */
  height: number;     /* px — vertical drop from tip to center */
  strokeWidth: number;
}

const BirdShape: React.FC<BirdProps> = ({ wingspan, height, strokeWidth }) => {
  const half = wingspan / 2;
  return (
    <svg
      width={wingspan}
      height={height}
      viewBox={`${-half} ${-height} ${wingspan} ${height}`}
      overflow="visible"
      style={{ display: 'block' }}
      aria-hidden="true"
    >
      {/* Left wing: x1=0,y1=0 (center) → x2=-half,y2=-height (tip) */}
      <g className="hc-wl">
        <line
          x1="0" y1="0" x2={-half} y2={-height}
          stroke="#4c5f49" strokeWidth={strokeWidth} strokeLinecap="round"
        />
      </g>
      {/* Right wing: x1=0,y1=0 (center) → x2=+half,y2=-height (tip) */}
      <g className="hc-wr">
        <line
          x1="0" y1="0" x2={half} y2={-height}
          stroke="#4c5f49" strokeWidth={strokeWidth} strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

/* ── HERO SECTION ────────────────────────────────────────── */
export const HeroSection: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />

      {/* Full-bleed escape from the max-w-7xl container */}
      <div
        style={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '-2rem',   /* negate parent py-8 */
          marginBottom: '3rem',
          overflow: 'hidden',
          minHeight: '100svh',
          background: 'linear-gradient(180deg, #BEE1F6 0%, #DCEEE0 30%, #D8E3A6 65%, #BFCF7C 100%)',
          display: 'flex',
          flexDirection: 'column',
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >

        {/* ── SUN AMBIENT GLOW BLOB ── */}
        <div
          className="hc-sun-glow"
          style={{
            position: 'absolute',
            top: '-4%',
            right: '-4%',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,245,180,0.38) 0%, rgba(255,235,140,0.12) 50%, transparent 72%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* ── SUN ── */}
        <div
          className="hc-sun"
          style={{
            position: 'absolute',
            top: '7%',
            right: '13%',
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 42% 42%, #FFFDF4 0%, #FFEFAE 55%, #FFE28A 100%)',
            boxShadow: '0 0 18px 4px rgba(255,220,80,.72), 0 0 60px 22px rgba(255,220,80,.28)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />

        {/* ── CLOUDS (all positioned absolute, z-index 1) ── */}
        <div className="hc-cloud hc-c1" />
        <div className="hc-cloud hc-c2" />
        <div className="hc-cloud hc-c3" />
        <div className="hc-cloud hc-c4" />

        {/* ── BIRDS ── */}
        {/* Bird 1 — small */}
        <div className="hc-bird hc-bird-1">
          <BirdShape wingspan={28} height={12} strokeWidth={1.5} />
        </div>
        {/* Bird 2 — medium */}
        <div className="hc-bird hc-bird-2">
          <BirdShape wingspan={40} height={18} strokeWidth={1.8} />
        </div>
        {/* Bird 3 — large */}
        <div className="hc-bird hc-bird-3">
          <BirdShape wingspan={54} height={23} strokeWidth={2.1} />
        </div>

        {/* ══════════════════════════════════════════════
            INTERNAL HERO NAV
        ══════════════════════════════════════════════ */}
        <nav
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 40px',
          }}
        >
          {/* Logo mark + wordmark */}
          <button
            onClick={() => navigateTo('explore')}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            }}
            aria-label="Go home"
          >
            {/* Logo mark — circle with radial gradient */}
            <div
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'radial-gradient(circle at 38% 36%, #5B9FEA 0%, #2E63B8 55%, #1B3A6B 100%)',
                boxShadow: '0 2px 8px rgba(46,99,184,.35)',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'Fraunces', 'Newsreader', serif",
                fontSize: '20px', fontWeight: 520,
                color: '#233324', letterSpacing: '-0.03em', lineHeight: 1,
              }}
            >
              wanderLocal
            </span>
          </button>

          {/* Nav links — hidden below 840px */}
          <div
            className="hc-nav-links"
            style={{ display: 'flex', alignItems: 'center', gap: '32px' }}
          >
            {['Explore', 'Trips', 'Vendors', 'About'].map(label => (
              <button key={label} className="hc-nav-link"
                onClick={() => {
                  if (label === 'Explore') navigateTo('explore');
                  if (label === 'Trips') navigateTo('trip-builder');
                  if (label === 'Vendors') navigateTo('vendor-portal');
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* CTA — always visible */}
          <button
            className="hc-nav-start"
            onClick={() => navigateTo('trip-builder')}
          >
            Start free
          </button>
        </nav>

        {/* ══════════════════════════════════════════════
            HERO CONTENT — layered above clouds/birds
        ══════════════════════════════════════════════ */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 5,
            padding: '48px 24px 80px',
            textAlign: 'center',
          }}
        >
          {/* Eyebrow pill */}
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '5px 14px',
              background: 'rgba(255,255,255,0.68)',
              border: '1px solid rgba(35,51,36,0.15)',
              borderRadius: '999px',
              backdropFilter: 'blur(6px)',
              marginBottom: '28px',
            }}
          >
            <span
              style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#15803D', display: 'inline-block', flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: '12px', fontWeight: 500, color: '#233324',
                letterSpacing: '0.01em',
              }}
            >
              HackCelestial 3.0 &nbsp;✦&nbsp; Nugen AI Now Live
            </span>
          </div>

          {/* 4-line serif headline */}
          <h1
            style={{
              fontFamily: "'Fraunces', 'Newsreader', serif",
              fontSize: 'clamp(28px, 5.5vw, 58px)',
              fontWeight: 440,
              lineHeight: 1.16,
              letterSpacing: '-0.03em',
              margin: '0 0 22px',
              maxWidth: '15ch',
            }}
          >
            <span style={{ display: 'block', color: '#233324' }}>Discover India's</span>
            <span style={{ display: 'block', color: '#233324' }}>hidden artisan</span>
            <span style={{ display: 'block', color: '#2E63B8' }}>trails &amp; living</span>
            <span style={{ display: 'block', color: '#2E63B8' }}>culture — live.</span>
          </h1>

          {/* Subhead */}
          <p
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              fontWeight: 400,
              color: '#3d4f3e',
              lineHeight: 1.55,
              maxWidth: '38ch',
              margin: '0 0 38px',
              letterSpacing: '-0.01em',
            }}
          >
            AI-powered trip planning for authentic,&nbsp;
            off-map India — rebuilt in real time.
          </p>

          {/* CTA row */}
          <div
            className="hc-cta-row"
            style={{
              display: 'flex', alignItems: 'center',
              gap: '12px', flexWrap: 'wrap', justifyContent: 'center',
              marginBottom: '44px',
            }}
          >
            <button className="hc-cta-p" onClick={() => navigateTo('trip-builder')}>
              Plan my trip&nbsp; →
            </button>
            <button className="hc-cta-s" onClick={() => navigateTo('explore')}>
              Browse experiences
            </button>
          </div>

          {/* Proof stats row */}
          <div
            className="hc-stats-row"
            style={{
              display: 'flex', alignItems: 'center',
              gap: '40px', flexWrap: 'wrap', justifyContent: 'center',
            }}
          >
            {[
              { num: '3,200+', label: 'Experiences' },
              { num: '40+',    label: 'Indian Cities' },
              { num: '100%',   label: 'Real-Time AI' },
            ].map(s => (
              <div
                key={s.label}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}
              >
                <span
                  style={{
                    fontFamily: "'Fraunces', 'Newsreader', serif",
                    fontSize: 'clamp(22px, 3vw, 30px)',
                    fontWeight: 520, color: '#233324',
                    letterSpacing: '-0.03em', lineHeight: 1,
                  }}
                >
                  {s.num}
                </span>
                <span
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontSize: '12px', fontWeight: 400,
                    color: '#5a6e5a', letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
