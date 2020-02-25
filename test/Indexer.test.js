const { expect } = require("chai");
const Indexer = require("../lib/finder/indexer");
const { RED_PLAYER, BLACK_PLAYER } = require("surakarta");
const { writeSurakarta } = require("surakarta/test-helpers");

describe("Indexer", function() {
  it("Doesn't index the non-turning player's moves", function() {
    const mockSurakarta = writeSurakarta([
      { pebble: BLACK_PLAYER, row: 1, column: 1 }
    ]);

    expect(Indexer.index(mockSurakarta).length).to.equal(0);
  });

  it("Indexes all single-step moves for a pebble", function() {
    const mockSurakarta = writeSurakarta([
      { pebble: RED_PLAYER, row: 3, column: 1 },
      { pebble: BLACK_PLAYER, row: 4, columnRange: [0, 1, 2] }
    ]);

    const singleSteps = Indexer.indexSingleSteps(mockSurakarta);

    expect(singleSteps.length).to.equal(5);
  });

  it("Indexes all attacks for a pebble", function() {
    const mockSurakarta = writeSurakarta([
      { pebble: RED_PLAYER, row: 2, column: 2 },
      { pebble: BLACK_PLAYER, row: 2, column: 0 }
    ]);

    const attacks = Indexer.indexAttacks(mockSurakarta);

    expect(attacks.length).to.be.greaterThan(3);
  });
});
