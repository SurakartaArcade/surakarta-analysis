import { Position } from "surakarta";
import { AttackFreedoms } from "./AttackFreedoms";
import { SimpleStepFreedoms } from "./SimpleStepFreedoms";

/**
 * Stores all the moves that can be played to move a certain pebble, without
 * having an explicit array.
 *
 * @class
 * @namespace SK.analysis
 */
export class PebbleMoves {
  /**
   * @param {SK.Surakarta} surakarta
   * @param {SK.Position}[basePosition]
   */
  constructor(surakarta, basePosition) {
    /** @member {SK.analysis.finder.SimpleStepFreedoms} */
    this.steppableDirections = new SimpleStepFreedoms(basePosition);
    /** @member {SK.analysis.finder.AttackFreedoms} */
    this.attacks = new AttackFreedoms(basePosition);
    /** @member {SK.Position} */
    this.basePosition = basePosition || new Position();
    /** @member {SK.Surakarta} */
    this.surakarta = surakarta;
  }

  reset() {
    this.steppableDirections.reset();
    this.attacks.reset();
  }

  /**
   * No. of moves stored.
   * @member {number}
   */
  get length() {
    return this.steppableDirections.length + this.attacks.length;
  }

  get basePosition() {
    return this._basePosition;
  }

  set basePosition(value) {
    this._basePosition = value;
    this.steppableDirections.putBase(value);
    this.attacks.putBase(value);
  }

  /**
   * Iterate over each possible step-move.
   * @param {MoveConsumer} callback
   */
  forEachStep(callback) {
    this.steppableDirections.forEach(callback);
  }

  /**
   * Iterate over each possible attack move.
   * @param {MoveConsumer} callback
   */
  forEachAttack(callback) {
    this.attacks.forEach(callback);
  }

  /**
   * Iterate over all moves
   * @param {MoveConsumer} callback
   */
  forEach(callback) {
    this.forEachAttack(callback);
    this.forEachStep(callback);
  }
}

/**
 * A _pure_ function that consumes a move.
 *
 * @typedef {Function} MoveConsumer
 * @param {Move} move - move that should _not_ be modified
 */
