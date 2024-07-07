const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');

const gridSize = 20;
const canvasSize = 400;

canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let direction = 'right';
let food = {
  x: Math.floor(Math.random() * canvasSize / gridSize) * gridSize,
  y: Math.floor(Math.random() * canvasSize / gridSize) * gridSize
};

let score = 0;

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, gridSize, gridSize);
}

function drawSnake() {
  snake.forEach(segment => drawRect(segment.x, segment.y, 'green'));
}

function drawFood() {
  drawRect(food.x, food.y, 'red');
}

function updateSnake() {
  const head = { x: snake[0].x, y: snake[0].y };
  
  if (direction === 'right') {
    head.x += gridSize;
  }
  if (direction === 'left') {
    head.x -= gridSize;
  }
  if (direction === 'up') {
    head.y -= gridSize;
  }
  if (direction === 'down') {
    head.y += gridSize;
  }

  // Check for food collision
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').textContent = 'Score: ' + score;
    food = {
      x: Math.floor(Math.random() * canvasSize / gridSize) * gridSize,
      y: Math.floor(Math.random() * canvasSize / gridSize) * gridSize
    };
  } else {
    snake.pop();
  }

  // Add new head to the snake
  snake.unshift(head);

  // Check for wall collisions
  if (head.x < 0 || head.y < 0 || head.x >= canvasSize || head.y >= canvasSize) {
    resetGame();
  }

  // Check for self-collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
      break;
    }
  }
}

function resetGame() {
  direction = 'right';
  snake = [{ x: gridSize * 5, y: gridSize * 5 }];
  score = 0;
  document.getElementById('score').textContent = 'Score: ' + score;
  food = {
    x: Math.floor(Math.random() * canvasSize / gridSize) * gridSize,
    y: Math.floor(Math.random() * canvasSize / gridSize) * gridSize
  };
}

function changeDirection(event) {
  const keyPressed = event.key;
  if (keyPressed === 'ArrowRight' && direction !== 'left') {
    direction = 'right';
  }
  if (keyPressed === 'ArrowLeft' && direction !== 'right') {
    direction = 'left';
  }
  if (keyPressed === 'ArrowUp' && direction !== 'down') {
    direction = 'up';
  }
  if (keyPressed === 'ArrowDown' && direction !== 'up') {
    direction = 'down';
  }
}

document.addEventListener('keydown', changeDirection);

function gameLoop() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  drawSnake();
  drawFood();
  updateSnake();
}

setInterval(gameLoop, 300);

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', function(event) {
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, false);

canvas.addEventListener('touchmove', function(event) {
  event.preventDefault(); // Prevent scrolling
}, false);

canvas.addEventListener('touchend', function(event) {
  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;
  handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
}, false);

function handleSwipe(startX, startY, endX, endY) {
  const diffX = endX - startX;
  const diffY = endY - startY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0 && direction !== 'left') {
      direction = 'right';
    } else if (diffX < 0 && direction !== 'right') {
      direction = 'left';
    }
  } else {
    if (diffY > 0 && direction !== 'up') {
      direction = 'down';
    } else if (diffY < 0 && direction !== 'down') {
      direction = 'up';
    }
  }
}
