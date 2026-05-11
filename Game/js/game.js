
let currentRotation = 0;
let landedNumber = null;
let chosenPath = null;
let playerIndex = 0;
let isMoving = false;
let graduationMode = false;
let stressMoveWarningShown = false;

const playerStats = {
  money: 3000,
  salary: 0,
  job: "None",
  stress: 25,
  stressMax: 100,
  loan: 0,
  married: false,
  kids: 0,
  house: "None"
};

function updateStats() {
  document.getElementById("moneyStat").textContent = `$${playerStats.money}`;
  document.getElementById("salaryStat").textContent = `$${playerStats.salary}`;
  document.getElementById("jobStat").textContent = playerStats.job;
  document.getElementById("stressStat").textContent = `${playerStats.stress}/${playerStats.stressMax}`;
  document.getElementById("loanStat").textContent = `$${playerStats.loan}`;
}

const careerJobs = [
  { name: "Cashier", salary: 500 },
  { name: "Mechanic", salary: 750 },
  { name: "Chef", salary: 700 },
  { name: "Security Guard", salary: 650 },
  { name: "Truck Driver", salary: 800 },
  { name: "Construction", salary: 850 }
];

const collegeJobs = [
  { name: "Teacher", salary: 1000 },
  { name: "Engineer", salary: 1200 },
  { name: "Doctor", salary: 1600 },
  { name: "Lawyer", salary: 1400 },
  { name: "Scientist", salary: 1300 },
  { name: "Architect", salary: 1250 }
];

const houses = [
  { name: "Tiny House", cost: 1000 },
  { name: "Family Home", cost: 2500 },
  { name: "Mansion", cost: 5000 }
];

const normalEvents = [
  { text: "Bills. Lose $500.", money: -500 },
  { text: "Car repair. Lose $800.", money: -800, stress: 10 },
  { text: "Insurance. Lose $600.", money: -600 },
  { text: "Groceries. Lose $350.", money: -350 },
  { text: "Side gig. Gain $400, stress +10.", money: 400, stress: 10 },
  { text: "Bonus. Gain $500.", money: 500 },
  { text: "Traffic. Lose $200, stress +15.", money: -200, stress: 15 },
  { text: "Medical bill. Lose $1000, stress +15.", money: -1000, stress: 15 },
  { text: "Relax day. Stress -10.", stress: -10 },
  { text: "Bad investment. Lose $2500, stress +20..", money: -2500, stress: 20},
  { text: "Tax refund. Gain $1500, stress -10.", money: 1500 , stress: -15},
  { text: "House repairs. Lose $3000.", money: -3000 },
  { text: "Lottery win! Gain $4000.", money: 4000 },
];

const actionEvents = {
  Promotion: { text: "You got promoted! Salary +$200.", salary: 200 },
  Internship: { text: "Internship paid off! Gain $500.", money: 500 },
  Vacation: { text: "Vacation time. Lose $300, stress -10.", money: -300, stress: -10 },
  "Date Night": { text: "Date night! Lose $300, stress -5.", money: -300, stress: -5 },
  "Buy House": { text: "You bought a house. Lose $1000.", money: -1000 },
  Concert: { text: "Concert night. Lose $200, stress -5.", money: -200, stress: -5 },
  Baby: { text: "New baby! Lose $500, stress +10.", money: -500, stress: 10, kids: 1 },
  Motorcycle: { text: "Bought a motorcycle. Lose $700.", money: -700 },
  "Sports Car": { text: "Bought a sports car. Lose $1200.", money: -1200 }
};

const numbers = [5, 6, 1, 2, 3, 4];

const board = document.querySelector(".board");
const player = document.getElementById("player");
const spinner = document.getElementById("spinner");
const spinBtn = document.querySelector(".spinBtn");

const startOverlay = document.getElementById("startOverlay");
const startBtn = document.getElementById("startBtn");
const rulesOverlay = document.getElementById("rulesOverlay");
const pathChoiceOverlay = document.getElementById("pathChoiceOverlay");

const careerChoice = document.getElementById("careerChoice");
const collegeChoice = document.getElementById("collegeChoice");

