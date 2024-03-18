/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/

function onMessageSendHandler(event) {
  Office.context.mailbox.item.to.getAsync({ asyncContext: event }, getRecipientsCallback);
}

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

  if (hasSameDomain(recipients)) {
    event.completed({ allowEvent: true });
  } else {
    event.completed({ allowEvent: false, errorMessage: "You have recipients from different domains." });
  }
}

function hasSameDomain(recipients) {
  if (recipients == null || recipients.length == 0) {
    return false;
  }

  const domain = getDomain(recipients[0].emailAddress);
  for (let index = 1; index < recipients.length; index++) {
    if (getDomain(recipients[index].emailAddress) !== domain) {
      return false;
    }
  }

  return true;
}

function getDomain(email) {
  return email.substring(email.lastIndexOf("@") + 1);
}

  
  // IMPORTANT: To ensure your add-in is supported in the Outlook client on Windows, remember to map the event handler name specified in the manifest to its JavaScript counterpart.
  if (Office.context.platform === Office.PlatformType.PC || Office.context.platform == null) {
    Office.actions.associate("onMessageSendHandler", onMessageSendHandler);
  }