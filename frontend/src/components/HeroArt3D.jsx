// Abstract, gender-neutral 3D-style hero visual: a premium "product render" style
// composition — two glass bottles on a soft podium, floating glass spheres, and
// layered light/shadow to fake real depth, instead of a stock photo.
const HeroArt3D = () => (
  <svg viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="28%" r="70%">
        <stop offset="0%" stopColor="#f4e3d9" />
        <stop offset="60%" stopColor="#fbf7f4" />
        <stop offset="100%" stopColor="#f6ede7" />
      </radialGradient>

      <linearGradient id="podium" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#efe0d6" />
        <stop offset="100%" stopColor="#e2cec0" />
      </linearGradient>

      <linearGradient id="podiumEdge" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#d9c2b3" />
        <stop offset="100%" stopColor="#c7ab99" />
      </linearGradient>

      <linearGradient id="bottleMain" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#5c2f3b" />
        <stop offset="14%" stopColor="#8b4a5c" />
        <stop offset="38%" stopColor="#d69cab" />
        <stop offset="52%" stopColor="#f0c9d2" />
        <stop offset="66%" stopColor="#c17f8f" />
        <stop offset="86%" stopColor="#8b4a5c" />
        <stop offset="100%" stopColor="#5c2f3b" />
      </linearGradient>

      <linearGradient id="bottleMainCap" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#96794f" />
        <stop offset="45%" stopColor="#f1dbb0" />
        <stop offset="55%" stopColor="#f9ecd4" />
        <stop offset="100%" stopColor="#96794f" />
      </linearGradient>

      <linearGradient id="bottleSide" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#9c7a4a" />
        <stop offset="35%" stopColor="#d8bd93" />
        <stop offset="50%" stopColor="#f3e4c8" />
        <stop offset="65%" stopColor="#d8bd93" />
        <stop offset="100%" stopColor="#9c7a4a" />
      </linearGradient>

      <linearGradient id="bottleSideCap" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#5c2f3b" />
        <stop offset="50%" stopColor="#8b4a5c" />
        <stop offset="100%" stopColor="#5c2f3b" />
      </linearGradient>

      <radialGradient id="orbGold" cx="32%" cy="26%" r="80%">
        <stop offset="0%" stopColor="#fdf6ea" />
        <stop offset="45%" stopColor="#e6cfa3" />
        <stop offset="100%" stopColor="#a5824f" />
      </radialGradient>

      <radialGradient id="orbRose" cx="32%" cy="26%" r="80%">
        <stop offset="0%" stopColor="#f8e6ea" />
        <stop offset="45%" stopColor="#d99cab" />
        <stop offset="100%" stopColor="#7a3f4c" />
      </radialGradient>

      <radialGradient id="orbGlass" cx="32%" cy="26%" r="80%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#f0e6df" />
        <stop offset="100%" stopColor="#c9a87c" />
      </radialGradient>

      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f1dbb0" />
        <stop offset="100%" stopColor="#8b4a5c" />
      </linearGradient>

      <filter id="blurLg" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="26" />
      </filter>
      <filter id="blurSm" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="8" />
      </filter>
    </defs>

    <rect x="0" y="0" width="600" height="700" fill="url(#bgGlow)" />

    <circle cx="330" cy="260" r="240" fill="#8b4a5c" opacity="0.10" filter="url(#blurLg)" />
    <circle cx="150" cy="470" r="120" fill="#c9a87c" opacity="0.14" filter="url(#blurLg)" />

    <g transform="rotate(-16 470 165)">
      <ellipse cx="470" cy="165" rx="80" ry="26" fill="none" stroke="url(#ringGrad)" strokeWidth="10" opacity="0.9" />
    </g>

    <circle cx="108" cy="150" r="42" fill="url(#orbGlass)" />
    <ellipse cx="94" cy="134" rx="11" ry="8" fill="#ffffff" opacity="0.7" />

    <circle cx="512" cy="430" r="30" fill="url(#orbRose)" />
    <ellipse cx="502" cy="420" rx="7" ry="5" fill="#ffffff" opacity="0.6" />

    <ellipse cx="300" cy="612" rx="185" ry="22" fill="#2b1f24" opacity="0.16" filter="url(#blurSm)" />

    <g transform="translate(160 480)">
      <ellipse cx="140" cy="0" rx="150" ry="26" fill="url(#podium)" />
      <path d="M -10 0 L -10 22 Q -10 40 140 40 Q 290 40 290 22 L 290 0 Z" fill="url(#podiumEdge)" />
      <ellipse cx="140" cy="0" rx="150" ry="26" fill="#ffffff" opacity="0.18" />
    </g>

    <g transform="translate(150 430)">
      <ellipse cx="65" cy="76" rx="60" ry="12" fill="#2b1f24" opacity="0.12" />
      <rect x="18" y="-6" width="94" height="158" rx="26" fill="url(#bottleSide)" />
      <rect x="30" y="10" width="12" height="128" rx="6" fill="#ffffff" opacity="0.35" />
      <rect x="34" y="-34" width="62" height="34" rx="10" fill="url(#bottleSideCap)" />
      <rect x="34" y="-34" width="62" height="10" rx="5" fill="#ffffff" opacity="0.25" />
    </g>

    <g transform="translate(255 300)">
      <ellipse cx="70" cy="290" rx="82" ry="15" fill="#2b1f24" opacity="0.14" />
      <rect x="0" y="0" width="140" height="290" rx="36" fill="url(#bottleMain)" />
      <rect x="18" y="26" width="16" height="236" rx="8" fill="#ffffff" opacity="0.3" />
      <rect x="34" y="-50" width="72" height="56" rx="16" fill="url(#bottleMainCap)" />
      <rect x="34" y="-50" width="72" height="14" rx="7" fill="#ffffff" opacity="0.3" />
      <rect x="22" y="70" width="96" height="78" rx="12" fill="#fbf7f4" opacity="0.94" />
      <rect x="36" y="92" width="68" height="7" rx="3.5" fill="#8b4a5c" opacity="0.4" />
      <rect x="36" y="108" width="48" height="6" rx="3" fill="#8b4a5c" opacity="0.24" />
      <rect x="36" y="122" width="56" height="6" rx="3" fill="#8b4a5c" opacity="0.24" />
    </g>

    <circle cx="150" cy="565" r="16" fill="url(#orbGold)" />
    <ellipse cx="146" cy="561" rx="4" ry="3" fill="#ffffff" opacity="0.7" />

    <circle cx="330" cy="95" r="230" fill="none" stroke="#c9a87c" strokeWidth="1" opacity="0.28" />
  </svg>
);

export default HeroArt3D;
