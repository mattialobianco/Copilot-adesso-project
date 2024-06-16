// Get the canvas context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

// Define the tetris pieces
const pieces = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1]],
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1, 1], [1, 0, 0]],
  [[1, 1, 1], [0, 0, 1]]
];

// Initialize the game board
let board = Array.from({length: 20}, () => Array(10).fill(0));

// Current piece
let currentPiece = null;

// Current position
let currentPosition = {x: 0, y: 0};

// Function to draw the board
function drawBoard() {
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
          context.fillRect((currentPosition.x + x) * 30, (currentPosition.y + y) * 30, 30, 30);
        }
      }
    }
  }
}

// Function to update the game state
function update() {
  // If there is no current piece, create a new one
  if (currentPiece === null) {
    currentPiece = pieces[Math.floor(Math.random() * pieces.length)];
    currentPosition = {x: 5, y: 0};
  }

  // Move the current piece down
  currentPosition.y++;

  // If the current piece has hit the bottom, fix it to the board
  if (collision()) {
    currentPosition.y--;
    fixPiece();
  }
  deleteCompletedLines();

  // Draw the board
  drawBoard();
}

// Function to check for a collision
function collision() {
  for (let y = 0; y < currentPiece.length; y++) {
    for (let x = 0; x < currentPiece[y].length; x++) {
      if (currentPiece[y][x] !== 0 && (board[currentPosition.y + y] === undefined || board[currentPosition.y + y][currentPosition.x + x] !== 0)) {
        return true;
      }
    }
  }
  return false;
}

// Function to fix the current piece to the board
function fixPiece() {
  for (let y = 0; y < currentPiece.length; y++) {
    for (let x = 0; x < currentPiece[y].length; x++) {
      if (currentPiece[y][x] !== 0) {
        board[currentPosition.y + y][currentPosition.x + x] = 1;
      }
    }
  }
  currentPiece = null;
}

// Function to rotate the current piece
function rotatePiece(direction) {
    let newPiece = currentPiece[0].map((val, index) => currentPiece.map(row => row[index])); // Transpose
    if (direction === 'ArrowUp') newPiece.forEach(row => row.reverse()); // Reverse each row for a clockwise rotation
    else newPiece.reverse(); // Reverse the matrix for a counterclockwise rotation
    currentPiece = newPiece;
  }

  // Function to check and delete completed lines
function deleteCompletedLines() {
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

  
  // Existing code...
  
  // Handle keydown events
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        currentPosition.x--;
        if (collision()) currentPosition.x++;
        break;
      case 'ArrowRight':
        currentPosition.x++;
        if (collision()) currentPosition.x--;
        break;
      case 'ArrowUp':
        rotatePiece('ArrowUp');
        if (collision()) rotatePiece('ArrowDown'); // Rotate back if there's a collision
        break;
      case 'ArrowDown':
        rotatePiece('ArrowDown');
        if (collision()) rotatePiece('ArrowUp'); // Rotate back if there's a collision
        break;
      case ' ':
        while (!collision()) currentPosition.y++;
        currentPosition.y--;
        break;
    }
    drawBoard();
  });

// Start the game loop
setInterval(update, 1000);