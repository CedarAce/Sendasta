import { Link } from 'react-router-dom'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import { useSetup } from '../../context/SetupContext'

export default function SetupCenter() {
  const { steps, completedCount, total, allDone, loading, markDeployed } = useSetup()
  const pct = total ? Math.round((completedCount / total) * 100) : 0

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Setup Center"
        subtitle="A few steps to get Sendasta protecting your team's email."
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <ProgressRing pct={loading ? 0 : pct} />
          <div>
            <div className="text-sm font-semibold text-navy">
              {allDone ? "You're all set" : `${completedCount} of ${total} complete`}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {allDone
                ? 'Sendasta is configured and deployed. Nice work.'
                : 'Finish setup to get the most out of Sendasta.'}
            </div>
          </div>
        </div>

        <ol className="divide-y divide-gray-100">
          {steps.map((step, i) => (
            <StepRow key={step.id} step={step} index={i + 1} onMarkDone={markDeployed} />
          ))}
        </ol>
      </div>

      {allDone ? (
        <Link
          to="/admin/reporting"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-accent hover:underline"
        >
          See your first caught mistake (Reporting) →
        </Link>
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          When everything's done, this page disappears from your sidebar — and you'll see your first
          caught mistakes in{' '}
          <Link to="/admin/reporting" className="text-blue-accent hover:underline">
            Reporting
          </Link>
          .
        </p>
      )}
    </div>
  )
}

function StepRow({ step, index, onMarkDone }) {
  return (
    <li className="flex items-start gap-4 px-5 py-4">
      <StepMark done={step.done} index={index} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-semibold ${step.done ? 'text-gray-400 line-through' : 'text-navy'}`}>
            {step.title}
          </span>
          {step.optional && (
            <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
              Optional
            </span>
          )}
          {step.hint && !step.done && (
            <span className="text-[11px] text-gray-400">{step.hint}</span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
        {!step.done && (
          <div className="mt-2 flex items-center gap-3">
            <Link
              to={step.to}
              className="inline-flex items-center text-sm font-medium text-blue-accent hover:underline"
            >
              {step.cta} →
            </Link>
            {step.kind === 'manual' && (
              <button
                type="button"
                onClick={() => onMarkDone(true)}
                className="text-sm font-medium text-gray-500 hover:text-navy"
              >
                Mark as done
              </button>
            )}
          </div>
        )}
        {step.done && step.kind === 'manual' && (
          <button
            type="button"
            onClick={() => onMarkDone(false)}
            className="mt-1 text-xs text-gray-400 hover:text-gray-600"
          >
            Undo
          </button>
        )}
      </div>
    </li>
  )
}

function StepMark({ done, index }) {
  if (done) {
    return (
      <div className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-green-500 flex items-center justify-center">
        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  }
  return (
    <div className="mt-0.5 w-6 h-6 shrink-0 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-semibold text-gray-400">
      {index}
    </div>
  )
}

function ProgressRing({ pct }) {
  const r = 18
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <div className="relative w-12 h-12 shrink-0">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="#4f8cff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-navy">
        {pct}%
      </span>
    </div>
  )
}
