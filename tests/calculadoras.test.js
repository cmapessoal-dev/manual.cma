const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');

function ler(rel){ return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }

function criarAmbiente(){
  const dom = new JSDOM(`<!doctype html><html><head></head><body><nav id="manual-menu"></nav><div id="manual-conteudo"><main><section id="baselegal" class="manual-section"></section></main></div></body></html>`, {
    url: 'https://cmapessoal-dev.github.io/manual.cma/',
    runScripts: 'outside-only'
  });
  const w = dom.window;
  w.showSection = () => {};
  w.getMenuButton = () => null;
  w.toggleExplainer = () => {};
  w.CMAFerramentas = { adicionarAcoes: () => {} };
  w.CMAExportadorCalculadoras = { aplicar: () => {} };
  w.eval(ler('ferramentas/base-tributaria-2026.js'));
  return dom;
}

function carregar(dom, rel){
  dom.window.eval(ler(rel));
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded', { bubbles: true }));
}

function setValor(dom, id, valor){
  const el = dom.window.document.getElementById(id);
  assert.ok(el, `Campo ${id} não encontrado`);
  el.value = String(valor);
  el.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  el.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
}

function brl(texto){
  const s = String(texto || '').replace(/\u00a0/g, ' ').replace(/[^0-9,.-]/g, '').replace(/\./g, '').replace(',', '.');
  return Number(s || 0);
}

function perto(atual, esperado, tolerancia = 0.01){
  assert.ok(Math.abs(atual - esperado) <= tolerancia, `Esperado ${esperado}, recebido ${atual}`);
}

test('Motor tributário 2026 — INSS progressivo e teto', () => {
  const dom = criarAmbiente();
  const T = dom.window.CMATributos2026;
  assert.equal(T.calcularINSS(1621).valor, 121.58);
  assert.equal(T.calcularINSS(3000).valor, 248.60);
  assert.equal(T.calcularINSS(8475.55).valor, 988.09);
  assert.equal(T.calcularINSS(10000).valor, 988.09);
});

test('Motor tributário 2026 — IRRF usa redução mensal e melhor dedução', () => {
  const dom = criarAmbiente();
  const T = dom.window.CMATributos2026;
  const ir5000 = T.calcularIRRF({ rendimentos: 5000, inss: 501.51 });
  assert.equal(ir5000.metodo, 'Desconto simplificado');
  assert.equal(ir5000.impostoAntesReducao, 312.89);
  assert.equal(ir5000.reducao, 312.89);
  assert.equal(ir5000.valor, 0);

  const ir6000 = T.calcularIRRF({ rendimentos: 6000, inss: 641.51 });
  assert.equal(ir6000.metodo, 'Deduções legais');
  assert.equal(ir6000.base, 5358.49);
  assert.equal(ir6000.valor, 385.10);
});

test('Calculadora de Férias — 30 dias sobre salário de R$ 3.000', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-ferias/calculadora-ferias.js');
  setValor(dom, 'cma-ferias-salario', 3000);
  setValor(dom, 'cma-ferias-dias', 30);
  perto(brl(dom.window.document.getElementById('cma-ferias-total').textContent), 3631.40);
  perto(brl(dom.window.document.getElementById('cma-ferias-inss-base').textContent), 4000);
});

test('Calculadora de 13º — 6/12 com primeira parcela de R$ 750', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-decimo-terceiro/calculadora-decimo-terceiro.js');
  setValor(dom, 'cma-13-salario', 3000);
  setValor(dom, 'cma-13-avos', 6);
  setValor(dom, 'cma-13-primeira', 750);
  perto(brl(dom.window.document.getElementById('cma-13-total').textContent), 637.50);
  perto(brl(dom.window.document.getElementById('cma-13-inss-base').textContent), 1500);
});

test('Calculadora de Pró-labore — R$ 5.000', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-pro-labore/calculadora-pro-labore.js');
  setValor(dom, 'cma-pl-bruto', 5000);
  perto(brl(dom.window.document.getElementById('cma-pl-total').textContent), 4450.00);
  perto(brl(dom.window.document.getElementById('cma-pl-inss-base').textContent), 5000);
});

