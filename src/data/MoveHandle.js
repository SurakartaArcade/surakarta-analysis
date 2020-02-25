// @flow
import { Move } from "surakarta";
import { type Handle, type Helper } from "./Handle";

/**
 * A abstract, compressed version of {@code SK.Move} that can used with
 * {@code SK.analysis.MoveHelper}.
 *
 * @namespace SK.analysis
 */
export type MoveHandle = Handle<Move>;

/**
 * @namespace SK.analysis
 */
export const MoveHelper: Helper<MoveHandle, Move> = {
  createHandle(move: Move): MoveHandle {
    return (
      move.srcRow |
      (move.srcColumn << 3) |
      (move.dstRow << 6) |
      (move.dstColumn << 9) |
      ((move.isAttack ? 1 : 0) << 12) |
      ((move.direction > 0 ? move.direction : 0) << 13)
    );
  },
  buildHandle(
    srcRow: number,
    srcColumn: number,
    dstRow: number,
    dstColumn: number,
    isAttack: boolean = false,
    direction: number = -1
  ) {
    return (
      srcRow |
      (srcColumn << 3) |
      (dstRow << 6) |
      (dstColumn << 9) |
      ((isAttack ? 1 : 0) << 12) |
      ((direction > 0 ? direction : 0) << 13)
    );
  },
  expandHandle(handle: MoveHandle): Move {
    return MoveHelper.inflateHandle(handle, new Move());
  },
  inflateHandle(handle: MoveHandle, move: Move): Move {
    const isAttack = !!((handle >> 12) & 1);
    const direction = isAttack ? (handle >> 13) & 15 : -1;

    move.srcRow = handle & 7;
    move.srcColumn = (handle >> 3) & 7;
    move.dstRow = (handle >> 6) & 7;
    move.dstColumn = (handle >> 9) & 7;
    move.isAttack = isAttack;
    move.direction = direction;

    return move;
  }
};
