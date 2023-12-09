//define HTML elements
const gameBoard = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

//Define game variables
const gridSize = 20;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();

//function to draw snake, food, map
function draw() {
  gameBoard.innerHTML = "";
  drawSnake();
  drawFood();
  updateScores();
}
//Draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createElement("div", "snake");
    setPosition(snakeElement, segment);
    gameBoard.appendChild(snakeElement);
  });
}

function createElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

//set the position of snake/food on board
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function drawFood() {
  if (gameStarted) {
    const foodElement = createElement("div", "food");
    setPosition(foodElement, food);
    gameBoard.appendChild(foodElement);
  }
}

function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

function moveSnake() {
  const head = { ...snake[0] };
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // clear past interval
    gameInterval = setInterval(() => {
      moveSnake();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

function startGame() {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    moveSnake();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

//key press event listener
function handleKeyPressEvent(event) {
  if (!gameStarted && (event.code === "Space" || event.key === " ")) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
      case "ArrowRight":
        direction = "right";
        break;
    }
  }
}
function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }
  for (let index = 1; index < snake.length; index++) {
    const element = snake[index];
    if (head.x === element.x && head.y === element.y) {
      resetGame();
    }
  }
}
function resetGame() {
  updateHighScore();
  updateScores();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
}
function updateScores() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}
function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}
document.addEventListener("keydown", handleKeyPressEvent);
