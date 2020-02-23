// @flow
import { Move } from "surakarta";

export type MoveHandle = Number;

export const MoveHelper = {
  createHandle(move: Move): MoveHandle {
    return (
      move.srcRow &
      (move.srcColumn << 3) &
      (move.dstRow << 6) &
      (move.dstColumn << 9) &
      ((move.isAttack ? 1 : 0) << 12) &
      ((move.direction > 0 ? move.direction : 0) << 13)
    );
  },
  buildHandle(
    srcRow: Number,
    srcColumn: Number,
    dstRow: Number,
    dstColumn: Number,
    isAttack: Boolean,
    direction: Number
  ) {
    return (
      srcRow &
      (srcColumn << 3) &
      (dstRow << 6) &
      (dstColumn << 9) &
      ((isAttack ? 1 : 0) << 12) &
      ((direction > 0 ? move.direction : 0) << 13)
    );
  },
  expandHandle(handle: MoveHandle): Move {
    const isAttack = !!((handle >> 12) & 1);
    const direction = isAttack ? (handle >> 13) & 1 : -1;

    return new Move(
      handle & 7,
      (handle >> 3) & 7,
      (handle >> 6) & 7,
      (handle >> 9) & 7,
      isAttack,
      direction
    );
  }
};
