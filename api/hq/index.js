// api/hq/index.js
// Standalone HQ dashboard (HTML+JS). Password-gated. Reads /api/hq/* endpoints.
import { requireHqAuth } from "../../lib/hqAuth.mjs";

export default function handler(req, res) {
  if (!requireHqAuth(req, res)) return;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(HTML);
}

const HTML = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Sendasta · HQ</title>
<style>
  :root{--bg:#0a0c11;--panel:#13161e;--border:rgba(255,255,255,.07);--border2:rgba(255,255,255,.13);
    --text:#e9eaee;--muted:#6c727f;--accent:#4f8cff;--ok:#22c55e;--warn:#f59e0b;--err:#ef4444;}
  *{box-sizing:border-box} html,body{margin:0;background:var(--bg);color:var(--text);
    font-family:-apple-system,BlinkMacSystemFont,Inter,system-ui,sans-serif;font-size:13px;min-height:100vh}
  header{position:sticky;top:0;z-index:5;backdrop-filter:blur(12px);background:rgba(10,12,17,.72);
    border-bottom:1px solid var(--border);padding:12px 24px;display:flex;justify-content:space-between;align-items:center}
  .brand{font-weight:800;letter-spacing:-.02em} .brand .l{color:var(--muted);font-weight:600}
  .container{max-width:1280px;margin:0 auto;padding:24px 24px 80px}
  h2{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:28px 4px 12px}
  .stats{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}
  .stat{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:14px 16px}
  .stat .lbl{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:700}
  .stat .val{font-size:26px;font-weight:800;margin-top:6px;font-variant-numeric:tabular-nums}
  .panel{background:var(--panel);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-top:14px}
  .panel .ph{padding:12px 16px;border-bottom:1px solid var(--border);font-weight:700;font-size:12px;
    text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
  table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
  th{text-align:left;padding:8px 14px;font-size:10px;text-transform:uppercase;letter-spacing:.08em;
    color:var(--muted);border-bottom:1px solid var(--border)}
  td{padding:9px 14px;border-bottom:1px solid var(--border);font-size:12.5px}
  td.num{text-align:right;font-variant-numeric:tabular-nums}
  tr:last-child td{border-bottom:0}
  .chart{display:flex;align-items:flex-end;gap:8px;height:120px;padding:16px}
  .bar{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px}
  .bar .f{width:100%;max-width:42px;border-radius:4px 4px 0 0;background:rgba(79,140,255,.35)}
  .bar.today .f{background:linear-gradient(180deg,var(--accent),#2f6fe0)}
  .bar .c{font-size:11px;color:var(--muted);font-weight:700} .bar .d{font-size:10px;color:var(--muted)}
  .funnel{padding:16px;display:flex;flex-direction:column;gap:10px}
  .fstage{display:flex;align-items:center;gap:12px}
  .fstage .name{width:120px;color:var(--muted);font-size:12px}
  .ftrack{flex:1;background:rgba(255,255,255,.05);border-radius:8px;height:30px;position:relative;overflow:hidden}
  .ffill{height:100%;background:linear-gradient(90deg,#2f6fe0,var(--accent));display:flex;align-items:center;
    padding:0 10px;font-weight:700;font-size:12px;min-width:42px}
  .drop{width:70px;text-align:right;color:var(--muted);font-size:11px}
  .links{margin-top:28px;color:var(--muted);font-size:12px}
  .links a{color:var(--accent);text-decoration:none;margin-right:16px}
  .err{color:var(--err);padding:12px 16px}
  .muted{color:var(--muted)}
</style></head>
<body>
<header><div class="brand">Sendasta <span class="l">· HQ</span></div>
  <div class="muted"><span id="clock"></span> · auto 30s</div></header>
<div class="container" id="root"><div class="muted" style="padding:40px">Loading…</div></div>
<script>
(()=>{
  const root=document.getElementById("root"), clock=document.getElementById("clock");
  setInterval(()=>clock.textContent=new Date().toLocaleTimeString(),1000);
  const esc=s=>String(s??"—").replace(/&/g,"&amp;").replace(/</g,"&lt;");
  const fmtAgo=iso=>{if(!iso)return "—";const s=Math.round((Date.now()-new Date(iso))/1000);
    if(s<60)return s+"s ago";if(s<3600)return Math.round(s/60)+"m ago";
    if(s<86400)return Math.round(s/3600)+"h ago";return Math.round(s/86400)+"d ago";};
  async function api(p){const r=await fetch(p);if(!r.ok)throw new Error(p+" → "+r.status);return r.json();}

  function statCards(o){const s=o.today,t=o.totals;
    const c=(l,v)=>'<div class="stat"><div class="lbl">'+l+'</div><div class="val">'+v+'</div></div>';
    return '<div class="stats">'+c("Visitors today",s.visitors)+c("Scans today",s.scans)+
      c("Blocks today",s.blocks)+c("Signups today",s.signups)+c("Companies",t.companies)+
      c("Active (7d)",t.activeCompanies7d)+'</div>';}

  function chart(o){const max=Math.max(1,...o.weeklyChart.map(w=>w.scans));
    const bars=o.weeklyChart.map((w,i)=>{const h=Math.max(4,Math.round(w.scans/max*80));
      const today=i===o.weeklyChart.length-1;
      return '<div class="bar'+(today?' today':'')+'"><div class="c">'+w.scans+
        '</div><div class="f" style="height:'+h+'px"></div><div class="d">'+esc(w.day)+'</div></div>';}).join("");
    return '<div class="panel"><div class="ph">Scans · last 7 days</div><div class="chart">'+bars+'</div></div>';}

  function companies(c){const rows=(c.companies||[]).slice(0,100).map(x=>
    '<tr><td>'+esc(x.domain)+'</td><td class="num">'+x.scans+'</td><td class="num">'+x.blocks+
    '</td><td class="num">'+x.allows+'</td><td class="num">'+x.uniqueSenders+
    '</td><td class="num muted">'+fmtAgo(x.lastSeen)+'</td></tr>').join("")||
    '<tr><td colspan="6" class="muted" style="padding:24px;text-align:center">No company activity yet</td></tr>';
    return '<div class="panel"><div class="ph">Companies · last 30 days</div><table>'+
      '<thead><tr><th>Domain</th><th class="num">Scans</th><th class="num">Blocks</th>'+
      '<th class="num">Allows</th><th class="num">Senders</th><th class="num">Last seen</th></tr></thead>'+
      '<tbody>'+rows+'</tbody></table></div>';}

  function funnel(f){const top=Math.max(1,f.stages[0].count);let prev=null;
    const rows=f.stages.map(s=>{const w=Math.round(s.count/top*100);
      const drop=prev==null||prev===0?"":("−"+Math.round((1-s.count/prev)*100)+"%");prev=s.count;
      return '<div class="fstage"><div class="name">'+esc(s.label)+'</div><div class="ftrack">'+
        '<div class="ffill" style="width:'+Math.max(w,4)+'%">'+s.count+'</div></div>'+
        '<div class="drop">'+drop+'</div></div>';}).join("");
    return '<div class="panel"><div class="ph">Funnel · last '+f.rangeDays+' days</div>'+
      '<div class="funnel">'+rows+'</div></div>';}

  async function load(){try{
    const [o,c,f]=await Promise.all([api("/api/hq/overview"),api("/api/hq/companies"),api("/api/hq/funnel")]);
    root.innerHTML='<h2>Overview</h2>'+statCards(o)+chart(o)+
      '<h2>Funnel</h2>'+funnel(f)+'<h2>Companies</h2>'+companies(c)+
      '<div class="links">↗ <a href="https://analytics.google.com" target="_blank">GA4</a>'+
      '<a href="https://clarity.microsoft.com" target="_blank">Clarity</a>'+
      '<a href="https://app.hubspot.com" target="_blank">HubSpot</a></div>';
  }catch(e){root.innerHTML='<div class="err">Error: '+esc(e.message)+'</div>';}}
  load(); setInterval(()=>{if(document.visibilityState==="visible")load();},30000);
})();
</script></body></html>`;
