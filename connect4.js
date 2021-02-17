/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1;
const board = [];

const makeBoard = () => {
	//discuss with mentor --> how to make below two solutions work?
	// board.push(...Array(HEIGHT).fill([ ...Array(WIDTH).fill(null) ]));
	// board.push([ ...Array(HEIGHT) ].map(() => Array(WIDTH).fill(null)));
	for (let i = 0; i < HEIGHT; i++) {
		board.push(Array(WIDTH).fill(null));
	}
};

const makeHtmlBoard = () => {
	let htmlBoard = document.querySelector('#board');

	let top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	for (let x = 0; x < WIDTH; x++) {
		let headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
};

const findSpotForCol = (x) => {
	const tRows = document.querySelectorAll('tr:not(#column-top)');
	const index = Array.from(tRows).findIndex((tr) => Array.from(tr.cells)[x].hasChildNodes());
	let y = index - 1;
	if (index === 0) y = null;
	return index === -1 ? HEIGHT - 1 : y;
};

const placeInTable = (y, x) => {
	const tRows = document.querySelectorAll('tr:not(#column-top)');
	const cellDiv = document.createElement('div');
	cellDiv.classList.add('piece');
	cellDiv.setAttribute('player', currPlayer);
	Array.from(tRows)[y].cells[x].append(cellDiv);
};

function endGame(msg) {
	setTimeout(() => {
		alert(msg);
	}, 200);
	setTimeout(() => {
		location.reload();
	}, 300);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	let x = +evt.target.id;

	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	placeInTable(y, x);

	board[y][x] = currPlayer;

	if (checkForWin()) {
		return endGame(`Player ${currPlayer} won!`);
	}
	if (checkForTie()) {
		return endGame(`It's a tie!`);
	}
	currPlayer = currPlayer === 1 ? 2 : 1;
}

const checkForTie = () => {
	return board.every((row) => {
		return row.every((item) => item != null);
	});
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();
