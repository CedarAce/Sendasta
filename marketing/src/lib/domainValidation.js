// Same domain shape the Outlook add-in enforces. Lowercase letters, digits, hyphens;
// at least one dot; no underscores; max 63 chars per label.
const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/

export function normalizeDomain(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
}

export function isValidDomain(d) {
  return typeof d === 'string' && DOMAIN_RE.test(d)
}

// Parse a blob of text (CSV, TSV, newline-separated, comma-separated)
// into a unique, validated, normalized list of domains.
// Returns: { added: string[], duplicates: string[], invalid: string[] }
// Caller passes `existing` so duplicates against existing entries are counted too.
export function parseDomainBlob(raw, existing = []) {
  const existingSet = new Set(existing.map(normalizeDomain))
  const seen = new Set()
  const added = []
  const duplicates = []
  const invalid = []

  const tokens = String(raw || '')
    .split(/[\s,;]+/)
    .map(normalizeDomain)
    .filter(Boolean)

  for (const token of tokens) {
    // Skip header rows that just say "domain" / "domains"
    if (token === 'domain' || token === 'domains') continue
    if (existingSet.has(token) || seen.has(token)) {
      duplicates.push(token)
      continue
    }
    if (!isValidDomain(token)) {
      invalid.push(token)
      continue
    }
    seen.add(token)
    added.push(token)
  }

  return { added, duplicates, invalid }
}

// Parse a blob of text into pairs of {a, b}.
// Accepts CSV (two columns), TSV, or "a, b" on each line.
// Returns: { added, duplicates, invalid }
export function parsePairBlob(raw, existing = []) {
  const sameAs = (p1, p2) =>
    (p1.a === p2.a && p1.b === p2.b) || (p1.a === p2.b && p1.b === p2.a)
  const isDup = (p, pool) => pool.some((q) => sameAs(p, q))

  const added = []
  const duplicates = []
  const invalid = []

  const lines = String(raw || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  for (const line of lines) {
    const parts = line.split(/[\s,;\t]+/).map(normalizeDomain).filter(Boolean)
    // Header row tolerated
    if (
      parts.length === 2 &&
      ['domain_a', 'a', 'domain1', 'domain'].includes(parts[0]) &&
      ['domain_b', 'b', 'domain2'].includes(parts[1])
    ) {
      continue
    }
    if (parts.length !== 2 || !isValidDomain(parts[0]) || !isValidDomain(parts[1]) || parts[0] === parts[1]) {
      invalid.push(line)
      continue
    }
    const pair = { a: parts[0], b: parts[1] }
    if (isDup(pair, existing) || isDup(pair, added)) {
      duplicates.push(`${pair.a} × ${pair.b}`)
      continue
    }
    added.push(pair)
  }

  return { added, duplicates, invalid }
}

// Trigger a browser download of a string as a file.
export function downloadAsFile(filename, content, mime = 'text/csv') {
  const blob = new Blob([content], { type: `${mime};charset=utf-8;` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const DOMAIN_TEMPLATE_CSV =
  'domain\nexample.com\ncompetitor.com\nold-client.com\n'

export const PAIR_TEMPLATE_CSV =
  'domain_a,domain_b\nacme.com,competitor.com\nclient-a.com,client-b.com\n'
