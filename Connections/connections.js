const ButtonsElements = document.querySelectorAll(".categorysDiv button");
const allButtonElements = document.querySelector(".categorysDiv");
const shuffleButtonElement = document.querySelector(".shuffleButton");
const submitButtonElement = document.querySelector(".submitButton");

const groups = [
  ["A", "B", "C", "D"],
  ["W", "X", "Y", "Z"],
  ["PAIN", "MORE PAIN", "EVEN MORE PAIN", "MAX PAIN"],
  ["1", "2", "3", "4"]
];

const solvedDivs = [
  document.querySelector(".solvedGroup[data-group='0']"),
  document.querySelector(".solvedGroup[data-group='1']"),
  document.querySelector(".solvedGroup[data-group='2']"),
  document.querySelector(".solvedGroup[data-group='3']")
];

function getActiveButtons() {
  return document.querySelectorAll(".activeButton");
}

function addEventListeners(func) {
  ButtonsElements.forEach(button => {
    button.addEventListener("click", func);
  });
  submitButtonElement.addEventListener("click", submitButtonClicked);
  shuffleButtonElement.addEventListener("click", shuffleButtons)
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
  const solvedDiv = solvedDivs[groupIndex];
  const matchedGroup = groups[groupIndex];

  solvedDiv.innerHTML = `
    <h3>GROUP ${groupIndex + 1}</h3>
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
    submitButtonElement.disabled = true;
    
    collapseGrid();
  }, 350);
}

function collapseGrid() {
  const container = document.querySelector(".categorysDiv");

  const visibleButtons = Array.from(container.children)
    .filter(btn => !btn.classList.contains("gone"));

  visibleButtons.forEach(btn => container.appendChild(btn));
}

function submitButtonClicked() {
  const activeButtons = Array.from(getActiveButtons());
  const selected = activeButtons.map(btn => btn.textContent.trim());

  const matchedIndex = checkMatch(selected, groups);

  if (matchedIndex !== -1) {
    showSolvedGroup(matchedIndex, activeButtons);
  }
  else {
    const activeButtons = getActiveButtons();

    activeButtons.forEach(btn => {
      btn.classList.add("wrongGuess");

    // remove so it can be triggered again later
      setTimeout(() => {
        btn.classList.remove("wrongGuess");
      }, 300);
    });
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

function run() {
  submitButtonElement.disabled = true;
  addEventListeners(buttonsClicked);
  shuffleButtons();
  ButtonsElements.forEach(button => {
    button.active = false;
  });
}

run();