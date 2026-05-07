import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          {/* Logo + tagline */}
          <div className="flex flex-col gap-3">
            <img
              src="/assets/logo-sendasta-white.svg"
              alt="Sendasta"
              className="h-7 w-auto"
            />
            <p className="text-gray-500 text-sm">
              Enterprise email misdirection prevention for Microsoft Outlook.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
            <div className="flex flex-col gap-2">
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Product</span>
              <Link to="/for-it-admins" className="text-gray-400 hover:text-white text-sm transition-colors">For IT Admins</Link>
              <Link to="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</Link>
              <Link to="/faq" className="text-gray-400 hover:text-white text-sm transition-colors">FAQ</Link>
              <a href="/#contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Legal</span>
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Connect</span>
              <a
                href="https://www.linkedin.com/company/sendasta/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com/getsendasta"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Twitter / X
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-gray-600 text-sm">
            &copy; 2026 Sendasta. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
