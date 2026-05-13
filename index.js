const viewedLetter = localStorage.getItem("viewedLetter");

if (viewedLetter === "true") {
  document.querySelectorAll(".locked").forEach(link => {
    link.classList.remove("locked");
  });
}