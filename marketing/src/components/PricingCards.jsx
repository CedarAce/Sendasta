import { useState } from "react";
import { Link } from "react-router-dom";

// ▼ Replace with your Stripe Payment Link once created at dashboard.stripe.com
// Leave as-is for now — the button will show a "contact us" popup instead
const STRIPE_BUSINESS_URL = null;

function trackEvent(eventName, params = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

function ContactModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 bg-blue-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-blue-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Start your free trial</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Drop us an email and we'll get you set up personally — usually within the same business day.
        </p>
        <a
          href="mailto:info@sendasta.com?subject=Sendasta Business Trial&body=Hi, I'd like to start a 30-day free trial of Sendasta Business for my team."
          className="block w-full bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold py-3 rounded-lg transition-colors text-sm mb-3"
          onClick={onClose}
        >
          Email us — info@sendasta.com
        </a>
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Maybe later
        </button>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-accent"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

const BUSINESS_FEATURES = [
  "Real-time wrong-recipient warning",
  "Block specific domains for your whole team",
  "Shared rules and policies, set once",
  "Automatic rollout via Microsoft 365 Admin",
  "Choose which team members get it",
  "Priority email support",
];

export default function PricingCards({ onContactClick }) {
  const [yearly, setYearly] = useState(true);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Billing toggle */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setYearly(false)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !yearly ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              yearly ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Yearly
          </button>
        </div>
        <span className={`text-sm font-semibold text-blue-accent transition-opacity duration-150 ${yearly ? "opacity-100" : "opacity-0"}`}>
          Save 20%
        </span>
      </div>

      {/* Business card — single centered card */}
      <div className="w-full max-w-125 mx-auto">
        <div className="rounded-xl p-8 flex flex-col ring-2 ring-blue-accent" style={{ backgroundColor: "#EEF4FF" }}>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-4xl font-bold text-navy">{yearly ? "$4" : "$5"}</span>
            <span className="text-sm text-gray-500">per user / month</span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            From small businesses to large enterprises — wherever a misdirected email can't be undone.
          </p>

          <div className="my-6 border-t border-blue-accent/20" />

          <ul className="flex flex-col gap-2.5">
            {BUSINESS_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check />
                <span className="text-sm text-gray-700">{f}</span>
              </li>
            ))}
          </ul>

          {STRIPE_BUSINESS_URL ? (
            <a
              href={STRIPE_BUSINESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("begin_checkout", { plan: "business", currency: "USD" })}
              className="mt-8 block text-center bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              Start 30-day free trial
            </a>
          ) : (
            <button
              onClick={() => {
                trackEvent("select_plan", { plan: "business_interest" });
                onContactClick();
              }}
              className="mt-8 w-full bg-blue-accent hover:bg-blue-accent-hover text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              Start 30-day free trial
            </button>
          )}
          <p className="text-center text-xs text-gray-500 mt-2.5">No credit card. Full access. Cancel anytime.</p>
        </div>
      </div>

      <p className="text-sm text-gray-400 text-center max-w-md">
        Need something custom for a larger team or specific compliance requirements?{' '}
        <a href="mailto:info@sendasta.com" className="text-blue-accent hover:underline">Email info@sendasta.com</a>
        {' '}— we'll figure it out.
      </p>
    </div>
  );
}
