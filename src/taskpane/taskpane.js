Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("toggleSwitch").onchange = toggleSendasta;
    document.getElementById("internalDomainToggle").onchange = toggleInternalDomains;
    getSendastaState(); // Retrieve initial slider state from roaming settings
    getInternalDomainsState(); // Retrieve initial internal domains state from roaming settings
  }
});

let isSendastaEnabled = true;

function toggleSendasta() {
  isSendastaEnabled = document.getElementById("toggleSwitch").checked;
  console.log("Sendasta is now " + (isSendastaEnabled ? "enabled" : "disabled"));
  saveSendastaState(isSendastaEnabled);
}

function saveSendastaState(isSendastaEnabled) {
  Office.context.roamingSettings.set("isSendastaEnabled", isSendastaEnabled);
  Office.context.roamingSettings.saveAsync();
}

function getSendastaState() {
  const isSendastaEnabled = Office.context.roamingSettings.get("isSendastaEnabled");
  if (isSendastaEnabled !== null) {
    document.getElementById("toggleSwitch").checked = isSendastaEnabled;
  } else {
    document.getElementById("toggleSwitch").checked = true; // Default to enabled if not set
  }
}

function toggleInternalDomains() {
  const considerInternalDomains = document.getElementById("internalDomainToggle").checked;
  console.log("Consider internal domains: " + (considerInternalDomains ? "enabled" : "disabled"));
  saveInternalDomainsState(considerInternalDomains);
}

function saveInternalDomainsState(considerInternalDomains) {
  Office.context.roamingSettings.set("considerInternalDomains", considerInternalDomains);
  Office.context.roamingSettings.saveAsync();
}

function getInternalDomainsState() {
  const considerInternalDomains = Office.context.roamingSettings.get("considerInternalDomains");
  if (considerInternalDomains !== null) {
    document.getElementById("internalDomainToggle").checked = considerInternalDomains;
  } else {
    document.getElementById("internalDomainToggle").checked = true; // Default to enabled if not set
  }
}