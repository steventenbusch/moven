const eggs = ["red", "orange", "yellow", "green", "blue", "purple"];

const board = document.querySelector("[data-egg-board]");
const scoreDisplay = document.querySelector("[data-score]");
const timerDisplay = document.querySelector("[data-timer]");
const winMessage = document.querySelector("[data-win-message]");
const newGameButton = document.querySelector("[data-new-game]");

let hiddenSequence = [];
let playerSequence = [];
let selectedIndex = null;
let startTime = 0;
let timerId = null;
let gameIsComplete = false;
let completedTime = 0;

function shuffle(sequence) {
  const shuffled = [...sequence];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function getCorrectCount() {
  return playerSequence.reduce((count, egg, index) => {
    return egg === hiddenSequence[index] ? count + 1 : count;
  }, 0);
}

function sequencesMatch(firstSequence, secondSequence) {
  return firstSequence.every((egg, index) => egg === secondSequence[index]);
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getElapsedSeconds() {
  return Math.floor((Date.now() - startTime) / 1000);
}

function updateTimer() {
  timerDisplay.textContent = `Time: ${formatTime(getElapsedSeconds())}`;
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function startTimer() {
  stopTimer();
  startTime = Date.now();
  updateTimer();
  timerId = setInterval(updateTimer, 1000);
}

function updateScore() {
  const correctCount = getCorrectCount();
  scoreDisplay.textContent = `${correctCount} / 6 eggs are in the correct spot.`;

  if (correctCount === eggs.length) {
    gameIsComplete = true;
    completedTime = getElapsedSeconds();
    stopTimer();
    winMessage.textContent = `You matched the hidden egg sequence in ${formatTime(completedTime)}!`;
  } else {
    winMessage.textContent = "";
  }
}

function renderBoard() {
  board.innerHTML = "";

  playerSequence.forEach((egg, index) => {
    const eggButton = document.createElement("button");
    const eggLabel = `${egg} egg in position ${index + 1}`;

    eggButton.className = "egg";
    eggButton.type = "button";
    eggButton.dataset.color = egg;
    eggButton.dataset.index = index;
    eggButton.setAttribute("aria-label", eggLabel);
    eggButton.setAttribute("aria-pressed", selectedIndex === index ? "true" : "false");

    if (selectedIndex === index) {
      eggButton.classList.add("is-selected");
    }

    board.appendChild(eggButton);
  });
}

function selectEgg(index) {
  if (gameIsComplete) {
    return;
  }

  if (selectedIndex === index) {
    selectedIndex = null;
    renderBoard();
    return;
  }

  if (selectedIndex === null) {
    selectedIndex = index;
    renderBoard();
    return;
  }

  [playerSequence[selectedIndex], playerSequence[index]] = [
    playerSequence[index],
    playerSequence[selectedIndex],
  ];

  selectedIndex = null;
  renderBoard();
  updateScore();
}

function startNewGame() {
  hiddenSequence = shuffle(eggs);
  playerSequence = shuffle(eggs);

  while (sequencesMatch(hiddenSequence, playerSequence)) {
    playerSequence = shuffle(eggs);
  }

  selectedIndex = null;
  gameIsComplete = false;
  completedTime = 0;
  winMessage.textContent = "";
  startTimer();
  renderBoard();
  updateScore();
}

board.addEventListener("click", (event) => {
  const eggButton = event.target.closest(".egg");

  if (!eggButton) {
    return;
  }

  selectEgg(Number(eggButton.dataset.index));
});

newGameButton.addEventListener("click", startNewGame);

startNewGame();
