class SudokuSolver {

  validate(puzzleString) {
    //     The validate function should take a given puzzle string and check it to see if it has 81 valid characters for the input.  
    return puzzleString.length === 81 && /^([1-9\.]+)$/.test(puzzleString);
  }



  checkRowPlacement(puzzleString, row, column, value) {
    // The check functions should be validating against the current state of the board.
    let noConflict = true;
    const startRow = row * 9;
    for (let i = 0; i < 9; i++){
      if (puzzleString[startRow + i] == value) noConflict = false;
    }
    return noConflict;
  }
  
  checkColPlacement(puzzleString, row, column, value) {
    // The check functions should be validating against the current state of the board.
    let noConflict = true;
    for(let i = 0; i < 9; i ++){
      if (puzzleString[column + i * 9] == value) noConflict = false;
    }
    return noConflict;
  }
  
  checkRegionPlacement(puzzleString, row, column, value) {
    // The check functions should be validating against the current state of the board.  
    let noConflict = true;
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(column / 3) * 3;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (parseInt(puzzleString[(regionRow + i) * 9 + (regionCol + j)]) == value) {
          noConflict = false;
        }
      }
    }
    return noConflict;
  }
  
  solve(puzzleString) {
    // The solve function should handle solving any given valid puzzle string, not just the test inputs and solutions. You are expected to write out the logic to solve this. 
    let solvedPuzzle;

    let board = this.stringToBoard(puzzleString);
    if (this.solveBoard(board)) {
      solvedPuzzle = board.flat().join('');
    } else {
      solvedPuzzle = false
    }
    return solvedPuzzle;
  }

  solveBoard(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.spotIsValid(board, row, col, num)) {
              board[row][col] = num;
              if (this.solveBoard(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  stringToBoard(puzzleString) {
    let board = [];
    for (let i = 0; i < puzzleString.length; i += 9) {
      board.push(puzzleString.slice(i, i + 9).split('').map(item => item === '.' ? 0 : Number(item)));
    }
    return board;
  }

  spotIsValid(board, row, col, val) {
    let flatBoard = board.flat().join('');
    return this.checkRowPlacement(flatBoard, row, col, val) && this.checkColPlacement(flatBoard, row, col, val) && this.checkRegionPlacement(flatBoard, row, col, val);
  }
}

module.exports = SudokuSolver;

