const {test}=require('node:test');
const assert=require('node:assert/strict');
const {dayKey,total,reward,buy}=require('../model');
test('daily totals separate dates and include multiple drinks',()=>{const entries=[{day:'2026-10-20',mg:80},{day:'2026-10-20',mg:45},{day:'2026-10-19',mg:100}];assert.equal(total(entries,'2026-10-20'),125);assert.equal(total(entries,'2026-10-18'),0);});
test('rewards cannot be farmed by repeating a daily action',()=>{const state={coins:0,claimed:[]};assert.equal(reward(state,'2026-10-20','log'),true);assert.equal(reward(state,'2026-10-20','log'),false);assert.equal(state.coins,20);assert.equal(reward(state,'2026-10-21','log'),true);assert.equal(state.coins,40);});
test('shop prevents overdrafts and duplicate purchases',()=>{const state={coins:20,owned:[]},item={id:'ball',price:40};assert.equal(buy(state,item),false);state.coins=60;assert.equal(buy(state,item),true);assert.equal(state.coins,20);assert.deepEqual(state.owned,['ball']);state.coins=100;assert.equal(buy(state,item),false);assert.equal(state.coins,100);});
test('calendar keys use local calendar dates',()=>{assert.equal(dayKey(new Date(2026,0,2,23,45)),'2026-01-02');});