const startTile = { label: "Start", x: 450, y: -15, type: "start" };

const careerPath = [
  { label: "careful", x: 365, y: 22, type: "death" },
  { label: "careful", x: 285, y: 32 , type: "death"},
  { label: "careful", x: 195, y: 42 , type: "death"},
  { label: "payday", x: 115, y: 52 , type: "payday"},
  { label: "", x: 65, y: 110 , type: "normal"},
  { label: "Promotion", x: 115, y: 170 , type: "action"},
  { label: "payday", x: 195, y: 180 , type: "payday"},
  { label: "", x: 285, y: 190 , type: "normal"},
  { label: "", x: 365, y: 200 , type: "normal"}
];

const collegePath = [
  { label: "careful", x: 535, y: 22, type: "death" },
  { label: "careful", x: 615, y: 32 , type: "death"},
  { label: "careful", x: 705, y: 42 , type: "death"},
  { label: "", x: 785, y: 52 , type: "normal"},
  { label: "", x: 835, y: 110 , type: "normal"},
  { label: "", x: 785, y: 170 , type: "normal"},
  { label: "Internship", x: 705, y: 180 , type: "action"},
  { label: "", x: 615, y: 190 , type: "normal"},
  { label: "STOP: spin to graduate", x: 532, y: 175, type: "job-stop" }
];

const nextPath = [
  { label: "payday", x: 450, y: 210 , type: "payday"},
  { label: "", x: 450, y: 270 , type: "normal"},
  { label: "Vacation", x: 535, y: 270 , type: "action"},
  { label: "payday", x: 620, y: 270 , type: "payday"},
  { label: "Vacation", x: 705, y: 270 , type: "action"},
  { label: "", x: 790, y: 280 , type: "normal"},
  { label: "STOP: get married?", x: 855, y: 320 , type: "married-stop"}
];

const marriedPath = [
  { label: "", x: 855, y: 410 , type: "normal"},
  { label: "", x: 855, y: 475 , type: "normal"},
  { label: "Date Night", x: 770, y: 475 , type: "action"},
  { label: "", x: 685, y: 475 , type: "normal"},
  { label: "Buy House", x: 600, y: 475 , type: "action"},
  { label: "payday", x: 515, y: 475 , type: "payday"},
  { label: "Buy House", x: 515, y: 410 , type: "action"}
];

const notMarriedPath = [
  { label: "", x: 770, y: 340 , type: "normal"},
  { label: "payday", x: 685, y: 340 , type: "payday"},
  { label: "Concert", x: 600, y: 340 , type: "action"},
];

const otherPath = [
  { label: "", x: 515, y: 340 , type: "normal"},
  { label: "", x: 430, y: 340 , type: "normal"},
  { label: "payday", x: 345, y: 340 , type: "payday"},
  { label: "", x: 345, y: 280 , type: "normal"},
  { label: "STOP: grow family?", x: 260, y: 260 , type: "grow-stop"}
];

const growPath = [
  { label: "Baby", x: 175, y: 275 , type: "action"},
  { label: "", x: 90, y: 275 , type: "normal"},
  { label: "Baby", x: 90, y: 340 , type: "action"},
  { label: "payday", x: 90, y: 405 , type: "payday"},
  { label: "Baby", x: 90, y: 470 , type: "action"},
  { label: "", x: 90, y: 535 , type: "normal"}
];

const notGrowPath = [
  { label: "", x: 260, y: 350 , type: "normal"},
  { label: "payday", x: 175, y: 350 , type: "payday"},
  { label: "Vacation", x: 175, y: 415 , type: "action"},
  { label: "", x: 175, y: 480 , type: "normal"}
];

const otherOtherPath = [
  { label: "", x: 175, y: 545 , type: "normal"},
  { label: "STOP: midlife crisis", x: 260, y: 530 , type: "crisis-stop"}
];

const crisisPath = [
  { label: "Motorcycle", x: 260, y: 475 , type: "action"},
  { label: "", x: 260, y: 415 , type: "normal"},
  { label: "Sports Car", x: 345, y: 415 , type: "action"},
  { label: "payday", x: 430, y: 415 , type: "payday"},
  { label: "Sports Car", x: 430, y: 480 , type: "action"}
];

