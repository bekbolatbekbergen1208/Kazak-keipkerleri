export type BoardState = {
  pits: number[];
  kazans: [number, number];
  tuzdyks: [number | null, number | null];
  turn: 0 | 1;
  winner: 0 | 1 | "draw" | null;
  moves: number;
};
export const newBoard = (): BoardState => ({
  pits: Array(18).fill(9),
  kazans: [0, 0],
  tuzdyks: [null, null],
  turn: 0,
  winner: null,
  moves: 0,
});
export function legalMoves(s: BoardState) {
  return s.winner === null
    ? s.pits.flatMap((v, i) =>
        Math.floor(i / 9) === s.turn && v > 0 ? [i] : [],
      )
    : [];
}
export function move(s: BoardState, index: number): BoardState {
  if (!legalMoves(s).includes(index)) return s;
  const n: BoardState = {
    ...s,
    pits: [...s.pits],
    kazans: [...s.kazans],
    tuzdyks: [...s.tuzdyks],
    moves: s.moves + 1,
  };
  const who = s.turn,
    other = who === 0 ? 1 : 0;
  let remaining = n.pits[index],
    last = index;
  n.pits[index] = remaining === 1 ? 0 : 1;
  if (remaining > 1) remaining--;
  while (remaining-- > 0) {
    last = (last + 1) % 18;
    const owner = n.tuzdyks.indexOf(last);
    if (owner >= 0) n.kazans[owner] += 1;
    else n.pits[last]++;
  }
  if (Math.floor(last / 9) === other && !n.tuzdyks.includes(last)) {
    if (n.pits[last] % 2 === 0) {
      n.kazans[who] += n.pits[last];
      n.pits[last] = 0;
    } else if (
      n.pits[last] === 3 &&
      n.tuzdyks[who] === null &&
      last % 9 !== 8 &&
      (n.tuzdyks[other] === null || n.tuzdyks[other]! % 9 !== last % 9)
    ) {
      n.tuzdyks[who] = last;
      n.kazans[who] += 3;
      n.pits[last] = 0;
    }
  }
  n.turn = other;
  if (n.kazans[0] > 81 || n.kazans[1] > 81) n.winner = n.kazans[0] > 81 ? 0 : 1;
  else if (!legalMoves(n).length) {
    for (let i = 0; i < 18; i++) {
      n.kazans[Math.floor(i / 9)] += n.pits[i];
      n.pits[i] = 0;
    }
    n.winner =
      n.kazans[0] === n.kazans[1] ? "draw" : n.kazans[0] > n.kazans[1] ? 0 : 1;
  }
  return n;
}
export function computerMove(s: BoardState) {
  const who = s.turn;
  return legalMoves(s).sort((a, b) => {
    const x = move(s, a),
      y = move(s, b);
    const score = (n: BoardState) =>
      n.kazans[who] -
      s.kazans[who] +
      (n.tuzdyks[who] !== null ? 5 : 0) +
      (n.winner === who ? 1000 : 0);
    return score(y) - score(x);
  })[0];
}
