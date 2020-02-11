import { Directions, PathFinder, Move } from 'surakarta'

/**
 * Stores the attack moves that a pebble can make. It does so by storing
 * minimum no. & maximum no. of simple steps along an attack-line for each
 * orthogonal direction. An optional cache can be supplied for the first
 * position along the attack-line that is a valid landing position.
 *
 * @class AttackFreedoms
 * @namespace SK.analysis.finder
 */
export class AttackFreedoms {
    /**
     * @param {SK.Position} basePosition - starting position for all attacks
     */
    constructor (basePosition) {
        /** @private */
        this.startCache = {}

        this.reset()

        if (basePosition) {
            this.putBase(basePosition)
        }
    }

    /**
     * Store base position.
     *
     * @param {SK.Position} basePosition
     */
    putBase (basePosition) {
        /**
         * @member {SK.Position}
         * @readonly
         */
        this.basePosition = basePosition
    }

    /**
     * Store attack information for left direction.
     *
     * @param {number} threshold - no. of steps till first valid landing position
     * @param {number} limit - no. of steps till last valid landing position
     * @param {SK.Position}[startPosition] - first landing position (for cache)
     */
    putLeft (threshold, limit, startPosition = null) {
        this.LEFT_THRESHOLD = threshold
        this.LEFT_LIMIT = limit
        this.startCache.LEFT = startPosition
    }

    /**
     * Store attack information for up direction.
     *
     * @param {number} threshold - no. of steps till first valid landing position
     * @param {number} limit - no. of steps till last valid landing position
     * @param {SK.Position}[startPosition] - first landing position (for cache)
     */
    putUp (threshold, limit, startPosition = null) {
        this.UP_THRESHOLD = threshold
        this.UP_LIMIT = limit
        this.startCache.UP = startPosition
    }

    /**
     * Store attack information for right direction.
     *
     * @param {number} threshold - no. of steps till first valid landing position
     * @param {number} limit - no. of steps till last valid landing position
     * @param {SK.Position}[startPosition] - first landing position (for cache)
     */
    putRight (threshold, limit, startPosition = null) {
        this.RIGHT_THRESHOLD = threshold
        this.RIGHT_LIMIT = limit
        this.startCache.RIGHT = startPosition
    }

    /**
     * Store attack information for bottom direction.
     *
     * @param {number} threshold - no. of steps till first valid landing position
     * @param {number} limit - no. of steps till last valid landing position
     * @param {SK.Position}[startPosition] - first landing position (for cache)
     */
    putDown (threshold, limit, startPosition = null) {
        this.DOWN_THRESHOLD = threshold
        this.DOWN_LIMIT = limit
        this.startCache.DOWN = startPosition
    }

    /**
     * Number of valid attack moves
     * @member {number}
     */
    get length () {
        return this.LEFT_LIMIT - this.LEFT_THRESHOLD +
            this.UP_LIMIT - this.UP_THRESHOLD +
            this.RIGHT_LIMIT - this.RIGHT_THRESHOLD +
            this.DOWN_LIMIT - this.DOWN_THRESHOLD
    }

    /**
     * Iterate over each possible attack move.
     * @param {MoveConsumer} callback
     */
    forEach (callback) {
        const move = new Move()
        move.isAttack = true

        for (const dirString in this) {
            let dir = Directions[dirString]
            const threshold = this[dirString + '_THRESHOLD']
            const limit = this[dirString + '_LIMIT']

            move.setSource(this.basePosition)
            move.direction = dir

            for (let i = 0; i < limit; i++) {
                const next = PathFinder.findStep(move.srcRow, move.srcColumn, dir)

                if (next.direction) {
                    dir = next.direction
                }

                if (i >= threshold) {
                    move.setDestination(next.row, next.column)
                    move.direction = dir
                    callback(move)
                }
            }
        }
    }

    /**
     * Reset all thresholds & limits to zero.
     */
    reset () {
        /**
         * No. of steps until first valid landing position starting left direction.
         * @member {number}
         */
        this.LEFT_THRESHOLD = 0

        /**
         * No. of steps until first valid landing position starting up direction.
         * @member {number}
         */
        this.UP_THRESHOLD = 0

        /**
         * No. of steps until first valid landing position starting right direction.
         * @member {number}
         */
        this.RIGHT_THRESHOLD = 0

        /**
         * No. of steps until first valid landing position starting down direction.
         * @member {number}
         */
        this.DOWN_THRESHOLD = 0

        /**
         * No. of steps until last valid landing position starting left direction.
         * @member {number}
         */
        this.LEFT_LIMIT = 0

        /**
         * No. of steps until last valid landing position starting up direction.
         * @member {number}
         */
        this.UP_LIMIT = 0

        /**
         * No. of steps until last valid landing position starting right direction.
         * @member {number}
         */
        this.RIGHT_LIMIT = 0

        /**
         * No. of steps until last valid landing position starting down direction.
         * @member {number}
         */
        this.DOWN_LIMIT = 0

        this.startCache.LEFT = null
        this.startCache.TOP = null
        this.startCache.RIGHT = null
        this.startCache.BOTTOM = null
    }
}