const notCrisisPath = [
  { label: "", x: 345, y: 545 , type: "normal"},
]

const retirePath = [
  { label: "payday", x: 430, y: 545 , type: "payday"},
  { label: "", x: 515, y: 545 , type: "normal"},
  { label: "payday", x: 600, y: 545 , type: "payday"},
  { label: "", x: 685, y: 545 , type: "normal"},
  { label: "RETIRE!!", x: 770, y: 545 , type: "retire"}
]

function makeTile(space) {
  const tile = document.createElement("div");

  tile.className = `tile ${space.type || ""}`;
  tile.textContent = space.label;
  tile.style.left = `${space.x}px`;
  tile.style.top = `${space.y}px`;

  board.appendChild(tile);
}

function getTileHeight(space) {
  if (space.type === "stop" || space.type.includes("stop")) return 85;
  return 50;
}

function drawConnections(path) {
  const svg = document.getElementById("pathLines");

  path.forEach((space, i) => {
    if (i === path.length - 1) return;

    const next = path[i + 1];

    const h1 = getTileHeight(space);
    const h2 = getTileHeight(next);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", space.x);
    line.setAttribute("y1", space.y + h1 / 2);

    line.setAttribute("x2", next.x);
    line.setAttribute("y2", next.y + h2 / 2);

    line.setAttribute("stroke", "#333");
    line.setAttribute("stroke-width", "10");
    line.setAttribute("stroke-linecap", "round");

    svg.appendChild(line);
  });
}

function drawBoard() {
  board.querySelectorAll(".tile").forEach(tile => tile.remove());

  const visualTiles = [
    startTile,
    ...careerPath,
    ...collegePath,
    ...nextPath,
    ...marriedPath,
    ...notMarriedPath,
    ...otherPath,
    ...growPath,
    ...notGrowPath,
    ...otherOtherPath,
    ...crisisPath,
    ...notCrisisPath,
    ...retirePath
  ];

  drawConnections([
  ...careerPath,
  ...nextPath,
  ...marriedPath,
  ...otherPath,
  ...growPath,
  ...otherOtherPath,
  ...crisisPath,
  ...retirePath
]);
  drawConnections([
  ...collegePath,
  ...nextPath,
  ...notMarriedPath,
  ...otherPath,
  ...notGrowPath,
  ...otherOtherPath,
  ...notCrisisPath,
  ...retirePath
]);

  visualTiles.forEach(makeTile);
}

function placePlayerOnSpace(space) {
  let offsetX = 0;
  let offsetY = 0;

  if (space.type === "start") {
    offsetY = 20; // move car down
  }

  player.style.left = `${space.x + offsetX}px`;
  player.style.top = `${space.y + offsetY}px`;

  updateStats();
}

function showStopChoice(title, text, choices) {
  const stopOverlay = document.getElementById("stopOverlay");
  const stopTitle = document.getElementById("stopTitle");
  const stopText = document.getElementById("stopText");
  const stopCards = document.getElementById("stopCards");

  stopTitle.textContent = title;
  stopText.textContent = text;
  stopCards.innerHTML = "";

  choices.forEach(choice => {
    const card = document.createElement("div");
    card.className = "stopCard";
    card.textContent = choice.label;

    card.addEventListener("click", () => {
      choice.action();
      stopOverlay.classList.remove("show");
    });

    stopCards.appendChild(card);
  });

  stopOverlay.classList.add("show");
}

function choosePath(type) {
  chosenPath =
    type === "career"
      ? [startTile, ...careerPath, ...nextPath]
      : [startTile, ...collegePath, ...nextPath];

  playerIndex = 0;

  chosenPath.forEach(space => {
    space.used = false;
  });

  placePlayerOnSpace(startTile);
}

function addPathAfterStop(...paths) {
  chosenPath = [
    ...chosenPath.slice(0, playerIndex + 1),
    ...paths.flat()
  ];
}

function movePlayer(spaces) {
  if (!chosenPath || isMoving) return;

  isMoving = true;

  const destination = Math.min(
    playerIndex + spaces,
    chosenPath.length - 1
  );

  moveStep(destination);
}

