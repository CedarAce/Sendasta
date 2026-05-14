import { inject } from "@vercel/analytics";
inject();

const POLICY_KEYS = ["blockedDomains", "noCombinePairs", "allowedPairs", "internalDomains"];
const LEGACY_KEYS = POLICY_KEYS.map((k) => "_legacy_" + k);

Office.onReady(async (info) => {
  if (info.host !== Office.HostType.Outlook) return;

  document.getElementById("sideload-msg").style.display = "none";
  const appBody = document.getElementById("app-body");
  appBody.classList.remove("app-body--hidden");
  appBody.style.display = "flex";

  // Common controls (visible in both tiers)
  document.getElementById("toggleSwitch").onchange = toggleSendasta;
  document.getElementById("toggleCcBcc").onchange = toggleCcBcc;
  getSendastaState();
  getCcBccState();

  // Tier detection — never throws, falls back to 'personal'
  const me = await detectTier();
  Office.context.roamingSettings.set("tier", me.tier);

  if (me.tier === "business") {
    await applyBusinessPolicy(me);
    renderBusinessUI(me);
    maybeShowMigrationPrompt(me);
  } else {
    renderPersonalUI();
  }
});

// ── Tier detection ─────────────────────────────────────────────────────────────

async function detectTier() {
  try {
    if (!Office.auth || typeof Office.auth.getAccessToken !== "function") {
      return { tier: "personal" };
    }
    const ssoToken = await Office.auth.getAccessToken({
      allowSignInPrompt: false,
      allowConsentPrompt: false,
      forMSGraphAccess: false,
    });
    const res = await fetch("https://sendasta.com/api/me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ssoToken }),
    });
    if (!res.ok) return { tier: "personal" };
    const data = await res.json();
    if (!data || (data.tier !== "business" && data.tier !== "personal")) {
      return { tier: "personal" };
    }
    return data;
  } catch (_) {
    return { tier: "personal" };
  }
}

async function applyBusinessPolicy(me) {
  if (!me.policy) return;
  const settings = Office.context.roamingSettings;
  const previousVersion = settings.get("policyVersion");
  if (previousVersion === me.policyVersion) return;

  settings.set("orgId", me.orgId);
  settings.set("orgName", me.orgName);
  settings.set("policyVersion", me.policyVersion);
  settings.set("blockedDomains", me.policy.blocked_domains ?? []);
  settings.set("internalDomains", me.policy.internal_domains ?? []);
  settings.set("noCombinePairs", pairsToTuples(me.policy.no_combine_pairs));
  settings.set("allowedPairs", pairsToTuples(me.policy.trusted_pairs));

  await new Promise((resolve) => settings.saveAsync(() => resolve()));
}

function pairsToTuples(pairs) {
  if (!Array.isArray(pairs)) return [];
  return pairs
    .map((p) => (Array.isArray(p) ? p : p && typeof p === "object" ? [p.a, p.b] : null))
    .filter((p) => Array.isArray(p) && p.length === 2 && p[0] && p[1]);
}

// ── Tier UI renderers ──────────────────────────────────────────────────────────

function renderPersonalUI() {
  document.getElementById("proUpsellCard").hidden = false;
  document.getElementById("managedBanner").hidden = true;
  // Cc/Bcc checking is a Business-tier feature.
  document.getElementById("ccBccContainer").hidden = true;
  document.getElementById("internalDomainsContainer").hidden = true;
  document.getElementById("blockedDomainsContainer").hidden = true;
  document.getElementById("noCombineContainer").hidden = true;
  document.getElementById("trustedPairsContainer").hidden = true;
}

function renderBusinessUI(me) {
  document.getElementById("proUpsellCard").hidden = true;

  const banner = document.getElementById("managedBanner");
  document.getElementById("managedOrgName").textContent = me.orgName || "your organization";
  banner.hidden = false;

  ["internalDomainsContainer", "blockedDomainsContainer", "noCombineContainer", "trustedPairsContainer"].forEach(
    (id) => {
      const el = document.getElementById(id);
      el.hidden = false;
      el.classList.add("managed-readonly");
    }
  );

  renderList("internalDomains", "internalDomainList");
  renderList("blockedDomains", "blockedDomainList");
  renderPairList("noCombinePairs", "noCombineList");
  renderPairList("allowedPairs", "trustedPairList");
}

// ── Migration prompt for users with legacy v1 lists in same namespace ──────────

