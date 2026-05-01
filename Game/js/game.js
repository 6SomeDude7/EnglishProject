
let currentRotation = 0;
let landedNumber = null;
let chosenPath = null;
let playerIndex = 0;
let isMoving = false;

const playerStats = {
  money: 1000,
  salary: 0,
  job: "None",
  stress: 25,
  stressMax: 100
};

function updateStats() {
  document.getElementById("moneyStat").textContent = `$${playerStats.money}`;
  document.getElementById("salaryStat").textContent = `$${playerStats.salary}`;
  document.getElementById("jobStat").textContent = playerStats.job;
  document.getElementById("stressStat").textContent = `${playerStats.stress}/${playerStats.stressMax}`;
}

const jobs = [
  { name: "Teacher", salary: 600 },
  { name: "Mechanic", salary: 750 },
  { name: "Doctor", salary: 1200 },
  { name: "Artist", salary: 500 },
  { name: "Engineer", salary: 1000 },
  { name: "Chef", salary: 700 }
];

const numbers = [8, 9, 10, 1, 2, 3, 4, 5, 6, 7];

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
  { label: "", x: 115, y: 170 , type: "event"},
  { label: "", x: 195, y: 180 , type: "normal"},
  { label: "career", x: 285, y: 190 , type: "career"},
  { label: "", x: 365, y: 200 , type: "normal"}
];

const collegePath = [
  { label: "careful", x: 535, y: 22, type: "death" },
  { label: "careful", x: 615, y: 32 , type: "death"},
  { label: "careful", x: 705, y: 42 , type: "death"},
  { label: "", x: 785, y: 52 , type: "normal"},
  { label: "", x: 835, y: 110 , type: "event"},
  { label: "", x: 785, y: 170 , type: "normal"},
  { label: "", x: 705, y: 180 , type: "event"},
  { label: "", x: 615, y: 190 , type: "normal"},
  { label: "STOP: spin to graduate", x: 532, y: 175, type: "job-stop" }
];

const nextPath = [
  { label: "payday", x: 450, y: 210 , type: "payday"},
  { label: "", x: 450, y: 270 , type: "normal"},
  { label: "", x: 535, y: 270 , type: "event"},
  { label: "", x: 620, y: 270 , type: "normal"},
  { label: "", x: 705, y: 270 , type: "event"},
  { label: "", x: 790, y: 280 , type: "normal"},
  { label: "STOP: get married?", x: 855, y: 320 , type: "married-stop"}
];

const marriedPath = [
  { label: "", x: 855, y: 410 , type: "normal"},
  { label: "", x: 855, y: 475 , type: "normal"},
  { label: "", x: 770, y: 475 , type: "event"},
  { label: "", x: 685, y: 475 , type: "normal"},
  { label: "", x: 600, y: 475 , type: "event"},
  { label: "", x: 515, y: 475 , type: "normal"},
  { label: "", x: 515, y: 410 , type: "event"}
];

const notMarriedPath = [
  { label: "", x: 770, y: 340 , type: "event"},
  { label: "", x: 685, y: 340 , type: "normal"},
  { label: "", x: 600, y: 340 , type: "event"},
];

const otherPath = [
  { label: "", x: 515, y: 340 , type: "normal"},
  { label: "", x: 430, y: 340 , type: "event"},
  { label: "", x: 345, y: 340 , type: "normal"},
  { label: "", x: 345, y: 280 , type: "normal"},
  { label: "STOP: grow family?", x: 260, y: 260 , type: "grow-stop"}
];

const growPath = [
  { label: "", x: 175, y: 275 , type: "event"},
  { label: "", x: 90, y: 275 , type: "normal"},
  { label: "", x: 90, y: 340 , type: "event"},
  { label: "", x: 90, y: 405 , type: "normal"},
  { label: "", x: 90, y: 470 , type: "event"},
  { label: "", x: 90, y: 535 , type: "normal"}
];

const notGrowPath = [
  { label: "", x: 260, y: 350 , type: "event"},
  { label: "", x: 175, y: 350 , type: "normal"},
  { label: "", x: 175, y: 415 , type: "event"},
  { label: "", x: 175, y: 480 , type: "normal"}
];

const otherOtherPath = [
  { label: "", x: 175, y: 545 , type: "event"},
  { label: "STOP: midlife crisis", x: 260, y: 530 , type: "crisis-stop"}
]

const crisisPath = [
  { label: "", x: 260, y: 475 , type: "event"},
  { label: "", x: 260, y: 415 , type: "normal"},
  { label: "", x: 345, y: 415 , type: "event"},
  { label: "", x: 430, y: 415 , type: "event"},
  { label: "", x: 430, y: 480 , type: "normal"}
]

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

function choosePath(type) {
  chosenPath =
    type === "career"
      ? [startTile, ...careerPath, ...nextPath]
      : [startTile, ...collegePath, ...nextPath];

  playerIndex = 0;
  placePlayerOnSpace(startTile);
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

function moveStep(destination) {
  if (playerIndex >= destination) {
    isMoving = false;
    handleTile(chosenPath[playerIndex]);
    return;
  }

  playerIndex++;
  placePlayerOnSpace(chosenPath[playerIndex]);

  const currentSpace = chosenPath[playerIndex];

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
  return space.type === "stop" || space.type === "job-stop";
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
      movePlayer(landedNumber);
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
  showJobPicker();
});

collegeChoice.addEventListener("click", () => {
  choosePath("college");
  pathChoiceOverlay.classList.remove("show");
});

function showJobPicker() {
  const jobOverlay = document.getElementById("jobOverlay");
  const jobCards = document.getElementById("jobCards");

  jobCards.innerHTML = "";

  const shuffled = [...jobs].sort(() => Math.random() - 0.5);
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

function handleTile(space) {
  updateStats();

  if (space.type === "job-stop" && !space.used) {
    space.used = true;
    showJobPicker();
  }

  if (space.type === "stop" && !space.used) {
    space.used = true;
    // showStopEvent();
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
