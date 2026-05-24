// marketing/src/lib/trialState.js
// Derives the org's billing/trial state for UI. Light enforcement: the console
// is never blocked — we only show banners. States: paid | trialing |
// trial_ended | past_due | canceled | unknown.
export function computeTrialState(org) {
  if (!org) return { kind: 'unknown' }
  if (org.subscription_status === 'active') return { kind: 'paid' }
  if (org.subscription_status === 'past_due') return { kind: 'past_due' }
  if (org.subscription_status === 'canceled') return { kind: 'canceled' }

  const end = org.trial_ends_at ? new Date(org.trial_ends_at).getTime() : 0
  if (Date.now() < end) {
    return { kind: 'trialing', daysLeft: Math.max(1, Math.ceil((end - Date.now()) / 86400000)) }
  }
  return { kind: 'trial_ended' }
}
