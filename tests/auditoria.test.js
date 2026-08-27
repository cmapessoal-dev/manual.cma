const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const ROOT=path.resolve(__dirname,'..');
const ler=p=>fs.readFileSync(path.join(ROOT,p),'utf8');

test('App e bootstrap usam a mesma versão',()=>{
  const app=ler('app.js');
  const boot=ler('core/bootstrap.js');
  const vApp=(app.match(/bootstrap\.js\?v=([0-9a-z]+)/)||[])[1];
  const vBoot=(boot.match(/const VERSAO='([^']+)'/)||[])[1];
  assert.ok(vApp,'Versão do bootstrap não encontrada no app.js');
  assert.equal(vApp,vBoot);
});

test('Módulos jurídicos auditados estão carregados',()=>{
  const boot=ler('core/bootstrap.js');
  ['jornada/jornada-conteudo.js','beneficios/beneficios-conteudo.js','mei/mei-autonomos-conteudo.js','core/auditoria-conteudo-2026.js'].forEach(p=>assert.ok(boot.includes(p),`Módulo ausente: ${p}`));
});

test('Tempo parcial — 26h semanais sobre referência de R$ 2.200 resulta R$ 1.300',()=>{
  const dom=new JSDOM('<!doctype html><html><head></head><body><nav id="manual-menu"></nav><div id="manual-conteudo"><main><section id="baselegal"></section></main></div></body></html>',{url:'https://cmapessoal-dev.github.io/manual.cma/',runScripts:'outside-only'});
  const w=dom.window;w.showSection=()=>{};w.getMenuButton=()=>null;w.toggleExplainer=()=>{};w.CMAFerramentas={adicionarAcoes:()=>{}};w.CMAExportadorCalculadoras={aplicar:()=>{}};
  w.eval(ler('calculadora-tempo-parcial/calculadora-tempo-parcial.js'));
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded',{bubbles:true}));
  const sal=dom.window.document.getElementById('cma-tp-salario');
  const hrs=dom.window.document.getElementById('cma-tp-horas-semanais');
  assert.ok(sal&&hrs);
  sal.value='2200';hrs.value='26';sal.dispatchEvent(new dom.window.Event('input',{bubbles:true}));hrs.dispatchEvent(new dom.window.Event('input',{bubbles:true}));
  const total=dom.window.document.getElementById('cma-tp-total').textContent.replace(/\u00a0/g,' ').replace(/[^0-9,.-]/g,'').replace(/\./g,'').replace(',','.');
  assert.equal(Number(total),1300);
});

test('Conteúdo legado de fiscalização não é mantido pela camada de auditoria',()=>{
  assert.ok(ler('core/auditoria-conteudo-2026.js').includes("document.getElementById('fiscalizacao')?.remove()"));
});