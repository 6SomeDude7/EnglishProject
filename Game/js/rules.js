document.addEventListener("DOMContentLoaded", () => {
  const rulesBtn = document.getElementById("rulesBtn");
  const rulesOverlay = document.getElementById("rulesOverlay");
  const closeRules = document.getElementById("closeRules");

  rulesBtn.addEventListener("click", () => {
    rulesOverlay.classList.add("show");
  });

  closeRules.addEventListener("click", () => {
    rulesOverlay.classList.remove("show");
  });

});