function maybeShowMigrationPrompt(me) {
  const settings = Office.context.roamingSettings;
  if (settings.get("migration_handled")) return;

  // Only meaningful if there were previously-written lists in this namespace
  // BEFORE we just overwrote them with the org policy. Since applyBusinessPolicy
  // has already run, we can't tell from current state — instead, look for any
  // legacy backup keys left from an earlier session. (The first transition
  // overwrites; we never see a true "legacy" snapshot in this implementation
  // unless the user explicitly populated lists in a previous personal session.)
  const hasLegacy = LEGACY_KEYS.some((k) => {
    const v = settings.get(k);
    return Array.isArray(v) && v.length > 0;
  });
  if (!hasLegacy) {
    settings.set("migration_handled", "no_legacy");
    settings.saveAsync();
    return;
  }

  const card = document.getElementById("migrationCard");
  card.hidden = false;

  document.getElementById("migrationSendBtn").onclick = async () => {
    const suggested_blocked = settings.get("_legacy_blockedDomains") || [];
    const suggested_internal = settings.get("_legacy_internalDomains") || [];
    const noCombine = settings.get("_legacy_noCombinePairs") || [];
    const trusted = settings.get("_legacy_allowedPairs") || [];
    const suggested_pairs = [
      ...noCombine.map(([a, b]) => ({ kind: "no_combine", a, b })),
      ...trusted.map(([a, b]) => ({ kind: "trusted", a, b })),
    ];
    try {
      const ssoToken = await Office.auth.getAccessToken({
        allowSignInPrompt: false,
        allowConsentPrompt: false,
        forMSGraphAccess: false,
      });
      await fetch("https://sendasta.com/api/policy-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ssoToken,
          orgId: me.orgId,
          suggested_blocked,
          suggested_internal,
          suggested_pairs,
        }),
      });
    } catch (_) {}
    finishMigration("sent");
  };

  document.getElementById("migrationDiscardBtn").onclick = () => finishMigration("discarded");

  function finishMigration(outcome) {
    settings.set("migration_handled", outcome);
    settings.saveAsync(() => {
      card.hidden = true;
    });
  }
}

// ── Master toggle ──────────────────────────────────────────────────────────────

function toggleSendasta() {
  const enabled = document.getElementById("toggleSwitch").checked;
  saveSettings({ isSendastaEnabled: enabled });

  const ccBccToggle = document.getElementById("toggleCcBcc");
  const ccBccLabel = ccBccToggle.closest("label");

  if (!enabled) {
    ccBccToggle.checked = false;
    saveSettings({ includeCcBcc: false });
    setTimeout(() => {
      ccBccToggle.disabled = true;
      ccBccLabel.classList.add("disabled");
    }, 100);
  } else {
    ccBccToggle.disabled = false;
    ccBccLabel.classList.remove("disabled");
  }
}

function toggleCcBcc() {
  const toggle = document.getElementById("toggleCcBcc");
  if (toggle.disabled) return;
  saveSettings({ includeCcBcc: toggle.checked });
}

function getSendastaState() {
  const enabled = Office.context.roamingSettings.get("isSendastaEnabled") ?? true;
  document.getElementById("toggleSwitch").checked = enabled;

  const ccBccToggle = document.getElementById("toggleCcBcc");
  const ccBccLabel = ccBccToggle.closest("label");
  ccBccToggle.disabled = !enabled;
  ccBccLabel.classList.toggle("disabled", !enabled);
}

function getCcBccState() {
  const enabled = Office.context.roamingSettings.get("includeCcBcc") ?? true;
  document.getElementById("toggleCcBcc").checked = enabled;
}

// ── Read-only renderers ────────────────────────────────────────────────────────

function renderList(settingKey, listId) {
  const list = getList(settingKey);
  const ul = document.getElementById(listId);
  ul.innerHTML = "";
  if (list.length === 0) {
    const li = document.createElement("li");
    li.className = "domain-item";
    li.style.color = "#999";
    li.textContent = "None configured.";
    ul.appendChild(li);
    return;
  }
  list.forEach((domain) => {
    const li = document.createElement("li");
    li.className = "domain-item";
    const span = document.createElement("span");
    span.className = "domain-text";
    span.textContent = domain;
    li.appendChild(span);
    ul.appendChild(li);
  });
}

function renderPairList(settingKey, listId) {
  const pairs = getList(settingKey);
  const ul = document.getElementById(listId);
  ul.innerHTML = "";
  if (pairs.length === 0) {
    const li = document.createElement("li");
    li.className = "domain-item";
    li.style.color = "#999";
    li.textContent = "None configured.";
    ul.appendChild(li);
    return;
  }
  pairs.forEach(([a, b]) => {
    const li = document.createElement("li");
    li.className = "domain-item";
    const span = document.createElement("span");
    span.className = "domain-text";
    const badge = document.createElement("span");
    badge.className = "pair-badge";
    badge.textContent = "+";
    span.appendChild(document.createTextNode(a + " "));
    span.appendChild(badge);
    span.appendChild(document.createTextNode(" " + b));
    li.appendChild(span);
    ul.appendChild(li);
  });
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getList(settingKey) {
  const raw = Office.context.roamingSettings.get(settingKey);
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSettings(settings) {
  Object.entries(settings).forEach(([key, value]) => {
    Office.context.roamingSettings.set(key, value);
  });
  Office.context.roamingSettings.saveAsync((result) => {
    if (result.status !== Office.AsyncResultStatus.Succeeded) {
      console.error("Failed to save settings: " + result.error.message);
    }
  });
}
