import './exportador.js';
export type PdfReport={titulo:string;empresa?:string;empregado?:string;total:string;sub:string;blocos:{titulo:string;itens:string[][]}[];memoria:string[][];cleanSchedule?:boolean};
export async function exportCalculatorPdf(data:PdfReport){
  const exporter=(window as Window&{CMAEscalaExportador?:{gerarDados:(data:PdfReport)=>Promise<void>}}).CMAEscalaExportador;
  if(!exporter)throw new Error('Exportador de escala indisponível. Atualize a página e tente novamente.');
  await exporter.gerarDados(data);
}