function getStressMovePenalty() {
  return playerStats.stress >= 50 ? 1 : 0;
}

function checkStressEffects() {
  console.log("Checking stress:", playerStats.stress);

  if (playerStats.stress >= 100) {
    playerStats.job = "Unemployed";
    playerStats.salary = 0;
    playerStats.stress = 50;
    stressMoveWarningShown = true;

    updateStats();

    showEventMessage(
      "Burnout!",
      "Your stress hit 100. You quit your job. Your stress dropped back to 50."
    );

    return;
  }

  if (playerStats.stress >= 50 && !stressMoveWarningShown) {
    stressMoveWarningShown = true;

    showEventMessage(
      "High Stress!",
      "Your stress is 50 or higher. You now move -1 space while stress stays above 50."
    );

    return;
  }

  if (playerStats.stress < 50) {
    stressMoveWarningShown = false;
  }
}

function showRetirementScreen() {
  const spouseText = playerStats.married ? "Married" : "Single";
  const houseText = playerStats.house || "None";
  const kidsText = playerStats.kids || 0;
  const loanText = playerStats.loan || 0;

  showEventMessage(
    "Congratulations!",
    `You retired!

Money: $${playerStats.money}
Loans: $${loanText}
Kids: ${kidsText}
Spouse: ${spouseText}
House: ${houseText}`,
    null,
    "Finish",
    150000
  );

  spinBtn.disabled = true;
  isMoving = true;
}

function checkDebt() {
  if (playerStats.money < 0) {
    const needed = Math.abs(playerStats.money);

    playerStats.loan += needed;
    playerStats.money = 0;

    const stressGain = Math.ceil(needed / 500);

    playerStats.stress += stressGain;

    playerStats.stress = Math.min(
      playerStats.stress,
      playerStats.stressMax
    );

    updateStats();

    showEventMessage(
      "Loan Taken",
      `You took a $${needed} loan.\nStress +${stressGain}`
    );
  }
}

function moveStep(destination) {
  if (playerIndex >= destination) {
    isMoving = false;
    handleTile(chosenPath[playerIndex]);
    return;
  }

  playerIndex++;
  placePlayerOnSpace(chosenPath[playerIndex]);

  const currentSpace = chosenPath[playerIndex];

  if (currentSpace.type === "payday") {
    let paycheck = playerStats.salary;

  if (playerStats.loan > 0) {
    const payment = Math.min(paycheck, playerStats.loan);

    playerStats.loan -= payment;
    paycheck -= payment;

    showEventMessage(
      "Loan Payment",
      `$${payment} went toward your loan.`
    );
  }

  playerStats.money += paycheck;
    updateStats();

    showEventMessage(
      "Payday!",
      `You got paid $${playerStats.salary}.`,
      () => {
        setTimeout(() => {
          moveStep(destination);
        }, 400);
      }
    );

    return;
  }

  if (isStopTile(currentSpace) && !currentSpace.used) {
    isMoving = false;
    handleTile(currentSpace);
    return;
  }

  setTimeout(() => {
    moveStep(destination);
  }, 400);
}

function isStopTile(space) {
  return space?.type?.includes("stop");
}

function spin() {
  if (!chosenPath || isMoving) return;

  spinBtn.disabled = true;
  spinBtn.innerHTML = "";

  const index = Math.floor(Math.random() * numbers.length);
  landedNumber = numbers[index];

  const sliceAngle = 360 / numbers.length;
  const sliceCenter = index * sliceAngle + sliceAngle / 2;
  const offset = Math.random() * 32 - 16;

  const targetRotation = 360 - sliceCenter + offset;
  const extraSpins = 360 * 5;

  currentRotation += extraSpins + targetRotation - (currentRotation % 360);

  spinner.style.transform = `rotate(${currentRotation}deg)`;

  spinner.addEventListener(
    "transitionend",
    () => {
      if (graduationMode) {
        finishGraduationSpin();
        return;
      }

      const stressPenalty = getStressMovePenalty();
      const spacesToMove = Math.max(1, landedNumber - stressPenalty);

      movePlayer(spacesToMove);
      spinBtn.disabled = false;
    },
    { once: true }
  );
}

