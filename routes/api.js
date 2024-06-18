'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  function validateCoord(c){
    let coordIsValid = true;  
    if (c.length !== 2){
      coordIsValid = false;
    } else {
      const line = c[0].toUpperCase().charCodeAt() - 65;
      const col = Number(c[1])
      if (line < 0 || line > 8) coordIsValid = false;
      if (isNaN(col) || col === 0) coordIsValid = false;
    }
    return coordIsValid;
  }
 
  function valueDoubles(s, r, c, v){
    return s[r * 9 + c] === v;
  }

  app.route('/api/check')
  .post((req, res) => {
    let finalRes;
    const sudo = req.body.puzzle;
    const coord = req.body.coordinate;
    const val = req.body.value;

    if (!sudo || !coord || !val){
      finalRes = {'error': 'Required field(s) missing'};
    } else if (sudo.length !== 81){
      finalRes = {'error': 'Expected puzzle to be 81 characters long'};
    } else if (solver.validate(sudo) === false){
      finalRes = {'error': 'Invalid characters in puzzle'};
    } else {
     
      if (!validateCoord(coord)) {
        finalRes = {'error': 'Invalid coordinate'}
      } else if (isNaN(Number(val)) || Number(val) > 9 || val == 0) {
        finalRes = {'error': 'Invalid value'}
      } else {
        let valid = true;
        const conflict = [];

        const rowIndex = coord[0].toUpperCase().charCodeAt()-65;
        const colIndex = coord[1]-1;
        // check if value doubles       
        
        // check row
        if (!solver.checkRowPlacement(sudo, rowIndex, colIndex, val)){
          conflict.push('row')
        }
        // check column
        if (!solver.checkColPlacement(sudo, rowIndex, colIndex, val)){
          conflict.push('column')
        }
        // check region
        if (!solver.checkRegionPlacement(sudo, rowIndex, colIndex, val)){
          conflict.push('region')
        }
        if (conflict.length > 0){
          valid = false;
          finalRes = {valid, conflict}
        } else {
          finalRes = {valid};
        }
        if (valueDoubles(sudo, rowIndex, colIndex, val)){
          finalRes = {valid: true};
        }
      }   
    }
    res.json(finalRes);
  });

  app.route('/api/solve')
    .post((req, res) => {
      let finalRes;
      const sudo = req.body.puzzle;

      if (!sudo){
        finalRes = {error: 'Required field missing'};
      } else if (sudo.length !== 81) {
        finalRes = {error: 'Expected puzzle to be 81 characters long'};
      } else if (!solver.validate(sudo)) {
        finalRes = {error: 'Invalid characters in puzzle'};
      } else if (!solver.solve(sudo)){
        finalRes = {error: 'Puzzle cannot be solved'};
      } else {
        finalRes = {solution: solver.solve(sudo)};
      }
      res.send(finalRes);
    });
};




