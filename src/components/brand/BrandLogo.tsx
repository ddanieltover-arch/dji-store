import React from 'react';

interface BrandLogoProps {
  variant: 'light' | 'dark';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant, className = '' }) => {
  const src =
    variant === 'dark'
      ? '/brand/dji-store-logo-dark.png'
      : '/brand/dji-store-logo-white.png';

  return (
    <img
      src={src}
      alt="DJI Store"
      className={`h-7 w-auto object-contain object-left ${className}`}
    />
  );
};
