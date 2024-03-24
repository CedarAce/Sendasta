/* global global, Office, self, window */

Office.onReady(() => {
  // If needed, Office.js is ready to be called
  if (Office.context.platform === Office.PlatformType.PC || Office.context.platform == null) {
    Office.actions.associate("onMessageRecipientsChangedHandler", onMessageRecipientsChangedHandler);
    Office.actions.associate("onMessageSendHandler", onMessageSendHandler);
    Office.actions.associate("onSensitivityLabelChangedHandler", onSensitivityLabelChangedHandler);
  }
  
  // Register an event handler for the RecipientsChanged event
  Office.context.mailbox.item.addHandlerAsync(Office.EventType.RecipientsChanged, function(eventArgs) {
    // Call the checkDomains function whenever the recipients list changes
    checkDomains(eventArgs);
  });
});



function onMessageSendHandler(event) {
  console.log("subFunction is running!");
}

function checkDomains(eventArgs) {
  console.log('checkDomains called');  // Debugging line

  // Get the recipient list
  Office.context.mailbox.item.to.getAsync(
    { asyncContext: "This is some data" },
    function callback(result) {
      console.log('callback called', result);  // Debugging line

      if (result.status === Office.AsyncResultStatus.Failed) {
        console.error(result.error);  // Debugging line
        eventArgs.completed();
        return;
      }

      var emailAddresses = result.value;
      console.log('emailAddresses', emailAddresses);  // Debugging line

      var domains = emailAddresses
        .filter(emailDetails => emailDetails.emailAddress !== undefined)  // Ignore recipients without an email address
        .map(emailDetails => {
          console.log('emailDetails.emailAddress', emailDetails.emailAddress);  // Debugging line
          let domain = emailDetails.emailAddress.split('@')[1];
          console.log('domain after split', domain);  // Debugging line
          return domain;
        });
      console.log('domains', domains);  // Debugging line

      var uniqueDomains = [...new Set(domains)];
      console.log('uniqueDomains', uniqueDomains);  // Debugging line

      // Show a notification if multiple domains are detected
      if (uniqueDomains.length > 1) {
        // Save the item
        Office.context.mailbox.item.saveAsync(function(saveResult) {
          if (saveResult.status === Office.AsyncResultStatus.Succeeded) {
            // Item saved successfully, now add the notification
            const message = {
              type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
              message: "Multiple recipient domains detected.",
              icon: "Icon.80x80",
              persistent: true,
            };

            // Show a notification message
            Office.context.mailbox.item.notificationMessages.replaceAsync("checkDomains", message, (result) => {
              if (result.status === Office.AsyncResultStatus.Failed) {
                console.error(result.error);  // Debugging line
              }
              eventArgs.completed();
            });
          } else {
            console.error(saveResult.error);  // Debugging line
            eventArgs.completed();
          }
        });
      } else {
        eventArgs.completed();
      }
    }
  );
}


function getGlobal() {
  return typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : undefined;
}

const g = getGlobal();

// The add-in command functions need to be available in global scope
g.checkDomains = checkDomains;
