/* global Office */

const CLIENT_VERSION = "2.0.0";

// Business-tier compliance: strip PII (sender/recipient email addresses) from
// any structured event before it leaves the user's machine. Domain-level fields
// (companyDomain, recipientDomains) are kept so admin analytics still work.
const PII_FIELDS = ["senderEmail", "recipientEmails"];

function log(payload) {
  try {
    const body = typeof payload === "string" ? { msg: payload } : payload;
    const settings = Office.context && Office.context.roamingSettings;
    const tier = settings ? settings.get("tier") : null;
    const orgId = settings ? settings.get("orgId") : null;
    const host =
      Office.context && Office.context.mailbox && Office.context.mailbox.diagnostics
        ? Office.context.mailbox.diagnostics.hostName
        : null;

    let outgoing = body;
    if (tier === "business" && body && typeof body === "object") {
      outgoing = {};
      for (const k of Object.keys(body)) {
        if (!PII_FIELDS.includes(k)) outgoing[k] = body[k];
      }
    }

    fetch("https://sendasta.com/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...outgoing,
        tier,
        orgId,
        host,
        client_version: CLIENT_VERSION,
      }),
    });
  } catch (_) {}
}

// Register at root level for classic Outlook on Windows (JS-only runtime fires events
// before Office.onReady resolves). Also register inside onReady for new Outlook / WebView
// runtimes where Office must be initialized before associations are accepted.
log("commands-js-loaded");
Office.actions.associate("onMessageSendHandler", onMessageSendHandler);
Office.onReady(() => {
  log("office-ready");
  Office.actions.associate("onMessageSendHandler", onMessageSendHandler);
});

function onMessageSendHandler(event) {
  log("handler-called");

  const isSendastaEnabled = Office.context.roamingSettings.get("isSendastaEnabled");
  if (isSendastaEnabled !== null && !isSendastaEnabled) {
    log("disabled-allow");
    event.completed({ allowEvent: true });
    return;
  }

  const includeCcBcc = Office.context.roamingSettings.get("includeCcBcc") ?? true;
  const blockedDomains = getListSetting("blockedDomains");
  const noCombinePairs = getListSetting("noCombinePairs");
  const allowedPairs = getListSetting("allowedPairs");
  const internalDomains = getListSetting("internalDomains");

  log("calling-from-getAsync");
  Office.context.mailbox.item.from.getAsync(function (fromResult) {
    log("from-callback-fired");

    if (fromResult.status !== Office.AsyncResultStatus.Succeeded) {
      log("from-failed");
      event.completed({ allowEvent: false, errorMessage: "Sendasta could not read the sender address." });
      return;
    }

    const senderEmail = fromResult.value.emailAddress;
    const senderDomain = getDomain(senderEmail);
    log({ action: "scan_started", companyDomain: senderDomain, senderEmail });

    const ctx = { event, senderEmail, senderDomain, blockedDomains, noCombinePairs, allowedPairs, internalDomains };

    if (includeCcBcc) {
      log("calling-to-getAsync");
      Office.context.mailbox.item.to.getAsync({ asyncContext: ctx }, (toResult) => {
        log("to-callback-fired");
        Office.context.mailbox.item.cc.getAsync({ asyncContext: { ...toResult.asyncContext, toResult } }, (ccResult) => {
          log("cc-callback-fired");
          Office.context.mailbox.item.bcc.getAsync({ asyncContext: { ...ccResult.asyncContext, ccResult } }, evaluateRecipients);
        });
      });
    } else {
      log("calling-to-getAsync-only");
      Office.context.mailbox.item.to.getAsync({ asyncContext: ctx }, evaluateRecipients);
    }
  });
}

function evaluateRecipients(asyncResult) {
  log("evaluate-recipients-called");
  const { event, senderEmail, senderDomain, blockedDomains, noCombinePairs, allowedPairs, internalDomains, toResult, ccResult } = asyncResult.asyncContext;
  let recipients = [];

  if (toResult && toResult.status === Office.AsyncResultStatus.Succeeded) {
    recipients = recipients.concat(toResult.value);
  }
  if (ccResult && ccResult.status === Office.AsyncResultStatus.Succeeded) {
    recipients = recipients.concat(ccResult.value);
  }
  if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
    recipients = recipients.concat(asyncResult.value);
  }

  if (recipients.length === 0) {
    log("completed-no-recipients");
    event.completed({ allowEvent: true });
    return;
  }

  const recipientDomains = recipients.map((r) => getDomain(r.emailAddress));
  const recipientEmails = recipients.map((r) => r.emailAddress);

  // 1. Blocked domains
  if (blockedDomains.length > 0) {
    const hits = [...new Set(recipientDomains.filter((d) => blockedDomains.includes(d)))];
    if (hits.length > 0) {
      log({ action: "email_blocked", reason: "blocked_domain", companyDomain: senderDomain, senderEmail, recipientEmails });
      event.completed({
        allowEvent: false,
        errorMessage: `⚠️ Recipient on restricted list\n\nThe following recipient domain${hits.length > 1 ? "s are" : " is"} on your organization's restricted list:\n\n${hits.map((d) => `• ${d}`).join("\n")}\n\nAre you sure you want to send this email?`,
      });
      return;
    }
  }

  // 2. No-combine pairs
  for (const pair of noCombinePairs) {
    const [domainA, domainB] = pair;
    if (recipientDomains.includes(domainA) && recipientDomains.includes(domainB)) {
      log({ action: "email_blocked", reason: "no_combine", companyDomain: senderDomain, senderEmail, recipientEmails });
      event.completed({
        allowEvent: false,
        errorMessage: `Conflicting recipients detected\n\nYour organization's policy does not allow sending to these domains together:\n\n• ${domainA}\n• ${domainB}\n\nReview recipients before proceeding.`,
      });
      return;
    }
  }

  // 3. External domains
  const allInternalDomains = new Set([senderDomain, ...internalDomains]);
  const externalDomains = [...new Set(recipientDomains.filter((d) => !allInternalDomains.has(d)))];

  if (externalDomains.length <= 1) {
      log({ action: "email_allowed", reason: "single_external_domain", companyDomain: senderDomain, senderEmail, recipientEmails });
    event.completed({ allowEvent: true });
    return;
  }

  // 4. Allowed pairs
  if (allowedPairs.length > 0 && areAllPairsAllowed(externalDomains, allowedPairs)) {
    log({ action: "email_allowed", reason: "allowed_pairs", companyDomain: senderDomain, senderEmail, recipientEmails });
    event.completed({ allowEvent: true });
    return;
  }

  // 5. Multi-domain alert
  log({ action: "email_blocked", reason: "multi_domain_alert", companyDomain: senderDomain, senderEmail, recipientEmails });
  event.completed({
    allowEvent: false,
    errorMessage: `Multiple external domains detected\n\nThis email is addressed to ${externalDomains.length} external organization${externalDomains.length > 1 ? "s" : ""}:\n\n${externalDomains.map((d) => `• ${d}`).join("\n")}\n\nConfirm this is intentional.`,
  });
}

function areAllPairsAllowed(domains, allowedPairs) {
  for (let i = 0; i < domains.length; i++) {
    for (let j = i + 1; j < domains.length; j++) {
      const a = domains[i];
      const b = domains[j];
      const ok = allowedPairs.some(([pa, pb]) => (pa === a && pb === b) || (pa === b && pb === a));
      if (!ok) return false;
    }
  }
  return true;
}

function getListSetting(key) {
  const raw = Office.context.roamingSettings.get(key);
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getDomain(email) {
  return email.substring(email.lastIndexOf("@") + 1).toLowerCase();
}
