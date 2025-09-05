import React from 'react';

export default function LoadingIcon() {
  // Color for the icon when it's "empty" or the background
  const mutedColor = "#3d3d3d"; // Corresponds to neutral-800
  
  // Color for the icon as it "fills up"
  const fillColor = "#D25430";  // Burnt orange

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Loading content"
      >
        <style>
          {`
            @keyframes fillUp {
              0% { transform: scaleY(0); }
              100% { transform: scaleY(1); }
            }
            .fill-anim-rect {
              animation: fillUp 1.5s ease-out infinite alternate;
              transform-origin: bottom; /* Animation starts from the bottom */
            }
          `}
        </style>

        <defs>
          <clipPath id="fillClip">
            <rect x="0" y="0" width="100" height="100" className="fill-anim-rect" />
          </clipPath>
        </defs>

        {/* --- Background Code Brackets (muted stroke) --- */}
        <g
          stroke={mutedColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Left Bracket */}
          <path d="M40 20 L20 50 L 40 80" />
          {/* Right Bracket */}
          <path d="M60 20 L80 50 L 60 80" />
        </g>

        {/* --- Foreground Fill (animated with vibrant stroke) --- */}
        {/* This group is masked by the clipPath, revealing the colored stroke inside */}
        <g
          clipPath="url(#fillClip)"
          stroke={fillColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Left Bracket */}
          <path d="M40 20 L20 50 L 40 80" />
          {/* Right Bracket */}
          <path d="M60 20 L80 50 L 60 80" />
        </g>
      </svg>
      <p className="text-sm font-medium text-neutral-400">Hacking away...</p>
    </div>
  );
}