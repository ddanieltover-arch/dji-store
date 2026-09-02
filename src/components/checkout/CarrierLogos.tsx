import React from 'react';
import type { CarrierId } from '../../lib/shipping/standardShipping';

interface CarrierLogoProps {
  carrier: CarrierId;
  className?: string;
}

/** Stylised carrier marks for checkout — text/SVG only, no external assets. */
export const CarrierLogo: React.FC<CarrierLogoProps> = ({ carrier, className = '' }) => {
  switch (carrier) {
    case 'dhl':
      return (
        <svg viewBox="0 0 72 24" className={className} aria-label="DHL">
          <rect width="72" height="24" rx="2" fill="#FFCC00" />
          <text x="36" y="16" textAnchor="middle" fill="#D40511" fontSize="13" fontWeight="800" fontFamily="Arial,sans-serif">
            DHL
          </text>
        </svg>
      );
    case 'fedex':
      return (
        <svg viewBox="0 0 72 24" className={className} aria-label="FedEx">
          <rect width="72" height="24" rx="2" fill="#fff" />
          <text x="22" y="16" fill="#4D148C" fontSize="11" fontWeight="800" fontFamily="Arial,sans-serif">
            Fed
          </text>
          <text x="48" y="16" fill="#FF6600" fontSize="11" fontWeight="800" fontFamily="Arial,sans-serif">
            Ex
          </text>
        </svg>
      );
    case 'dpd':
      return (
        <svg viewBox="0 0 72 24" className={className} aria-label="DPD">
          <rect width="72" height="24" rx="2" fill="#fff" />
          <rect x="0" y="0" width="72" height="24" rx="2" fill="#DC0032" opacity="0.08" />
          <text x="36" y="16" textAnchor="middle" fill="#DC0032" fontSize="13" fontWeight="800" fontFamily="Arial,sans-serif">
            DPD
          </text>
        </svg>
      );
    case 'gls':
      return (
        <svg viewBox="0 0 72 24" className={className} aria-label="GLS">
          <rect width="72" height="24" rx="2" fill="#061AB1" />
          <text x="36" y="16" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800" fontFamily="Arial,sans-serif">
            GLS
          </text>
        </svg>
      );
    case 'postnl':
      return (
        <svg viewBox="0 0 72 24" className={className} aria-label="PostNL">
          <rect width="72" height="24" rx="2" fill="#fff" />
          <text x="36" y="16" textAnchor="middle" fill="#FF6600" fontSize="11" fontWeight="800" fontFamily="Arial,sans-serif">
            PostNL
          </text>
        </svg>
      );
    case 'hermes':
      return (
        <svg viewBox="0 0 72 24" className={className} aria-label="Hermes">
          <rect width="72" height="24" rx="2" fill="#0091DA" />
          <text x="36" y="16" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800" fontFamily="Arial,sans-serif">
            Hermes
          </text>
        </svg>
      );
    default:
      return null;
  }
};
