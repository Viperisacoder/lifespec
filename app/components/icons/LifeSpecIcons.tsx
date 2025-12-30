export function LegacyIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      {/* Tree representing family legacy and long-term growth */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v18m-6-6h12M6 9h12M3 15h18"
      />
      {/* Stylized tree trunk and branches */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c-2 1-3 2.5-3 4s1 3 3 4c2-1 3-2.5 3-4s-1-3-3-4z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 8c-1.5 1-2 2.5-2 4s.5 3 2 4M16 8c1.5 1 2 2.5 2 4s-.5 3-2 4"
      />
      {/* Roots representing foundation */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21c-1.5-1-2.5-2-2.5-3.5M12 21c1.5-1 2.5-2 2.5-3.5"
      />
    </svg>
  );
}

export function SafetyIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      {/* Shield outline representing protection and security */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m7.784-4.817a.75.75 0 00-.925.746l1.692 5.955a.75.75 0 01-.69.917H2.887a.75.75 0 01-.69-.917l1.692-5.955a.75.75 0 00-.925-.746m15.456-3.956L12 2.75m0 0L3.265 6.227a.75.75 0 00-.427.643v7.237a6 6 0 002.946 5.029m8.216-10.139a6 6 0 002.946 5.029M9.305 6.227v7.237a6 6 0 002.946 5.029m0 0v-5.059m0 5.059V8.271"
      />
      {/* Simplified shield with checkmark */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2L3 6v5c0 5.55 4.5 10.74 9 12 4.5-1.26 9-6.45 9-12V6l-9-4z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4"
      />
    </svg>
  );
}

export function FinancialFoundationIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      {/* Bank/columns representing financial stability and structure */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2L2 7v2h20V7L12 2z"
      />
      {/* Left column */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 9v10h2V9H5z"
      />
      {/* Center column */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 9v10h2V9h-2z"
      />
      {/* Right column */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 9v10h2V9h-2z"
      />
      {/* Base line */}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 19h20"
      />
      {/* Stacked coins accent */}
      <circle cx="12" cy="14" r="1.5" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <circle cx="12" cy="16" r="1.5" stroke="currentColor" strokeWidth={1.5} fill="none" />
    </svg>
  );
}
