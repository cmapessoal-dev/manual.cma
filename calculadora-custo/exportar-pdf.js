(function(){
  function moedaTexto(v){return (Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function valorNumero(id){const el=document.getElementById(id);if(!el)return 0;const n=parseFloat(String(el.value||'0').replace(',','.'));return isNaN(n)?0:n;}
  function opcao(nome){const el=document.querySelector(`input[name="${nome}"]:checked`);return el?el.value:'';}
  function limparTexto(t){return (t||'').replace(/\s+/g,' ').trim();}
  function linhasDaCaixa(id){
    const box=document.getElementById(id);if(!box)return [];
    return Array.from(box.querySelectorAll('.cma-custo-linha')).map(l=>({
      label:limparTexto((l.querySelector('span')||{}).textContent),
      valor:limparTexto((l.querySelector('strong')||{}).textContent),
      total:l.classList.contains('cma-custo-total-linha'),
      desconto:l.classList.contains('cma-custo-desconto')
    }));
  }
  function esc(t){return String(t??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function tabela(titulo,linhas){
    return `<section class="pdf-card"><h2>${esc(titulo)}</h2>${linhas.map(l=>`<div class="pdf-row${l.total?' total':''}${l.desconto?' desconto':''}"><span>${esc(l.label)}</span><strong>${esc(l.valor)}</strong></div>`).join('')}</section>`;
  }
  function montarRelatorio(){
    const regime=limparTexto((document.getElementById('cma-custo-regime-label')||{}).textContent)||'Não informado';
    const total=limparTexto((document.getElementById('cma-custo-total')||{}).textContent)||'R$ 0,00';
    const percentual=limparTexto((document.getElementById('cma-custo-percentual')||{}).textContent)||'';
    const salario=valorNumero('cma-custo-salario');
    const vt=opcao('cma-vt')==='sim'?valorNumero('cma-custo-vt'):0;
    const alim=opcao('cma-alim')==='sim'?valorNumero('cma-custo-alim'):0;
    const plano=valorNumero('cma-custo-plano');
    const outros=valorNumero('cma-custo-outros');
    const data=new Date().toLocaleDateString('pt-BR');
    const desembolso=linhasDaCaixa('cma-custo-desembolso');
    const provisoes=linhasDaCaixa('cma-custo-provisoes');
    const beneficios=[
      ['Salário base',moedaTexto(salario)],
      ['Vale-transporte',vt>0?moedaTexto(vt):'Não informado'],
      ['Vale-alimentação / refeição',alim>0?moedaTexto(alim):'Não informado'],
      ['Plano de saúde',plano>0?moedaTexto(plano):'Não informado'],
      ['Outros benefícios',outros>0?moedaTexto(outros):'Não informado']
    ];
    const html=`<div id="cma-pdf-relatorio" class="pdf-page">
      <header class="pdf-header">
        <div><div class="pdf-brand">CMA</div><div class="pdf-brand-text"><strong>CMA Assessoria Contábil</strong><span>Departamento Pessoal</span></div></div>
        <div class="pdf-date">Simulação em ${esc(data)}</div>
      </header>
      <div class="pdf-title"><span>Relatório de estimativa</span><h1>Custo do Empregado</h1><p>${esc(regime)}</p></div>
      <section class="pdf-summary"><div><span>Custo efetivo mensal estimado</span><strong>${esc(total)}</strong><small>${esc(percentual)}</small></div></section>
      <section class="pdf-card"><h2>Dados informados</h2>${beneficios.map(x=>`<div class="pdf-row"><span>${esc(x[0])}</span><strong>${esc(x[1])}</strong></div>`).join('')}</section>
      ${tabela('Desembolso mensal',desembolso)}
      ${tabela('Provisões mensais',provisoes)}
      <section class="pdf-note"><strong>Importante</strong><p>Os valores apresentados são apenas uma estimativa para planejamento. O custo efetivo do empregado pode variar conforme o enquadramento tributário da empresa, atividade exercida, alíquotas aplicáveis, benefícios concedidos, normas coletivas, condições contratuais e demais particularidades de cada caso. Para decisões definitivas, os valores devem ser analisados conforme a realidade da empresa e do empregado.</p></section>
      <footer class="pdf-footer">CMA Assessoria Contábil • Manual de Diretrizes Trabalhistas &amp; Boas Práticas</footer>
    </div>`;
    return html;
  }
  function estilos(){return `
    *{box-sizing:border-box}body{margin:0;background:#fff;font-family:Arial,Helvetica,sans-serif;color:#334155}.pdf-page{width:794px;max-width:100%;margin:0 auto;padding:30px 34px}.pdf-header{display:flex;justify-content:space-between;align-items:center;padding-bottom:14px;border-bottom:3px solid #f5b51b}.pdf-header>div:first-child{display:flex;align-items:center;gap:10px}.pdf-brand{display:grid;place-items:center;width:48px;height:48px;border-radius:9px;background:#082f7d;color:#fff;font-size:15px;font-weight:900}.pdf-brand-text strong{display:block;color:#172554;font-size:15px}.pdf-brand-text span,.pdf-date{display:block;color:#64748b;font-size:10px;margin-top:2px}.pdf-title{padding:22px 0 14px}.pdf-title>span{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;font-weight:700}.pdf-title h1{margin:5px 0 3px;color:#172554;font-size:27px}.pdf-title p{margin:0;color:#64748b;font-size:12px}.pdf-summary{margin-bottom:15px;padding:18px 20px;border-radius:11px;background:#082f7d;color:#fff}.pdf-summary span{display:block;color:#bfdbfe;font-size:11px}.pdf-summary strong{display:block;margin-top:3px;font-size:29px}.pdf-summary small{display:block;margin-top:4px;color:#fbbf24;font-size:10px;font-weight:700}.pdf-card{margin-top:12px;padding:14px 16px;border:1px solid #dbe3ef;border-radius:10px;background:#fff;break-inside:avoid}.pdf-card h2{margin:0 0 8px;color:#172554;font-size:14px}.pdf-row{display:flex;justify-content:space-between;gap:20px;padding:7px 0;border-bottom:1px solid #edf2f7;font-size:11px}.pdf-row:last-child{border-bottom:0}.pdf-row span{max-width:72%;color:#475569}.pdf-row strong{white-space:nowrap;color:#1e293b}.pdf-row.desconto strong{color:#b91c1c}.pdf-row.total{margin-top:3px;padding-top:9px;border-top:2px solid #dbeafe;border-bottom:0;font-weight:800}.pdf-row.total span,.pdf-row.total strong{color:#172554}.pdf-note{margin-top:14px;padding:12px 14px;border-left:4px solid #d97706;background:#fffbeb;border-radius:0 8px 8px 0;break-inside:avoid}.pdf-note strong{display:block;color:#92400e;font-size:11px}.pdf-note p{margin:4px 0 0;color:#78350f;font-size:9.5px;line-height:1.45}.pdf-footer{margin-top:18px;padding-top:10px;border-top:1px solid #e2e8f0;text-align:center;color:#94a3b8;font-size:8.5px}@page{size:A4;margin:10mm}@media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.pdf-page{width:auto;padding:0}.pdf-card,.pdf-note{break-inside:avoid}}`;}
  function fallbackImprimir(html){
    const w=window.open('','_blank');if(!w){alert('Não foi possível abrir a janela de impressão. Verifique o bloqueador de pop-ups.');return;}
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Custo do Empregado - CMA</title><style>${estilos()}</style></head><body>${html}<script>window.onload=function(){setTimeout(function(){window.print()},250)}<\/script></body></html>`);w.document.close();
  }
  function carregarHtml2Pdf(){
    if(window.html2pdf)return Promise.resolve(window.html2pdf);
    return new Promise((resolve,reject)=>{
      const existente=document.getElementById('cma-html2pdf-lib');
      if(existente){existente.addEventListener('load',()=>resolve(window.html2pdf),{once:true});existente.addEventListener('error',reject,{once:true});return;}
      const s=document.createElement('script');s.id='cma-html2pdf-lib';s.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';s.onload=()=>resolve(window.html2pdf);s.onerror=reject;document.head.appendChild(s);
    });
  }
  async function exportar(){
    const salario=valorNumero('cma-custo-salario');if(salario<=0){alert('Informe o salário base antes de exportar o relatório.');return;}
    const btn=document.getElementById('cma-exportar-custo-pdf');const original=btn?btn.innerHTML:'';if(btn){btn.disabled=true;btn.textContent='Gerando PDF...';}
    const html=montarRelatorio();
    try{
      await carregarHtml2Pdf();
      const wrap=document.createElement('div');wrap.innerHTML=`<style>${estilos()}</style>${html}`;wrap.style.position='fixed';wrap.style.left='-99999px';wrap.style.top='0';wrap.style.background='#fff';document.body.appendChild(wrap);
      const nome=`Custo-do-Empregado-CMA-${new Date().toISOString().slice(0,10)}.pdf`;
      await window.html2pdf().set({margin:0.3,filename:nome,image:{type:'jpeg',quality:0.98},html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff'},jsPDF:{unit:'in',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy']}}).from(wrap.querySelector('#cma-pdf-relatorio')).save();
      wrap.remove();
    }catch(e){fallbackImprimir(html);}finally{if(btn){btn.disabled=false;btn.innerHTML=original;}}
  }
  function instalar(){
    const secao=document.getElementById('custo-empregado');if(!secao)return false;
    if(document.getElementById('cma-exportar-custo-pdf'))return true;
    const resumo=secao.querySelector('.cma-custo-resumo');if(!resumo)return false;
    const btn=document.createElement('button');btn.type='button';btn.id='cma-exportar-custo-pdf';btn.className='cma-exportar-custo-pdf';btn.innerHTML='<span aria-hidden="true">⇩</span> Exportar em PDF';btn.addEventListener('click',exportar);resumo.appendChild(btn);
    if(!document.getElementById('cma-exportar-pdf-style')){const st=document.createElement('style');st.id='cma-exportar-pdf-style';st.textContent='.cma-exportar-custo-pdf{display:inline-flex;align-items:center;justify-content:center;gap:7px;margin-top:14px;padding:9px 13px;border:1px solid rgba(255,255,255,.28);border-radius:8px;background:#fff;color:#082f7d;font-size:12.5px;font-weight:800;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.12);transition:.2s}.cma-exportar-custo-pdf:hover{background:#f8fafc;transform:translateY(-1px)}.cma-exportar-custo-pdf:disabled{opacity:.65;cursor:wait;transform:none}@media(max-width:800px){.cma-exportar-custo-pdf{width:100%;font-size:14px;padding:11px 14px}}';document.head.appendChild(st);}
    return true;
  }
  let tentativas=0;function iniciar(){if(instalar())return;if(++tentativas<40)setTimeout(iniciar,250);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();