test('Horas Extras e DSR — 10h a 50% sobre salário de R$ 2.200', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-horas-extras/calculadora-horas-extras.js');
  setValor(dom, 'cma-he-salario', 2200);
  setValor(dom, 'cma-he-divisor', 220);
  setValor(dom, 'cma-he-h1', 10);
  setValor(dom, 'cma-he-m1', 0);
  setValor(dom, 'cma-he-p1', 50);
  setValor(dom, 'cma-he-h2', 0);
  setValor(dom, 'cma-he-uteis', 25);
  setValor(dom, 'cma-he-dsr-dias', 5);
  perto(brl(dom.window.document.getElementById('cma-he-total').textContent), 180.00);
  perto(brl(dom.window.document.getElementById('cma-he-valor-hora').textContent), 10.00);
});

test('Adicional Noturno — jornada integral de 22h às 5h', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-adicional-noturno/calculadora-adicional-noturno.js');
  setValor(dom, 'cma-an-salario', 2200);
  setValor(dom, 'cma-an-divisor', 220);
  setValor(dom, 'cma-an-percentual', 20);
  setValor(dom, 'cma-an-entrada', '22:00');
  setValor(dom, 'cma-an-saida', '05:00');
  perto(brl(dom.window.document.getElementById('cma-an-total').textContent), 16.00);
  assert.equal(dom.window.document.getElementById('cma-an-hora-reduzida').textContent, '52min30s');
});

test('Faltas, Atrasos e DSR — 1 falta, 1h30 de atraso e 1 DSR', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-faltas-atrasos/calculadora-faltas-atrasos.js');
  setValor(dom, 'cma-fa-salario', 3000);
  setValor(dom, 'cma-fa-divisor', 220);
  setValor(dom, 'cma-fa-faltas', 1);
  setValor(dom, 'cma-fa-horas', 1);
  setValor(dom, 'cma-fa-minutos', 30);
  setValor(dom, 'cma-fa-dsrs', 1);
  perto(brl(dom.window.document.getElementById('cma-fa-total').textContent), 220.45);
  perto(brl(dom.window.document.getElementById('cma-fa-valor-dia').textContent), 100.00);
});

test('Simulador de Folha — salário simples de R$ 3.000', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-folha/calculadora-folha.js');
  setValor(dom, 'cma-folha-salario', 3000);
  perto(brl(dom.window.document.getElementById('cma-folha-inss').textContent), 248.60);
  perto(brl(dom.window.document.getElementById('cma-folha-liquido').textContent), 2751.40);
});

test('Apurador de Ponto — apura quatro marcações e excedente diário', () => {
  const dom = criarAmbiente();
  carregar(dom, 'apurador-ponto/apurador-ponto.js');
  const A = dom.window.CMAApuradorPonto;
  const r = A.analisarDia({ previsto: 480, marcacoes: ['08:00','12:00','13:00','18:00'], margem: 10 });
  assert.equal(r.valido, true);
  assert.equal(r.trabalhado, 540);
  assert.equal(r.extra, 60);
  assert.equal(r.saldo, 60);
});

test('Apurador de Ponto — aceita jornada atravessando a meia-noite', () => {
  const dom = criarAmbiente();
  carregar(dom, 'apurador-ponto/apurador-ponto.js');
  const r = dom.window.CMAApuradorPonto.analisarDia({ previsto: 360, marcacoes: ['22:00','02:00','03:00','05:00'] });
  assert.equal(r.trabalhado, 360);
  assert.equal(r.saldo, 0);
});

test('Apurador de Ponto — não oculta minutos dentro da margem informada', () => {
  const dom = criarAmbiente();
  carregar(dom, 'apurador-ponto/apurador-ponto.js');
  const r = dom.window.CMAApuradorPonto.analisarDia({ previsto: 480, marcacoes: ['08:00','12:00','13:00','17:05'], margem: 10 });
  assert.equal(r.extra, 5);
  assert.equal(r.saldo, 5);
  assert.equal(r.margem, true);
});

