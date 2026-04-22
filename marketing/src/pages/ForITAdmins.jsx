import { usePageMeta } from '../hooks/usePageMeta'

const SELF_INSTALL_STEPS = [
  {
    title: 'Download the Sendasta manifest file',
    detail: (
      <>
        Click the download button above to save{' '}
        <code className="bg-gray-100 text-gray-800 text-xs font-mono px-1.5 py-0.5 rounded border border-gray-200">
          manifest-sendasta.xml
        </code>{' '}
        to your computer. You'll need this file in the next step.
      </>
    ),
  },
  {
    title: 'Open Outlook on the web',
    detail: (
      <>
        Go to{' '}
        <a href="https://outlook.office.com" target="_blank" rel="noopener noreferrer" className="text-blue-accent hover:underline font-medium">
          outlook.office.com
        </a>{' '}
        and sign in with your Microsoft 365 account. (Desktop Outlook also works — the steps are the same.)
      </>
    ),
  },
  {
    title: 'Open the Add-ins manager',
    detail: 'Click the Apps icon in the Outlook toolbar, then click "Get add-ins". This opens the "Add-ins for Outlook" window.',
  },
  {
    title: 'Upload the manifest file',
    detail: 'In the left pane, select "My add-ins". Scroll to the bottom to find "Custom Add-ins". Click "Add a custom add-in" → "Add from file", then select the manifest-sendasta.xml file you downloaded.',
  },
  {
    title: 'Confirm the installation',
    detail: 'Outlook will show a confirmation prompt — click "Yes" to confirm. Sendasta appears immediately in your compose toolbar. Open a new email to see it.',
  },
]

export default function ForITAdmins() {
  usePageMeta({
    title: 'Setup Guide — How to Install Sendasta in Outlook',
    description: 'Install Sendasta in Outlook in 3 minutes. Step-by-step guide for self-install or full team deployment via the Microsoft 365 Admin Center.',
    canonical: 'https://sendasta.com/for-it-admins',
  })

  const steps = [
    {
      number: '01',
      title: 'Open the Exchange Admin Center',
      detail: (
        <>
          Navigate to{' '}
          <a
            href="https://admin.exchange.microsoft.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-accent hover:underline font-medium"
          >
            admin.exchange.microsoft.com
          </a>{' '}
          and sign in with your Microsoft 365 administrator account.
        </>
      ),
    },
    {
      number: '02',
      title: 'Go to Organization > Add-ins',
      detail: 'In the left navigation, expand "Organization" and select "Add-ins". This is where you manage all Outlook add-ins across your organization.',
    },
    {
      number: '03',
      title: 'Add from URL',
      detail: 'Click the "+" button to add a new add-in. When prompted, select "Add from URL" rather than the AppSource store.',
    },
    {
      number: '04',
      title: 'Paste the Sendasta manifest URL',
      detail: (
        <>
          Enter the following URL and click "Install":<br />
          <code className="mt-2 inline-block bg-gray-100 text-gray-800 text-sm font-mono px-3 py-1.5 rounded border border-gray-200">
            https://sendasta.com/manifest-sendasta.xml
          </code>
        </>
      ),
    },
    {
      number: '05',
      title: 'Assign to user groups',
      detail: 'After installation, configure which users or distribution groups have access. You can deploy to your entire organization or a specific pilot group. Set the deployment to "Mandatory" to ensure all users have the add-in.',
    },
    {
      number: '06',
      title: 'Sendasta appears in Outlook',
      detail: 'Within 24 hours (often within minutes), Sendasta will appear automatically in Outlook for all assigned users — on web, desktop, and Mac. No end-user action required.',
    },
  ]

  return (
    <main className="pt-16">

      {/* Header */}
      <section className="bg-navy py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-semibold text-blue-accent uppercase tracking-widest">Setup Guide</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Get Sendasta Running in Minutes
          </h1>
          <p className="mt-6 text-gray-300 text-lg max-w-2xl leading-relaxed">
            Installing just for yourself takes about 3 minutes. Rolling it out to your whole team
            takes about 5 — no AppSource approval, no end-user action needed.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-5 h-5 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Works on Outlook Web, Desktop &amp; Mac
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-5 h-5 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No AppSource listing required
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-5 h-5 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No IT expertise needed
            </div>
          </div>
        </div>
      </section>

      {/* Self install — individual users */}
      <section className="py-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-accent uppercase tracking-widest">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Just for me
            </span>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Install Sendasta for yourself</h2>
            <p className="mt-3 text-gray-500 text-sm leading-relaxed">
              Takes about 3 minutes. No admin access required — works on Outlook web and desktop.
            </p>

            {/* Download button */}
            <a
              href="/manifest-sendasta.xml"
              download="manifest-sendasta.xml"
              className="mt-5 inline-flex items-center gap-2.5 bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download manifest-sendasta.xml
            </a>
            <p className="mt-2 text-xs text-gray-400">Small XML file — your browser will save it to your Downloads folder</p>
          </div>

          <div className="flex flex-col gap-0">
            {SELF_INSTALL_STEPS.map((step, i) => (
              <div key={step.title} className="flex gap-6 relative">
                {i < SELF_INSTALL_STEPS.length - 1 && (
                  <div className="absolute left-5 top-11 bottom-0 w-px bg-gray-200" />
                )}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-accent/10 border-2 border-blue-accent/30 flex items-center justify-center z-10">
                  <span className="text-blue-accent font-bold text-xs">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="pb-8 flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mt-2 mb-1.5">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deployment steps — organization rollout */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-accent uppercase tracking-widest">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              For my whole team
            </span>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Deploy to your entire organization</h2>
            <p className="mt-3 text-gray-500 text-sm leading-relaxed">
              As an IT administrator, you can roll Sendasta out to your whole Microsoft 365 organization in minutes — no end-user action needed.
            </p>
          </div>

          <div className="flex flex-col gap-0">
            {steps.map((step, i) => (
              <div key={step.number} className="flex gap-6 relative">
                {/* Timeline line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-6 top-14 bottom-0 w-px bg-gray-200" />
                )}

                {/* Step number circle */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-accent/10 border-2 border-blue-accent/30 flex items-center justify-center z-10">
                  <span className="text-blue-accent font-bold text-sm">{step.number}</span>
                </div>

                {/* Content */}
                <div className="pb-10 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mt-2.5 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System requirements */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Requirements</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { label: 'Platform', value: 'Microsoft 365 (Exchange Online)' },
              { label: 'Outlook clients', value: 'Web, Desktop (Windows/Mac), New Outlook' },
              { label: 'Admin access required', value: 'Exchange Administrator or Global Administrator' },
              { label: 'End-user setup', value: 'None — fully centrally deployed' },
              { label: 'Manifest format', value: 'Office Add-in XML (Unified Manifest also available)' },
              { label: 'AppSource required', value: 'No — private sideload via Admin Center' },
            ].map((r) => (
              <div key={r.label} className="border border-gray-100 rounded-lg p-5">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{r.label}</p>
                <p className="text-gray-800 text-sm font-medium">{r.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Need help */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need help with deployment?</h2>
          <p className="text-gray-300 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
            Our team can walk you through the setup, help configure your domain policies, or schedule
            a live deployment session for your IT team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/#contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Contact Us
            </a>
            <a
              href="mailto:info@sendasta.com"
              className="w-full sm:w-auto px-8 py-3.5 border border-white/30 hover:border-white text-white font-semibold rounded-lg transition-colors text-sm"
            >
              info@sendasta.com
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
