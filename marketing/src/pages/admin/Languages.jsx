import AdminPageHeader from '../../components/admin/AdminPageHeader'
import TodoBanner from '../../components/admin/TodoBanner'

const LANGUAGES = [
  { code: 'en', label: 'English', enabled: true },
  { code: 'es', label: 'Spanish', enabled: false },
  { code: 'fr', label: 'French', enabled: false },
  { code: 'de', label: 'German', enabled: false },
]

export default function Languages() {
  return (
    <div className="max-w-5xl">
      <AdminPageHeader
        title="Languages"
        subtitle="Set the language for Sendasta's warning messages and admin console."
      />
      <TodoBanner>TODO: wire to Supabase (organizations.locale)</TodoBanner>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <ul className="divide-y divide-gray-100">
          {LANGUAGES.map((lang) => (
            <li key={lang.code} className="flex items-center justify-between py-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="language"
                  defaultChecked={lang.code === 'en'}
                  disabled={!lang.enabled}
                  className="accent-blue-accent"
                />
                <span className={`text-sm ${lang.enabled ? 'text-navy' : 'text-gray-400'}`}>
                  {lang.label}
                </span>
              </label>
              {!lang.enabled && (
                <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  Coming soon
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
