const Data = require("../lib/data");
const { Move, Position, Directions } = require("surakarta");
const { expect } = require("chai");

const { MoveHelper, PositionHelper } = Data;

describe("Data", function() {
  it("MoveHandle encode/decode integrity", function() {
    const mockMove = new Move(1, 2, 5, 6, true, Directions.LEFT);
    const mockHandle = Data.MoveHelper.createHandle(mockMove);

    expect(MoveHelper.expandHandle(mockHandle)).to.deep.equal(mockMove);
    expect(
      MoveHelper.expandHandle(
        MoveHelper.buildHandle(1, 2, 5, 6, true, Directions.LEFT)
      )
    ).to.deep.equal(mockMove);
  });

  it("PositionHandle encode/decode integrity", function() {
    const mockPosition = new Position(2, 3);
    const mockHandle = Data.PositionHelper.createHandle(mockPosition);

    expect(PositionHelper.expandHandle(mockHandle)).to.deep.equal(mockPosition);
    expect(
      PositionHelper.expandHandle(Data.PositionHelper.buildHandle(2, 3))
    ).to.deep.equal(mockPosition);
  });
});
