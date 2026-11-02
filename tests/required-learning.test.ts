import test from "node:test";
import assert from "node:assert/strict";
import { requiredActivities, requiredQuestions } from "../data/required-learning";
import { heroes } from "../data/content";
test("four required categories cover all original heroes and all named national games",()=>{
 assert.deepEqual(requiredActivities.map(x=>x.title),["Батырды таны","Кейіпкердің қасиетін тап","Ұлттық ойын","Біліміңді сына"]);
 for(const activity of requiredActivities){const questions=requiredQuestions[activity.id];assert.equal(questions.length,6);for(const q of questions){assert.ok(q.options[q.answer]);assert.ok(q.explanation.length>20);}}
 assert.deepEqual(requiredQuestions.recognize.map(q=>heroes[q.hero!].name),heroes.map(h=>h.name));
 for(const q of requiredQuestions.recognize){assert.equal(q.options[q.answer],heroes[q.hero!].name);}
 assert.deepEqual(new Set(requiredQuestions.national.map(q=>q.art)),new Set(["asyk","board","rope"]));
});
