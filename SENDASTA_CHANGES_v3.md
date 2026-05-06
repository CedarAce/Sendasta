# Sendasta — Final Change Spec (v3)

This is the consolidated set of changes. Work top to bottom: `index.html` first, then the homepage sections in the order they appear on the page.

For each change: **FIND** what's there now, **REPLACE** with the new text. If a section is marked **NEW**, it doesn't exist yet — add it in the indicated location. If marked **REMOVE**, delete cleanly.

Do not change layout, components, or styling unless explicitly noted. Only update text content and the items called out as new sections.

---

## What's new in v3

- **Pricing restructured from 3 tiers to 2 tiers.** Enterprise tier removed. "Free" tier renamed to "Personal."
- **Business tier moved from flat $299/year to per-user pricing**: $4/user/month billed annually ($48/user/year), or $5/user/month billed monthly. 5-user minimum.
- **30-day free trial** on Business, no credit card required to start.
- Schema, stats closing line, and verification checklist all updated to reflect new pricing.

---

# PART 1 — `index.html` (head/meta)

## 1.1 Title tag

**FIND:**
```html
<title>Sendasta — Stop Sending Emails to the Wrong Person in Outlook</title>
```

**REPLACE WITH:**
```html
<title>Sendasta — Misdirected Email Prevention for Outlook</title>
```

## 1.2 Meta description

**FIND:**
```html
<meta name="description" content="Sendasta warns you the moment Outlook autocomplete puts the wrong recipient in your email. Free to try, 5-minute setup. Works on Outlook web, desktop, and Mac." />
```

**REPLACE WITH:**
```html
<meta name="description" content="Misdirected email prevention for Outlook. Sendasta warns you the moment autocomplete picks the wrong recipient — before the contract reaches a competitor's inbox. Free, 5-min install." />
```

## 1.3 Open Graph title

**FIND:**
```html
<meta property="og:title" content="Sendasta — Stop Sending Emails to the Wrong Person in Outlook" />
```

**REPLACE WITH:**
```html
<meta property="og:title" content="Sendasta — Misdirected Email Prevention for Outlook" />
```

## 1.4 Open Graph description

**FIND:**
```html
<meta property="og:description" content="Sendasta warns you the moment Outlook autocomplete puts the wrong recipient in your email. Free to try, 5-minute setup. Works on Outlook web, desktop, and Mac." />
```

**REPLACE WITH:**
```html
<meta property="og:description" content="Misdirected email prevention for Outlook. Sendasta warns you the moment autocomplete picks the wrong recipient — before the contract reaches a competitor's inbox. Free, 5-min install." />
```

## 1.5 Twitter Card title

**FIND:**
```html
<meta name="twitter:title" content="Sendasta — Stop Sending Emails to the Wrong Person in Outlook" />
```

**REPLACE WITH:**
```html
<meta name="twitter:title" content="Sendasta — Misdirected Email Prevention for Outlook" />
```

## 1.6 Twitter Card description

**FIND:**
```html
<meta name="twitter:description" content="Sendasta warns you the moment Outlook autocomplete puts the wrong recipient in your email. Free to try, 5-minute setup. Works on Outlook web, desktop, and Mac." />
```

**REPLACE WITH:**
```html
<meta name="twitter:description" content="Misdirected email prevention for Outlook. Sendasta warns you the moment autocomplete picks the wrong recipient — before the contract reaches a competitor's inbox. Free, 5-min install." />
```

## 1.7 Schema description

**FIND** (inside the JSON-LD block):
```json
"description": "Sendasta is a Microsoft Outlook add-in that warns you the moment autocomplete puts the wrong recipient in your email — before you hit send.",
```

**REPLACE WITH:**
```json
"description": "Misdirected email prevention for Microsoft Outlook. Sendasta catches the wrong recipient before send — built for small firms handling sensitive client communications.",
```

## 1.8 Schema offers — full replacement (two tiers, per-user pricing)

