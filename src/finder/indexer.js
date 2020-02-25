// @flow
import {
  Surakarta,
  Position,
  Directions,
  PathFinder as AttackFinder,
  NOT_FILLED
} from "surakarta";
import { MoveHandle, MoveHelper } from "../data";

const ATTACK_DIRECTIONS = [
  Directions.LEFT,
  Directions.UP,
  Directions.RIGHT,
  Directions.DOWN
];

const PositionDB: Position[] = (function() {
  const buffer = [];

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      buffer.push(new Position(r, c));
    }
  }

  return buffer;
})();

/**
 * Indexes all the possible single-step moves from the given position.
 *
 * @param {SK.Surakarta} surakarta - board state before the move
 * @param {SK.Position} basePosition - position of pebble being moved
 * @param {Array<SK.analysis.MoveHandle>}[index] - buffer to append into
 */
export function indexSingleStepsFrom(
  surakarta: Surakarta,
  basePosition: Position,
  index = []
): Array<number> {
  if (surakarta.states[basePosition.index()] !== surakarta.turnPlayer) {
    return index;
  }

  const { row: r, column: c } = basePosition;

  if (surakarta.state(r, c - 1) === NOT_FILLED) {
    index.push(MoveHelper.buildHandle(r, c, r, c - 1));
  }
  if (surakarta.state(r - 1, c - 1) === NOT_FILLED) {
    index.push(MoveHelper.buildHandle(r, c, r - 1, c - 1));
  }
  if (surakarta.state(r - 1, c) === NOT_FILLED) {
    index.push(MoveHelper.buildHandle(r, c, r - 1, c));
  }
  if (surakarta.state(r - 1, c + 1) === NOT_FILLED) {
    index.push(MoveHelper.buildHandle(r, c, r - 1, c + 1));
  }
  if (surakarta.state(r, c + 1) === NOT_FILLED) {
    index.push(MoveHelper.buildHandle(r, c, r, c + 1));
  }
  if (surakarta.state(r + 1, c + 1) === NOT_FILLED) {
    index.push(MoveHelper.buildHandle(r, c, r + 1, c + 1));
  }
  if (surakarta.state(r + 1, c) === NOT_FILLED) {
    index.push(MoveHelper.buildHandle(r, c, r + 1, c));
  }
  if (surakarta.state(r + 1, c - 1) === NOT_FILLED) {
    index.push(MoveHelper.buildHandle(r, c, r + 1, c - 1));
  }

  return index;
}

/**
 * Indexes all possible attacking moves from the given position.
 *
 * @param {SK.Surakarta} surakarta - board state before the attack
 * @param {SK.Position} basePosition - attacking pebble's original position
 * @param {Array<SK.analysis.MoveHandle>}[index] - buffer to append into
 */
export function indexAttacksFrom(
  surakarta: Surakarta,
  basePosition: Position,
  index: Array<MoveHandle> = []
) {
  if (surakarta.states[basePosition.index()] != surakarta.turnPlayer) {
    return index;
  }

  const { row: baseRow, column: baseColumn } = basePosition;

  // Algorithm similar to SK.PathFinder
  const pebble = surakarta.state(basePosition.row, basePosition.column);
  let row;
  let column;
  let direction;
  let selfTouch;
  let loops;

  for (let i = 0; i < 4; i++) {
    row = basePosition.row;
    column = basePosition.column;
    direction = ATTACK_DIRECTIONS[i];
    const baseDirection = direction;

    selfTouch = 0;
    loops = 0;
    const builderBuffer = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      let next;
      try {
        next = AttackFinder.findStep(row, column, direction);
      } catch (e) {
        break; // illegal attack path
      }

      row = next[0];
      column = next[1];

      let self = false;
      if (row === basePosition.row && column === basePosition.column) {
        ++selfTouch;
        if (selfTouch > 1) {
          break; // prevent infinite loop
        }
        self = true;
      }

      const state = surakarta.state(row, column);

      if (!self && state === pebble) {
        break; // can't capture our own pebble
      }
      if (next.length === 3) {
        ++loops;
        direction = next.direction;
      }
      if (loops >= 1) {
        builderBuffer.push(
          MoveHelper.buildHandle(
            baseRow,
            baseColumn,
            row,
            column,
            true,
            baseDirection
          )
        );
      }
      if (state !== NOT_FILLED) {
        break;
      }
    }

    index.push(...builderBuffer);
  }

  return index;
}

/**
 * Indexes all possible moves from a given position.
 *
 * @param {SK.Surakarta} surakarta - board state before the move
 * @param {SK.Position} basePosition - position of pebble being moved
 * @param {Array<MoveHandle>} index - buffer to append into
 */
export function indexFrom(
  surakarta: Surakarta,
  basePosition: Position,
  index: Array<number>
) {
  indexAttacksFrom(surakarta, basePosition, index);
  indexSingleStepsFrom(surakarta, basePosition, index);
}

/**
 * Index all possible single-step moves on the given board.
 *
 * @param {SK.Surakarta} surakarta
 * @param {Array<SK.analysis.MoveHandle>}[index]
 * @param {Array<SK.Position>}[positions]
 * @returns {Array<SK.analysis.MoveHandle>} index
 */
export function indexSingleSteps(
  surakarta: Surakarta,
  index: Array<number> = [],
  positions: Array<Position> = PositionDB
) {
  for (const pos of positions) {
    indexSingleStepsFrom(surakarta, pos, index);
  }

  return index;
}

/**
 * Index all possible attacks on the given board.
 *
 * @param {SK.Surakarta} surakarta
 * @param {Array<SK.analysis.MoveHandle>}[index]
 * @param {Array<SK.Position>}[positions]
 * @returns {Array<SK.analysis.MoveHandle>} index
 */
export function indexAttacks(
  surakarta: Surakarta,
  index: Array<number> = [],
  positions: Array<Position> = PositionDB
) {
  for (const pos of positions) {
    indexAttacksFrom(surakarta, pos, index);
  }

  return index;
}

/**
 * Indexes all possible moves for a node.
 *
 * @param {SK.Surakarta} surakarta - node to explore
 * @param {Array<SK.analysis.MoveHandle>}[index=[]] - buffer to append to
 * @param {Array<SK.Position>}[positions] - index moves only from the given positions
 */
export function index(
  surakarta: Surakarta,
  index: Array<number> = [],
  positions = undefined
) {
  indexSingleSteps(surakarta, index, positions);
  indexAttacks(surakarta, index, positions);

  return index;
}
