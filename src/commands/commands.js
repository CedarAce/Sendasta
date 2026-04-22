/* global Office */

function log(msg) {
  try {
    fetch("https://sendasta.com/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msg }),
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

    const senderDomain = getDomain(fromResult.value.emailAddress);
    const ctx = { event, senderDomain, blockedDomains, noCombinePairs, allowedPairs, internalDomains };

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
  const { event, senderDomain, blockedDomains, noCombinePairs, allowedPairs, internalDomains, toResult, ccResult } = asyncResult.asyncContext;
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

  // 1. Blocked domains
  if (blockedDomains.length > 0) {
    const hits = [...new Set(recipientDomains.filter((d) => blockedDomains.includes(d)))];
    if (hits.length > 0) {
      log("completed-blocked-domain");
      event.completed({
        allowEvent: false,
        errorMessage: `⚠️ Recipient on restricted list\nThe following domain(s) are on your organization's restricted list:\n${hits.map((d) => `• ${d}`).join("\n")}\nAre you sure you want to send this email?`,
      });
      return;
    }
  }

  // 2. No-combine pairs
  for (const pair of noCombinePairs) {
    const [domainA, domainB] = pair;
    if (recipientDomains.includes(domainA) && recipientDomains.includes(domainB)) {
      log("completed-no-combine");
      event.completed({
        allowEvent: false,
        errorMessage: `Conflicting recipients detected\nYour policy prevents sending to these domains on the same email:\n• ${domainA}\n• ${domainB}\nReview recipients before proceeding.`,
      });
      return;
    }
  }

  // 3. External domains
  const allInternalDomains = new Set([senderDomain, ...internalDomains]);
  const externalDomains = [...new Set(recipientDomains.filter((d) => !allInternalDomains.has(d)))];

  if (externalDomains.length <= 1) {
    log("completed-single-domain-allow");
    event.completed({ allowEvent: true });
    return;
  }

  // 4. Allowed pairs
  if (allowedPairs.length > 0 && areAllPairsAllowed(externalDomains, allowedPairs)) {
    log("completed-allowed-pairs");
    event.completed({ allowEvent: true });
    return;
  }

  // 5. Multi-domain alert
  log("completed-multi-domain-block");
  event.completed({
    allowEvent: false,
    errorMessage: `Multiple external domains detected\nThis email is addressed to ${externalDomains.length} external organization${externalDomains.length > 1 ? "s" : ""}:\n${externalDomains.map((d) => `• ${d}`).join("\n")}\nConfirm this is intentional.`,
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
