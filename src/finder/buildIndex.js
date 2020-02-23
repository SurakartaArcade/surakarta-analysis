// @flow
import { Surakarta, NOT_FILLED } from "surakarta";
import { MoveHandle, PositionHandle } from "../data";

export function buildIndex(surakarta: Surakarta, position: Position) {
  if (!position) {
    const multidx = [];

    for (let i = 0; i < 36; i++) {
      if (surakarta.states[i] == surakarta.turn) {
        multidx.push(...buildIndex(surakarta, Position.from(i)));
      }
    }

    const index = [];


    // TODO:
    if (surakarta.state(row, column - 1) === NOT_FILLED) {
      index.push(MoveHandle.)
    }
    if (surakarta.state(row - 1, column - 1) === NOT_FILLED) {
      freedoms.UP_LEFT = true;
    }
    if (surakarta.state(row - 1, column) === NOT_FILLED) {
      freedoms.UP = true;
    }
    if (surakarta.state(row - 1, column + 1) === NOT_FILLED) {
      freedoms.UP_RIGHT = true;
    }
    if (surakarta.state(row, column + 1) === NOT_FILLED) {
      freedoms.RIGHT = true;
    }
    if (surakarta.state(row + 1, column + 1) === NOT_FILLED) {
      freedoms.DOWN_RIGHT = true;
    }
    if (surakarta.state(row + 1, column) === NOT_FILLED) {
      freedoms.DOWN = true;
    }
    if (surakarta.state(row + 1, column - 1) === NOT_FILLED) {
      freedoms.DOWN_LEFT = true;
    }

    return multidx;
  }
}
