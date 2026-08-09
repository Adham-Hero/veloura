// Abstract, gender-neutral 3D-style hero visual: a stylized glass bottle
// with floating spheres, built entirely in SVG using the site's own
// design tokens (so it automatically adapts to light/dark theme).
const HeroVisual = () => (
  <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <defs>
      <linearGradient id="heroBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--v-bg-alt)" />
        <stop offset="100%" stopColor="var(--v-bg)" />
      </linearGradient>

      <linearGradient id="bottleBody" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--v-rose)" />
        <stop offset="100%" stopColor="var(--v-rose-dark)" />
      </linearGradient>

      <linearGradient id="bottleCap" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="var(--v-gold)" />
        <stop offset="100%" stopColor="var(--v-gold-dark)" />
      </linearGradient>

      <radialGradient id="sphereGold" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="var(--v-gold)" />
        <stop offset="100%" stopColor="var(--v-gold-dark)" />
      </radialGradient>

      <radialGradient id="sphereRose" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="var(--v-rose-light)" />
        <stop offset="100%" stopColor="var(--v-rose)" />
      </radialGradient>

      <radialGradient id="glowBack" cx="50%" cy="42%" r="55%">
        <stop offset="0%" stopColor="var(--v-gold)" stopOpacity="0.35" />
        <stop offset="100%" stopColor="var(--v-gold)" stopOpacity="0" />
      </radialGradient>

      <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>

      <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#000000" floodOpacity="0.18" />
      </filter>
    </defs>

    {/* backdrop */}
    <rect x="0" y="0" width="400" height="500" fill="url(#heroBg)" />
    <circle cx="200" cy="215" r="170" fill="url(#glowBack)" />

    {/* floor shadow ellipse */}
    <ellipse cx="200" cy="430" rx="110" ry="18" fill="#000000" opacity="0.12" />

    {/* floating sphere - top right */}
    <g filter="url(#softShadow)">
      <circle cx="305" cy="120" r="34" fill="url(#sphereGold)" />
    </g>
    <ellipse cx="294" cy="107" rx="11" ry="7" fill="#ffffff" opacity="0.5" />

    {/* floating sphere - lower left */}
    <g filter="url(#softShadow)">
      <circle cx="82" cy="330" r="26" fill="url(#sphereRose)" />
    </g>
    <ellipse cx="74" cy="321" rx="8" ry="5" fill="#ffffff" opacity="0.45" />

    {/* small accent sphere */}
    <circle cx="330" cy="360" r="10" fill="var(--v-gold)" opacity="0.8" />

    {/* main bottle group */}
    <g filter="url(#softShadow)">
      {/* bottle body */}
      <rect x="150" y="190" width="100" height="220" rx="26" fill="url(#bottleBody)" />
      {/* neck */}
      <rect x="180" y="150" width="40" height="50" rx="10" fill="url(#bottleBody)" />
      {/* cap */}
      <rect x="172" y="118" width="56" height="40" rx="12" fill="url(#bottleCap)" />
      <rect x="172" y="118" width="56" height="10" rx="5" fill="var(--v-gold)" opacity="0.9" />
    </g>

    {/* glass sheen on bottle */}
    <rect x="163" y="205" width="26" height="190" rx="13" fill="url(#sheen)" />

    {/* label plate */}
    <rect x="168" y="270" width="64" height="60" rx="10" fill="var(--v-surface)" opacity="0.9" />
    <rect x="180" y="286" width="40" height="4" rx="2" fill="var(--v-rose)" />
    <rect x="180" y="298" width="28" height="4" rx="2" fill="var(--v-text-muted)" opacity="0.6" />
    <rect x="180" y="310" width="34" height="4" rx="2" fill="var(--v-text-muted)" opacity="0.6" />

    {/* thin orbit ring for a techy, modern touch */}
    <ellipse
      cx="200"
      cy="300"
      rx="150"
      ry="45"
      fill="none"
      stroke="var(--v-gold)"
      strokeWidth="1.5"
      opacity="0.35"
    />
  </svg>
);

export default HeroVisual;
