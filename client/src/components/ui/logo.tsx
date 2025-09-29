import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.8)" />
        </linearGradient>
        <filter id="logoShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.1"/>
        </filter>
      </defs>
      
      {/* Main container circle */}
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="url(#logoGradient)"
        filter="url(#logoShadow)"
        className="transition-all duration-200"
      />
      
      {/* Tool icons arranged in a creative pattern */}
      {/* Wrench icon */}
      <g transform="translate(8, 8)" fill="hsl(var(--primary-foreground))">
        <path
          d="M10.5 2L9 3.5L11.5 6L10 7.5L7.5 5L6 6.5L8.5 9L7 10.5L4.5 8L3 9.5L5.5 12L4 13.5L1.5 11L0 12.5L2.5 15L4 13.5L6.5 16L8 14.5L5.5 12L7 10.5L9.5 13L11 11.5L8.5 9L10 7.5L12.5 10L14 8.5L11.5 6L13 4.5L15.5 7L17 5.5L14.5 3L13 4.5L10.5 2Z"
          transform="scale(0.8)"
        />
      </g>
      
      {/* Gear/Settings icon */}
      <g transform="translate(24, 10)" fill="hsl(var(--primary-foreground))">
        <circle cx="4" cy="4" r="2" />
        <path
          d="M7.5 4C7.5 5.933 5.933 7.5 4 7.5S0.5 5.933 0.5 4 2.067 0.5 4 0.5 7.5 2.067 7.5 4Z"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="0.5"
          fill="none"
        />
      </g>
      
      {/* Code brackets */}
      <g transform="translate(6, 24)" fill="hsl(var(--primary-foreground))" opacity="0.9">
        <path d="M2 0L0 2L2 4" stroke="hsl(var(--primary-foreground))" strokeWidth="1.2" fill="none"/>
        <path d="M6 0L8 2L6 4" stroke="hsl(var(--primary-foreground))" strokeWidth="1.2" fill="none"/>
      </g>
      
      {/* Calculator/Grid icon */}
      <g transform="translate(26, 26)" fill="hsl(var(--primary-foreground))" opacity="0.8">
        <rect x="0" y="0" width="2" height="2" rx="0.2"/>
        <rect x="3" y="0" width="2" height="2" rx="0.2"/>
        <rect x="0" y="3" width="2" height="2" rx="0.2"/>
        <rect x="3" y="3" width="2" height="2" rx="0.2"/>
      </g>
      
      {/* Central highlight dot */}
      <circle
        cx="20"
        cy="20"
        r="2"
        fill="hsl(var(--primary-foreground))"
        opacity="0.3"
      />
    </svg>
  );
}

export default Logo;