**FIND** (the entire `"offers"` array in the JSON-LD block):
```json
"offers": [
  {
    "@type": "Offer",
    "name": "Free",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Real-time wrong-recipient warnings for individual use. No sign-up required."
  },
  {
    "@type": "Offer",
    "name": "Business",
    "price": "299",
    "priceCurrency": "USD",
    "description": "Team-wide domain rules and centralized rollout for up to 25 users. Billed annually."
  },
  {
    "@type": "Offer",
    "name": "Enterprise",
    "description": "Custom pricing for 100+ users. Includes dedicated onboarding, audit logs, priority support."
  }
]
```

**REPLACE WITH:**
```json
"offers": [
  {
    "@type": "Offer",
    "name": "Personal",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Real-time wrong-recipient warnings for individual use. Free forever. No sign-up required."
  },
  {
    "@type": "Offer",
    "name": "Business",
    "price": "48",
    "priceCurrency": "USD",
    "description": "Team-wide domain rules and centralized rollout. $4/user/month billed annually ($48/user/year), or $5/user/month billed monthly. 5-user minimum. 30-day free trial.",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "48",
      "priceCurrency": "USD",
      "unitCode": "ANN",
      "referenceQuantity": {
        "@type": "QuantitativeValue",
        "value": "1",
        "unitCode": "C62",
        "unitText": "user"
      }
    }
  }
]
```

## 1.9 NEW — add Open Graph image (flag for follow-up)

After the existing `og:description` line, add (commented out until an image asset exists):

```html
<!-- TODO: Add og:image once a 1200x630 hero image is available -->
<!-- <meta property="og:image" content="https://sendasta.com/og-image.png" /> -->
```

---

# PART 2 — Homepage (top to bottom)

## 2.1 HERO SECTION

### 2.1.1 H1

**FIND:**
```
Stop the Wrong Email Before It's Too Late
```

**REPLACE WITH:**
```
The wrong recipient is one autocomplete away.
```

### 2.1.2 Subhead

**FIND:**
```
One wrong autocomplete and your client's contract lands in a competitor's inbox. Sendasta warns you the moment it spots the wrong recipient — before you hit send.
```

**REPLACE WITH:**
```
Sendasta watches every email you send and stops the ones going to the wrong person — the competitor, the former client, the John Smith you didn't mean. Before you hit send, not after.
```

### 2.1.3 NEW — positioning line (insert under subhead, above the CTAs)

**ADD as a new paragraph** between the subhead and the CTA buttons:
```
Built for small firms where one wrong email can end a client relationship — law, accounting, consulting, and other professional services.
```

**Styling note:** smaller and lighter weight than the subhead. A muted gray, single line if it fits; otherwise wrap naturally.

### 2.1.4 Primary CTA

**FIND:**
```
Try Now — Install Free
```

**REPLACE WITH:**
```
Try Free — 5 min install
```

### 2.1.5 Secondary CTA

**FIND:**
```
Learn More
```

**REPLACE WITH:**
```
See how it works
```

### 2.1.6 Supporting line below CTAs

**FIND:**
```
Free forever for personal use. No credit card needed.
```

**REPLACE WITH:**
```
Free for personal use · No credit card · Works on Outlook web, desktop, and Mac
```

### 2.1.7 REMOVE — Microsoft logo line

**FIND and DELETE:**
```
[Microsoft logo] Works exclusively with Microsoft 365 & Outlook
```

(The "Works on Outlook web, desktop, and Mac" copy in the supporting line above replaces this.)

### 2.1.8 REMOVE — "Used by" pill row

**FIND and DELETE the entire row:**
```
Used by: Law Firms · Accounting · Consultancies · Recruiters · Real Estate · Finance
```

### 2.1.9 REMOVE — three-stat block at bottom of hero

**FIND and DELETE the entire block:**
```
1 in 3 — employees has sent an email to the wrong person
Free — to try, no credit card, no sign-up, works today
5 min — to set up, no IT experience needed
```

(Replaced by a new, expanded stats section later — see 2.6.)

---

## 2.2 NEW SECTION — Autocomplete trap (villain section)

**Insert this as a new section between the hero and the existing "Sound familiar?" section.**

### Section heading
```
Outlook autocomplete was built for 2003.
```