startBtn.addEventListener("click", () => {
  startOverlay.style.display = "none";
  //rulesOverlay.classList.add("show");
  pathChoiceOverlay.classList.add("show");
});

careerChoice.addEventListener("click", () => {
  choosePath("career");
  pathChoiceOverlay.classList.remove("show");

  showEventMessage(
    "Career Path",
    "You skipped college costs and started working right away.",
    () => showJobPicker(careerJobs)
  );
});

collegeChoice.addEventListener("click", () => {
  choosePath("college");
  pathChoiceOverlay.classList.remove("show");

  playerStats.money -= 2000;
  updateStats();

  showEventMessage(
    "College Tuition",
    "You paid $2000 for college. Graduate to unlock better jobs.",
    () => checkDebt()
  );
});

function showJobPicker(jobList = careerJobs) {
  const jobOverlay = document.getElementById("jobOverlay");
  const jobCards = document.getElementById("jobCards");

  jobCards.innerHTML = "";

  const shuffled = [...jobList].sort(() => Math.random() - 0.5);
  const choices = shuffled.slice(0, 3);

  choices.forEach(job => {
    const card = document.createElement("div");
    card.className = "jobCard";

    card.innerHTML = `
      <h3>${job.name}</h3>
      <p>Salary: $${job.salary}</p>
    `;

    card.addEventListener("click", () => {
      playerStats.job = job.name;
      playerStats.salary = job.salary;

      updateStats();
      jobOverlay.classList.remove("show");
    });

    jobCards.appendChild(card);
  });

  jobOverlay.classList.add("show");
}

function showHousePicker() {
  showStopChoice(
    "Buy a House",
    "Choose a house to buy.",
    houses.map(house => ({
      label: `${house.name}\n$${house.cost}`,
      action: () => {
        playerStats.house = house.name;
        playerStats.money -= house.cost;
        updateStats();
        showEventMessage("New House!", `You bought a ${house.name} for $${house.cost}.`);
      }
    }))
  );
}

function applyEffect(effect) {
  if (effect.money) {
    playerStats.money += effect.money;
  }

  if (effect.moneyMultiplier) {
    playerStats.money += playerStats.salary * effect.moneyMultiplier;
  }

  if (effect.salary) {
    playerStats.salary += effect.salary;
  }

  if (effect.kids) {
    playerStats.kids += effect.kids;
  }

  if (effect.stress) {
    playerStats.stress += effect.stress;
  }

  if (playerStats.stress < 0) {
    playerStats.stress = 0;
  }

  updateStats();
}


function showEventMessage(
  title,
  message,
  onClose,
  buttonText = "Continue",
  duration = 2500
) {
  const eventOverlay = document.getElementById("eventOverlay");
  const eventTitle = document.getElementById("eventTitle");
  const eventText = document.getElementById("eventText");
  const eventCloseBtn = document.getElementById("eventCloseBtn");

  eventTitle.textContent = title;
  eventText.textContent = message;
  eventCloseBtn.textContent = buttonText;

  eventOverlay.classList.add("show");

  function closeCard() {
    eventOverlay.classList.remove("show");
    eventCloseBtn.textContent = "Continue";

    if (onClose) onClose();
  }

  const autoClose = setTimeout(closeCard, duration);

  eventCloseBtn.onclick = () => {
    clearTimeout(autoClose);
    closeCard();
  };
}

function handleGraduationSpin() {
  graduationMode = true;
  spinBtn.disabled = false;

  showEventMessage(
    "Graduation Spin",
    "Spin again. Roll 4, 5, or 6 to graduate. Roll 1, 2, or 3 to drop out."
  );
}

function finishGraduationSpin() {
  graduationMode = false;

  if (landedNumber <= 3) {
    showEventMessage(
      "Dropped Out!",
      `You rolled ${landedNumber}. You did not graduate, so you pick a career job.`,
      () => {
        showJobPicker(careerJobs);
        addPathAfterStop(nextPath);
        spinBtn.disabled = false;
      }
    );
  } else {
    showEventMessage(
      "Graduated!",
      `You rolled ${landedNumber}. You graduated, so you get college job choices.`,
      () => {
        showJobPicker(collegeJobs);
        addPathAfterStop(nextPath);
        spinBtn.disabled = false;
      }
    );
  }
}

