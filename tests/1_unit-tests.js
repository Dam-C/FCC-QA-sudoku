const chai = require('chai');
const assert = chai.assert;
const inp = require('./inputs');
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    suite('puzzleString test', () => {
        test('Logic handles a valid puzzle string of 81 characters', (done) => {
            assert.isTrue(solver.validate(inp.validSudo))
            done();
        })
        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
            assert.isNotTrue(solver.validate(inp.badCharSudo))
            done();
        })
        test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
            assert.isNotTrue(solver.validate(inp.badLengthSudo))
            done();
        })
    })
    suite('coordinates test', () => {
        test('Logic handles a valid row placement', (done) => {
            assert.isTrue(solver.checkRowPlacement(inp.validSudo, 0, 0, '7'), 'row and columns are converted before going to solver')
            done();
        })
        test('Logic handles an invalid row placement', (done) => {
            assert.isNotTrue(solver.checkRowPlacement(inp.validSudo, 0, 0, '1'), 'row and columns are converted before going to solver')
            done();
        })
        test('Logic handles a valid column placement', (done) => {
            assert.isTrue(solver.checkColPlacement(inp.validSudo, 0, 0, '7'), 'row and columns are converted before going to solver')
            done();
        })
        test('Logic handles an invalid column placement', (done) => {
            assert.isNotTrue(solver.checkColPlacement(inp.validSudo, 0, 0, '1'), 'row and columns are converted before going to solver')
            done();
        })
        test('Logic handles a valid region (3x3 grid) placement', (done) => {
            assert.isTrue(solver.checkRegionPlacement(inp.validSudo, 0, 0, '7'), 'row and columns are converted before going to solver')
            done();
        })
        test('Logic handles an invalid region (3x3 grid) placement', (done) => {
            assert.isNotTrue(solver.checkRegionPlacement(inp.validSudo, 0, 0, '3'), 'row and columns are converted before going to solver')
            done();
        })
    })
    suite('solving puzzle test', () => {
        test('Valid puzzle strings pass the solver', (done) => {
            assert.equal(solver.solve(inp.validSudo), inp.validSudoSolution)
            done();
        })
        test('Invalid puzzle strings fail the solver', (done) => {
            assert.isNotTrue(solver.solve(inp.invalidSudo))
            done();
        })
        test('Solver returns the expected solution for an incomplete puzzle', (done) => {
            assert.equal(solver.solve(inp.validSudo), inp.validSudoSolution)
            done();
        })
    })
});
