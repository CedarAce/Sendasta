import { useState } from 'react'
import AdminPageHeader from '../../components/admin/AdminPageHeader'

const MANIFEST_URL = 'https://sendasta.com/sendasta-manifest.xml'

const DEPLOY_STEPS = [
  {
    title: 'Open Microsoft 365 admin center',
    body: 'Go to admin.microsoft.com → Settings → Integrated apps → Upload custom apps.',
  },
  {
    title: 'Upload the Sendasta manifest',
    body: 'Choose "Provide link to manifest file" and paste the manifest URL above.',
  },
  {
    title: 'Assign users',
    body:
      'Pick "Specific users/groups" and assign your Sendasta-licensed users. Save and they\'ll see Sendasta in Outlook within a few hours.',
  },
]

export default function Downloads() {
  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Downloads & Deployment"
        subtitle="Deploy Sendasta to your organization via the Microsoft 365 admin center."
      />

      <section className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-semibold text-navy mb-2">Manifest URL</h2>
        <p className="text-sm text-gray-600 mb-4">
          Use this URL when uploading the Sendasta add-in to Microsoft 365.
        </p>
        <CopyField value={MANIFEST_URL} />
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-navy mb-4">Deployment steps</h2>
        <ol className="space-y-4">
          {DEPLOY_STEPS.map((step, i) => (
            <li key={i} className="flex gap-4">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-accent text-white text-sm font-semibold flex items-center justify-center">
                {i + 1}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-navy">{step.title}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

function CopyField({ value }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex items-stretch gap-2">
      <input
        readOnly
        value={value}
        className="flex-1 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
      />
      <button
        onClick={onCopy}
        className="bg-blue-accent hover:bg-blue-accent-hover text-white text-sm font-semibold px-4 rounded-lg"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}
