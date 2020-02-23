const { expect } = require("chai");
const Indexer = require("../lib/finder/indexer");
const {
  Surakarta,
  NOT_FILLED,
  RED_PLAYER,
  BLACK_PLAYER
} = require("surakarta");

function createSurakarta(list) {
  const array = new Array(36);

  for (let i = 0; i < 36; i++) {
    array[i] = NOT_FILLED;
  }

  for (let i = 0; i < list.length; i++) {
    array[list[i].r * 6 + list[i].c] =
      list[i].player === "red" ? RED_PLAYER : BLACK_PLAYER;
  }

  return Surakarta.fromState(array);
}

describe("Indexer", function() {
  it("Doesn't index the non-turning player's moves", function() {
    const mockSurakarta = createSurakarta([
      { r: 1, c: 1, player: BLACK_PLAYER }
    ]);

    expect(Indexer.index(mockSurakarta).length).to.equal(0);
  });
});
