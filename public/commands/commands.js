/* global global, Office, self, window */


/* global global, Office, self, window */

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
    Office.context.mailbox.item.to.getAsync({ asyncContext: event }, getRecipientsCallback);
  }
}


// ... (keep the remaining code in commands.js unchanged)

function getRecipientsCallback(asyncResult) {
  let event = asyncResult.asyncContext;
  let recipients = [];
  if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
    recipients = asyncResult.value;
  } else {
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
  return email.substring(email.lastIndexOf("@") + 1);
}

// IMPORTANT: To ensure your add-in is supported in the Outlook client on Windows, remember to map the event handler name specified in the manifest to its JavaScript counterpart.
if (Office.context.platform === Office.PlatformType.PC || Office.context.platform == null) {
  Office.actions.associate("onMessageSendHandler", onMessageSendHandler);
}