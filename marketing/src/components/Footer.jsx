import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          {/* Logo + wordmark + tagline */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/logo-sendasta-white.svg"
                alt=""
                className="h-7 w-auto"
              />
              <span className="text-white font-bold text-lg tracking-tight">Sendasta</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
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

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-gray-600 text-sm">
            &copy; 2026 Sendasta. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1.5">
            Made in Ottawa, Canada
            <svg viewBox="0 0 640 480" className="h-3.5 w-auto rounded-[1px]" role="img" aria-label="Canadian flag">
              <path fill="#fff" d="M150.1 0h339.7v480H150z" />
              <path
                fill="#d52b1e"
                d="M-19.7 0h169.8v480H-19.7zm509.5 0h169.8v480H489.9zM201 232l-13.3 4.4 61.4 54c4.7 13.7-1.6 17.8-5.6 25l66.6-8.4-1.6 67 13.9-.3-3.1-66.6 66.7 8c-4.1-8.7-7.8-13.3-4-27.2l61.3-51-10.7-4c-8.8-6.8 3.8-32.6 5.6-48.9 0 0-35.7 12.3-38 5.8l-9.2-17.5-32.6 35.8c-3.5.9-5-.5-5.9-3.5l15-74.8-23.8 13.4q-3.2 1.3-5.2-2.2l-23-46-23.6 47.8q-2.8 2.5-5 .7L264 130.8l13.7 74.1c-1.1 3-3.7 3.8-6.7 2.2l-31.2-35.3c-4 6.5-6.8 17.1-12.2 19.5s-23.5-4.5-35.6-7c4.2 14.8 17 39.6 9 47.7"
              />
            </svg>
          </p>
        </div>
      </div>
    </footer>
  )
}