test('Apurador de Ponto — classifica todas as horas de domingo ou feriado a 100%', () => {
  const dom = criarAmbiente();
  carregar(dom, 'apurador-ponto/apurador-ponto.js');
  const r = dom.window.CMAApuradorPonto.analisarDia({ previsto: 0, marcacoes: ['08:00','12:00','13:00','17:00'], especial: true });
  assert.equal(r.trabalhado, 480);
  assert.equal(r.extra50, 0);
  assert.equal(r.extra100, 480);
});

test('Apurador de Ponto — apura o período noturno pelo tempo real, sem conversão', () => {
  const dom = criarAmbiente();
  carregar(dom, 'apurador-ponto/apurador-ponto.js');
  const cincoMinutos = dom.window.CMAApuradorPonto.analisarDia({ previsto: 485, marcacoes: ['14:00','22:05','',''] });
  const seteHoras = dom.window.CMAApuradorPonto.analisarDia({ previsto: 420, marcacoes: ['22:00','05:00','',''] });
  assert.equal(cincoMinutos.noturnoReal, 5);
  assert.equal(seteHoras.noturnoReal, 420);
});

test('Apurador de Ponto — exclui marcações incompletas da apuração', () => {
  const dom = criarAmbiente();
  carregar(dom, 'apurador-ponto/apurador-ponto.js');
  const r = dom.window.CMAApuradorPonto.analisarDia({ previsto: 480, marcacoes: ['08:00','','13:00','17:00'] });
  assert.equal(r.valido, false);
  assert.equal(r.incompleto, true);
});

test('Simulador de Rescisão — calcula a base bruta das verbas informadas', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const r = dom.window.CMACalculadoraRescisao.calcularBase({
    salario: 3000,
    diasSaldo: 10,
    avosFerias: 6,
    periodosVencidos: 1,
    avosDecimo: 8,
    diasAviso: 30
  });
  assert.equal(r.saldoSalario, 1000);
  assert.equal(r.feriasProporcionais, 1500);
  assert.equal(r.feriasVencidas, 3000);
  assert.equal(r.tercoFerias, 1500);
  assert.equal(r.decimoTerceiro, 2000);
  assert.equal(r.avisoPrevio, 3000);
  assert.equal(r.totalBruto, 12000);
});

test('Simulador de Rescisão — calcula dias e avos automaticamente pelas datas', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const r = dom.window.CMACalculadoraRescisao.calcularAutomaticos({
    admissao: '2026-02-16',
    desligamento: '2026-10-24'
  });
  assert.equal(r.diasSaldo, 24);
  assert.equal(r.avosDecimo, 8);
  assert.equal(r.avosFerias, 8);
  assert.equal(r.periodosCompletos, 0);
});

test('Simulador de Rescisão — transforma 12 avos em período completo e mantém o excedente proporcional', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const r = dom.window.CMACalculadoraRescisao.calcularAutomaticos({
    admissao: '2025-05-15',
    desligamento: '2026-08-28'
  });
  assert.equal(r.totalAvosFerias, 15);
  assert.equal(r.periodosCompletos, 1);
  assert.equal(r.avosFerias, 3);
});

test('Simulador de Rescisão — saldo usa salário e demais verbas usam salário mais médias', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const r = dom.window.CMACalculadoraRescisao.calcularBase({salario:3000,medias:600,diasSaldo:10,avosFerias:6,periodosVencidos:1,avosDecimo:8,diasAviso:30});
  assert.equal(r.saldoSalario, 1000);
  assert.equal(r.feriasProporcionais, 1800);
  assert.equal(r.decimoTerceiro, 2400);
  assert.equal(r.avisoPrevio, 3600);
  assert.equal(r.totalBruto, 14200);
});

