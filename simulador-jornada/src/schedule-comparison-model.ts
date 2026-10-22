import {clock,duration,minutes,weekDays,type ScheduleRow} from "./schedule-five-model";
export type CurrentDay={status:""|"work"|"off";entry:string;exit:string;pause:string};
export const emptyCurrentWeek=():CurrentDay[]=>weekDays.map(()=>({status:"",entry:"",exit:"",pause:"60"}));
export function currentDayRow(day:CurrentDay,index:number):ScheduleRow{
 if(day.status==="off")return {name:weekDays[index],index,week:0,off:true,start:0,end:0,rest:0,work:0,valid:true};
 const start=minutes(day.entry),raw=minutes(day.exit),end=raw<start?raw+1440:raw,rest=Number(day.pause),work=end-start-rest;
 return {name:weekDays[index],index,week:0,off:false,start,end,rest,work,valid:day.status==="work"&&Number.isFinite(start)&&Number.isFinite(end)&&day.pause!==""&&Number.isInteger(rest)&&rest>=0&&rest<=240&&end>start&&end-start<1440&&work>0};
}
export function rowDescription(row:ScheduleRow){return row.off?"Folga":row.valid?`${clock(row.start)} a ${clock(row.end)}${row.end>=1440?" (+1 dia)":""} · intervalo ${duration(row.rest)} · trabalho ${duration(row.work)}`:"Horários incompletos ou inválidos"}
export function currentDescription(day:CurrentDay,index:number){return !day.status?"Não informada":currentDayRow(day,index).valid?rowDescription(currentDayRow(day,index)):`${day.entry||"—"} a ${day.exit||"—"} · intervalo ${day.pause||"—"} min (revisar)`}
export function durationChange(n:number){return n===0?"Sem alteração":`${duration(n)} ${n<0?"a menos":"a mais"}`}
function timeChange(label:string,old:number,next:number){return next===old?null:`${label} ${duration(next-old)} mais ${next<old?"cedo":"tarde"}`}
export function compareWeek(current:CurrentDay[],proposal:ScheduleRow[]){
 const before=current.map(currentDayRow),items=weekDays.map((name,i)=>{
  const a=before[i],b=proposal[i],parts:string[]=[];
  if(!a.valid)return {name,before:a,after:b,changed:false,changes:current[i].status?"Revisar os horários atuais":"Informe a escala atual"};
  if(!b||!b.valid)return {name,before:a,after:b,changed:false,changes:"Revisar a proposta"};
  if(a.off!==b.off)parts.push(b.off?"Passa a ser folga":"Passa a ser dia de trabalho");
  else if(!a.off){const entry=timeChange("Entrada",a.start,b.start),exit=timeChange("Saída",a.end,b.end);if(entry)parts.push(entry);if(exit)parts.push(exit);if(a.rest!==b.rest)parts.push(`Intervalo: ${duration(a.rest)} → ${duration(b.rest)}`)}
  if(a.work!==b.work)parts.push(`Trabalho: ${durationChange(b.work-a.work)}`);
  return {name,before:a,after:b,changed:parts.length>0,changes:parts.join(" · ")||"Sem alteração"};
 });
 const valid=current.length===7&&before.every(r=>r.valid)&&proposal.length===7&&proposal.every(r=>r.valid),beforeTotal=before.reduce((s,r)=>s+(r.valid?r.work:0),0),afterTotal=proposal.reduce((s,r)=>s+(r.valid?r.work:0),0);
 return {items,valid,beforeTotal,afterTotal,delta:valid?afterTotal-beforeTotal:null,beforeOff:before.filter(r=>r.off).length,afterOff:proposal.filter(r=>r.off).length,changedDays:valid?items.filter(r=>r.changed).length:null};
}
export function comparisonPdfBlock(current:CurrentDay[],proposal:ScheduleRow[],week:number){
 const c=compareWeek(current,proposal);
 return {titulo:`Comparação atual × proposta · Semana ${week+1}`,itens:[
  ["Situação",c.valid?`${duration(c.beforeTotal)} para ${duration(c.afterTotal)} · ${durationChange(c.delta!)} · folgas ${c.beforeOff} para ${c.afterOff}`:"Comparação incompleta: preencha todos os dias atuais e revise a proposta."],
  ...c.items.map((r,i)=>[r.name,`Atual: ${currentDescription(current[i],i)}. Proposta: ${r.after?rowDescription(r.after):"Não informada"}. Mudança: ${r.changes.replaceAll("→","para")}.`])
 ]};
}
