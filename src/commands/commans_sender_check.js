/* global global, Office, self, window */
Office.onReady(() => {
  // If needed, Office.js is ready to be called
  if (Office.context && (Office.context.platform === Office.PlatformType.PC || Office.context.platform == null)) {
    Office.actions.associate("onMessageSendHandler", onMessageSendHandler);
  }
});

function onMessageSendHandler(event) {
  const isSendastaEnabled = Office.context.roamingSettings.get("isSendastaEnabled");
  const considerInternalDomains = Office.context.roamingSettings.get("considerInternalDomains");

  if (isSendastaEnabled !== null && !isSendastaEnabled) {
    event.completed({ allowEvent: true });
  } else {
    Office.context.mailbox.item.from.getAsync(function (asyncResult) {
      if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
        const senderEmailAddress = asyncResult.value.emailAddress;
        const senderDomain = getDomain(senderEmailAddress);
        Office.context.mailbox.item.to.getAsync({ asyncContext: { event, senderDomain, considerInternalDomains } }, getRecipientsCallback);
      } else {
        console.error("Failed to get sender's email address. Error: " + asyncResult.error.message);
        event.completed({ allowEvent: false, errorMessage: "Failed to get sender's email address." });
      }
    });
  }
}

function getRecipientsCallback(asyncResult) {
  let event = asyncResult.asyncContext.event;
  let senderDomain = asyncResult.asyncContext.senderDomain;
  let considerInternalDomains = asyncResult.asyncContext.considerInternalDomains;
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
  let externalDomains = domainList.filter(domain => domain !== senderDomain);

  if (externalDomains.length > 0) {
    if (externalDomains.length === 1 && !considerInternalDomains) {
      event.completed({ allowEvent: true });
    } else {
      let domainListText = externalDomains.map(domain => `• ${domain}`).join("\n");
      event.completed({ allowEvent: false, errorMessage: `The recipients contain one or more domains that are different from the sender's domain (${senderDomain}):\n${domainListText}` });
    }
  } else {
    event.completed({ allowEvent: true });
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
if (Office.context && (Office.context.platform === Office.PlatformType.PC || Office.context.platform == null)) {
  Office.actions.associate("onMessageSendHandler", onMessageSendHandler);
}