test('Simulador de Rescisão — dispensa sem justa causa inclui aviso indenizado', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const r = dom.window.CMACalculadoraRescisao.calcularPorModalidade({modalidade:'sem_justa',formaAviso:'indenizado',salario:3000,diasSaldo:10,avosFerias:6,avosDecimo:8,diasAviso:30});
  assert.equal(r.saldoSalario, 1000);
  assert.equal(r.feriasProporcionais, 1500);
  assert.equal(r.decimoTerceiro, 2000);
  assert.equal(r.avisoPrevio, 3000);
  assert.equal(r.totalBruto, 8000);
});

test('Simulador de Rescisão — justa causa exclui proporcionais e aviso', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const r = dom.window.CMACalculadoraRescisao.calcularPorModalidade({modalidade:'justa_causa',formaAviso:'indenizado',salario:3000,diasSaldo:10,avosFerias:6,periodosVencidos:1,avosDecimo:8,diasAviso:30});
  assert.equal(r.feriasProporcionais, 0);
  assert.equal(r.decimoTerceiro, 0);
  assert.equal(r.avisoPrevio, 0);
  assert.equal(r.totalBruto, 5000);
});

test('Simulador de Rescisão — pedido sem aviso cumprido desconta 30 dias', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const r = dom.window.CMACalculadoraRescisao.calcularPorModalidade({modalidade:'pedido',formaAviso:'nao_cumprido',salario:3000,medias:300,diasSaldo:10,avosFerias:6,avosDecimo:8,diasAviso:30});
  assert.equal(r.descontoAviso, 3300);
  assert.equal(r.totalBruto, 2100);
});

test('Simulador de Rescisão — mútuo acordo paga metade do aviso indenizado', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const r = dom.window.CMACalculadoraRescisao.calcularPorModalidade({modalidade:'acordo',formaAviso:'indenizado',salario:3000,diasAviso:30});
  assert.equal(r.avisoPrevio, 1500);
});

test('Simulador de Rescisão — término antecipado pelo empregador calcula art. 479', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const r = dom.window.CMACalculadoraRescisao.calcularPorModalidade({modalidade:'antecipada_empregador',salario:3000,desligamento:'2026-09-01',fimContrato:'2026-09-30'});
  assert.equal(r.diasRestantes, 29);
  assert.equal(r.indenizacao479, 1450);
});

test('Simulador de Rescisão — aviso proporcional respeita 30 a 90 dias', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const A = dom.window.CMACalculadoraRescisao;
  assert.equal(A.diasAvisoAutomaticos('2026-01-01','2026-12-31','sem_justa'),30);
  assert.equal(A.diasAvisoAutomaticos('2020-01-01','2026-01-01','sem_justa'),48);
  assert.equal(A.diasAvisoAutomaticos('1990-01-01','2026-01-01','sem_justa'),90);
  assert.equal(A.diasAvisoAutomaticos('2020-01-01','2026-01-01','pedido'),30);
});

test('Simulador de Rescisão — calcula INSS e IRRF separadamente sobre saldo e 13º', () => {
  const dom = criarAmbiente();
  carregar(dom, 'ferramentas/base-tributaria-2026.js');
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const r = dom.window.CMACalculadoraRescisao.calcularPorModalidade({modalidade:'termino_prazo',salario:6000,diasSaldo:30,avosDecimo:12});
  assert.equal(r.inssSaldo, 641.51);
  assert.equal(r.irSaldo, 385.10);
  assert.equal(r.inssDecimo, 641.51);
  assert.equal(r.irDecimo, 385.10);
  assert.equal(r.totalTributos, 2053.22);
  assert.equal(r.totalLiquido, 9946.78);
});

test('Simulador de Rescisão — não tributa férias indenizadas e terço constitucional', () => {
  const dom = criarAmbiente();
  carregar(dom, 'ferramentas/base-tributaria-2026.js');
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const r = dom.window.CMACalculadoraRescisao.calcularPorModalidade({modalidade:'termino_prazo',salario:6000,avosFerias:12,periodosVencidos:1});
  assert.equal(r.feriasProporcionais, 6000);
  assert.equal(r.feriasVencidas, 6000);
  assert.equal(r.tercoFerias, 4000);
  assert.equal(r.totalTributos, 0);
  assert.equal(r.totalLiquido, 16000);
});

