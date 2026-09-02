// Stylized peach + crown brand mark (SVG) used in the header / app.
const PeachLogo = ({ size = 46 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="peachGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="55%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#d6337a" />
        </linearGradient>
        <linearGradient id="crownGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5dca3" />
          <stop offset="100%" stopColor="#c9a15a" />
        </linearGradient>
      </defs>
      {/* crown */}
      <path
        d="M20 14 L26 20 L32 12 L38 20 L44 14 L42 24 L22 24 Z"
        fill="url(#crownGrad)"
      />
      {/* peach body: two lobes */}
      <path
        d="M32 26 C22 26 16 34 16 43 C16 53 24 58 32 58 C40 58 48 53 48 43 C48 34 42 26 32 26 Z"
        fill="url(#peachGrad)"
      />
      {/* center crease */}
      <path
        d="M32 30 C29 36 29 50 32 56"
        stroke="#b31e63"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* leaf */}
      <path
        d="M36 26 C40 22 46 22 48 24 C46 28 40 30 36 28 Z"
        fill="#7bbf6a"
      />
    </svg>
  );
};

export default PeachLogo;