### Body
```
Back then your contact list had 50 names and the worst-case mistake was an awkward apology. Today it has thousands, half of them similar, and one wrong selection sends a privileged document to a competitor, a former client, or somebody's personal Gmail.

Outlook hasn't fixed this. The feature is unchanged. The stakes aren't.

Sendasta is the layer that should have been built into Outlook fifteen years ago.
```

### Closing line (smaller, muted text below body)
```
Used in environments subject to GDPR, PIPEDA, and confidentiality obligations like attorney-client privilege.
```

**Styling note:** Match the typographic weight of the hero subhead for the body. The closing compliance line should be smaller and muted gray. No icons, no images.

---

## 2.3 SOUND FAMILIAR SECTION

### 2.3.1 Section heading (keep as-is)
```
Sound familiar?
```

### 2.3.2 Body

**FIND:**
```
Every day, someone at a small business sends a sensitive email to the wrong person — a former client, a competitor, or the wrong "John Smith" in their contacts. Outlook's autocomplete makes it easy to miss.

Sendasta catches it before it leaves your outbox.
```

**REPLACE WITH:**
```
You start typing a name. Outlook fills in the rest. You attach the file, hit send, and a second later realize the autocomplete grabbed the wrong contact — the one with the similar last name, the old client, the personal address. By then it's gone.

Sendasta catches it before it leaves your outbox.
```

---

## 2.4 HOW IT WORKS SECTION

### 2.4.1 Section header

**FIND:**
```
How It Works
Simple to set up. Works in the background.
```

**REPLACE WITH:**
```
Three steps. Five minutes.
```

(Single line, no subtitle.)

### 2.4.2 Step 1 heading

**FIND:**
```
Install in minutes — no IT expertise needed
```

**REPLACE WITH:**
```
Install
```

### 2.4.3 Step 1 body

**FIND:**
```
Add Sendasta to Outlook in a few clicks — for yourself, or for your whole team. Works on Outlook web, desktop, and Mac. No technical knowledge required.
```

**REPLACE WITH:**
```
Add Sendasta to your own Outlook in a few clicks, or roll it out to your whole team through Microsoft 365 Admin. Works on Outlook web, desktop, and Mac. No technical knowledge required.
```

### 2.4.4 Step 2 heading

**FIND:**
```
Tell it who to watch out for
```

**REPLACE WITH:**
```
Set your rules
```

### 2.4.5 Step 2 body

**FIND:**
```
Add the domains you want Sendasta to flag — a competitor, a personal email address, a client that should never be mixed with another. Takes about 2 minutes to set up.
```

**REPLACE WITH:**
```
Tell Sendasta which domains to flag — competitors, former clients, personal addresses, anything that should never receive your work email. Add no-combine pairs for clients who must stay separated. Takes about two minutes.
```

### 2.4.6 Step 3 heading

**FIND:**
```
Sendasta quietly checks every email you send
```

**REPLACE WITH:**
```
Send normally
```

### 2.4.7 Step 3 body

**FIND:**
```
The moment you click send, Sendasta checks your recipients. If something looks off, it pauses and gives you a chance to review — before the email goes anywhere.
```

**REPLACE WITH:**
```
When you click Send, Sendasta checks your recipients against your rules. If something looks off, it pauses and shows you why. If everything checks out, the email goes. You won't notice it most days. The day you do, it's worth it.
```

### 2.4.8 Keep all UI mockup illustrations as-is.

---

## 2.5 FEATURES SECTION

### 2.5.1 Section header

**FIND:**
```
Features
Everything you need. Nothing you don't.
```

**REPLACE WITH:**
```
What it actually does
```

(Single line, no subtitle.)

### 2.5.2 Feature 1 heading

**FIND:**
```
Real-time check
Catches the wrong recipient instantly
```

**REPLACE WITH:**
```
Catches recipients that don't belong
```

(Remove the "Real-time check" eyebrow if it exists separately.)

### 2.5.3 Feature 1 body

**FIND:**
```
The moment you add someone from the wrong company, Sendasta flags it. A quick popup gives you a chance to double-check before anything is sent — every single time.
```

**REPLACE WITH:**
```
When the recipients on an email don't match — a competitor's domain mixed with your client's, a personal address mixed with a corporate one — Sendasta pauses the send and asks you to confirm. Works on every Send and every Reply All.
```

