import { inject } from "@vercel/analytics";
inject();

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById("sideload-msg").style.display = "none";
    const appBody = document.getElementById("app-body");
    appBody.classList.remove("app-body--hidden");
    appBody.style.display = "flex";

    // Activation
    document.getElementById("activateBtn").onclick = handleActivate;
    document.getElementById("deactivateBtn").onclick = handleDeactivate;
    bindEnterKey("licenseKeyInput", handleActivate);
    loadActivationState();

    // Toggles
    document.getElementById("toggleSwitch").onchange = toggleSendasta;
    document.getElementById("toggleCcBcc").onchange = toggleCcBcc;

    // Single-domain list buttons
    document.getElementById("addInternalDomain").onclick = () =>
      addDomain("internalDomains", "internalDomainInput", "internalDomainList");
    document.getElementById("addBlockedDomain").onclick = () =>
      addDomain("blockedDomains", "blockedDomainInput", "blockedDomainList");

    // Pair list buttons
    document.getElementById("addNoCombine").onclick = () =>
      addPair("noCombinePairs", "noCombineInputA", "noCombineInputB", "noCombineList");
    document.getElementById("addTrustedPair").onclick = () =>
      addPair("allowedPairs", "trustedPairInputA", "trustedPairInputB", "trustedPairList");

    // Enter key support for single-domain inputs
    bindEnterKey("internalDomainInput", () => addDomain("internalDomains", "internalDomainInput", "internalDomainList"));
    bindEnterKey("blockedDomainInput", () => addDomain("blockedDomains", "blockedDomainInput", "blockedDomainList"));

    // Enter key support for pair inputs
    const noCombineHandler = () => addPair("noCombinePairs", "noCombineInputA", "noCombineInputB", "noCombineList");
    bindEnterKey("noCombineInputA", noCombineHandler);
    bindEnterKey("noCombineInputB", noCombineHandler);

    const trustedPairHandler = () => addPair("allowedPairs", "trustedPairInputA", "trustedPairInputB", "trustedPairList");
    bindEnterKey("trustedPairInputA", trustedPairHandler);
    bindEnterKey("trustedPairInputB", trustedPairHandler);

    // Load saved state
    getSendastaState();
    getCcBccState();
    renderList("internalDomains", "internalDomainList");
    renderList("blockedDomains", "blockedDomainList");
    renderPairList("noCombinePairs", "noCombineList");
    renderPairList("allowedPairs", "trustedPairList");
  }
});

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
      setListSectionsDisabled(true);
    }, 100);
  } else {
    ccBccToggle.disabled = false;
    ccBccLabel.classList.remove("disabled");
    setListSectionsDisabled(false);
  }
}

function setListSectionsDisabled(disabled) {
  ["internalDomainsContainer", "blockedDomainsContainer", "noCombineContainer", "trustedPairsContainer"].forEach((id) => {
    const el = document.getElementById(id);
    el.classList.toggle("section-disabled", disabled);
    el.querySelectorAll("input, button").forEach((input) => {
      input.disabled = disabled;
    });
  });
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
  if (!enabled) setListSectionsDisabled(true);
}

function getCcBccState() {
  const enabled = Office.context.roamingSettings.get("includeCcBcc") ?? true;
  document.getElementById("toggleCcBcc").checked = enabled;
}

// ── Domain list management ────────────────────────────────────────────────────

function addDomain(settingKey, inputId, listId) {
  const input = document.getElementById(inputId);
  const domain = normalizeDomain(input.value);

  if (!domain) {
    showInputError(input, "Enter a domain (e.g. company.com)");
    return;
  }
  if (!isValidDomain(domain)) {
    showInputError(input, "Invalid domain format");
    return;
  }

  const list = getList(settingKey);
  if (list.includes(domain)) {
    showInputError(input, "Already in list");
    return;
  }

  list.push(domain);
  saveListSetting(settingKey, list, () => {
    input.value = "";
    renderList(settingKey, listId);
  });
}

