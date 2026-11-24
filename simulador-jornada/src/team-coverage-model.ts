export const days=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
export type Shift={on:boolean;start:string;end:string;breakStart:string;breakMinutes:number};
export type Operation={on:boolean;start:string;end:string;required:number;changeAt?:string;requiredAfter?:number};
export type Team={id:number;name:string;people:number;shifts:Shift[]};
export type CoverageSegment={start:number;end:number;count:number;required:number;missing:number};
export const minute=(s:string)=>/^\d{2}:\d{2}$/.test(s)?Number(s.slice(0,2))*60+Number(s.slice(3)):NaN;
export const time=(n:number)=>`${String(Math.floor(n/60)%24).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
export const hours=(n:number)=>`${Math.floor(n/60)}h${String(n%60).padStart(2,'0')}`;
const offShift=():Shift=>({on:false,start:'09:00',end:'18:00',breakStart:'12:00',breakMinutes:60});

export function operationParts(o:Operation):{start:number;end:number;required:number}[]{
 if(!o.on)return [];
 const start=minute(o.start),end=minute(o.end),change=minute(o.changeAt||'');
 if(!(end>start)||!Number.isInteger(o.required)||o.required<1)return [];
 if(Number.isFinite(change)&&change>start&&change<end&&Number.isInteger(o.requiredAfter)&&Number(o.requiredAfter)>0)return [{start,end:change,required:o.required},{start:change,end,required:Number(o.requiredAfter)}];
 return [{start,end,required:o.required}];
}
function requiredAt(o:Operation,a:number,b:number){return operationParts(o).find(p=>p.start<=a&&p.end>=b)?.required||0}
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
 operation.forEach((o,d)=>{if(o.on&&!operationParts(o).length)errors.push(`${days[d]}: confira funcionamento e pessoas necessárias.`)});
 teams.forEach(t=>{if(!Number.isInteger(t.people)||t.people<1)errors.push(`${t.name}: informe a quantidade de pessoas.`);t.shifts.forEach((s,d)=>{if(s.on&&!shiftParts(s).length)errors.push(`${t.name}, ${days[d]}: confira horários e intervalo.`)})});
 const demand=operation.reduce((sum,o)=>sum+operationParts(o).reduce((v,p)=>v+(p.end-p.start)*p.required,0),0);
 const teamTotals=teams.map(t=>({id:t.id,minutes:t.shifts.reduce((sum,s)=>sum+shiftParts(s).reduce((v,[a,b])=>v+b-a,0),0),off:t.shifts.filter(s=>!s.on).length}));
 const coverage=operation.map((o,d)=>{
  const op=operationParts(o);if(!op.length)return {segments:[] as CoverageSegment[],missing:0};
  const start=op[0].start,end=op[op.length-1].end;
  const intervals=teams.flatMap(t=>shiftParts(t.shifts[d]).map(([a,b])=>({a,b,count:t.people})));
  const points=[...new Set([start,end,...op.flatMap(p=>[p.start,p.end]),...intervals.flatMap(i=>[i.a,i.b]).filter(n=>n>start&&n<end)])].sort((a,b)=>a-b);
  const segments=points.slice(0,-1).map((a,i)=>{const b=points[i+1],count=intervals.filter(x=>x.a<=a&&x.b>=b).reduce((sum,x)=>sum+x.count,0),required=requiredAt(o,a,b);return {start:a,end:b,count,required,missing:Math.max(0,required-count)}});
  return {segments,missing:segments.reduce((sum,s)=>sum+s.missing*(s.end-s.start),0)};
 });
 return {errors,demand,teamTotals,coverage,missing:coverage.reduce((s,d)=>s+d.missing,0),people:teams.reduce((s,t)=>s+t.people,0),scheduled:teamTotals.reduce((s,t,i)=>s+t.minutes*teams[i].people,0),warnings:teamTotals.flatMap((t,i)=>[...(t.off<2?[`${teams[i].name}: apenas ${t.off} folga(s) na semana; são necessárias pelo menos duas.`]:[]),...(t.minutes>limit*60?[`${teams[i].name}: ${hours(t.minutes)} por pessoa, acima das ${limit}h selecionadas.`]:[])])};
}

type DailyCandidate={shift:Shift;parts:[number,number][];minutes:number};
const slot=15;
function restFor(work:number){return work>360?60:work>240?15:0}
function candidateShifts(o:Operation,dailyLimit:number):DailyCandidate[]{
 const op=operationParts(o);if(!op.length)return [];
 const start=op[0].start,end=op[op.length-1].end,span=end-start;
 let rest=restFor(Math.min(dailyLimit,span));let work=Math.min(dailyLimit,Math.max(0,span-rest));rest=restFor(work);work=Math.min(dailyLimit,Math.max(0,span-rest));
 const presence=Math.min(span,work+rest),starts=new Set<number>([start,Math.max(start,end-presence)]);for(let n=start;n<=end-presence;n+=slot)starts.add(n);
 const out:DailyCandidate[]=[];
 for(const a of starts){const b=Math.min(end,a+presence);if(!rest){const shift={on:true,start:time(a),end:time(b),breakStart:time(a),breakMinutes:0};out.push({shift,parts:[[a,b]],minutes:b-a});continue}
  const first=Math.min(b-rest,a+120),last=Math.max(first,b-rest-120),breaks=new Set<number>([first,last]);for(let p=first;p<=last;p+=slot)breaks.add(p);
  for(const p of breaks){const shift={on:true,start:time(a),end:time(b),breakStart:time(p),breakMinutes:rest},parts=shiftParts(shift);out.push({shift,parts,minutes:parts.reduce((s,[x,y])=>s+y-x,0)});}
 }
 return out;
}
function dailyDemand(o:Operation){const parts=operationParts(o);if(!parts.length)return [] as {start:number;end:number;required:number}[];const out=[];for(let a=parts[0].start;a<parts[parts.length-1].end;a+=slot){const b=Math.min(a+slot,parts[parts.length-1].end);out.push({start:a,end:b,required:requiredAt(o,a,b)});}return out}
function buildDay(o:Operation,dailyLimit:number){
 const demand=dailyDemand(o),candidates=candidateShifts(o,dailyLimit),short=demand.map(x=>x.required),picked:Shift[]=[];let guard=0;
 while(short.some(v=>v>0)&&guard++<100){let best:DailyCandidate|undefined,bestScore=0;for(const c of candidates){let score=0;c.parts.forEach(([a,b])=>demand.forEach((d,i)=>{if(short[i]>0&&a<=d.start&&b>=d.end)score+=(d.end-d.start)*short[i]}));if(score>bestScore){bestScore=score;best=c;}}if(!best||bestScore<=0)break;picked.push(best.shift);best.parts.forEach(([a,b])=>demand.forEach((d,i)=>{if(a<=d.start&&b>=d.end)short[i]=Math.max(0,short[i]-1)}));}
 return {shifts:picked,missing:short.reduce((s,v,i)=>s+v*(demand[i].end-demand[i].start),0)};
}
function sameSchedule(a:Shift[],b:Shift[]){return a.every((s,i)=>JSON.stringify(s)===JSON.stringify(b[i]))}
export function autoDimension(operation:Operation[],limit:number){
 const dailyLimit=Math.max(1,limit)*60/5,daily=operation.map(o=>buildDay(o,dailyLimit));
 type Person={shifts:Shift[];minutes:number;days:number};
 const assignments=daily.flatMap((d,day)=>d.shifts.map(shift=>({day,shift,minutes:shiftParts(shift).reduce((s,[a,b])=>s+b-a,0)}))).sort((a,b)=>b.minutes-a.minutes);
 const initialPeople=Math.max(0,...daily.map(d=>d.shifts.length),Math.ceil(assignments.length/5),Math.ceil(assignments.reduce((s,a)=>s+a.minutes,0)/(limit*60)));
 const people:Person[]=Array.from({length:initialPeople},()=>({shifts:days.map(()=>offShift()),minutes:0,days:0}));
 for(const item of assignments){let options=people.map((p,i)=>({p,i})).filter(x=>!x.p.shifts[item.day].on&&x.p.days<5&&x.p.minutes+item.minutes<=limit*60+.01).sort((a,b)=>a.p.minutes-b.p.minutes||a.p.days-b.p.days);if(!options.length){const p:Person={shifts:days.map(()=>offShift()),minutes:0,days:0};people.push(p);options=[{p,i:people.length-1}];}const p=options[0].p;p.shifts[item.day]=item.shift;p.minutes+=item.minutes;p.days++;}
 const teams:Team[]=[];people.forEach(p=>{const found=teams.find(t=>sameSchedule(t.shifts,p.shifts));if(found)found.people++;else teams.push({id:teams.length+1,name:`Equipe ${String.fromCharCode(65+teams.length)}`,people:1,shifts:p.shifts})});
 const result=analyze(operation,teams,limit);return {teams,people:people.length,missing:result.missing,dailyLimit};
}
export function initialTeams():Team[]{return [{id:1,name:'Equipe A',people:2,shifts:days.map((_,d)=>({on:d<5,start:'09:00',end:'18:00',breakStart:'12:00',breakMinutes:60}))},{id:2,name:'Equipe B',people:2,shifts:days.map((_,d)=>({on:d>0&&d<6,start:'09:00',end:'18:00',breakStart:'13:00',breakMinutes:60}))}]}