function handleNormalTile() {
  let possibleEvents = [...normalEvents];

  if (playerStats.house === "None") {
    possibleEvents = possibleEvents.filter(
      event => event.text !== "House repairs. Lose $3000."
    );
  }

  const randomEvent =
    possibleEvents[Math.floor(Math.random() * possibleEvents.length)];

  applyEffect(randomEvent);

  showEventMessage("Normal Event", randomEvent.text, () => {
    checkStressEffects();
    checkDebt();
  });
}

function handleActionTile(space) {
  if (space.label === "Buy House") {
    showHousePicker();
    return;
  }

  const action = actionEvents[space.label];

  if (!action) return;

  applyEffect(action);

  showEventMessage(space.label, action.text, () => {
    checkStressEffects();
    checkDebt();
  });
}

function handleDeathTile() {
  const dies = Math.random() < 0.5;

  if (dies) {
    spinBtn.disabled = true;
    isMoving = true;

    showEventMessage(
      "Game Over",
      "Bad luck. You died.",
      () => {
        location.reload();
      },
      "Restart"
    );
  } else {
    showEventMessage("Careful!", "You survived. Keep going.");
  }
}

function handleTile(space) {
  updateStats();

  if (!space || space.used) return;

  if (space.type === "retire") {
  space.used = true;
  showRetirementScreen();
  return;
  }

  if (space.type === "death") {
    space.used = true;
    handleDeathTile();
    return;
  }

  if (space.type === "normal") {
    space.used = true;
    handleNormalTile();
    return;
  }

  if (space.type === "action") {
    space.used = true;
    handleActionTile(space);
    return;
  }

  if (!isStopTile(space)) return;

  space.used = true;

  if (space.type === "job-stop") {
    handleGraduationSpin();
    return;
  }

  if (space.type === "married-stop") {
    showStopChoice(
      "STOP: Get married?",
      "Choose your next path.",
      [
        {
          label: "Get Married",
          action: () => {
            playerStats.married = true;

            applyEffect({
              money: -1500,
              stress: 10
            });

            showEventMessage(
              "Married!",
              "You got married! Wedding costs: $1500. Stress +10.",
              () => {
                checkStressEffects();
                checkDebt();
              }
            );

            addPathAfterStop(marriedPath, otherPath);
          }
        },
        {
          label: "Stay Single",
          action: () => addPathAfterStop(notMarriedPath, otherPath)
        }
      ]
    );
    return;
  }

  if (space.type === "grow-stop") {
    showStopChoice(
      "STOP: Grow Family?",
      "Choose your next path.",
      [
        {
          label: "Grow Family",
          action: () => addPathAfterStop(growPath, otherOtherPath)
        },
        {
          label: "No Family Path",
          action: () => addPathAfterStop(notGrowPath, otherOtherPath)
        }
      ]
    );
    return;
  }

  if (space.type === "crisis-stop") {
    showStopChoice(
      "STOP: Midlife Crisis",
      "Choose your next path.",
      [
        {
          label: "Crisis Path",
          action: () => addPathAfterStop(crisisPath, retirePath)
        },
        {
          label: "Skip Crisis",
          action: () => addPathAfterStop(notCrisisPath, retirePath)
        }
      ]
    );
  }
}


function run() {
  // draw the board
  drawBoard();

  // place player at start
  placePlayerOnSpace(startTile);

  // setup button events
  startBtn.addEventListener("click", () => {
    startOverlay.style.display = "none";
    pathChoiceOverlay.classList.add("show");
  });

  document.getElementById("careerChoice").addEventListener("click", () => {
    choosePath("career");
    pathChoiceOverlay.classList.remove("show");
  });

  document.getElementById("collegeChoice").addEventListener("click", () => {
    choosePath("college");
    pathChoiceOverlay.classList.remove("show");
  });

  document.querySelector(".spinBtn").addEventListener("click", spin);
}

document.addEventListener("DOMContentLoaded", run);
