import { usePageMeta } from '../hooks/usePageMeta'

const COMPANY = 'Sendasta'
const EFFECTIVE_DATE = 'April 19, 2026'
const CONTACT_EMAIL = 'info@sendasta.com'
const WEBSITE = 'https://sendasta.com'

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="text-gray-600 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  )
}

export default function PrivacyPolicy() {
  usePageMeta({
    title: 'Privacy Policy — Sendasta',
    description: 'Privacy Policy for Sendasta. We only read recipient email domains at send time to check your rules — we never read email content or store your messages.',
  })

  return (
    <main className="pt-16 bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{COMPANY} Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-12">Effective date: {EFFECTIVE_DATE}</p>

        <Section title="1. Introduction">
          <p>
            {COMPANY} ("we," "our," or "us") operates the {WEBSITE} website and the Sendasta Microsoft Outlook add-in
            (collectively, the "Service"). This Privacy Policy describes how we collect, use, and share information
            when you use our Service.
          </p>
          <p>
            By using the Service, you agree to the collection and use of information in accordance with this policy.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p><strong>Information you provide directly:</strong></p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Contact information submitted via our website forms (name, work email, company name, message)</li>
            <li>Account information for Enterprise customers (administrator email, organization name)</li>
          </ul>
          <p className="mt-3"><strong>Information collected automatically by the add-in:</strong></p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              Email recipient domain names — evaluated locally within Microsoft Outlook at the time of send,
              solely to enforce your configured policies. We do not read, store, or transmit email content or
              the full email addresses of recipients.
            </li>
            <li>Add-in configuration settings (enabled/disabled state, policy rules) for Enterprise users.</li>
          </ul>
          <p className="mt-3"><strong>Information collected from your browser:</strong></p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Standard web analytics data (page views, referral source, approximate location) via privacy-respecting analytics tools.</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>To provide, maintain, and improve the Service</li>
            <li>To respond to your inquiries and support requests</li>
            <li>To send transactional communications related to your account</li>
            <li>To enforce your organization's email policies (Enterprise plan)</li>
            <li>To analyze usage patterns and improve product functionality</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p className="mt-3">
            We do not sell your personal information to third parties. We do not use your information for
            behavioral advertising.
          </p>
        </Section>

        <Section title="4. Data Storage and Security">
          <p>
            Policy configurations for Enterprise accounts are stored on servers located in Canada and the United States.
            We implement industry-standard technical and organizational measures to protect your information against
            unauthorized access, alteration, disclosure, or destruction.
          </p>
          <p>
            Email content processed by the add-in is evaluated locally on your device and is never transmitted to our servers.
          </p>
        </Section>

        <Section title="5. Data Retention">
          <p>
            We retain personal information for as long as necessary to provide the Service and comply with our legal
            obligations. Contact form submissions are retained for 2 years. Enterprise account data is
            retained for the duration of the subscription plus 3 years following termination.
          </p>
        </Section>

        <Section title="6. Sharing Your Information">
          <p>We may share your information with:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong>Service providers</strong> who assist in operating our website and delivering the Service (e.g., form handling, analytics, cloud infrastructure), under confidentiality obligations</li>
            <li><strong>Legal authorities</strong> when required by law or to protect our rights</li>
            <li><strong>Business transfers</strong> in the event of a merger, acquisition, or sale of assets</li>
          </ul>
        </Section>

        <Section title="7. Your Rights">
          <p>
            Depending on your location, you may have the right to access, correct, delete, or restrict processing of
            your personal information. You may also have the right to data portability and to object to certain processing.
          </p>
          <p>
            To exercise any of these rights, please contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-accent hover:underline">{CONTACT_EMAIL}</a>.
          </p>
        </Section>

        <Section title="8. Cookies">
          <p>
            Our website uses essential cookies to enable basic functionality. We use analytics cookies to understand
            how visitors use our website. You can control cookie settings through your browser preferences.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            The Service is not directed to individuals under the age of 16. We do not knowingly collect personal
            information from children. If we become aware that a child has provided us with personal information,
            we will take steps to delete such information.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes by
            posting the new policy on this page and updating the effective date. Your continued use of the Service
            after changes are posted constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="mt-2 text-gray-700">
            <p><strong>{COMPANY}</strong></p>
            <p>
              Email:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-blue-accent hover:underline">{CONTACT_EMAIL}</a>
            </p>
            <p>Website: <a href={WEBSITE} className="text-blue-accent hover:underline">{WEBSITE}</a></p>
          </div>
        </Section>

      </div>
    </main>
  )
}
