import React from 'react';
import logoSvg from '@/assets/toolmaster-logo.svg';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <div 
      className={`inline-block rounded-full overflow-hidden shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      <img 
        src={logoSvg} 
        alt="ToolMaster Logo" 
        className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
      />
    </div>
  );
}

export default Logo;