### 2.5.4 Feature 1 bullet list — keep as-is:
- Checks every Send, including Reply All
- Works on Outlook web, desktop, and Mac
- Flags mismatched company domains

### 2.5.5 Feature 2 heading

**FIND:**
```
Domain rules
Flag the domains that should never get your emails
```

**REPLACE WITH:**
```
Enforces a rule, not a hope
```

### 2.5.6 Feature 2 body

**FIND:**
```
Add competitors, former clients, or any off-limits address to your watchlist. When someone on that list appears in a send, Sendasta stops and asks you to confirm before anything goes out.
```

**REPLACE WITH:**
```
Add the domains you don't want emails going to, ever. Competitors. Former clients. The journalist's address you accidentally added six months ago. Sendasta requires a deliberate "Send Anyway" — no silent slips.
```

### 2.5.7 Feature 2 bullet list — keep as-is:
- Requires a deliberate "Send Anyway" to override — no silent slips
- No-combine pairs for competing clients who must never share an email
- Trusted pairs to silence alerts for known-safe combos

### 2.5.8 Feature 3 heading

**FIND:**
```
For the whole team
One deployment, everyone protected
```

**REPLACE WITH:**
```
One deployment, whole team
```

### 2.5.9 Feature 3 body

**FIND:**
```
Roll Sendasta out to your whole team through Microsoft 365 Admin in about 5 minutes — no end-user setup, no per-person configuration. Everyone gets the same protection automatically.
```

**REPLACE WITH:**
```
Roll out through Microsoft 365 Admin in about five minutes. No per-user setup, no end-user action. Everyone protected automatically.
```

### 2.5.10 Feature 3 bullet list — keep as-is:
- Deploy once through Microsoft 365 Admin Center
- No end-user action or setup required
- Works on Outlook web, desktop, and new Outlook for Mac

---

## 2.6 NEW SECTION — Stats block

**Insert this as a new section between Features and Testimonials.**

### Section heading
```
The numbers nobody likes to talk about
```

### Five stats, displayed horizontally (or in a 5-up grid; 2-3-stack on mobile)

**Stat 1:**
```
65%
of organizations had data leave through email by employee mistake in the past year.
Source: Ponemon, 2022
```

**Stat 2:**
```
1 in 3
employees has sent an email to the wrong person.
Source: Tessian, 2022
```

**Stat 3:**
```
27%
of data protection incidents involve misdirected emails.
Source: Verizon DBIR (verify before publishing)
```

**Stat 4:**
```
47%
of misdirected emails are discovered by the recipient, not by security tools.
Source: verify before publishing
```

**Stat 5:**
```
$4.45M
average cost of a data breach involving misdirected email.
Source: IBM Cost of a Data Breach Report, 2023
```

### Closing block (below the stats, larger text)
```
One click is all it takes.

One misdirected email can end a client relationship that took years to build. Sendasta protects your team for $4 per user per month.
```

**⚠️ IMPORTANT:** Verify each of the five stats against original sources before publishing. The numbers are approximately right based on published reports, but should be confirmed exactly. Cite the original report. If any number can't be confirmed, swap it for one that can.

---

## 2.7 TESTIMONIALS SECTION

### REMOVE the entire section.

Delete the "What customers say" heading, all three testimonial cards (Sarah M., David K., James T.), and any surrounding container styling. Don't leave empty divs.

(If you want a placeholder section instead of nothing, see optional placeholder below — but the recommendation is to remove entirely until real testimonials exist.)

### Optional placeholder (only if removing entirely feels too bare):
```
Quietly running in real inboxes.

Sendasta is in active use at small firms across professional services and engineering. Customer stories coming as soon as our pilots are willing to be named.
```

---

## 2.8 PRICING SECTION

**This entire section is being restructured from 3 tiers to 2 tiers, with per-user pricing replacing flat-team pricing.** Remove the Enterprise tier entirely. Rename "Free" to "Personal." Replace the Business tier copy and pricing.

### 2.8.1 Section header

**FIND:**
```
Pricing
Free to try. Affordable for any small business.
```

