// Abstract, gender-neutral 3D-style hero visual: layered glass spheres and a
// rounded "bottle" silhouette rendered with gradients/highlights to fake depth,
// instead of a stock photo. Matches the rose/gold palette but skews modern/neutral.
const HeroArt3D = () => (
  <svg viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <defs>
      <radialGradient id="bgGlow" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#f3e2d8" />
        <stop offset="100%" stopColor="#fbf7f4" />
      </radialGradient>

      <radialGradient id="sphereMain" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#f3d9c9" />
        <stop offset="45%" stopColor="#c9a87c" />
        <stop offset="100%" stopColor="#8b4a5c" />
      </radialGradient>

      <radialGradient id="sphereSmall1" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="55%" stopColor="#e8d5d0" />
        <stop offset="100%" stopColor="#8b4a5c" />
      </radialGradient>

      <radialGradient id="sphereSmall2" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#fdf3e7" />
        <stop offset="55%" stopColor="#d8bd93" />
        <stop offset="100%" stopColor="#ab8a5f" />
      </radialGradient>

      <linearGradient id="bottleBody" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6e3a48" />
        <stop offset="18%" stopColor="#8b4a5c" />
        <stop offset="50%" stopColor="#c17f8f" />
        <stop offset="82%" stopColor="#8b4a5c" />
        <stop offset="100%" stopColor="#6e3a48" />
      </linearGradient>

      <linearGradient id="bottleCap" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ab8a5f" />
        <stop offset="50%" stopColor="#e6cfa3" />
        <stop offset="100%" stopColor="#ab8a5f" />
      </linearGradient>

      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c9a87c" />
        <stop offset="100%" stopColor="#8b4a5c" />
      </linearGradient>

      <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="18" />
      </filter>
    </defs>

    <rect x="0" y="0" width="600" height="700" fill="url(#bgGlow)" />

    <circle cx="300" cy="330" r="230" fill="#8b4a5c" opacity="0.12" filter="url(#softBlur)" />

    <ellipse cx="300" cy="590" rx="170" ry="26" fill="#2b1f24" opacity="0.10" />

    <g transform="rotate(-18 460 200)">
      <ellipse cx="460" cy="200" rx="95" ry="30" fill="none" stroke="url(#ringGrad)" strokeWidth="14" opacity="0.85" />
    </g>

    <circle cx="130" cy="180" r="58" fill="url(#sphereSmall1)" />
    <circle cx="112" cy="158" r="16" fill="#ffffff" opacity="0.55" />

    <circle cx="500" cy="470" r="46" fill="url(#sphereSmall2)" />
    <circle cx="486" cy="455" r="12" fill="#ffffff" opacity="0.55" />

    <circle cx="150" cy="520" r="34" fill="url(#sphereMain)" opacity="0.9" />

    <g transform="translate(230 230)">
      <rect x="0" y="0" width="140" height="270" rx="34" fill="url(#bottleBody)" />
      <rect x="0" y="0" width="140" height="270" rx="34" fill="#ffffff" opacity="0.06" />
      <rect x="16" y="24" width="18" height="220" rx="9" fill="#ffffff" opacity="0.25" />

      <rect x="30" y="-46" width="80" height="52" rx="14" fill="url(#bottleCap)" />
      <rect x="30" y="-46" width="80" height="14" rx="7" fill="#ffffff" opacity="0.3" />

      <rect x="20" y="60" width="100" height="70" rx="10" fill="#fbf7f4" opacity="0.92" />
      <rect x="34" y="80" width="72" height="6" rx="3" fill="#8b4a5c" opacity="0.35" />
      <rect x="34" y="94" width="52" height="6" rx="3" fill="#8b4a5c" opacity="0.22" />
      <rect x="34" y="108" width="60" height="6" rx="3" fill="#8b4a5c" opacity="0.22" />
    </g>

    <circle cx="310" cy="120" r="220" fill="none" stroke="#c9a87c" strokeWidth="1" opacity="0.35" />
  </svg>
);

export default HeroArt3D;
