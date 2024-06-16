// Get the canvas context
let canvas1 = document.getElementById('canvas1');
let context1 = canvas1.getContext('2d');

let canvas2 = document.getElementById('canvas2');
let context2 = canvas2.getContext('2d');

// Define the tetris pieces
const pieces = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [1, 1, 1],
    [0, 1, 0]
  ],
  [
    [1, 1, 1],
    [1, 0, 0]
  ],
  [
    [1, 1, 1],
    [0, 0, 1]
  ]
];

// Variables for the two boards
let board1 = createBoard(10, 20);
let board2 = createBoard(10, 20);

// Variables for the current pieces on the two boards
let currentPiece1 = null;
let currentPiece2 = null;

// Variables for the current positions on the two boards
let currentPosition1 = { x: 5, y: 0 };
let currentPosition2 = { x: 5, y: 0 };

function createBoard(width, height) {
  let board = [];
  for (let y = 0; y < height; y++) {
    board[y] = [];
    for (let x = 0; x < width; x++) {
      board[y][x] = 0;
    }
  }
  return board;
}

// Function to update the game state
function update() {
  // If there is no current piece on board 1, create a new one
  if (currentPiece1 === null) {
    currentPiece1 = pieces[Math.floor(Math.random() * pieces.length)];
    currentPosition1 = { x: 5, y: 0 };
  }

  // If the new piece on board 1 is colliding with existing pieces at the top of the grid, the game is over
  if (collision(board1, currentPiece1, currentPosition1)) {
    clearInterval(updateInterval);
    alert('Game Over on Board 1');
    return;
  }

  // Move the current piece down on board 1
  currentPosition1.y++;

  // If the current piece on board 1 has hit the bottom, fix it to the board
  if (collision(board1, currentPiece1, currentPosition1)) {
    currentPosition1.y--;
    fixPiece(board1, currentPiece1, currentPosition1);
    currentPiece1 = null;
  }

  // If there is no current piece on board 2, create a new one
  if (currentPiece2 === null) {
    currentPiece2 = pieces[Math.floor(Math.random() * pieces.length)];
    currentPosition2 = { x: 5, y: 0 };
  }

  // If the new piece on board 2 is colliding with existing pieces at the top of the grid, the game is over
  if (collision(board2, currentPiece2, currentPosition2)) {
    clearInterval(updateInterval);
    alert('Game Over on Board 2');
    return;
  }

  // Move the current piece down on board 2
  currentPosition2.y++;

  // If the current piece on board 2 has hit the bottom, fix it to the board
  if (collision(board2, currentPiece2, currentPosition2)) {
    currentPosition2.y--;
    fixPiece(board2, currentPiece2, currentPosition2);
    currentPiece2 = null;
  }

  deleteCompletedLines(board1);
  deleteCompletedLines(board2);

  // Draw the boards
  drawBoard(board1, canvas1, context1, currentPiece1, currentPosition1);
  drawBoard(board2, canvas2, context2, currentPiece2, currentPosition2);
}

// Function to check for a collision
function collision(board, currentPiece, currentPosition) {
  for (let y = 0; y < currentPiece.length; y++) {
    for (let x = 0; x < currentPiece[y].length; x++) {
      if (
        currentPiece[y][x] !== 0 &&
        (board[currentPosition.y + y] === undefined ||
          board[currentPosition.y + y][currentPosition.x + x] !== 0)
      ) {
        return true;
      }
    }
  }
  return false;
}

// Function to fix a piece to the board
function fixPiece(board, currentPiece, currentPosition) {
  for (let y = 0; y < currentPiece.length; y++) {
    for (let x = 0; x < currentPiece[y].length; x++) {
      if (currentPiece[y][x] !== 0) {
        board[currentPosition.y + y][currentPosition.x + x] =
          currentPiece[y][x];
      }
    }
  }
}

// Function to rotate the current piece
function rotatePiece(direction, currentPiece) {
  let newPiece = currentPiece[0].map((val, index) =>
    currentPiece.map(row => row[index])
  ); // Transpose
  if (direction === 'ArrowUp') newPiece.forEach(row => row.reverse());
  // Reverse each row for a clockwise rotation
  else newPiece.reverse(); // Reverse the matrix for a counterclockwise rotation

  return newPiece;
}

