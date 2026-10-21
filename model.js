(function(root){
const dayKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const total=(entries,day)=>entries.filter(e=>e.day===day).reduce((s,e)=>s+e.mg,0);
const reward=(state,day,challenge)=>{
 const key=`${day}:${challenge}`;
 if(state.claimed.includes(key))return false;
 state.claimed.push(key);state.coins+=20;return true;
};
const buy=(state,item)=>{
 if(state.owned.includes(item.id)||state.coins<item.price)return false;
 state.coins-=item.price;state.owned.push(item.id);return true;
};
const api={dayKey,total,reward,buy};
if(typeof module!=='undefined')module.exports=api;else root.CatModel=api;
})(globalThis);