function renderList(settingKey, listId) {
  const list = getList(settingKey);
  const ul = document.getElementById(listId);
  ul.innerHTML = "";
  list.forEach((domain, index) => {
    const li = document.createElement("li");
    li.className = "domain-item";
    const span = document.createElement("span");
    span.className = "domain-text";
    span.textContent = domain;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "remove-btn";
    btn.setAttribute("aria-label", `Remove ${domain}`);
    btn.textContent = "×";
    btn.addEventListener("click", () => removeDomainByIndex(settingKey, listId, index));
    li.appendChild(span);
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function removeDomainByIndex(settingKey, listId, index) {
  const list = getList(settingKey);
  list.splice(index, 1);
  saveListSetting(settingKey, list, () => renderList(settingKey, listId));
}

// ── Pair list management ───────────────────────────────────────────────────────

function addPair(settingKey, inputAId, inputBId, listId) {
  const inputA = document.getElementById(inputAId);
  const inputB = document.getElementById(inputBId);
  const domainA = normalizeDomain(inputA.value);
  const domainB = normalizeDomain(inputB.value);

  if (!domainA) { showInputError(inputA, "Enter a domain"); return; }
  if (!domainB) { showInputError(inputB, "Enter a domain"); return; }
  if (!isValidDomain(domainA)) { showInputError(inputA, "Invalid domain format"); return; }
  if (!isValidDomain(domainB)) { showInputError(inputB, "Invalid domain format"); return; }
  if (domainA === domainB) { showInputError(inputB, "Must be different domains"); return; }

  const pairs = getList(settingKey);
  const exists = pairs.some(([a, b]) => (a === domainA && b === domainB) || (a === domainB && b === domainA));
  if (exists) {
    showInputError(inputA, "Pair already exists");
    return;
  }

  pairs.push([domainA, domainB]);
  saveListSetting(settingKey, pairs, () => {
    inputA.value = "";
    inputB.value = "";
    renderPairList(settingKey, listId);
  });
}

function renderPairList(settingKey, listId) {
  const pairs = getList(settingKey);
  const ul = document.getElementById(listId);
  ul.innerHTML = "";
  pairs.forEach(([a, b], index) => {
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

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "remove-btn";
    btn.setAttribute("aria-label", `Remove pair ${a} + ${b}`);
    btn.textContent = "×";
    btn.addEventListener("click", () => removePairByIndex(settingKey, listId, index));

    li.appendChild(span);
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function removePairByIndex(settingKey, listId, index) {
  const pairs = getList(settingKey);
  pairs.splice(index, 1);
  saveListSetting(settingKey, pairs, () => renderPairList(settingKey, listId));
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

function saveListSetting(settingKey, value, callback) {
  Office.context.roamingSettings.set(settingKey, value);
  Office.context.roamingSettings.saveAsync((result) => {
    if (result.status === Office.AsyncResultStatus.Succeeded) {
      if (callback) callback();
    } else {
      console.error("Failed to save " + settingKey + ": " + result.error.message);
    }
  });
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

function normalizeDomain(value) {
  return (value || "").trim().toLowerCase().replace(/^@/, "").replace(/\/$/, "");
}

function isValidDomain(domain) {
  return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/.test(domain);
}

function showInputError(input, message) {
  const orig = input.placeholder;
  input.classList.add("input-error");
  input.placeholder = message;
  input.value = "";
  setTimeout(() => {
    input.classList.remove("input-error");
    input.placeholder = orig;
  }, 2500);
}

// ── Activation ────────────────────────────────────────────────────────────────

async function handleActivate() {
  const input = document.getElementById("licenseKeyInput");
  const btn = document.getElementById("activateBtn");
  const errorEl = document.getElementById("activationError");
  const key = input.value.trim();

  if (!key) {
    errorEl.textContent = "Please enter your license key.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Checking...";
  errorEl.textContent = "";

  try {
    const res = await fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ licenseKey: key }),
    });
    const data = await res.json();

    if (data.valid) {
      saveSettings({ licenseKey: key, licenseEmail: data.email ?? "" });
      showActivated(data.email);
    } else {
      errorEl.textContent = data.error ?? "Invalid license key.";
    }
  } catch {
    errorEl.textContent = "Could not reach the license server. Check your connection.";
  } finally {
    btn.disabled = false;
    btn.textContent = "Activate";
  }
}

function handleDeactivate() {
  saveSettings({ licenseKey: null, licenseEmail: null });
  showDeactivated();
}

function loadActivationState() {
  const key = Office.context.roamingSettings.get("licenseKey");
  const email = Office.context.roamingSettings.get("licenseEmail");
  if (key) {
    showActivated(email);
  } else {
    showDeactivated();
  }
}

function showActivated(email) {
  document.getElementById("activationUnlocked").classList.remove("activation-unlocked--hidden");
  document.getElementById("activationForm").style.display = "none";
  document.getElementById("activationEmail").textContent = email ? `Licensed to ${email}` : "Pro features unlocked";
  setProSectionsLocked(false);
}

function showDeactivated() {
  document.getElementById("activationUnlocked").classList.add("activation-unlocked--hidden");
  document.getElementById("activationForm").style.display = "";
  document.getElementById("licenseKeyInput").value = "";
  document.getElementById("activationError").textContent = "";
  setProSectionsLocked(true);
}

function setProSectionsLocked(locked) {
  ["internalDomainsContainer", "blockedDomainsContainer", "noCombineContainer", "trustedPairsContainer"].forEach((id) => {
    document.getElementById(id).classList.toggle("pro-locked", locked);
  });
}

function bindEnterKey(inputId, handler) {
  document.getElementById(inputId).addEventListener("keydown", (e) => {
    if (e.key === "Enter") handler();
  });
}
