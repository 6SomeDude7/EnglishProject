const ButtonsElements = document.querySelectorAll(".categorysDiv button");
const allButtonElements = document.querySelector(".categorysDiv");
const shuffleButtonElement = document.querySelector(".shuffleButton[data-group='0']");
const submitButtonElement = document.querySelector(".submitButton");
const resetButtonElement = document.querySelector(".shuffleButton[data-group='1']")
const mistakesPElement = document.querySelector(".mistakesP")

const groups = [
  ["A", "B", "C", "D"],
  ["W", "X", "Y", "Z"],
  ["1", "2", "3", "4"],
  ["PAIN", "MORE PAIN", "EVEN MORE PAIN", "MAX PAIN"]
];

const groupNames = ["DOGS", "STRESS", "NO MORE STRESS", "???"];

const solvedDivs = [
  document.querySelector(".solvedGroup[data-group='0']"),
  document.querySelector(".solvedGroup[data-group='1']"),
  document.querySelector(".solvedGroup[data-group='2']"),
  document.querySelector(".solvedGroup[data-group='3']")
];

const solvedGroups = new Set();

let solvedOrder = JSON.parse(localStorage.getItem("solvedOrder")) || [];

let solvedCount = 0;
let mistakes = 0;

function getActiveButtons() {
  return document.querySelectorAll(".activeButton");
}

function addEventListeners(func) {
  ButtonsElements.forEach(button => {
    button.addEventListener("click", func);
  });
  submitButtonElement.addEventListener("click", submitButtonClicked);
  shuffleButtonElement.addEventListener("click", shuffleButtons);
  resetButtonElement.addEventListener("click", resetGame);
}

function buttonsClicked(event) {
  const button = event.target;
  const activeButtons = getActiveButtons();

  if (activeButtons.length >= 4) {
    if (button.active) {
      button.active = !button.active;
      button.classList.toggle("activeButton");
    } else {
      return;
    }
  } else {
    button.active = !button.active;
    button.classList.toggle("activeButton");
  }

  const newActiveButtons = getActiveButtons();
  submitButtonElement.disabled = newActiveButtons.length < 4;
}

function normalize(arr) {
  return [...arr].sort().join("|");
}

function checkMatch(selected, groups) {
  const selectedNormalized = normalize(selected);

  for (let i = 0; i < groups.length; i++) {
    if (normalize(groups[i]) === selectedNormalized) {
      return i;
    }
  }

  return -1;
}

function showSolvedGroup(groupIndex, activeButtons) {
  const solvedDiv = solvedDivs[solvedCount];
  const matchedGroup = groups[groupIndex];

  solvedDiv.innerHTML = `
    <h3>${groupNames[groupIndex]}</h3>
    <p>${matchedGroup.join(", ")}</p>
  `;

  activeButtons.forEach(button => {
    button.classList.remove("activeButton");
    button.classList.add("shrinkAway");
    button.disabled = true;
    button.active = false;
  });

  setTimeout(() => {
    activeButtons.forEach(button => {
      button.classList.add("gone");
    });

    solvedDiv.classList.add("showSolved");
    shuffleButtons();
    submitButtonElement.disabled = true;
  }, 350);

  solvedOrder.push(groupIndex);
  localStorage.setItem("solvedOrder", JSON.stringify(solvedOrder));

  solvedCount++;
  
  if (solvedCount === 4) {
    localStorage.setItem("gameFinished", "true");
  }
}

function collapseGrid() {
  const container = document.querySelector(".categorysDiv");

  const visibleButtons = Array.from(container.children)
    .filter(btn => !btn.classList.contains("gone"));

  visibleButtons.forEach(btn => container.appendChild(btn));
}

function revealFinishedGame() {
  solvedOrder.forEach((groupIndex, displayIndex) => {
    if (displayIndex >= solvedDivs.length) return;

    const solvedDiv = solvedDivs[displayIndex];
    const matchedGroup = groups[groupIndex];

    if (!solvedDiv || !matchedGroup) return;

    solvedDiv.innerHTML = `
      <h3>${groupNames[groupIndex]}</h3>
      <p>${matchedGroup.join(", ")}</p>
    `;

    solvedDiv.classList.add("showSolved");
  });

  ButtonsElements.forEach(button => {
    button.classList.add("gone");
    button.disabled = true;
    button.active = false;
  });

  submitButtonElement.disabled = true;
}

function submitButtonClicked() {
  const activeButtons = Array.from(getActiveButtons());
  const selected = activeButtons.map(btn => btn.textContent.trim());

  const matchedIndex = checkMatch(selected, groups);

  if (matchedIndex !== -1) {
    showSolvedGroup(matchedIndex, activeButtons);
  } 
  else {
    activeButtons.forEach(btn => {
      btn.classList.add("wrongGuess");
      setTimeout(() => btn.classList.remove("wrongGuess"), 300);
    });
    mistakes++;
    mistakesPElement.innerHTML = `Mistakes: ${mistakes}`
  }
}

function shuffleButtons() {
  const container = document.querySelector(".categorysDiv");

  const buttons = Array.from(container.children)
    .filter(btn => !btn.classList.contains("gone"));

  for (let i = buttons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
  }

  buttons.forEach(button => container.appendChild(button));
}

function resetGame() {
  localStorage.removeItem("gameFinished");
  localStorage.removeItem("solvedOrder");
  localStorage.removeItem("mistakes");

  location.reload();
}

function run() {
  if (localStorage.getItem("gameFinished") === null) {
  localStorage.setItem("gameFinished", "false");
  }
  const gameFinished = localStorage.getItem("gameFinished");

  submitButtonElement.disabled = true;
  addEventListeners(buttonsClicked);
  shuffleButtons();

  ButtonsElements.forEach(button => {
    button.active = false;
  });

  if (gameFinished === "true") {
    revealFinishedGame();
  }
}

run();