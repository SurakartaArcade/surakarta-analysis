import { Move } from 'surakarta'

/**
 * Represents all the simple, single-step moves for a pebble. It does so by
 * storing a boolean for each octogonal direction.
 *
 * @class SimpleStepFreedoms
 * @namespace SK.analysis.finder
 */
export class SimpleStepFreedoms {
    /**
     * @param {SK.Position} basePosition - starting position
     */
    constructor (basePosition) {
        this._move = new Move()

        this.reset()

        if (basePosition) {
            this.putBase(basePosition)
        }
    }

    /**
     * Number of available directions for simple moves.
     * @member {number}
     */
    get length () {
        return (this.LEFT ? 1 : 0) +
            (this.UP_LEFT ? 1 : 0) +
            (this.UP ? 1 : 0) +
            (this.UP_RIGHT ? 1 : 0) +
            (this.RIGHT ? 1 : 0) +
            (this.DOWN_RIGHT ? 1 : 0) +
            (this.DOWN ? 1 : 0) +
            (this.DOWN_LEFT ? 1 : 0)
    }

    /**
     * Store base position.
     *
     * @member {SK.Position}
     */
    putBase (basePosition) {
        this.basePosition = basePosition
        this._move.setSource(basePosition.row, basePosition.column)
    }

    /**
     * Iterate over each possible step-move.
     *
     * @param {MoveConsumer} callback - callback that consumes the move
     * @param {SK.Position}[basePosition] - position from which pebble starts
     */
    forEach (callback, basePosition = this.basePosition) {
        const move = this._move

        if (this.LEFT) {
            callback(move.setDestination(basePosition.row, basePosition.column - 1))
        }
        if (this.UP_LEFT) {
            callback(move.setDestination(basePosition.row - 1, basePosition.column - 1))
        }
        if (this.UP) {
            callback(move.setDestination(basePosition.row - 1, basePosition.column))
        }
        if (this.UP_RIGHT) {
            callback(move.setDestination(basePosition.row - 1, basePosition.column + 1))
        }
        if (this.RIGHT) {
            callback(move.setDestination(basePosition.row, basePosition.column + 1))
        }
        if (this.DOWN_RIGHT) {
            callback(move.setDestination(basePosition.row + 1, basePosition.column + 1))
        }
        if (this.DOWN) {
            callback(move.setDestination(basePosition.row + 1, basePosition.column))
        }
        if (this.DOWN_LEFT) {
            callback(move.setDestination(basePosition.row + 1, basePosition.column - 1))
        }
    }

    /**
     * Reset to zero directions available.
     */
    reset () {
        this.LEFT = false
        this.UP_LEFT = false
        this.UP = false
        this.UP_RIGHT = false
        this.RIGHT = false
        this.DOWN_RIGHT = false
        this.DOWN = false
        this.DOWN_LEFT = false
    }
}
