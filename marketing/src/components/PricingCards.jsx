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

const FREE_FEATURES = [
  "Real-time wrong-recipient warning",
  "Basic domain filter",
  "Self-install in under 5 minutes",
  "Works on Outlook web, desktop, and Mac",
];

const BUSINESS_FEATURES = [
  "Everything in Personal, plus:",
  "Block specific domains for your whole team",
  "Shared rules and policies, set once",
  "Automatic rollout via Microsoft 365 Admin",
  "Choose which team members get it",
  "Priority email support",
];

const ENTERPRISE_FEATURES = [
  "Everything in Business, plus:",
  "Dedicated onboarding session",
  "We configure your domain policy with you",
  "Priority support — 4-hour response time",
  "Quarterly policy review",
  "Audit logs and email alert history",
  "Multi-team and department management",
  "Dedicated account contact",
];

function Card({ highlight, children }) {
  if (highlight) {
    return (
      <div
        className="rounded-xl p-7 flex flex-col h-full relative ring-2 ring-blue-accent"
        style={{ backgroundColor: "#EEF4FF" }}
      >
        <div className="absolute top-0 right-0 bg-blue-accent text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
          Most Popular
        </div>
        {children}
      </div>
    );
  }
  return <div className="bg-white border border-gray-200 rounded-xl p-7 flex flex-col h-full">{children}</div>;
}

export default function PricingCards({ onContactClick }) {
  const labelClass = (highlight) =>
    `text-xs font-semibold uppercase tracking-wider ${highlight ? "text-blue-accent" : "text-gray-400"}`;

  const priceClass = (highlight) => `text-4xl font-bold ${highlight ? "text-navy" : "text-gray-900"}`;

  const subNoteClass = (highlight) => `mt-1 text-xs ${highlight ? "text-gray-500" : "text-gray-400"}`;

  const descClass = (highlight) => `mt-3 text-sm leading-relaxed ${highlight ? "text-gray-700" : "text-gray-500"}`;

  const dividerClass = (highlight) => `my-6 border-t ${highlight ? "border-blue-accent/20" : "border-gray-100"}`;

  const featureTextClass = (highlight, isHeader) => {
    if (isHeader) return "text-sm text-blue-accent font-medium";
    return `text-sm ${highlight ? "text-gray-700" : "text-gray-600"}`;
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl w-full mx-auto items-stretch">
        {/* Personal */}
        <Card>
          <span className={labelClass(false)}>Personal</span>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className={priceClass(false)}>$0</span>
          </div>
          <p className={subNoteClass(false)}>Free forever</p>
          <p className={descClass(false)}>For individuals who want to stop misdirected emails on their own inbox.</p>

          <div className={dividerClass(false)} />

          <ul className="flex flex-col gap-2.5 flex-1">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check />
                <span className={featureTextClass(false, false)}>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/for-it-admins"
            onClick={() => trackEvent("select_plan", { plan: "free" })}
            className="mt-8 block text-center border border-gray-300 hover:border-blue-accent hover:text-blue-accent text-gray-600 font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            Install Free
          </Link>
          <p className="text-center text-xs text-gray-400 mt-2.5">No account needed. Works immediately.</p>
        </Card>

        {/* Business */}
        <Card highlight>
          <span className={labelClass(true)}>Business</span>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className={priceClass(true)}>$4</span>
            <span className="text-sm text-gray-500">/user/month</span>
          </div>
          <p className={subNoteClass(true)}>Billed annually ($48/user/year). Or $5/user/month billed monthly. 5-user minimum.</p>
          <p className={descClass(true)}>For small firms where one wrong email can end a client relationship. Cheaper than one billable hour spent fixing a misdirected email.</p>
          <div className={dividerClass(true)} />
          <ul className="flex flex-col gap-2.5 flex-1">
            {BUSINESS_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check />
                <span className={featureTextClass(true, f.startsWith("Everything"))}>{f}</span>
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
        </Card>
      </div>

      <p className="text-sm text-gray-400 text-center max-w-md">
        Need something custom for a larger team or specific compliance requirements?{' '}
        <a href="mailto:info@sendasta.com" className="text-blue-accent hover:underline">Email info@sendasta.com</a>
        {' '}— we'll figure it out.
      </p>
    </div>
  );
}
