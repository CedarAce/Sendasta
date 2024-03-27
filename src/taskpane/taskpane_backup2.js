Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("toggleSwitch").onchange = toggleSendasta;
    sendSliderStateToCommands(); // Send initial slider state to commands.js
  }
});

let isSendastaEnabled = true;

function toggleSendasta() {
  isSendastaEnabled = document.getElementById("toggleSwitch").checked;
  console.log("Sendasta is now " + (isSendastaEnabled ? "enabled" : "disabled"));
  sendSliderStateToCommands();
}

function sendSliderStateToCommands() {
  localStorage.setItem("isSendastaEnabled", isSendastaEnabled);
}