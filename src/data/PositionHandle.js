// @flow
import { Position } from "surakarta";
import { type Handle, type Helper } from "./Handle";

/**
 * A abstract, compressed version of {@code SK.Position} that can used with
 * {@code SK.analysis.PositionHelper}.
 *
 * @namespace SK.analysis
 */
export type PositionHandle = Handle<Position>;

/**
 * @namespace SK.analysis.PositionHelper
 */
export const PositionHelper: Helper<PositionHandle, Position> = {
  createHandle(position: Position) {
    return position.row | (position.column << 3);
  },
  buildHandle(row: number, column: number) {
    return row | (column << 3);
  },
  expandHandle(handle: PositionHandle) {
    return PositionHelper.inflateHandle(handle, new Position());
  },
  inflateHandle(handle: PositionHandle, position: Position): Position {
    position.row = handle & 7;
    position.column = (handle >> 3) & 7;

    return position;
  }
};
