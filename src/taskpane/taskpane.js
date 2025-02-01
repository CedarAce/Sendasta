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
  
  // Disable the CC/BCC toggle if Sendasta is disabled.
  document.getElementById("toggleCcBcc").disabled = !isSendastaEnabled;
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
  
  // Set the CC/BCC toggle disabled state accordingly.
  document.getElementById("toggleCcBcc").disabled = !sendastaEnabled;
}

function getCcBccState() {
  const isCcBccEnabled = Office.context.roamingSettings.get("includeCcBcc");
  document.getElementById("toggleCcBcc").checked = isCcBccEnabled !== null ? isCcBccEnabled : true;
}