import { test } from "node:test";
import assert from "node:assert/strict";
import {
  newBoard,
  move,
  legalMoves,
  computerMove,
  type BoardState,
} from "../lib/togyzqumalaq";
const total = (b: BoardState) =>
  b.pits.reduce((a, v) => a + v, 0) + b.kazans[0] + b.kazans[1];
test("initial board has 162 stones and nine legal moves", () => {
  const b = newBoard();
  assert.equal(total(b), 162);
  assert.equal(legalMoves(b).length, 9);
  assert.equal(move(b, 10), b);
});
test("multiple stones retain one and capture an even opponent pit", () => {
  const b = move(newBoard(), 8);
  assert.equal(b.pits[8], 1);
  assert.equal(b.kazans[0], 10);
  assert.equal(b.pits[16], 0);
  assert.equal(total(b), 162);
});
test("a single stone moves into the next pit", () => {
  const b = newBoard();
  b.pits[0] = 1;
  const n = move(b, 0);
  assert.equal(n.pits[0], 0);
  assert.equal(n.pits[1], 10);
});
test("tuzdyk captures three and cannot be made in ninth pit or matching opponent pit", () => {
  const b = newBoard();
  b.pits[8] = 1;
  b.pits[9] = 2;
  assert.equal(move(b, 8).tuzdyks[0], 9);
  const c = newBoard();
  c.pits[8] = 10;
  c.pits[17] = 2;
  assert.equal(move(c, 8).tuzdyks[0], null);
  const d = newBoard();
  d.pits[8] = 1;
  d.pits[9] = 2;
  d.tuzdyks[1] = 0;
  d.pits[0] = 0;
  assert.equal(move(d, 8).tuzdyks[0], null);
});
test("complete computer game conserves stones and terminates", () => {
  let b = newBoard();
  for (let i = 0; i < 1000 && b.winner === null; i++) {
    b = move(b, computerMove(b));
    assert.equal(total(b), 162);
    assert(b.pits.every((v) => v >= 0));
  }
  assert.notEqual(b.winner, null);
});
