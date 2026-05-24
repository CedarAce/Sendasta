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
              <path fill="#fff" d="M81.1 0h477.5v480H81.1z" />
              <path
                fill="#d52b1e"
                d="M-19.7 0H81.1v480H-19.7zm578.3 0h100.8v480H558.6zM135 232l-13.2 4.6 61 53.6c4.6 13.8-1.6 17.9-5.6 25.1l66.3-8.4-1.6 66.8 13.8-.4-3.1-66.3 66.5 7.8c-4.1-8.2-7.8-12.6-4-25.8l60.9-50.7-10.7-3.9c-8.8-6.8 3.8-32.6 5.6-48.9 0 0-35.7 12.3-38 5.8l-9.2-17.5-32.6 35.8c-3.5.9-5-.5-5.9-3.5l15-74.8-23.8 13.4c-2 .9-4 .1-5.3-2.2l-23-46-23.6 47.8c-1.8 1.7-3.6.9-5.2-.4l-22.7-12.7 13.7 74.3c-1.1 3-3.7 3.9-6.7 2.4L160 197.3l-8.6 16.4c-1.9 3-4.7 2.6-9.1 1.5l-34.8-12 12.7 49.4c2.7 10.4 4.8 14.7-2.9 17.5z"
              />
            </svg>
          </p>
        </div>
      </div>
    </footer>
  )
}
