import { test, expect } from "@playwright/test";
import { requiredActivities, requiredQuestions } from "../data/required-learning";
test("all four required activities can be completed and remain marked after reload", async ({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  const hub=page.getByRole('region',{name:'Төрт негізгі оқу бөлімі'});
  await expect(hub.locator('.required-activity')).toHaveCount(4);
  for(const activity of requiredActivities){
    await hub.locator('.required-activity').filter({has:page.getByRole('heading',{name:activity.title,exact:true})}).click();
    const task=hub.getByRole('region',{name:activity.title,exact:true});
    await expect(task.getByRole('button',{name:'КЕЛЕСІ ТАПСЫРМА',exact:true})).toBeDisabled();
    if(activity.id==='recognize'){
      await expect(task.locator('img')).toHaveAttribute('src',/image7/);
      await expect(task.locator('figcaption')).toHaveCount(0);
      await task.locator('.learning-options button').nth(1).click();
      await expect(task.getByRole('status')).toContainText('Тағы ойланып көр');
    }
    for(const [i,q] of requiredQuestions[activity.id].entries()){
      if(q.art==='board') await expect(task.locator('.required-counting-board > div > span')).toHaveCount(18);
      await task.locator('.learning-options button').nth(q.answer).click();
      await expect(task.getByRole('status')).toContainText('Дұрыс!');
      await task.getByRole('button',{name:i===5?'БӨЛІМДІ АЯҚТАУ':'КЕЛЕСІ ТАПСЫРМА',exact:true}).click();
    }
    await expect(task).toContainText('6 тапсырманы орындадың');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await task.getByRole('button',{name:'Басқа бөлімді таңдау',exact:true}).click();
  }
  await page.reload();
  await expect(hub.locator('.required-heading > .pill')).toContainText('4 / 4 бөлім');
  await expect(hub.locator('.required-activity strong')).toHaveText(Array(4).fill('Орындалды · Қайталау'));
});
test('the four sections also appear in games and learning navigation',async({page})=>{
  await page.goto('/');
  for(const name of ['ОЙЫНДАР','БІЛІМ']){
    await page.locator('header nav').getByRole('button',{name,exact:true}).click();
    await expect(page.locator('.required-activity')).toHaveCount(4);
    for(const activity of requiredActivities) await expect(page.locator('.required-activity').getByRole('heading',{name:activity.title,exact:true})).toBeVisible();
  }
});