**REPLACE WITH:**
```
Pricing
Two plans. No surprises.
```

### 2.8.2 Tier 1 — rename "Free" to "Personal"

**FIND** (the tier name/label, wherever it appears):
```
Free
```

**REPLACE WITH:**
```
Personal
```

### 2.8.3 Personal tier — price display

**FIND:**
```
$0 / forever
```

**REPLACE WITH:**
```
$0
Free forever
```

### 2.8.4 Personal tier — tagline

**FIND:**
```
No sign-up. No credit card. Works today.

Protect yourself from autocomplete mistakes — no team setup required.
```

**REPLACE WITH:**
```
For individuals who want to stop misdirected emails on their own inbox.
```

### 2.8.5 Personal tier — feature list (keep as-is):
- Real-time wrong-recipient warning
- Basic domain filter
- Self-install in under 5 minutes
- Works on Outlook web, desktop, and Mac

### 2.8.6 Personal tier — CTA: keep as `Install Free`. Sub-text: keep `No account needed. Works immediately.`

### 2.8.7 Business tier — price display

**FIND:**
```
$299
/yr
```

**REPLACE WITH:**
```
$4
/user/month
```

**Add small text directly below the price:**
```
Billed annually ($48/user/year). Or $5/user/month billed monthly. 5-user minimum.
```

### 2.8.8 Business tier — tagline

**FIND:**
```
For teams of any size — about $25/month.

Protect your whole team with shared rules and easy rollout via Microsoft 365.
```

**REPLACE WITH:**
```
For small firms where one wrong email can end a client relationship. Cheaper than one billable hour spent fixing a misdirected email.
```

### 2.8.9 Business tier — feature list

**FIND:**
```
Everything in Free, plus:
Block specific domains for your whole team
Simple settings panel — manage everyone
Automatic rollout via Microsoft 365
Choose which team members get it
Priority email support
```

**REPLACE WITH:**
```
Everything in Personal, plus:
Block specific domains for your whole team
Shared rules and policies, set once
Automatic rollout via Microsoft 365 Admin
Choose which team members get it
Priority email support
```

### 2.8.10 Business tier — CTA

**FIND:**
```
Sign Up
```

**REPLACE WITH:**
```
Start 30-day free trial
```

**Sub-text — replace existing:**
```
No credit card. Full access. Cancel anytime.
```

### 2.8.11 REMOVE — Enterprise tier entirely

Delete the entire Enterprise tier card from the pricing section. Don't leave a placeholder. The page should now show two tiers side by side: Personal and Business. Both are equally weighted visually, with Business marked "Most Popular."

If the existing layout uses a 3-column grid, change it to a 2-column grid centered on the page (or stack vertically on mobile).

### 2.8.12 NEW — small "Need more?" link below the pricing cards

After the two tier cards, add a single small line of text (light/muted, centered):

```
Need something custom for a larger team or specific compliance requirements? Email info@sendasta.com — we'll figure it out.
```

This handles the rare case where a 100+ person firm wants tailored pricing, without cluttering the page with an Enterprise tier that doesn't really exist yet.

---

## 2.9 TEAM SETUP SECTION

### 2.9.1 Section header

**FIND:**
```
Team Setup
Roll it out to your whole team — and set your own rules.
```

**REPLACE WITH:**
```
For IT and admins
```

(Single line, no subtitle.)

### 2.9.2 Body

**FIND:**
```
Deploy Sendasta across everyone's Outlook in about 5 minutes through Microsoft 365 Admin — no end-user action needed. Each person can then configure their own rules: flag domains that should never receive your emails, create no-combine pairs for competing clients, and mark trusted contacts to skip the alert.
```

**REPLACE WITH:**
```
Deploy Sendasta to everyone's Outlook in about five minutes through Microsoft 365 Admin Center — no end-user action, no per-person configuration. Each person can configure their own watched domains, no-combine pairs, and trusted contacts after install.
```

### 2.9.3 CTA: keep as `See the Setup Guide`.

---

## 2.10 NEW SECTION — Why I built this (founder note)

**Insert this as a new section between Team Setup and Contact.**

### Section heading
```
Why I built this
```

