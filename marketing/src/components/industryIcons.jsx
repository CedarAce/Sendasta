export function ScaleIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18M12 3l-6 4M12 3l6 4M3 7l3 7a3 3 0 006 0l-3-7M15 7l3 7a3 3 0 006 0l-3-7M5 21h14" />
    </svg>
  )
}

export function HandshakeIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l3 3 7-7M3 12l4-4 4 2 3-3 4 2 3 3-3 3-3-2-3 3-4-2-4 4z" />
    </svg>
  )
}

export function HeartPulseIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.8 8.6c0 5.4-8.8 10.4-8.8 10.4S3.2 14 3.2 8.6a4.6 4.6 0 018.8-1.8 4.6 4.6 0 018.8 1.8zM3.5 11h4l1.5-3 2 5 1.5-3h8" />
    </svg>
  )
}

export function ReceiptIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6M9 12h6" />
    </svg>
  )
}

export function DraftingCompassIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l8 18H4L12 3z" />
      <circle cx="12" cy="3" r="1.5" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15h6" />
    </svg>
  )
}
