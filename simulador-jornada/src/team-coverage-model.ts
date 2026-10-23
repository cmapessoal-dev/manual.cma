export const days=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
export type Shift={on:boolean;start:string;end:string;breakStart:string;breakMinutes:number};
export type Operation={on:boolean;start:string;end:string;required:number};
export type Team={id:number;name:string;people:number;shifts:Shift[]};
export const minute=(s:string)=>/^\d{2}:\d{2}$/.test(s)?Number(s.slice(0,2))*60+Number(s.slice(3)):NaN;
export const time=(n:number)=>`${String(Math.floor(n/60)%24).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
export const hours=(n:number)=>`${Math.floor(n/60)}h${String(n%60).padStart(2,'0')}`;
export function shiftParts(s:Shift):[number,number][]{
 if(!s.on)return [];
 const a=minute(s.start),b=minute(s.end),p=minute(s.breakStart),rest=s.breakMinutes;
 if(!Number.isFinite(a+b+rest)||b<=a||rest<0||rest>=b-a)return [];
 if(!rest)return [[a,b]];
 if(!Number.isFinite(p)||p<a||p+rest>b)return [];
 return [[a,p],[p+rest,b]].filter(([x,y])=>y>x) as [number,number][];
}
export function analyze(operation:Operation[],teams:Team[],limit:number){
 const errors:string[]=[];
 operation.forEach((o,d)=>{if(o.on&&(!Number.isFinite(minute(o.start)+minute(o.end))||minute(o.end)<=minute(o.start)||!Number.isInteger(o.required)||o.required<1))errors.push(`${days[d]}: confira funcionamento e pessoas necessárias.`)});
 teams.forEach(t=>{if(!Number.isInteger(t.people)||t.people<1)errors.push(`${t.name}: informe a quantidade de pessoas.`);t.shifts.forEach((s,d)=>{if(s.on&&!shiftParts(s).length)errors.push(`${t.name}, ${days[d]}: confira horários e intervalo.`)})});
 const demand=operation.reduce((sum,o)=>sum+(o.on&&minute(o.end)>minute(o.start)?(minute(o.end)-minute(o.start))*o.required:0),0);
 const teamTotals=teams.map(t=>({id:t.id,minutes:t.shifts.reduce((sum,s)=>sum+shiftParts(s).reduce((v,[a,b])=>v+b-a,0),0),off:t.shifts.filter(s=>!s.on).length}));
 const coverage=operation.map((o,d)=>{
  if(!o.on)return {segments:[] as {start:number;end:number;count:number;missing:number}[],missing:0};
  const start=minute(o.start),end=minute(o.end);
  if(!(end>start))return {segments:[],missing:0};
  const intervals=teams.flatMap(t=>shiftParts(t.shifts[d]).map(([a,b])=>({a,b,count:t.people})));
  const points=[...new Set([start,end,...intervals.flatMap(i=>[i.a,i.b]).filter(n=>n>start&&n<end)])].sort((a,b)=>a-b);
  const segments=points.slice(0,-1).map((a,i)=>{const b=points[i+1],count=intervals.filter(x=>x.a<=a&&x.b>=b).reduce((sum,x)=>sum+x.count,0);return {start:a,end:b,count,missing:Math.max(0,o.required-count)}});
  return {segments,missing:segments.reduce((sum,s)=>sum+s.missing*(s.end-s.start),0)};
 });
 return {errors,demand,teamTotals,coverage,missing:coverage.reduce((s,d)=>s+d.missing,0),people:teams.reduce((s,t)=>s+t.people,0),scheduled:teamTotals.reduce((s,t,i)=>s+t.minutes*teams[i].people,0),warnings:teamTotals.flatMap((t,i)=>[...(t.off!==2?[`${teams[i].name}: ${t.off} folga(s) na semana; referência selecionada: duas.`]:[]),...(t.minutes>limit*60?[`${teams[i].name}: ${hours(t.minutes)} por pessoa, acima das ${limit}h selecionadas.`]:[])])};
}
export function initialTeams():Team[]{return [{id:1,name:'Equipe A',people:2,shifts:days.map((_,d)=>({on:d<5,start:'09:00',end:'18:00',breakStart:'12:00',breakMinutes:60}))},{id:2,name:'Equipe B',people:2,shifts:days.map((_,d)=>({on:d>0&&d<6,start:'09:00',end:'18:00',breakStart:'13:00',breakMinutes:60}))}]}
