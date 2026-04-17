export default function ForITAdmins() {
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
            https://sendasta.com/manifest.xml
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
            Deploy Sendasta to Your Organization in 5 Minutes
          </h1>
          <p className="mt-6 text-gray-300 text-lg max-w-2xl leading-relaxed">
            No AppSource approval required. No end-user action needed. Deploy privately
            to your entire Microsoft 365 organization directly through the Exchange Admin Center.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-5 h-5 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No AppSource listing
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-5 h-5 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Centrally managed
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-5 h-5 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Works on Outlook Web, Desktop, and Mac
            </div>
          </div>
        </div>
      </section>

      {/* Deployment steps */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">Deployment Steps</h2>

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

      {/* Install guide video */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Walkthrough</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <video
              className="w-full"
              src="/assets/videos/video02.mp4"
              poster="/assets/videos/video02_poster.jpg"
              controls
              muted
              playsInline
            />
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
