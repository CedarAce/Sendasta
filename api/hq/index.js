// api/hq/index.js
// Standalone HQ dashboard (HTML+JS). Password-gated. Reads /api/hq/* endpoints.
import { requireHqAuth } from "../../lib/hqAuth.cjs";

export default function handler(req, res) {
  if (!requireHqAuth(req, res)) return;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(HTML);
}

const HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sendasta · HQ</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg: #07080c;
      --bg-gradient: radial-gradient(circle at 50% 0%, #0d111c 0%, #050609 100%);
      --panel: rgba(18, 22, 35, 0.7);
      --panel-hover: rgba(26, 32, 51, 0.85);
      --border: rgba(255, 255, 255, 0.05);
      --border-hover: rgba(255, 255, 255, 0.12);
      --text: #f3f4f6;
      --muted: #8a94a6;
      --accent: #3b82f6;
      --accent-gradient: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      --ok: #10b981;
      --warn: #f59e0b;
      --err: #ef4444;
      --font-heading: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      background: var(--bg);
      background-image: var(--bg-gradient);
      color: var(--text);
      font-family: var(--font-body);
      font-size: 13px;
      min-height: 100vh;
      line-height: 1.5;
    }

    /* Custom Scrollbars */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); }
    ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }

    header {
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      background: rgba(7, 8, 12, 0.75);
      border-bottom: 1px solid var(--border);
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      font-family: var(--font-heading);
      font-size: 16px;
      font-weight: 800;
      letter-spacing: -.02em;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .brand .l { color: var(--muted); font-weight: 500; }
    
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: var(--muted);
      font-weight: 500;
    }
    
    .pulse-dot {
      width: 6px;
      height: 6px;
      background-color: var(--ok);
      border-radius: 50%;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      animation: pulse 1.6s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 28px 28px 100px;
    }

    h2 {
      font-family: var(--font-heading);
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: var(--muted);
      margin: 32px 4px 14px;
    }

    /* Stats Grid */
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 18px 20px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    .stat:hover {
      transform: translateY(-2px);
      background: var(--panel-hover);
      border-color: var(--border-hover);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }
    .stat .lbl {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: var(--muted);
      font-weight: 700;
    }
    .stat .val {
      font-family: var(--font-heading);
      font-size: 28px;
      font-weight: 800;
      margin-top: 8px;
      font-variant-numeric: tabular-nums;
      background: linear-gradient(135deg, #fff 40%, var(--muted) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Multi-column Layout Grid */
    .dashboard-row-grid {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 18px;
      margin-bottom: 18px;
    }
    
    .col-8 { grid-column: span 8; }
    .col-4 { grid-column: span 4; }
    .col-6 { grid-column: span 6; }
    .col-12 { grid-column: span 12; }

    @media (max-width: 1024px) {
      .col-8, .col-4, .col-6 { grid-column: span 12; }
    }

    /* Panels */
    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      transition: border-color 0.3s ease;
    }
    .panel:hover {
      border-color: rgba(255, 255, 255, 0.1);
    }
    .panel .ph {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .06em;
      color: var(--muted);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* 7-Day Scans Chart */
    .chart {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      height: 160px;
      padding: 24px 20px;
    }
    .bar {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .bar .f {
      width: 100%;
      max-width: 36px;
      border-radius: 6px 6px 0 0;
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.2);
      transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s;
    }
    .bar.today .f {
      background: var(--accent-gradient);
      border: none;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
    }
    .bar:hover .f {
      background: rgba(59, 130, 246, 0.4);
    }
    .bar.today:hover .f {
      filter: brightness(1.15);
    }
    .bar .c {
      font-size: 11px;
      color: var(--text);
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }
    .bar .d {
      font-size: 10px;
      color: var(--muted);
      font-weight: 500;
    }

    /* Funnel Stages */
    .funnel {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .fstage {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .fstage .name {
      width: 100px;
      color: var(--muted);
      font-weight: 600;
      font-size: 12px;
    }
    .ftrack {
      flex: 1;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      height: 28px;
      position: relative;
      overflow: hidden;
    }
    .ffill {
      height: 100%;
      background: var(--accent-gradient);
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
      display: flex;
      align-items: center;
      padding: 0 12px;
      font-weight: 700;
      font-size: 11.5px;
      min-width: 42px;
      transition: width 0.6s ease;
      font-variant-numeric: tabular-nums;
    }
    .drop {
      width: 60px;
      text-align: right;
      color: var(--err);
      font-weight: 600;
      font-size: 10.5px;
      font-variant-numeric: tabular-nums;
    }

    /* Breakdown Lists with Progress Bars */
    .breakdown-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding: 20px;
    }
    @media (max-width: 640px) {
      .breakdown-grid { grid-template-columns: 1fr; }
    }
    .breakdown-column h3 {
      font-family: var(--font-heading);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
      margin-top: 0;
      margin-bottom: 12px;
    }
    .breakdown-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .breakdown-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .breakdown-meta {
      display: flex;
      justify-content: space-between;
      font-size: 11.5px;
      font-weight: 500;
    }
    .breakdown-label {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text);
    }
    .breakdown-count {
      color: var(--muted);
      font-variant-numeric: tabular-nums;
      font-weight: 600;
    }
    .breakdown-bar-track {
      height: 6px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 3px;
      overflow: hidden;
    }
    .breakdown-bar-fill {
      height: 100%;
      background: var(--accent);
      border-radius: 3px;
      transition: width 0.6s ease;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      font-variant-numeric: tabular-nums;
      text-align: left;
    }
    th {
      padding: 14px 20px;
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: var(--muted);
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 13px 20px;
      border-bottom: 1px solid var(--border);
      font-size: 12px;
      vertical-align: middle;
    }
    tr:last-child td { border-bottom: 0; }
    
    tbody tr {
      transition: background 0.2s ease;
    }
    tbody tr.interactive-row {
      cursor: pointer;
    }
    tbody tr.interactive-row:hover {
      background: rgba(255, 255, 255, 0.02);
    }
    tbody tr.props-row {
      background: rgba(0, 0, 0, 0.2) !important;
    }

    td.num, th.num { text-align: right; }
    .muted { color: var(--muted); }

    /* Custom Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .badge-blue { background: rgba(59, 130, 246, 0.12); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.2); }
    .badge-green { background: rgba(16, 185, 129, 0.12); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); }
    .badge-red { background: rgba(239, 68, 68, 0.12); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }
    .badge-emerald { background: rgba(5, 150, 105, 0.12); color: #34d399; border: 1px solid rgba(5, 150, 105, 0.2); }
    .badge-orange { background: rgba(245, 158, 11, 0.12); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.2); }
    .badge-purple { background: rgba(139, 92, 246, 0.12); color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.2); }
    .badge-yellow { background: rgba(234, 179, 8, 0.12); color: #fef08a; border: 1px solid rgba(234, 179, 8, 0.2); }
    .badge-neutral { background: rgba(156, 163, 175, 0.12); color: #d1d5db; border: 1px solid rgba(156, 163, 175, 0.2); }

    /* Platform labels */
    .platform-info {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
    }
    
    /* Collapsible JSON raw properties block */
    .json-inspector {
      font-family: var(--font-mono);
      font-size: 11px;
      background: #040508;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
      margin: 4px 0;
      color: #a78bfa;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* Live Feed Actions bar */
    .feed-header-bar {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }
    .feed-header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .feed-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }
    .chip {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 20px;
      color: var(--muted);
      padding: 6px 14px;
      font-size: 11.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: var(--font-body);
      outline: none;
    }
    .chip:hover {
      background: rgba(255, 255, 255, 0.07);
      color: var(--text);
      border-color: rgba(255, 255, 255, 0.2);
    }
    .chip.active {
      background: rgba(59, 130, 246, 0.15);
      border-color: var(--accent);
      color: #60a5fa;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.15);
    }
    .feed-search-input {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 14px;
      color: var(--text);
      font-family: var(--font-body);
      font-size: 12.5px;
      width: 280px;
      transition: all 0.2s;
    }
    .feed-search-input:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.25);
      width: 340px;
    }

    .links {
      margin-top: 32px;
      color: var(--muted);
      font-size: 12px;
      text-align: center;
    }
    .links a {
      color: var(--accent);
      text-decoration: none;
      margin: 0 10px;
      font-weight: 500;
      transition: color 0.2s;
    }
    .links a:hover { color: #60a5fa; text-decoration: underline; }
    
    .err {
      color: var(--err);
      padding: 32px;
      text-align: center;
      font-weight: 600;
    }
    
    .no-results {
      padding: 28px;
      text-align: center;
      color: var(--muted);
      font-weight: 500;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">Sendasta <span class="l">· HQ</span></div>
    <div class="status-indicator">
      <div class="pulse-dot"></div>
      <span id="clock">Loading time…</span> · auto-refreshing 30s
    </div>
  </header>
  
  <div class="container" id="root">
    <div class="muted" style="padding: 100px; text-align: center; font-size: 16px;">
      Gathering intelligence from Supabase…
    </div>
  </div>

  <script>
    (() => {
      const root = document.getElementById("root");
      const clock = document.getElementById("clock");
      
      // Keep header clock running
      setInterval(() => clock.textContent = new Date().toLocaleTimeString(), 1000);
      
      const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      
      const fmtAgo = iso => {
        if (!iso) return "—";
        const s = Math.round((Date.now() - new Date(iso)) / 1000);
        if (s < 60) return s + "s ago";
        if (s < 3600) return Math.round(s / 60) + "m ago";
        if (s < 86400) return Math.round(s / 3600) + "h ago";
        return Math.round(s / 86400) + "d ago";
      };

      const decodeCity = name => {
        if (!name) return "";
        try {
          return decodeURIComponent(name.replace(/\+/g, " "));
        } catch (e) {
          return name;
        }
      };

      // Native Country Flags generator
      const getFlagEmoji = countryCode => {
        if (!countryCode || countryCode.length !== 2) return "🌐";
        const codePoints = countryCode
          .toUpperCase()
          .split("")
          .map(char => 127397 + char.charCodeAt(0));
        try {
          return String.fromCodePoint(...codePoints);
        } catch (e) {
          return "🌐";
        }
      };

      // Simple user-agent parser
      const parseUA = ua => {
        if (!ua) return { os: "Unknown OS", browser: "Unknown Browser" };
        let os = "Unknown OS";
        if (/windows/i.test(ua)) os = "Windows";
        else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
        else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
        else if (/android/i.test(ua)) os = "Android";
        else if (/linux/i.test(ua)) os = "Linux";

        let browser = "Browser";
        if (/outlook|msip/i.test(ua)) browser = "Outlook";
        else if (/edg/i.test(ua)) browser = "Edge";
        else if (/chrome|crios/i.test(ua)) browser = "Chrome";
        else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
        else if (/safari/i.test(ua)) browser = "Safari";

        return { os, browser };
      };

      const getActionBadge = (action, reason) => {
        let cls = "badge-neutral";
        let label = action;

        if (action === "page_view") {
          cls = "badge-blue";
          label = "Page View";
        } else if (action === "scan_started") {
          cls = "badge-green";
          label = "Scan Started";
        } else if (action === "email_blocked") {
          cls = "badge-red";
          label = "Email Blocked" + (reason ? " (" + reason + ")" : "");
        } else if (action === "email_allowed") {
          cls = "badge-emerald";
          label = "Email Allowed";
        } else if (action === "user_signed_up" || action === "user_logged_in") {
          cls = "badge-orange";
          label = action === "user_signed_up" ? "Signed Up" : "Logged In";
        } else if (action === "checkout_started" || action === "subscription_active") {
          cls = "badge-purple";
          label = action === "checkout_started" ? "Checkout Started" : "Sub Active";
        } else if (action === "cta_click") {
          cls = "badge-yellow";
          label = "CTA Click";
        }

        return '<span class="badge ' + cls + '">' + esc(label) + '</span>';
      };

      async function api(path) {
        const response = await fetch(path);
        if (!response.ok) throw new Error(path + " → " + response.status);
        return response.json();
      }

      // Globally scoped toggleProps function so it is clickable on standard onclick
      window.toggleProps = (id) => {
        const row = document.getElementById("props-" + id);
        if (row) {
          row.style.display = row.style.display === "none" ? "table-row" : "none";
        }
      };

      function statCards(o) {
        const s = o.today;
        const t = o.totals;
        
        const card = (label, val) => 
          '<div class="stat">' +
            '<div class="lbl">' + label + '</div>' +
            '<div class="val">' + val + '</div>' +
          '</div>';

        return '<div class="stats">' +
          card("Visitors Today", s.visitors) +
          card("Scans Today", s.scans) +
          card("Blocks Today", s.blocks) +
          card("Signups Today", s.signups) +
          card("Total Companies", t.companies) +
          card("Active (7d)", t.activeCompanies7d) +
        '</div>';
      }

      function chartPanel(o) {
        const maxScans = Math.max(1, ...o.weeklyChart.map(w => w.scans));
        const bars = o.weeklyChart.map((w, idx) => {
          const h = Math.max(4, Math.round((w.scans / maxScans) * 110));
          const isToday = idx === o.weeklyChart.length - 1;
          return '<div class="bar' + (isToday ? ' today' : '') + '">' +
            '<div class="c">' + w.scans + '</div>' +
            '<div class="f" style="height: ' + h + 'px"></div>' +
            '<div class="d">' + esc(w.day) + '</div>' +
          '</div>';
        }).join("");
        
        return '<div class="panel col-8">' +
          '<div class="ph">Outlook Scans · Last 7 Days</div>' +
          '<div class="chart">' + bars + '</div>' +
        '</div>';
      }

      function funnelPanel(f) {
        const topCount = Math.max(1, f.stages[0].count);
        let prevCount = null;
        
        const stagesHTML = f.stages.map(s => {
          const widthPct = Math.round((s.count / topCount) * 100);
          const dropText = prevCount === null || prevCount === 0 
            ? "" 
            : "−" + Math.round((1 - s.count / prevCount) * 100) + "%";
          prevCount = s.count;
          
          return '<div class="fstage">' +
            '<div class="name">' + esc(s.label) + '</div>' +
            '<div class="ftrack">' +
              '<div class="ffill" style="width: ' + Math.max(widthPct, 4) + '%">' + s.count + '</div>' +
            '</div>' +
            '<div class="drop">' + dropText + '</div>' +
          '</div>';
        }).join("");

        return '<div class="panel col-4">' +
          '<div class="ph">Funnel · Last ' + f.rangeDays + ' Days</div>' +
          '<div class="funnel">' + stagesHTML + '</div>' +
        '</div>';
      }

      function breakdownsPanel(o) {
        const countryTotal = Math.max(1, ...o.topCountries.map(x => x.count));
        const cityTotal = Math.max(1, ...o.topCities.map(x => x.count));
        const platformTotal = Math.max(1, ...o.topPlatforms.map(x => x.count));
        const browserTotal = Math.max(1, ...o.topBrowsers.map(x => x.count));

        const makeList = (data, total, flagFn) => {
          if (!data || data.length === 0) {
            return '<div class="muted">No data available</div>';
          }
          return data.slice(0, 5).map(x => {
            const pct = Math.round((x.count / total) * 100);
            const label = flagFn ? flagFn(x.name) : esc(x.name);
            return '<div class="breakdown-item">' +
              '<div class="breakdown-meta">' +
                '<span class="breakdown-label">' + label + '</span>' +
                '<span class="breakdown-count">' + x.count + ' (' + pct + '%)</span>' +
              '</div>' +
              '<div class="breakdown-bar-track">' +
                '<div class="breakdown-bar-fill" style="width: ' + pct + '%"></div>' +
              '</div>' +
            '</div>';
          }).join("");
        };

        const renderCountry = name => {
          return getFlagEmoji(name) + ' <span class="muted">' + esc(name) + '</span>';
        };

        const renderCity = name => {
          const parts = name.split(",");
          const cityName = parts[0].trim();
          const countryCode = parts[1] ? parts[1].trim() : "";
          return (countryCode ? getFlagEmoji(countryCode) + " " : "") + esc(decodeCity(cityName));
        };

        return '<div class="panel col-12">' +
          '<div class="ph">Customer Demographics &amp; Devices · Last 30 Days</div>' +
          '<div class="breakdown-grid">' +
            '<div class="breakdown-column">' +
              '<h3>Top Countries</h3>' +
              '<div class="breakdown-list">' + makeList(o.topCountries, countryTotal, renderCountry) + '</div>' +
            '</div>' +
            '<div class="breakdown-column">' +
              '<h3>Top Cities</h3>' +
              '<div class="breakdown-list">' + makeList(o.topCities, cityTotal, renderCity) + '</div>' +
            '</div>' +
            '<div class="breakdown-column" style="margin-top: 10px;">' +
              '<h3>Devices &amp; OS</h3>' +
              '<div class="breakdown-list">' + makeList(o.topPlatforms, platformTotal) + '</div>' +
            '</div>' +
            '<div class="breakdown-column" style="margin-top: 10px;">' +
              '<h3>Browsers &amp; Clients</h3>' +
              '<div class="breakdown-list">' + makeList(o.topBrowsers, browserTotal) + '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
      }

      function companiesPanel(c) {
        const rows = (c.companies || []).slice(0, 15).map(x => 
          '<tr>' +
            '<td><strong>' + esc(x.domain) + '</strong></td>' +
            '<td class="num">' + x.scans + '</td>' +
            '<td class="num">' + x.blocks + '</td>' +
            '<td class="num">' + x.allows + '</td>' +
            '<td class="num">' + x.uniqueSenders + '</td>' +
            '<td class="num muted">' + fmtAgo(x.lastSeen) + '</td>' +
          '</tr>'
        ).join("") || '<tr><td colspan="6" class="muted" style="padding: 24px; text-align: center;">No active company accounts found</td></tr>';

        return '<div class="panel col-12">' +
          '<div class="ph">Top Active Companies · Last 30 Days</div>' +
          '<div style="overflow-x: auto;">' +
            '<table>' +
              '<thead>' +
                '<tr>' +
                  '<th>Domain</th>' +
                  '<th class="num">Scans</th>' +
                  '<th class="num">Blocks</th>' +
                  '<th class="num">Allows</th>' +
                  '<th class="num">Senders</th>' +
                  '<th class="num">Last Seen</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody>' + rows + '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>';
      }

      // Store recent events globally for searching and filtering
      let globalRecentEvents = [];
      let currentFilterChip = 'all';
      let currentSearchQuery = '';

      function renderLiveFeedRows(events) {
        const tbody = document.getElementById("live-feed-tbody");
        if (!tbody) return;
        
        if (events.length === 0) {
          tbody.innerHTML = '<tr><td colspan="7" class="no-results">No matching events in the log</td></tr>';
          return;
        }

        tbody.innerHTML = events.map(x => {
          const uaInfo = parseUA(x.user_agent);
          const flag = getFlagEmoji(x.country);
          const decodedCityName = decodeCity(x.city);
          const locationText = x.country 
            ? flag + ' ' + esc(decodedCityName || "Unknown")
            : '🌐 Local/VPN';
          const ipText = x.ip ? '<br/><span class="muted" style="font-size: 10px;">' + esc(x.ip) + '</span>' : '';
          
          const customerText = x.company_domain 
            ? '<strong>' + esc(x.company_domain) + '</strong>' + (x.sender_email || x.email ? '<br/><span class="muted" style="font-size: 10px;">' + esc(x.sender_email || x.email) + '</span>' : '')
            : '<span class="muted">—</span>';
          
          const timeText = '<span title="' + esc(x.at) + '">' + fmtAgo(x.at) + '</span>';
          
          return '<tr class="interactive-row" onclick="toggleProps(' + "'" + x.id + "'" + ')">' +
            '<td>' + timeText + '</td>' +
            '<td>' + getActionBadge(x.action, x.reason) + '</td>' +
            '<td>' + customerText + '</td>' +
            '<td>' + locationText + ipText + '</td>' +
            '<td>' +
              '<div class="platform-info">' +
                '<span>' + esc(uaInfo.os) + '</span> · <span class="muted">' + esc(uaInfo.browser) + '</span>' +
              '</div>' +
            '</td>' +
            '<td class="muted">' + esc(x.source || "web") + '</td>' +
            '<td style="text-align: right; color: var(--accent); font-weight: 600;">Inspect ▾</td>' +
          '</tr>' +
          '<tr id="props-' + x.id + '" class="props-row" style="display: none;">' +
            '<td colspan="7">' +
              '<pre class="json-inspector"><strong>Event Properties:</strong><br/>' + esc(JSON.stringify({
                id: x.id,
                at: x.at,
                action: x.action,
                source: x.source,
                reason: x.reason,
                company_domain: x.company_domain,
                sender_email: x.sender_email,
                email: x.email,
                org_id: x.org_id,
                path: x.path,
                ip: x.ip,
                country: x.country,
                city: decodedCityName,
                user_agent: x.user_agent,
                props: x.props
              }, null, 2)) + '</pre>' +
            '</td>' +
          '</tr>';
        }).join("");
      }

      window.setChipFilter = (chipVal) => {
        currentFilterChip = chipVal;
        
        // Update active class on DOM buttons
        const chips = document.querySelectorAll('.feed-chips .chip');
        chips.forEach(c => {
          c.classList.remove('active');
          if (c.getAttribute('data-filter') === chipVal) {
            c.classList.add('active');
          }
        });
        
        applyFilter();
      };

      window.onFeedSearch = e => {
        currentSearchQuery = e.value;
        applyFilter();
      };

      function applyFilter() {
        const q = currentSearchQuery.toLowerCase().trim();
        let filtered = globalRecentEvents;
        
        // 1. Apply Chip filter
        if (currentFilterChip !== 'all') {
          filtered = filtered.filter(x => {
            if (currentFilterChip === 'page_view') return x.action === 'page_view';
            if (currentFilterChip === 'scan_started') return x.action === 'scan_started';
            if (currentFilterChip === 'email_blocked') return x.action === 'email_blocked';
            if (currentFilterChip === 'email_allowed') return x.action === 'email_allowed';
            if (currentFilterChip === 'auth') return x.action === 'user_signed_up' || x.action === 'user_logged_in' || x.action.startsWith('user_');
            if (currentFilterChip === 'billing') return x.action === 'checkout_started' || x.action === 'subscription_active' || x.action.includes('checkout') || x.action.includes('sub');
            return true;
          });
        }
        
        // 2. Apply Text search filter
        if (q) {
          filtered = filtered.filter(x => {
            const uaInfo = parseUA(x.user_agent);
            const decodedCityName = decodeCity(x.city);
            return (
              (x.company_domain && x.company_domain.toLowerCase().includes(q)) ||
              (x.sender_email && x.sender_email.toLowerCase().includes(q)) ||
              (x.email && x.email.toLowerCase().includes(q)) ||
              (x.action && x.action.toLowerCase().includes(q)) ||
              (x.reason && x.reason.toLowerCase().includes(q)) ||
              (decodedCityName && decodedCityName.toLowerCase().includes(q)) ||
              (x.country && x.country.toLowerCase().includes(q)) ||
              (x.ip && x.ip.toLowerCase().includes(q)) ||
              (x.source && x.source.toLowerCase().includes(q)) ||
              uaInfo.os.toLowerCase().includes(q) ||
              uaInfo.browser.toLowerCase().includes(q)
            );
          });
        }
        
        renderLiveFeedRows(filtered);
      }

      function liveFeedPanel() {
        return '<div class="panel col-12">' +
          '<div class="ph">' +
            '<div class="feed-header-bar">' +
              '<div class="feed-header-top">' +
                '<span>Live Intelligence Feed (Recent 100 Events)</span>' +
                '<input type="text" class="feed-search-input" oninput="onFeedSearch(this)" placeholder="🔍 Filter feed..." />' +
              '</div>' +
              '<div class="feed-chips">' +
                '<button class="chip active" data-filter="all" onclick="setChipFilter(\'all\')">All</button>' +
                '<button class="chip" data-filter="page_view" onclick="setChipFilter(\'page_view\')">Page Views</button>' +
                '<button class="chip" data-filter="scan_started" onclick="setChipFilter(\'scan_started\')">Outlook Scans</button>' +
                '<button class="chip" data-filter="email_blocked" onclick="setChipFilter(\'email_blocked\')">Blocked</button>' +
                '<button class="chip" data-filter="email_allowed" onclick="setChipFilter(\'email_allowed\')">Allowed</button>' +
                '<button class="chip" data-filter="auth" onclick="setChipFilter(\'auth\')">Signups &amp; Auth</button>' +
                '<button class="chip" data-filter="billing" onclick="setChipFilter(\'billing\')">Billing</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div style="overflow-x: auto;">' +
            '<table>' +
              '<thead>' +
                '<tr>' +
                  '<th>Time</th>' +
                  '<th>Event Action</th>' +
                  '<th>Customer / Identity</th>' +
                  '<th>Location</th>' +
                  '<th>Platform / Device</th>' +
                  '<th>Source</th>' +
                  '<th style="text-align: right;">Data</th>' +
                '</tr>' +
              '</thead>' +
              '<tbody id="live-feed-tbody">' +
                '<tr><td colspan="7" class="muted" style="padding: 24px; text-align: center;">Loading events…</td></tr>' +
              '</tbody>' +
            '</table>' +
          '</div>' +
        '</div>';
      }

      async function load() {
        try {
          const [o, c, f, r] = await Promise.all([
            api("/api/hq/overview"),
            api("/api/hq/companies"),
            api("/api/hq/funnel"),
            api("/api/hq/recent")
          ]);

          globalRecentEvents = r || [];

          root.innerHTML = 
            '<h2>System Overview</h2>' + 
            statCards(o) +
            '<div class="dashboard-row-grid">' +
              chartPanel(o) +
              funnelPanel(f) +
            '</div>' +
            '<div class="dashboard-row-grid">' +
              breakdownsPanel(o) +
            '</div>' +
            '<div class="dashboard-row-grid">' +
              companiesPanel(c) +
            '</div>' +
            '<div class="dashboard-row-grid">' +
              liveFeedPanel() +
            '</div>' +
            '<div class="links">' +
              '↗ <a href="https://analytics.google.com" target="_blank">GA4</a>' +
              '<a href="https://clarity.microsoft.com" target="_blank">Clarity</a>' +
              '<a href="https://app.hubspot.com" target="_blank">HubSpot</a>' +
            '</div>';
            
          renderLiveFeedRows(globalRecentEvents);
        } catch (e) {
          root.innerHTML = '<div class="err">Failed to pull database metrics: ' + esc(e.message) + '</div>';
        }
      }

      load();
      
      // Auto reload dashboard every 30s only when the tab is active
      setInterval(() => {
        if (document.visibilityState === "visible") {
          load();
        }
      }, 30000);
    })();
  </script>
</body>
</html>`;
