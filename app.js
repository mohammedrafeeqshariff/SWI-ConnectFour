const columns = 7;
const rows = 6;
let currentPlayer = 1; // 1 = Red, 2 = Yellow
let gameBoard = Array(rows).fill().map(() => Array(columns).fill(0));
const boardElement = document.getElementById('board');
const turnElement = document.getElementById('turn');
const restartButton = document.getElementById('restart-button');

// Initialize the game board
function initializeBoard() {
    gameBoard = Array(rows).fill().map(() => Array(columns).fill(0));
    boardElement.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

// Handle a player's move
function handleCellClick(event) {
    const col = event.target.dataset.col;
    const row = getAvailableRow(col);

    if (row === -1) return; // Column is full

    gameBoard[row][col] = currentPlayer;
    const cell = boardElement.children[row * columns + parseInt(col)];
    cell.style.backgroundColor = currentPlayer === 1 ? 'red' : 'yellow';

    if (checkWinner(row, col)) {
        turnElement.textContent = `Player ${currentPlayer} wins!`;
        disableBoard();
    } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        turnElement.textContent = `Player ${currentPlayer}'s Turn (${currentPlayer === 1 ? 'Red' : 'Yellow'})`;
    }
}

// Get the first available row in a column
function getAvailableRow(col) {
    for (let r = rows - 1; r >= 0; r--) {
        if (gameBoard[r][col] === 0) {
            return r;
        }
    }
    return -1;
}

// Check if there's a winner after the last move
function checkWinner(row, col) {
    return (
        checkDirection(row, col, 1, 0) || // Horizontal
        checkDirection(row, col, 0, 1) || // Vertical
        checkDirection(row, col, 1, 1) || // Diagonal (\)
        checkDirection(row, col, 1, -1)   // Diagonal (/)
    );
}

// Check for four in a row in a given direction
function checkDirection(row, col, dRow, dCol) {
    let count = 1;

    // Check one direction
    for (let i = 1; i < 4; i++) {
        const r = row + i * dRow;
        const c = col + i * dCol;
        if (r >= 0 && r < rows && c >= 0 && c < columns && gameBoard[r][c] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }

    // Check the opposite direction
    for (let i = 1; i < 4; i++) {
        const r = row - i * dRow;
        const c = col - i * dCol;
        if (r >= 0 && r < rows && c >= 0 && c < columns && gameBoard[r][c] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }

    return count >= 4;
}

// Disable the board after a win
function disableBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
}

// Restart the game
restartButton.addEventListener('click', () => {
    currentPlayer = 1;
    turnElement.textContent = "Player 1's Turn (Red)";
    initializeBoard();
});

// Initialize the game
initializeBoard();
