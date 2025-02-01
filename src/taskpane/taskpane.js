Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    
    // Master toggle
    document.getElementById("toggleSwitch").onchange = toggleSendasta;
    
    // Cc/Bcc toggle
    document.getElementById("toggleCcBcc").onchange = toggleCcBcc;

    // Retrieve initial states
    getSendastaState();
    getCcBccState();
  }
});
// Master toggle function
function toggleSendasta() {
  const isSendastaEnabled = document.getElementById("toggleSwitch").checked;
  console.log("Sendasta is now " + (isSendastaEnabled ? "enabled" : "disabled"));
  
  Office.context.roamingSettings.set("isSendastaEnabled", isSendastaEnabled);
  Office.context.roamingSettings.saveAsync(function (asyncResult) {
    if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
      console.log("Sendasta state saved successfully.");
    } else {
      console.error("Failed to save Sendasta state. Error: " + asyncResult.error.message);
    }
  });
  
  // Get the CC/BCC toggle input and its parent label
  const ccBccToggle = document.getElementById("toggleCcBcc");
  const ccBccLabel = ccBccToggle.parentNode; // the <label class="switch"> element

  // Disable (or enable) the CC/BCC toggle based on the Sendasta state.
  ccBccToggle.disabled = !isSendastaEnabled;

  // Add or remove a disabled class to the label for visual feedback.
  if (!isSendastaEnabled) {
    ccBccLabel.classList.add("disabled");
  } else {
    ccBccLabel.classList.remove("disabled");
  }
}

// Save & retrieve Cc/Bcc toggle state
function toggleCcBcc() {
  const isCcBccEnabled = document.getElementById("toggleCcBcc").checked;
  console.log("Include Cc/Bcc: " + (isCcBccEnabled ? "enabled" : "disabled"));

  Office.context.roamingSettings.set("includeCcBcc", isCcBccEnabled);
  Office.context.roamingSettings.saveAsync(function (asyncResult) {
    if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
      console.log("Cc/Bcc setting saved successfully.");
    } else {
      console.error("Failed to save Cc/Bcc setting. Error: " + asyncResult.error.message);
    }
  });
}

function getSendastaState() {
  const isSendastaEnabled = Office.context.roamingSettings.get("isSendastaEnabled");
  // Use true as default if the setting hasn't been set yet.
  const sendastaEnabled = (isSendastaEnabled !== null ? isSendastaEnabled : true);
  document.getElementById("toggleSwitch").checked = sendastaEnabled;
  
  const ccBccToggle = document.getElementById("toggleCcBcc");
  const ccBccLabel = ccBccToggle.parentNode;
  ccBccToggle.disabled = !sendastaEnabled;
  if (!sendastaEnabled) {
    ccBccLabel.classList.add("disabled");
  } else {
    ccBccLabel.classList.remove("disabled");
  }
}

function toggleCcBcc() {
  const ccBccToggle = document.getElementById("toggleCcBcc");
  if (ccBccToggle.disabled) {
    return; // Do nothing if disabled.
  }
  const isCcBccEnabled = ccBccToggle.checked;
  console.log("Include Cc/Bcc: " + (isCcBccEnabled ? "enabled" : "disabled"));

  Office.context.roamingSettings.set("includeCcBcc", isCcBccEnabled);
  Office.context.roamingSettings.saveAsync(function (asyncResult) {
    if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
      console.log("Cc/Bcc setting saved successfully.");
    } else {
      console.error("Failed to save Cc/Bcc setting. Error: " + asyncResult.error.message);
    }
  });
}