### Body
```
I'm Mo, the founder. I built Sendasta after watching too many smart people send the wrong email and have a terrible afternoon. If you're a small firm trying to keep your team out of that situation, send me a note — I read every message myself.
```

**Styling note:** smaller, more personal section than the rest. No call-to-action button. Just the heading and body, with maybe a subtle visual treatment that signals "this is from a person, not the brand." Could include a small photo of Mo if available — optional.

---

## 2.11 CONTACT SECTION

### 2.11.1 Section header

**FIND:**
```
Get in Touch
Questions? We respond personally.
```

**REPLACE WITH:**
```
Questions? A real person answers.
```

(Single line, no subtitle.)

### 2.11.2 Body

**FIND:**
```
Pricing questions, a custom setup for your team, or anything else — send us a message and a real person will get back to you.
```

**REPLACE WITH:**
```
Pricing questions, custom setup, integration questions — send a message and you'll hear back within one business day.
```

### 2.11.3 Form fields and email link: keep all as-is.

---

## 2.12 FOOTER

No changes.

---

# PART 3 — Verification checklist before deploying

Before pushing to production:

1. ☐ Verify all five stats in section 2.6 against original sources. Replace any that can't be confirmed.
2. ☐ Decide: testimonials section removed entirely, or replaced with placeholder?
3. ☐ Confirm mobile layout for the new 5-stat block (likely needs to stack to 2 or 3 columns on narrow viewports).
4. ☐ Confirm the new villain section (2.2) and founder note (2.10) have appropriate visual treatment, not just dropped-in text.
5. ☐ Once an OG image asset exists, uncomment the `og:image` tag in section 1.9.
6. ☐ **Wire up Stripe billing for the new per-user pricing** before this goes live. Pricing on the site must match what users can actually pay. Specifically:
   - Annual plan: $48/user/year, 5-user minimum ($240/year minimum charge)
   - Monthly plan: $5/user/month, 5-user minimum ($25/month minimum charge)
   - 30-day free trial on Business, no credit card required to start
   - Trial expiration UX: when day 30 hits without conversion, drop back to Personal-tier features. Don't disable everything.
7. ☐ **Decide on day-25 trial reminder email.** Recommended: a transactional email at day 25 showing the user how many emails Sendasta scanned, how many it flagged, and how many near-misses it prevented during their trial. This is the highest-conversion mechanic.
8. ☐ Update pricing page CTAs to point to the actual Stripe checkout / signup flow, not a placeholder.
9. ☐ Confirm pricing layout shifts cleanly from 3-column to 2-column grid (or verify the existing grid handles 2 cards centered).

---

# PART 4 — Product roadmap (NOT copy changes — track separately)

These came up during the audit but are product/feature work, not site copy. Tracking them here so they don't get lost.

**Highest priority:**
1. **External domain color-coding** in the prompt UI — small CSS change, big UX value.
2. **"Send Anyway" with optional reason field** — small change, real compliance value.
3. **Customer-visible audit log + CSV export** — multi-week build, but the upmarket unlock.

**Lower priority / not now:**
- Delay-send / undo window
- Generic Reply All confirmation (configurable threshold version is fine)
- Attachment scanning / DLP regex
- Encryption integration
- Mobile (iOS/Android)

---

# PART 5 — Marketing roadmap (NOT copy changes — track separately)

These also came up but are content/distribution work, not homepage edits.

1. **Named-incident blog posts** — pick 4-6 real misdirected-email disasters (Cardiff Council, Cornwall Council, etc.), write a short piece on each. AEO + social proof + SEO.
2. **Per-vertical landing pages** — `/law-firms`, `/compliance`, eventually `/german-manufacturing`. Don't build until homepage is solid.
3. **Run incognito search audits** for `misdirected email outlook`, `prevent wrong recipient outlook`, etc. Note where Sendasta currently ranks. This is the SEO baseline.
4. **Open Microsoft Clarity** and review session recordings — especially identify how pw-oertel.de's team found and used the site.
5. **Outreach to pw-oertel.de** — wait until they've been using Sendasta for ~30 days, then send a short personal note (not a sales pitch). Ask for a 15-min call about how it's working for them.
