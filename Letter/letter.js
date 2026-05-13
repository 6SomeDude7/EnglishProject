
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");

const coverPage = document.getElementById("coverPage");

nextBtn.addEventListener("click", () => {
  coverPage.style.display = "none";

  localStorage.setItem("viewedLetter", "true");
});

backBtn.addEventListener("click", () => {
  coverPage.style.display = "flex";
});