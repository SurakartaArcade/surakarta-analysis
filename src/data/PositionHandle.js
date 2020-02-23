// @flow
import { Position } from "surakarta";

export type PositionHandle = Number;

export const PositionHelper = {
  createHandle(position: Position) {
    return position.row & (position.column << 3);
  },
  buildHandle(row: Number, column: number) {
    return row & (column << 3);
  },
  expandHandle(handle: PositionHandle) {
    return new Position(handle & 7, (handle >> 3) & 7);
  }
};
