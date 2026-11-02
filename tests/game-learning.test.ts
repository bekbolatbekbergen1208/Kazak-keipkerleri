import test from "node:test";
import assert from "node:assert/strict";
import { gameLearning } from "../data/game-learning";
import { storyQuestions } from "../data/story-questions";
import { tostikEpisodes } from "../data/tostik";
test("each national game teaches three explained tasks with valid answers", () => {
  for (const lesson of Object.values(gameLearning)) {
    assert.equal(lesson.questions.length, 3);
    for (const q of lesson.questions) { assert.ok(q.options[q.answer]); assert.ok(q.explanation.length > 30); assert.equal(new Set(q.options).size, q.options.length); }
  }
});
test("every animation episode has a comprehension question", () => {
  assert.equal(Object.keys(storyQuestions).length, tostikEpisodes.length);
  for (const e of tostikEpisodes) { const q = storyQuestions[e.id]; assert.ok(q, e.id); assert.ok(q.options[q.answer]); assert.ok(q.explanation); }
});
