const {dayKey,total,reward,buy}=CatModel;
const $=id=>document.getElementById(id);
const initial=()=>({name:'Mochi',coins:0,entries:[],claimed:[],owned:[],checkins:[],notes:{}});
let state=initial();
try{const saved=JSON.parse(localStorage.getItem('caffeine-cat-v1'));if(saved)state={...state,...saved};}catch{setTimeout(()=>notice('Saved data could not be loaded. You can export or reset your data below.'),100);}
let today=dayKey();
const items=[{id:'ball',name:'Yarn ball',emoji:'🧶',price:40},{id:'bed',name:'Cozy bed',emoji:'🛏️',price:60},{id:'plant',name:'Little plant',emoji:'🌱',price:80}];
let timer;
function notice(message){$('status').textContent=message;$('status').style.display='block';clearTimeout(timer);timer=setTimeout(()=>$('status').style.display='none',5000);}
function save(){try{localStorage.setItem('caffeine-cat-v1',JSON.stringify(state));}catch{notice('This browser could not save your progress. Export your data before leaving.');}render();}
function challengeDone(id){return state.claimed.includes(`${today}:${id}`);}
function earn(id){if(reward(state,today,id))notice('Daily challenge complete! +20 coins');}
function syncDay(){const next=dayKey();if(next!==today){today=next;$('reflection').value=state.notes[today]||'';render();}}
function render(){
 $('wallet').textContent=`✦ ${state.coins} coins`;
 $('cat-title').textContent=`At home with ${state.name}`;
 $('total').textContent=total(state.entries,today);
 $('entries').replaceChildren();
 for(const entry of state.entries.filter(e=>e.day===today)){
  const li=document.createElement('li'),text=document.createElement('span'),remove=document.createElement('button');
  text.textContent=`${entry.name} · ${entry.mg} mg`;
  remove.textContent='×';remove.className='quiet';remove.setAttribute('aria-label',`Remove ${entry.name}`);
  remove.onclick=()=>{state.entries=state.entries.filter(e=>e.id!==entry.id);save();};li.append(text,remove);$('entries').append(li);
 }
 $('challenges').replaceChildren();
 for(const [id,label] of [['log','Check in with your caffeine log'],['care','Spend a moment with your cat'],['reflect','Write a daily reflection']]){
 const row=document.createElement('div');row.className='challenge';const name=document.createElement('span'),value=document.createElement('span');name.textContent=label;value.textContent=challengeDone(id)?'✓ Complete':'+20 coins';row.append(name,value);$('challenges').append(row);
 }
 $('shop').replaceChildren();
 for(const item of items){
 const card=document.createElement('div');card.className='item';const emoji=document.createElement('div'),name=document.createElement('p'),button=document.createElement('button');emoji.className='emoji';emoji.textContent=item.emoji;name.textContent=item.name;button.textContent=state.owned.includes(item.id)?'✓ At home':`${item.price} coins`;button.disabled=state.owned.includes(item.id)||state.coins<item.price;button.setAttribute('aria-label',`Buy ${item.name} for ${item.price} coins`);button.onclick=()=>{syncDay();if(buy(state,item)){notice(`${item.name} is now in your cat’s room!`);save();}};card.append(emoji,name,button);$('shop').append(card);
 }
 $('accessories').textContent=items.filter(i=>state.owned.includes(i.id)).map(i=>i.emoji).join(' ');
 $('zero').disabled=state.entries.some(e=>e.day===today&&e.mg>0);
 $('zero').textContent=state.checkins.includes(today)&&!state.entries.some(e=>e.day===today)?'✓ No caffeine logged today':'I had no caffeine today';
 renderChart();
}
function renderChart(){
 const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()-6+i);const key=dayKey(d);return {key,label:d.toLocaleDateString(undefined,{weekday:'short'}),amount:total(state.entries,key),logged:state.checkins.includes(key)||state.entries.some(e=>e.day===key)};});
 const max=Math.max(1,...days.map(d=>d.amount));$('chart').replaceChildren();
 for(const d of days){const col=document.createElement('div'),value=document.createElement('span'),bar=document.createElement('div'),label=document.createElement('span');col.className='bar-column';value.textContent=d.logged?`${d.amount}`:'—';bar.className='bar'+(d.logged?'':' unlogged');bar.style.height=`${d.logged?Math.max(3,d.amount/max*105):3}px`;label.textContent=d.label;col.setAttribute('aria-label',`${d.key}: ${d.logged?d.amount+' milligrams':'no check-in'}`);col.append(value,bar,label);$('chart').append(col);}
 const logged=days.filter(d=>d.logged);
 $('insight').textContent=logged.length?`${logged.length} of 7 days checked in · ${Math.round(logged.reduce((sum,d)=>sum+d.amount,0)/logged.length)} mg average on checked-in days. ${logged.length<3?'Keep checking in to start noticing your patterns.':'Look back at your highest and lowest days. What was different about your sleep, mood, or routine?'}`:'Your story starts with a check-in. Log today to begin noticing patterns.';
}
$('log-form').onsubmit=event=>{
 event.preventDefault();syncDay();const name=$('drink').value.trim(),mg=Number($('mg').value);
 if(!name||!$('mg').value||!Number.isInteger(mg)||mg<0||mg>5000)return;
 state.entries.push({id:crypto.randomUUID(),day:today,name,mg,createdAt:new Date().toISOString()});
 if(!state.checkins.includes(today))state.checkins.push(today);earn('log');$('log-form').reset();save();
};
$('zero').onclick=()=>{syncDay();if(state.entries.some(e=>e.day===today&&e.mg>0))return;if(!state.checkins.includes(today))state.checkins.push(today);earn('log');save();};
for(const [id,message] of [['pet','Purr… that’s the spot.'],['play','A tiny pounce. A very big victory.'],['feed','A little snack for a happy cat.']])$(id).onclick=()=>{syncDay();$('cat-message').textContent=message;$('cat').classList.add('bounce');setTimeout(()=>$('cat').classList.remove('bounce'),250);earn('care');save();};
$('reflection').value=state.notes[today]||'';
$('reflect').onclick=()=>{syncDay();const note=$('reflection').value.trim();if(!note){notice('Write a little reflection first.');return;}state.notes[today]=note;const done=challengeDone('reflect');earn('reflect');save();if(done)notice('Reflection updated.');};
$('rename').onclick=()=>{const name=prompt('What would you like to name your cat?',state.name);if(name?.trim()){state.name=name.trim().slice(0,30);save();}};
$('export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=`caffeine-cat-${dayKey()}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('reset').onclick=()=>{if(confirm('Delete your caffeine log, reflections, coins, and cat items from this browser? This cannot be undone.')){state=initial();$('reflection').value='';save();notice('Your data has been deleted.');}};
window.addEventListener('focus',syncDay);setInterval(syncDay,30000);render();
