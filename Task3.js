const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset-button');
const playWithFriendButton = document.getElementById('play-with-friend');
const playWithAIButton = document.getElementById('play-with-ai');
const gameBoard = document.getElementById('game-board');
let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let isPlayingWithAI = false;

cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

resetButton.addEventListener('click', resetGame);
playWithFriendButton.addEventListener('click', startGameWithFriend);
playWithAIButton.addEventListener('click', startGameWithAI);

function startGameWithFriend() {
    isPlayingWithAI = false;
    resetGame();
    gameBoard.classList.remove('hidden');
    resetButton.classList.remove('hidden');
}

function startGameWithAI() {
    isPlayingWithAI = true;
    resetGame();
    gameBoard.classList.remove('hidden');
    resetButton.classList.remove('hidden');
}

function handleClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (gameState[index] || checkWinner(gameState)) {
        return;
    }

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWinner(gameState)) {
        setTimeout(() => alert(`${currentPlayer} wins!`), 10);
        return;
    } else if (gameState.every(cell => cell !== null)) {
        setTimeout(() => alert('It\'s a draw!'), 10);
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (isPlayingWithAI && currentPlayer === 'O') {
        makeBestMove();
    }
}

function makeBestMove() {
    const bestMove = minimax(gameState, 'O').index;
    gameState[bestMove] = 'O';
    document.querySelector(`.cell[data-index="${bestMove}"]`).textContent = 'O';

    if (checkWinner(gameState)) {
        setTimeout(() => alert('O wins!'), 10);
        return;
    } else if (gameState.every(cell => cell !== null)) {
        setTimeout(() => alert('It\'s a draw!'), 10);
        return;
    }

    currentPlayer = 'X';
}

function minimax(newBoard, player) {
    const availSpots = newBoard.reduce((acc, curr, index) => {
        if (curr === null) acc.push(index);
        return acc;
    }, []);

    if (checkWinner(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWinner(newBoard, 'O')) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availSpots[i]] = null;
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function checkWinner(board, player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] === player && board[a] === board[b] && board[a] === board[c];
    });
}

function resetGame() {
    gameState.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
    });
    currentPlayer = 'X';
}
