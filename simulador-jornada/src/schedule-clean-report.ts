import type {PdfReport} from './calculator-pdf-client';
import {clock,duration,type ScheduleRow} from './schedule-five-model';

export function cleanScheduleReport(rows:ScheduleRow[],weeks:number,company:string,employee:string):PdfReport{
 return {titulo:'Escala de Trabalho 5×2',empresa:company,empregado:employee,cleanSchedule:true,
  total:'Escala proposta',sub:weeks===1?'Semana fixa · repetição semanal':'Ciclo de quatro semanas · seguir a sequência das semanas',memoria:[],
  blocos:Array.from({length:weeks},(_,week)=>({titulo:weeks===1?'Horários e folgas':`Semana ${week+1}`,itens:rows.filter(r=>r.week===week).map(r=>[r.name,r.off?'FOLGA':`${clock(r.start)} a ${clock(r.end)}${r.end>=1440?' (saída no dia seguinte)':''} · intervalo ${duration(r.rest)}`])}))};
}
