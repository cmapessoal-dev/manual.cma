export const weekDays=["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];
export type ScheduleDay={entry:string;exit:string;pause:string};
export type ScheduleRow={name:string;index:number;week:number;off:boolean;start:number;end:number;rest:number;work:number;valid:boolean};
export type ScheduleIssue={level:"error"|"warning";text:string;dayIndex?:number};
export const minutes=(s:string)=>/^([01]\d|2[0-3]):[0-5]\d$/.test(s)?Number(s.slice(0,2))*60+Number(s.slice(3)):NaN;
export const clock=(n:number)=>Number.isFinite(n)?`${String(Math.floor(n/60)%24).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`:"—";
export const duration=(n:number)=>Number.isFinite(n)?`${Math.floor(Math.abs(n)/60)}h${String(Math.abs(n)%60).padStart(2,"0")}`:"—";
export function distributeWeek(total:number,count:number){return Array.from({length:count},(_,i)=>Math.floor(total/count)+(i<total%count?1:0))}
export function buildSchedule(off:number[][],weekly:number,entry:string,pause:string,overrides:Record<number,ScheduleDay>):ScheduleRow[]{
 return off.flatMap((restDays,week)=>{const shares=distributeWeek(weekly,7-restDays.length);let cursor=0;return weekDays.map((name,i)=>{
  const index=week*7+i;if(restDays.includes(i))return {name,index,week,off:true,start:0,end:0,rest:0,work:0,valid:true};
  const o=overrides[index],start=minutes(o?.entry??entry),raw=o?minutes(o.exit):start+shares[cursor]+Number(pause),end=o&&raw<start?raw+1440:raw,rest=Number(o?.pause??pause);cursor++;
  return {name,index,week,off:false,start,end,rest,work:end-start-rest,valid:Number.isFinite(start)&&Number.isFinite(end)&&(o?.pause??pause)!==""&&Number.isInteger(rest)&&rest>=0&&rest<=240&&end>start&&end-start<1440&&end-start-rest>0};
 })});
}
export function checkSchedule(rows:ScheduleRow[],off:number[][],weekly:number,dailyLimit:number,sundayPeriod:number,collective:boolean):ScheduleIssue[]{
 const issues:ScheduleIssue[]=[],add=(level:ScheduleIssue["level"],text:string,dayIndex?:number)=>issues.push({level,text,...(dayIndex===undefined?{}:{dayIndex})});
 if(!Number.isFinite(weekly)||weekly<=0||weekly>2520)add("error","Informe uma carga de até 42h para esta simulação 5×2.");
 if(!Number.isFinite(dailyLimit)||dailyLimit<1||dailyLimit>600)add("error","O limite diário informado deve ser maior que zero e de até 10h nesta conferência comum.");
 off.forEach((days,w)=>{
  if(days.length!==2)add("error",`Semana ${w+1}: ${days.length} folga(s). O modelo 5×2 exige duas folgas por semana, independentemente da soma das horas.`);
  const group=rows.filter(r=>r.week===w);
  if(group.some(r=>!r.valid))add("error",`Semana ${w+1}: confira os horários e intervalos inválidos.`);
  else {const total=group.reduce((s,r)=>s+r.work,0);if(total!==weekly)add("error",`Semana ${w+1}: ${total>weekly?"excesso":"faltam"} ${duration(total-weekly)} em relação à carga escolhida.`)}
 });
 for(const r of rows.filter(r=>!r.off&&r.valid)){
  const title=`Semana ${r.week+1}, ${r.name.toLowerCase()}`;
  const dayIssue=(level:ScheduleIssue["level"],text:string)=>add(level,text,r.index);
  if(r.work>600)dayIssue("error",`${title}: ${duration(r.work)} ultrapassa 10h de trabalho. A marcação de acordo não afasta este limite da conferência comum.`);
  else if(r.work>dailyLimit)dayIssue(collective?"warning":"error",collective?`${title}: ${duration(r.work)} de trabalho, com compensação coletiva informada para o excesso sobre ${duration(dailyLimit)}. Confira as condições do instrumento.`:`${title}: trabalho acima de ${duration(dailyLimit)} sem confirmação de acordo/convenção coletiva para a compensação.`);
  if((r.work>360&&r.rest<60)||(r.work>240&&r.work<=360&&r.rest<15))dayIssue("error",`${title}: intervalo abaixo da referência geral (1h acima de 6h; 15min acima de 4h até 6h).`);
  if(r.rest>120)dayIssue("warning",`${title}: intervalo superior a 2h; confira a autorização aplicável.`);
  if(r.end>=1440)dayIssue("warning",`${title}: a jornada termina no dia seguinte. Confira trabalho noturno e eventual avanço sobre a folga.`);
  if(r.start<300||r.end>1320)dayIssue("warning",`${title}: há horário noturno; esta simulação não converte a hora noturna reduzida.`);
 }
 if(rows.every(r=>r.valid)){
  const work=rows.filter(r=>!r.off),cycle=rows.length;
  work.forEach((r,i)=>{const next=work[(i+1)%work.length];if(!next)return;const distance=(next.index>r.index?next.index-r.index:next.index-r.index+cycle),gap=distance*1440+next.start-r.end;
   if(gap<660)add("error",`Após a semana ${r.week+1}, ${r.name.toLowerCase()}: descanso entre jornadas inferior a 11h, inclusive na repetição do ciclo.`,r.index);
   if(distance>1&&gap<2100)add("error",`Após a semana ${r.week+1}, ${r.name.toLowerCase()}: descanso com folga inferior à referência de 35h (24h + 11h).`,r.index);
   if(distance>1&&r.end>1440)add("error",`Semana ${r.week+1}: jornada invade o dia marcado como folga após ${r.name.toLowerCase()}.`,r.index);
  });
  let streak=0,max=0;for(let i=0;i<cycle*2;i++){streak=rows[i%cycle].off?0:streak+1;max=Math.max(max,streak)}
  if(max>6)add("error",`Há ${max} dias consecutivos de trabalho na passagem entre semanas/ciclos. Revise o descanso semanal.`);
 }
 const sundays=off.flatMap((days,w)=>days.includes(6)?[w]:[]);
 if(sundays.length<off.length){
  add("warning","A preferência é pela folga no domingo. O trabalho dominical exige conferir autorização e revezamento da categoria.");
  if(!sundayPeriod)add("warning","Periodicidade dominical não definida: a conferência dos domingos está pendente.");
 }
 if(sundayPeriod){
  if(!sundays.length)add("error","O ciclo não contém nenhuma folga dominical e descumpre a periodicidade selecionada.");
  else {const maxGap=Math.max(...sundays.map((w,i)=>(sundays[(i+1)%sundays.length]>w?sundays[(i+1)%sundays.length]-w:sundays[(i+1)%sundays.length]-w+off.length)));if(maxGap>sundayPeriod)add("error",`Intervalo de até ${maxGap} semanas entre folgas dominicais; o parâmetro escolhido exige domingo de folga a cada ${sundayPeriod} semana(s). A repetição do ciclo também foi conferida.`)}
 }
 if(dailyLimit>480&&collective)add("warning","Ampliação diária informada pelo usuário: confira vigência e conteúdo do acordo/convenção coletiva. A ferramenta não verifica o instrumento.");
 return issues;
}
