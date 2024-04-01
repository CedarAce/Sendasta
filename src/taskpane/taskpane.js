Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("toggleSwitch").onchange = toggleSendasta;
    getSendastaState(); // Retrieve initial slider state from roaming settings
  }
});

function toggleSendasta() {
  const isSendastaEnabled = document.getElementById("toggleSwitch").checked;
  console.log("Sendasta is now " + (isSendastaEnabled ? "enabled" : "disabled"));
  saveSendastaState(isSendastaEnabled);
}

function saveSendastaState(isSendastaEnabled) {
  Office.context.roamingSettings.set("isSendastaEnabled", isSendastaEnabled);
  Office.context.roamingSettings.saveAsync(function (asyncResult) {
    if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
      console.log("Sendasta state saved successfully.");
    } else {
      console.error("Failed to save Sendasta state. Error: " + asyncResult.error.message);
    }
  });
}

function getSendastaState() {
  const isSendastaEnabled = Office.context.roamingSettings.get("isSendastaEnabled");
  if (isSendastaEnabled !== null) {
    document.getElementById("toggleSwitch").checked = isSendastaEnabled;
  } else {
    document.getElementById("toggleSwitch").checked = true; // Default to enabled if not set
  }
}