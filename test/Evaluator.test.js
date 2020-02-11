const { evaluate } = require('../lib/evaluate')
const { Surakarta } = require('surakarta')

require('chai').should()

describe('Evaluator', function () {
    it('Calculates neutral advantage for initial position', function () {
        evaluate(new Surakarta()).should.equal(0)
    })
})
