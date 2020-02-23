const assert = require("assert");
require("chai").should();

const {
  RED_PLAYER,
  BLACK_PLAYER,
  NOT_FILLED,
  Surakarta,
  Position
} = require("surakarta");

const { Finder, AttackFreedoms } = require("../lib");

/**
 * Generate a state from a list of positions.
 */
function generateState(list) {
  const array = new Array(36);

  for (let i = 0; i < 36; i++) {
    array[i] = NOT_FILLED;
  }

  for (let i = 0; i < list.length; i++) {
    array[list[i].row * 6 + list[i].col] =
      list[i].player === "red" ? RED_PLAYER : BLACK_PLAYER;
  }

  return array;
}

describe("Finder", function() {
  it("Finds all step directions for a isolated pebble", function() {
    const surakarta = Surakarta.fromState(
      generateState([{ row: 3, col: 3, player: "red" }])
    );

    const simpleFreedoms = Finder.exploreSimpleSteps(
      surakarta,
      new Position(3, 3)
    );

    simpleFreedoms.length.should.equal(8);
  });

  it("Doesn't crash when finding attacks on corners", function() {
    const surakarta = Surakarta.fromState(
      generateState([
        { row: 0, col: 0, player: "red" },
        { row: 5, col: 0, player: "red" },
        { row: 5, col: 5, player: "red" },
        { row: 0, col: 5, player: "red" }
      ])
    );

    const position = new Position();
    const attack = new AttackFreedoms();

    position.set(0, 0);
    Finder.exploreAttacks(surakarta, position, attack);
    attack.length.should.equal(0);

    position.set(5, 0);
    Finder.exploreAttacks(surakarta, position, attack);
    attack.length.should.equal(0);

    position.set(5, 5);
    Finder.exploreAttacks(surakarta, position, attack);
    attack.length.should.equal(0);

    position.set(5, 5);
    Finder.exploreAttacks(surakarta, position, attack);
    attack.length.should.equal(0);
  });

  it("Reports no attacks, four simple moves for an orthogonally clogged pebble", function() {
    const surakarta = Surakarta.fromState([
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      RED_PLAYER,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      RED_PLAYER,
      RED_PLAYER,
      RED_PLAYER,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      RED_PLAYER,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED
    ]);

    const attacks = Finder.exploreAttacks(surakarta, new Position(2, 2));

    const simples = Finder.exploreSimpleSteps(surakarta, new Position(2, 2));

    attacks.length.should.equal(0);
    simples.length.should.equal(4);
  });

  it("Finds no moves for a clogged pebble", function() {
    const surakarta = Surakarta.fromState([
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      RED_PLAYER,
      RED_PLAYER,
      RED_PLAYER,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      RED_PLAYER,
      RED_PLAYER,
      RED_PLAYER,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      RED_PLAYER,
      RED_PLAYER,
      RED_PLAYER,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED
    ]);

    const moves = Finder.exploreAll(surakarta, new Position(2, 2));

    moves.length.should.equal(0);
  });

  it("Finds the correct attack direction for given board", function() {
    const surakarta = Surakarta.fromState([
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      RED_PLAYER,
      BLACK_PLAYER,
      RED_PLAYER,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      RED_PLAYER,
      RED_PLAYER,
      RED_PLAYER,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      RED_PLAYER,
      RED_PLAYER,
      RED_PLAYER,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED,
      NOT_FILLED
    ]);

    const moves = Finder.exploreAll(surakarta, new Position(2, 1));
    moves.attacks.LEFT_THRESHOLD.should.equal(2);
    moves.attacks.LEFT_LIMIT.should.equal(4);
    moves.attacks.length.should.equal(2);

    moves.attacks.reset();
    Finder.exploreAll(surakarta, new Position(1, 2), moves);
    moves.attacks.LEFT_THRESHOLD.should.equal(0);
    moves.attacks.LEFT_LIMIT.should.equal(0);
    moves.attacks.UP_THRESHOLD.should.equal(2);
    moves.attacks.UP_LIMIT.should.equal(4);
    moves.attacks.length.should.equal(2);
  });
});