test('Simulador de Rescisão — outros descontos reduzem somente o líquido', () => {
  const dom = criarAmbiente();
  carregar(dom, 'ferramentas/base-tributaria-2026.js');
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const r = dom.window.CMACalculadoraRescisao.calcularPorModalidade({modalidade:'termino_prazo',salario:6000,diasSaldo:30,avosDecimo:12,valeTransporte:300,planoSaude:100,alimentacao:50,outrosDescontos:50});
  perto(r.baseINSSSaldo, 6000);
  perto(r.baseINSSDecimo, 6000);
  perto(r.totalTributos, 2053.22);
  perto(r.totalOutrosDescontos, 500);
  perto(r.totalDescontos, 2553.22);
  perto(r.totalLiquido, 9446.78);
});

test('Simulador de Rescisão — projeta aviso indenizado em férias e 13º', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const A = dom.window.CMACalculadoraRescisao;
  const p = A.calcularProjecaoAviso({admissao:'2025-01-01',desligamento:'2026-08-20',modalidade:'sem_justa',formaAviso:'indenizado',diasAviso:33});
  assert.equal(p.dataProjetada, '2026-09-22');
  assert.equal(p.avosFeriasAviso, 1);
  assert.equal(p.avosDecimoAviso, 1);
  assert.equal(p.avosDecimoAvisoMesmoAno, 1);
  assert.equal(p.avosDecimoAvisoAnoSeguinte, 0);
  const r = A.calcularPorModalidade({modalidade:'sem_justa',formaAviso:'indenizado',salario:3000,diasSaldo:20,avosFerias:8,avosFeriasAviso:p.avosFeriasAviso,avosDecimo:8,avosDecimoAvisoMesmoAno:p.avosDecimoAvisoMesmoAno,avosDecimoAvisoAnoSeguinte:p.avosDecimoAvisoAnoSeguinte,diasAviso:33});
  assert.equal(r.feriasAviso, 250);
  assert.equal(r.decimoAviso, 250);
  assert.equal(r.tercoFerias, 750);
  assert.equal(r.totalBruto, 10550);
});

test('Simulador de Rescisão — separa tributação do 13º projetado para o ano seguinte', () => {
  const dom = criarAmbiente();
  carregar(dom, 'ferramentas/base-tributaria-2026.js');
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const A = dom.window.CMACalculadoraRescisao;
  const p = A.calcularProjecaoAviso({admissao:'2025-07-01',desligamento:'2026-12-31',modalidade:'sem_justa',formaAviso:'indenizado',diasAviso:33});
  assert.equal(p.dataProjetada, '2027-02-02');
  assert.equal(p.avosFeriasAviso, 1);
  assert.equal(p.avosDecimoAviso, 1);
  assert.equal(p.avosDecimoAvisoMesmoAno, 0);
  assert.equal(p.avosDecimoAvisoAnoSeguinte, 1);
  const t = A.calcularTributos({decimoTerceiro:6000,decimoAvisoAnoSeguinte:500});
  assert.equal(t.inssDecimo, 679.01);
  assert.equal(t.irDecimo, 385.10);
  assert.equal(t.totalTributos, 1064.11);
});

test('Simulador de Rescisão — reconhece avo de dezembro completado pela projeção', () => {
  const dom = criarAmbiente();
  carregar(dom, 'calculadora-rescisao/calculadora-rescisao.js');
  const p = dom.window.CMACalculadoraRescisao.calcularProjecaoAviso({admissao:'2025-01-01',desligamento:'2026-12-10',modalidade:'sem_justa',formaAviso:'indenizado',diasAviso:33});
  assert.equal(p.dataProjetada, '2027-01-12');
  assert.equal(p.avosDecimoAvisoMesmoAno, 1);
  assert.equal(p.avosDecimoAvisoAnoSeguinte, 0);
  assert.equal(p.avosDecimoAviso, 1);
});
