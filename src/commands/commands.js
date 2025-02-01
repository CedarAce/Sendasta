Office.onReady(() => {
  // If needed, Office.js is ready to be called
  if (Office.context.platform === Office.PlatformType.PC || Office.context.platform == null) {
    Office.actions.associate("onMessageSendHandler", onMessageSendHandler);
  }
});

function onMessageSendHandler(event) {
  const isSendastaEnabled = Office.context.roamingSettings.get("isSendastaEnabled");
  if (isSendastaEnabled !== null && !isSendastaEnabled) {
    event.completed({ allowEvent: true });
  } else {
    const includeCcBcc = Office.context.roamingSettings.get("includeCcBcc") ?? true; // Default to true

    if (includeCcBcc) {
        Office.context.mailbox.item.to.getAsync({ asyncContext: event }, (toResult) => {
            Office.context.mailbox.item.cc.getAsync({ asyncContext: { event, toResult } }, (ccResult) => {
                Office.context.mailbox.item.bcc.getAsync({ asyncContext: { event, toResult, ccResult } }, getRecipientsCallback);
            });
        });
    } else {
        // Only get "To" recipients if Cc/Bcc scanning is disabled
        Office.context.mailbox.item.to.getAsync({ asyncContext: { event } }, getRecipientsCallback);
      }  }
}

function getRecipientsCallback(asyncResult) {
  let { event, toResult, ccResult } = asyncResult.asyncContext;
  let recipients = [];

  // Merge "To" recipients
  if (toResult && toResult.status === Office.AsyncResultStatus.Succeeded) {
    recipients = recipients.concat(toResult.value);
  }

  // Merge "Cc" recipients
  if (ccResult && ccResult.status === Office.AsyncResultStatus.Succeeded) {
    recipients = recipients.concat(ccResult.value);
  }

  // Merge "Bcc" recipients
  if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
    recipients = recipients.concat(asyncResult.value);
  }

  if (recipients.length === 0) {
    let message = "Failed to get recipients";
    console.error(message);
    event.completed({ allowEvent: false, errorMessage: message });
    return;
  }

  let domainList = getDifferentDomains(recipients);
  if (domainList.length === 1) {
    event.completed({ allowEvent: true });
  } else {
    let domainListText = domainList.map(domain => `• ${domain}`).join("\n");
    event.completed({ allowEvent: false, errorMessage: `You have recipients from different domains:\n${domainListText}` });
  }
}
function getDifferentDomains(recipients) {
  if (recipients == null || recipients.length == 0) {
    return [];
  }
  const domains = new Set();
  for (let index = 0; index < recipients.length; index++) {
    domains.add(getDomain(recipients[index].emailAddress));
  }
  return Array.from(domains);
}

function getDomain(email) {
  return email.substring(email.lastIndexOf("@") + 1).toLowerCase();
}

// IMPORTANT: To ensure your add-in is supported in the Outlook client on Windows, remember to map the event handler name specified in the manifest to its JavaScript counterpart.
 if (Office.context.platform === Office.PlatformType.PC || Office.context.platform == null) {
  Office.actions.associate("onMessageSendHandler", onMessageSendHandler);
 }