// Function to check and delete completed lines
function deleteCompletedLines(board) {
  // Iterate through each line from bottom to top
  for (let y = board.length - 1; y >= 0; y--) {
    // Check if the line is filled
    if (board[y].every(cell => cell !== 0)) {
      // Delete the line
      board.splice(y, 1);
      // Add an empty line at the top
      board.unshift(Array(10).fill(0));
      // Since we modified the board, check the same line again
      // as it now contains the line above it
      y++;
    }
  }
}

// Function to draw the board
function drawBoard(board, canvas, context, currentPiece, currentPosition) {
  // Clear the board
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the board
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 10; x++) {
      if (board[y][x] !== 0) {
        context.fillStyle = 'blue';
        context.fillRect(x * 30, y * 30, 30, 30);
      }
    }
  }

  // Draw the current piece
  if (currentPiece !== null) {
    context.fillStyle = 'red';
    for (let y = 0; y < currentPiece.length; y++) {
      for (let x = 0; x < currentPiece[y].length; x++) {
        if (currentPiece[y][x] !== 0) {
          context.fillRect(
            (currentPosition.x + x) * 30,
            (currentPosition.y + y) * 30,
            30,
            30
          );
        }
      }
    }
  }
}

// Existing code...

// Handle keydown events
window.addEventListener('keydown', e => {
  switch (e.key) {
    case 'a':
      currentPosition1.x--;
      if (collision(board1, currentPiece1, currentPosition1))
        currentPosition1.x++;
      break;
    case 'd':
      currentPosition1.x++;
      if (collision(board1, currentPiece1, currentPosition1))
        currentPosition1.x--;
      break;
    case 'w':
      currentPiece1 = rotatePiece('ArrowUp', currentPiece1);
      if (collision(board1, currentPiece1, currentPosition1)) {
        currentPiece1 = rotatePiece('ArrowDown', currentPiece1); // Rotate back if there's a collision
      }
      break;
    case 's':
      currentPiece1 = rotatePiece('ArrowDown', currentPiece1);
      if (collision(board1, currentPiece1, currentPosition1)) {
        currentPiece1 = rotatePiece('ArrowUp', currentPiece1); // Rotate back if there's a collision
      }
      break;
    case 'e':
      while (!collision(board1, currentPiece1, currentPosition1))
        currentPosition1.y++;
      currentPosition1.y--;
      break;
    case 'ArrowLeft':
      currentPosition2.x--;
      if (collision(board2, currentPiece2, currentPosition2))
        currentPosition2.x++;
      break;
    case 'ArrowRight':
      currentPosition2.x++;
      if (collision(board2, currentPiece2, currentPosition2))
        currentPosition2.x--;
      break;
    case 'ArrowUp':
      currentPiece2 = rotatePiece('ArrowUp', currentPiece2);
      if (collision(board2, currentPiece2, currentPosition2)) {
        currentPiece2 = rotatePiece('ArrowDown', currentPiece2); // Rotate back if there's a collision
      }
      break;
    case 'ArrowDown':
      currentPiece2 = rotatePiece('ArrowDown', currentPiece2);
      if (collision(board2, currentPiece2, currentPosition2)) {
        currentPiece2 = rotatePiece('ArrowUp', currentPiece2); // Rotate back if there's a collision
      }
      break;
    case 'Shift':
      while (!collision(board2, currentPiece2, currentPosition2))
        currentPosition2.y++;
      currentPosition2.y--;
      break;
  }
  drawBoard(board1, canvas1, context1, currentPiece1, currentPosition1);
  drawBoard(board2, canvas2, context2, currentPiece2, currentPosition2);
});

   // Function to display the timer
 function displayTimer() {
  const timerElement = document.getElementById('timer');
  let seconds = 0;
  let minutes = 0;
  let hours = 0;

  setInterval(() => {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    if (minutes === 60) {
      minutes = 0;
      hours++;
    }

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerElement.textContent = formattedTime;
  }, 1000);
}

// Call the function to display the timer
displayTimer();

// Start the game loop
var updateInterval = setInterval(update, 1000);
