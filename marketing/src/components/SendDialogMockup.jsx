export default function SendDialogMockup({ heading, note, domains, confirmText = 'Confirm this is intentional.' }) {
  return (
    <div
      className="max-w-md mx-auto rounded-[4px] bg-white shadow-[0_25.6px_57.6px_rgba(0,0,0,0.16),0_4.8px_14.4px_rgba(0,0,0,0.12)] overflow-hidden select-none"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-1.5">
        <span className="text-[15px] font-semibold text-[#1b1a19]">Message from Add-in: Sendasta</span>
        <svg className="w-3 h-3 text-[#605e5c] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" />
        </svg>
      </div>
      <div className="flex gap-3.5 px-5 pt-2 pb-1">
        <svg className="w-6 h-6 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="#d13438" strokeWidth="3" strokeLinecap="round">
          <line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" />
        </svg>
        <div className="text-[13.5px] leading-relaxed text-[#1f1f1f]">
          <p className="font-semibold mb-2 text-[14px]">{heading}</p>
          {note && <p className="my-2">{note}</p>}
          {domains?.length > 0 && (
            <ul className="my-2 pl-5 space-y-0.5 list-disc marker:text-[#d13438]">
              {domains.map((d) => <li key={d}>{d}</li>)}
            </ul>
          )}
          <p className="my-2">{confirmText}</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 px-5 pb-5 pt-3">
        <button type="button" tabIndex={-1} className="min-w-[110px] text-[13px] font-semibold px-4 py-2 rounded-[2px] bg-white border border-[#8a8886] text-[#201f1e]">
          Send anyway
        </button>
        <button type="button" tabIndex={-1} className="min-w-[110px] text-[13px] font-semibold px-4 py-2 rounded-[2px] bg-[#f4959b] border border-[#f4959b] text-[#201f1e]">
          Don't send
        </button>
      </div>
    </div>
  )
}
