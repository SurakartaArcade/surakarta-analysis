import { AttackFreedoms } from './AttackFreedoms'
import { SimpleStepFreedoms } from './SimpleStepFreedoms'
import { PebbleMoves } from './PebbleMoves'
import { Directions, PathFinder as AttackFinder, NOT_FILLED } from 'surakarta'

const ATTACK_DIRECTIONS = [
    Directions.LEFT,
    Directions.UP,
    Directions.RIGHT,
    Directions.DOWN
]

const ATTACK_DIRECTIONS_STRINGS = [
    'LEFT',
    'UP',
    'RIGHT',
    'DOWN'
]

/**
 * Utility to find available moves for a given pebble.
 *
 * @namespace SK.analysis
 */
export const Finder = {
    /**
     * Finds all the simple moves that can be made by a pebble at the given
     * position.
     *
     * @param {SK.Surakarta} surakarta - current game state
     * @param {SK.Position} basePosition - pebble's initial position
     * @param {SK.analysis.finder.SimpleStepFreedoms}[freedoms] - provides output object
     * @returns {SK.analysis.finder.SimpleStepFreedoms} directions for a simple move available
     */
    exploreSimpleSteps: function (surakarta, basePosition, freedoms) {
        if (surakarta.state(basePosition) === NOT_FILLED) {
            throw new Error("Illegal operation: Pebble doesn't exist at given position.")
        }

        if (!freedoms) {
            freedoms = new SimpleStepFreedoms(basePosition)
        } else {
            freedoms.reset()
            freedoms.putBase(basePosition)
        }

        const { row, column } = basePosition

        if (surakarta.state(row, column - 1) === NOT_FILLED) {
            freedoms.LEFT = true
        }
        if (surakarta.state(row - 1, column - 1) === NOT_FILLED) {
            freedoms.UP_LEFT = true
        }
        if (surakarta.state(row - 1, column) === NOT_FILLED) {
            freedoms.UP = true
        }
        if (surakarta.state(row - 1, column + 1) === NOT_FILLED) {
            freedoms.UP_RIGHT = true
        }
        if (surakarta.state(row, column + 1) === NOT_FILLED) {
            freedoms.RIGHT = true
        }
        if (surakarta.state(row + 1, column + 1) === NOT_FILLED) {
            freedoms.DOWN_RIGHT = true
        }
        if (surakarta.state(row + 1, column) === NOT_FILLED) {
            freedoms.DOWN = true
        }
        if (surakarta.state(row + 1, column - 1) === NOT_FILLED) {
            freedoms.DOWN_LEFT = true
        }

        return freedoms
    },
    /**
     * Finds all the available attack moves for a pebble at a given position.
     *
     * @param {SK.Surakarta} surakarta
     * @param {SK.Position} basePosition
     * @param {SK.analysis.finder.AttackFreedoms}[freedoms]
     * @returns {SK.analysis.finder.AttackFreedoms}
     */
    exploreAttacks: function (surakarta, basePosition, freedoms) {
        if (surakarta.state(basePosition) === NOT_FILLED) {
            throw new Error("Illegal operation: Pebble doesn't exist at given position.")
        }

        if (!freedoms) {
            freedoms = new AttackFreedoms(basePosition)
        } else {
            freedoms.reset()
            freedoms.putBase(basePosition)
        }

        // Algorithm similar to SK.PathFinder
        const pebble = surakarta.state(basePosition.row, basePosition.column)
        let row
        let column
        let direction
        let selfTouch
        let loops
        let steps

        for (let i = 0; i < 4; i++) {
            row = basePosition.row
            column = basePosition.column
            direction = ATTACK_DIRECTIONS[i]

            selfTouch = 0
            loops = 0
            steps = 0

            while (true) {
                let next
                try {
                    next = AttackFinder.findStep(row, column, direction)
                } catch (e) {
                    break // illegal attack path
                }

                row = next[0]
                column = next[1]
                ++steps

                let self = false
                if (row === basePosition.row && column === basePosition.column) {
                    ++selfTouch
                    if (selfTouch > 1) {
                        break // prevent infinite loop
                    }
                    self = true
                }

                const state = surakarta.state(row, column)

                if (!self && state === pebble) {
                    freedoms[ATTACK_DIRECTIONS_STRINGS[i] + '_THRESHOLD'] = 0
                    break // can't capture our own pebble
                }
                if (next.length === 3) {
                    ++loops
                    if (loops === 1) {
                        freedoms[ATTACK_DIRECTIONS_STRINGS[i] + '_THRESHOLD'] = steps
                    }

                    direction = next.direction
                }
                if (state !== NOT_FILLED) {
                    if (loops > 0) {
                        freedoms[ATTACK_DIRECTIONS_STRINGS[i] + '_LIMIT'] = steps + 1
                    }

                    break
                }
            }
        }

        return freedoms
    },
    /**
     * Explores all the possible moves for a given pebble.
     *
     * @param {SK.Surakarta} surakarta
     * @param {SK.Position} basePosition
     * @param {PebbleMoves}[moves] - optional output object
     */
    exploreAll (surakarta, basePosition, moves) {
        if (!moves) {
            moves = new PebbleMoves(surakarta)
        } else {
            moves.reset()
        }

        Finder.exploreSimpleSteps(surakarta, basePosition, moves.steppableDirections)
        Finder.exploreAttacks(surakarta, basePosition, moves.attacks)

        return moves
    }
}
