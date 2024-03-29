/* global global, Office, self, window */

Office.onReady(() => {
  // If needed, Office.js is ready to be called
  if (Office.context.platform === Office.PlatformType.PC || Office.context.platform == null) {
    Office.actions.associate("onMessageSendHandler", onMessageSendHandler);
  }
});



function onMessageSendHandler(event) {
  const isSendastaEnabled = Office.context.roamingSettings.get("isSendastaEnabled");
  const considerInternalDomains = Office.context.roamingSettings.get("considerInternalDomains");
  
  if (isSendastaEnabled !== null && !isSendastaEnabled) {
    event.completed({ allowEvent: true });
  } else {
    const senderEmail = getSenderEmail();
    const senderDomain = getDomain(senderEmail);
    Office.context.mailbox.item.to.getAsync({ asyncContext: { event, senderDomain, considerInternalDomains } }, getRecipientsCallback);
  }
}

function getSenderEmail() {
  return Office.context.mailbox.item.from && Office.context.mailbox.item.from.emailAddress;
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

  console.log("Sender Domain:", senderDomain);
  console.log("Domain List:", domainList);

  if (considerInternalDomains) {
    if (domainList.length === 1 && domainList[0] === senderDomain) {
      event.completed({ allowEvent: true });
    } else {
      let domainListText = domainList.map(domain => `• ${domain}`).join("\n");
      event.completed({ allowEvent: false, errorMessage: `The recipients' domains do not match the sender's domain (${senderDomain}):\n${domainListText}` });
    }
  } else {
    if (domainList.length === 1) {
      event.completed({ allowEvent: true });
    } else {
      let domainListText = domainList.map(domain => `• ${domain}`).join("\n");
      event.completed({ allowEvent: false, errorMessage: `You have recipients from different domains:\n${domainListText}` });
    }
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
  if (!email) return ''; // Return empty string or handle as needed if email is falsy
  return email.substring(email.lastIndexOf("@") + 1);
}

// IMPORTANT: To ensure your add-in is supported in the Outlook client on Windows, remember to map the event handler name specified in the manifest to its JavaScript counterpart.
if (Office.context.platform === Office.PlatformType.PC || Office.context.platform == null) {
  Office.actions.associate("onMessageSendHandler", onMessageSendHandler);
}