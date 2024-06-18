const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const inp = require('./inputs');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite ('puzzleStrings tests', () => {
        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
            chai.request(server)
            .post('/api/solve')
            .send({puzzle: inp.validSudo})
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'solution');
                assert.equal(res.body.solution, inp.validSudoSolution);
                done()
            })
        })
        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
            chai.request(server)
            .post('/api/solve')
            .send({})
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Required field missing');
                done()
            })
        })
        test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
            chai.request(server)
            .post('/api/solve')
            .send({puzzle: inp.badCharSudo})
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done()
            })
        })
        test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
            chai.request(server)
            .post('/api/solve')
            .send({puzzle: inp.badLengthSudo})
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done()
            })
        })
        test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
            chai.request(server)
            .post('/api/solve')
            .send({puzzle: inp.invalidSudo})
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Puzzle cannot be solved');
                done()
            })
        })
    })
    suite('coordinates tests', () => {
        test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({
                puzzle: inp.validSudo, 
                coordinate: 'A1', 
                value: '1', 
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                done()
            })
        })
        test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({
                puzzle: inp.validSudo, 
                coordinate: 'A1', 
                value: '2', 
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                assert.property(res.body, 'conflict');
                assert.equal(res.body.valid, false);
                assert.deepEqual(res.body.conflict, ['region']);
                done()
            })
        })
        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({
                puzzle: inp.validSudo, 
                coordinate: 'A1', 
                value: '1', 
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                assert.property(res.body, 'conflict');
                assert.equal(res.body.valid, false);
                assert.deepEqual(res.body.conflict, ['row','column']);
                done()
            })
        })
        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({
                puzzle: inp.validSudo, 
                coordinate: 'A1', 
                value: '5', 
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                assert.property(res.body, 'conflict');
                assert.equal(res.body.valid, false);
                assert.deepEqual(res.body.conflict, ['row','column','region']);
                done()
            })
        })
        test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({
                puzzle: inp.validSudo, 
                coordinate: '', 
                value: '', 
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Required field(s) missing');
                done()
            })
        })
        test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({
                puzzle: inp.badCharSudo, 
                coordinate: 'A1', 
                value: '1', 
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done()
            })
        })
        test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({
                puzzle: inp.badLengthSudo, 
                coordinate: 'A1', 
                value: '1', 
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done()
            })
        })
        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({
                puzzle: inp.validSudo, 
                coordinate: 'A_', 
                value: '1', 
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid coordinate');
                done()
            })
        })
        test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
            chai.request(server)
            .post('/api/check')
            .send({
                puzzle: inp.validSudo, 
                coordinate: 'A1', 
                value: 'a', 
            })
            .end((req, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'Invalid value');
                done()
            })
        })
    })
});