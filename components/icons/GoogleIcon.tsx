
import React from 'react';

export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    width="24px" 
    height="24px"
  >
    <g fill="none" fillRule="evenodd">
      <path
        d="M20.64 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.71-1.58 2.68-3.9 2.68-6.62z"
        fill="#4285F4"
      />
      <path
        d="M12 21c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.36 0-4.36-1.6-5.07-3.74H3.85v2.33A8.99 8.99 0 0 0 12 21z"
        fill="#34A853"
      />
      <path
        d="M6.93 13.68a5.36 5.36 0 0 1 0-3.36V7.99H3.85a8.99 8.99 0 0 0 0 8.02l3.08-2.33z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.77c1.32 0 2.5.45 3.44 1.35l2.58-2.59A9 9 0 0 0 12 1a8.99 8.99 0 0 0-8.15 4.99l3.08 2.33c.7-2.14 2.7-3.74 5.07-3.74z"
        fill="#EA4335"
      />
    </g>
  </svg>
);
