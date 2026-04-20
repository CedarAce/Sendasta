/* global Office */

// Register the event handler at the root level (NOT inside Office.onReady).
// For event-based add-ins, the JavaScript-only runtime can dispatch the event
// before Office.onReady resolves. If the handler isn't associated in time,
// Outlook falls back to showing "Sendasta is unavailable".
Office.actions.associate("onMessageSendHandler", onMessageSendHandler);

function getAsync(prop) {
  return new Promise((resolve) => {
    prop.getAsync((result) => resolve(result));
  });
}

function onMessageSendHandler(event) {
  try {
    const isSendastaEnabled = Office.context.roamingSettings.get("isSendastaEnabled");
    if (isSendastaEnabled !== null && !isSendastaEnabled) {
      event.completed({ allowEvent: true });
      return;
    }

    const includeCcBcc = Office.context.roamingSettings.get("includeCcBcc") ?? true;
    const blockedDomains = getListSetting("blockedDomains");
    const noCombinePairs = getListSetting("noCombinePairs");
    const allowedPairs = getListSetting("allowedPairs");
    const internalDomains = getListSetting("internalDomains");

    const item = Office.context.mailbox.item;
    const recipientCalls = includeCcBcc
      ? [getAsync(item.to), getAsync(item.cc), getAsync(item.bcc)]
      : [getAsync(item.to)];

    // Fetch from + all recipients in parallel instead of sequentially,
    // cutting 4 chained ~1.5s calls down to a single parallel round-trip.
    Promise.all([getAsync(item.from), ...recipientCalls])
      .then(([fromResult, ...recipientResults]) => {
        if (fromResult.status !== Office.AsyncResultStatus.Succeeded) {
          event.completed({ allowEvent: false, errorMessage: "Sendasta could not read the sender address." });
          return;
        }

        const senderDomain = getDomain(fromResult.value.emailAddress);
        let recipients = [];
        for (const result of recipientResults) {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            recipients = recipients.concat(result.value);
          }
        }

        evaluateRecipients(event, senderDomain, recipients, blockedDomains, noCombinePairs, allowedPairs, internalDomains);
      })
      .catch(() => {
        event.completed({ allowEvent: true });
      });
  } catch {
    event.completed({ allowEvent: true });
  }
}

function evaluateRecipients(event, senderDomain, recipients, blockedDomains, noCombinePairs, allowedPairs, internalDomains) {
  try {
    if (recipients.length === 0) {
      event.completed({ allowEvent: true });
      return;
    }

    const recipientDomains = recipients.map((r) => getDomain(r.emailAddress));

    // 1. Blocked domains — hard block regardless of other rules
    if (blockedDomains.length > 0) {
      const hits = [...new Set(recipientDomains.filter((d) => blockedDomains.includes(d)))];
      if (hits.length > 0) {
        event.completed({
          allowEvent: false,
          errorMessage: `Email blocked: recipient domain(s) on your blocked list:\n${hits.map((d) => `• ${d}`).join("\n")}`,
        });
        return;
      }
    }

    // 2. No-combine pairs — block if both domains of any pair are present
    for (const pair of noCombinePairs) {
      const [domainA, domainB] = pair;
      if (recipientDomains.includes(domainA) && recipientDomains.includes(domainB)) {
        event.completed({
          allowEvent: false,
          errorMessage: `Email blocked: "${domainA}" and "${domainB}" must not receive the same email per your rules.`,
        });
        return;
      }
    }

    // 3. Compute external domains (not sender's domain, not in internalDomains)
    const allInternalDomains = new Set([senderDomain, ...internalDomains]);
    const externalDomains = [...new Set(recipientDomains.filter((d) => !allInternalDomains.has(d)))];

    if (externalDomains.length <= 1) {
      event.completed({ allowEvent: true });
      return;
    }

    // 4. Allowed pairs — if every combination of external domains is explicitly trusted, allow
    if (allowedPairs.length > 0 && areAllPairsAllowed(externalDomains, allowedPairs)) {
      event.completed({ allowEvent: true });
      return;
    }

    // 5. Multi-domain alert
    event.completed({
      allowEvent: false,
      errorMessage: `Recipients span multiple external domains. Please double-check before sending:\n${externalDomains.map((d) => `• ${d}`).join("\n")}`,
    });
  } catch {
    event.completed({ allowEvent: true });
  }
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
