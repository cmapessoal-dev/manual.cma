(function(){
  function moeda(v){return (Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function numero(id){const el=document.getElementById(id);if(!el)return 0;const n=parseFloat(String(el.value||'0').replace(',','.'));return isNaN(n)?0:n;}
  function sim(id){const el=document.querySelector(`input[name="${id}"]:checked`);return el&&el.value==='sim';}

  function linha(label,valor,classe=''){
    return `<div class="cma-custo-linha ${classe}"><span>${label}</span><strong>${moeda(valor)}</strong></div>`;
  }

  function recalcular(){
    const regime=(document.querySelector('input[name="cma-regime"]:checked')||{}).value||'simples';
    const salario=numero('cma-custo-salario');
    const temVT=sim('cma-vt');
    const vtBruto=temVT?numero('cma-custo-vt'):0;
    const descontoVT=temVT?Math.min(vtBruto,salario*0.06):0;
    const custoVT=Math.max(0,vtBruto-descontoVT);

    const temAlim=sim('cma-alim');
    const alimBruto=temAlim?numero('cma-custo-alim'):0;
    const descontoAlim=temAlim?alimBruto*0.20:0;
    const custoAlim=Math.max(0,alimBruto-descontoAlim);

    const plano=numero('cma-custo-plano');
    const outros=numero('cma-custo-outros');

    const fgtsSalario=salario*0.08;
    const encargosFolha=regime==='nao-simples'?salario*0.28:0;
    const desembolso=salario+custoVT+custoAlim+plano+outros+fgtsSalario+encargosFolha;

    const ferias=salario/12;
    const terco=ferias/3;
    const fgtsFerias=(ferias+terco)*0.08;
    const decimo=salario/12;
    const fgtsDecimo=decimo*0.08;
    const aviso=salario/12;
    const fgtsAviso=aviso*0.08;
    const multaFgts=(fgtsSalario+fgtsFerias+fgtsDecimo+fgtsAviso)*0.50;
    const encargosProv=regime==='nao-simples'?(ferias+terco+decimo+aviso)*0.28:0;
    const provisoes=ferias+terco+fgtsFerias+decimo+fgtsDecimo+aviso+fgtsAviso+multaFgts+encargosProv;
    const total=desembolso+provisoes;

    const reg=document.getElementById('cma-custo-regime-label');
    if(reg)reg.textContent=regime==='simples'?'Optante pelo Simples Nacional':'Não optante pelo Simples Nacional';

    const caixa=document.getElementById('cma-custo-desembolso');
    if(caixa)caixa.innerHTML=
      linha('Salário base',salario)+
      (temAlim?linha('Vale-alimentação / refeição — valor informado',alimBruto)+linha('(-) Participação do empregado — 20%',-descontoAlim,'cma-custo-desconto')+linha('Custo do benefício para a empresa',custoAlim,'cma-custo-sub'):'')+
      (temVT?linha('Vale-transporte — valor informado',vtBruto)+linha('(-) Desconto do empregado — 6% do salário',-descontoVT,'cma-custo-desconto')+linha('Custo do VT para a empresa',custoVT,'cma-custo-sub'):'')+
      (plano?linha('Plano de saúde',plano):'')+
      (outros?linha('Outros benefícios',outros):'')+
      linha('FGTS sobre salário — 8%',fgtsSalario)+
      (regime==='nao-simples'?linha('INSS + SAT + Terceiros — 28%',encargosFolha):'')+
      linha('Subtotal mensal',desembolso,'cma-custo-total-linha');

    const prov=document.getElementById('cma-custo-provisoes');
    if(prov)prov.innerHTML=
      linha('Férias — 1/12',ferias)+
      linha('1/3 de férias',terco)+
      linha('FGTS sobre férias + 1/3 — 8%',fgtsFerias)+
      linha('13º salário — 1/12',decimo)+
      linha('FGTS sobre 13º — 8%',fgtsDecimo)+
      linha('Aviso-prévio — 1/12',aviso)+
      linha('FGTS sobre aviso-prévio — 8%',fgtsAviso)+
      linha('Provisão da multa do FGTS — 50%',multaFgts)+
      (regime==='nao-simples'?linha('INSS + SAT + Terceiros sobre provisões — 28%',encargosProv):'')+
      linha('Subtotal de provisões',provisoes,'cma-custo-total-linha');

    const t=document.getElementById('cma-custo-total');if(t)t.textContent=moeda(total);
    const pct=document.getElementById('cma-custo-percentual');if(pct)pct.textContent=salario>0?`${((total/salario-1)*100).toFixed(1).replace('.',',')}% acima do salário base`:'Informe o salário para calcular';

    const vtCampo=document.getElementById('cma-custo-vt-wrap');if(vtCampo)vtCampo.classList.toggle('hidden',!temVT);
    const aCampo=document.getElementById('cma-custo-alim-wrap');if(aCampo)aCampo.classList.toggle('hidden',!temAlim);
  }

  function criar(){
    const menu=document.getElementById('manual-menu');
    const main=document.querySelector('#manual-conteudo main');
    if(!menu||!main||document.getElementById('custo-empregado'))return;

    const botao=document.createElement('button');
    botao.type='button';
    botao.setAttribute('onclick',"showSection('custo-empregado', this)");
    botao.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';
    botao.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><path d="M6 15h2"/></svg> Custo do Empregado';
    const beneficios=typeof getMenuButton==='function'?getMenuButton('beneficios'):null;
    if(beneficios&&beneficios.nextSibling)menu.insertBefore(botao,beneficios.nextSibling);else menu.appendChild(botao);

    const section=document.createElement('section');
    section.id='custo-empregado';
    section.className='manual-section hidden fade-in';
    section.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
        <h3 class="text-2xl font-bold text-blue-950 flex items-center">Calculadora de Custo do Empregado</h3>
        <button onclick="toggleExplainer('exp-custo-empregado')" class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold hover:bg-slate-300 flex items-center shrink-0">Entenda os Termos</button>
      </div>
      <div id="exp-custo-empregado" class="hidden bg-slate-100 border border-slate-300 p-3 rounded mb-4 text-xs text-slate-700 space-y-2">
        <p><strong>Desembolso mensal:</strong> valores que normalmente geram saída de caixa no mês, como salário, benefícios e encargos correntes.</p>
        <p><strong>Provisões:</strong> valores mensais reservados para obrigações futuras, como férias, 13º, aviso-prévio e multa do FGTS.</p>
        <p><strong>Não optante pelo Simples:</strong> esta calculadora utiliza a mesma premissa da planilha-base: 28% para INSS patronal + SAT + Terceiros.</p>
      </div>

      <div class="cma-custo-grid">
        <div class="cma-custo-card cma-custo-form">
          <h4>1. Dados para o cálculo</h4>
          <label class="cma-custo-label">Regime da empresa</label>
          <div class="cma-custo-segmentado">
            <label><input type="radio" name="cma-regime" value="simples" checked><span>Optante pelo Simples</span></label>
            <label><input type="radio" name="cma-regime" value="nao-simples"><span>Não optante pelo Simples</span></label>
          </div>

          <label class="cma-custo-label" for="cma-custo-salario">Salário base</label>
          <div class="cma-custo-money"><span>R$</span><input id="cma-custo-salario" type="number" min="0" step="0.01" value="0"></div>

          <div class="cma-custo-pergunta"><div><strong>Vale-transporte?</strong><small>Se sim, informe a média mensal concedida.</small></div><div class="cma-custo-simnao"><label><input type="radio" name="cma-vt" value="nao" checked><span>Não</span></label><label><input type="radio" name="cma-vt" value="sim"><span>Sim</span></label></div></div>
          <div id="cma-custo-vt-wrap" class="hidden"><label class="cma-custo-label" for="cma-custo-vt">Média mensal de vale-transporte</label><div class="cma-custo-money"><span>R$</span><input id="cma-custo-vt" type="number" min="0" step="0.01" value="0"></div><div class="cma-custo-ajuda">Participação do empregado: até 6% do salário base, limitada ao valor do benefício nesta calculadora.</div></div>

          <div class="cma-custo-pergunta"><div><strong>Vale-alimentação / refeição?</strong><small>Se sim, informe a média mensal depositada.</small></div><div class="cma-custo-simnao"><label><input type="radio" name="cma-alim" value="nao" checked><span>Não</span></label><label><input type="radio" name="cma-alim" value="sim"><span>Sim</span></label></div></div>
          <div id="cma-custo-alim-wrap" class="hidden"><label class="cma-custo-label" for="cma-custo-alim">Média mensal de alimentação</label><div class="cma-custo-money"><span>R$</span><input id="cma-custo-alim" type="number" min="0" step="0.01" value="0"></div><div class="cma-custo-ajuda">Participação do empregado considerada no cálculo: 20% do valor mensal informado.</div></div>

          <label class="cma-custo-label" for="cma-custo-plano">Plano de saúde mensal <small>(opcional)</small></label>
          <div class="cma-custo-money"><span>R$</span><input id="cma-custo-plano" type="number" min="0" step="0.01" value="0"></div>
          <label class="cma-custo-label" for="cma-custo-outros">Outros benefícios mensais <small>(opcional)</small></label>
          <div class="cma-custo-money"><span>R$</span><input id="cma-custo-outros" type="number" min="0" step="0.01" value="0"></div>
        </div>

        <div class="cma-custo-resultados">
          <div class="cma-custo-resumo"><span id="cma-custo-regime-label">Optante pelo Simples Nacional</span><small>Custo efetivo mensal estimado</small><strong id="cma-custo-total">R$ 0,00</strong><em id="cma-custo-percentual">Informe o salário para calcular</em></div>
          <div class="cma-custo-card"><h4>2. Desembolso mensal</h4><div id="cma-custo-desembolso"></div></div>
          <div class="cma-custo-card"><h4>3. Provisões mensais</h4><div id="cma-custo-provisoes"></div></div>
        </div>
      </div>
      <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm mt-4"><strong class="text-amber-900 block mb-1">Importante</strong><p class="text-amber-950 text-sm leading-relaxed">A calculadora reproduz as premissas da planilha-base para fins de estimativa e planejamento. Alíquotas, benefícios, enquadramentos tributários e regras previstas em instrumentos coletivos podem alterar o custo real de cada empresa.</p></div>`;

    const beneficiosSec=document.getElementById('beneficios');
    if(beneficiosSec&&beneficiosSec.nextSibling)main.insertBefore(section,beneficiosSec.nextSibling);else main.appendChild(section);
    if(typeof manualSections!=='undefined'&&!manualSections.some(x=>x.id==='custo-empregado')){
      const pos=manualSections.findIndex(x=>x.id==='beneficios');
      manualSections.splice(pos>=0?pos+1:manualSections.length,0,{id:'custo-empregado',nome:'Custo do Empregado'});
    }

    const style=document.createElement('style');style.id='cma-custo-style';style.textContent=`
      .cma-custo-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:18px}.cma-custo-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 6px 18px rgba(15,23,42,.05)}.cma-custo-card h4{margin:0 0 16px;color:#172554;font-size:17px;font-weight:800}.cma-custo-label{display:block;margin:14px 0 6px;color:#334155;font-size:14px;font-weight:700}.cma-custo-label small{font-weight:500;color:#94a3b8}.cma-custo-money{display:flex;align-items:center;border:1px solid #cbd5e1;border-radius:9px;background:#fff;overflow:hidden}.cma-custo-money span{padding:11px 10px;background:#f8fafc;border-right:1px solid #e2e8f0;color:#64748b;font-weight:700}.cma-custo-money input{width:100%;padding:11px 12px;outline:none;color:#0f172a;font-size:16px}.cma-custo-money:focus-within{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.cma-custo-segmentado{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cma-custo-segmentado input,.cma-custo-simnao input{position:absolute;opacity:0}.cma-custo-segmentado span,.cma-custo-simnao span{display:flex;align-items:center;justify-content:center;padding:10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#475569;font-size:13px;font-weight:700;cursor:pointer;text-align:center}.cma-custo-segmentado input:checked+span,.cma-custo-simnao input:checked+span{background:#172554;color:#fff;border-color:#172554}.cma-custo-pergunta{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px;padding-top:16px;border-top:1px solid #eef2f7;color:#334155}.cma-custo-pergunta strong{display:block;font-size:14px}.cma-custo-pergunta small{display:block;margin-top:2px;color:#94a3b8;font-size:12px}.cma-custo-simnao{display:grid;grid-template-columns:58px 58px;gap:6px;flex:0 0 auto}.cma-custo-ajuda{margin:6px 2px 0;color:#64748b;font-size:11.5px;line-height:1.5}.cma-custo-resultados{display:flex;flex-direction:column;gap:14px}.cma-custo-resumo{padding:22px;border-radius:14px;background:linear-gradient(135deg,#061a46,#082f7d);color:#fff;box-shadow:0 10px 28px rgba(8,47,125,.18)}.cma-custo-resumo>span{display:block;color:#bfdbfe;font-size:12px;font-weight:700}.cma-custo-resumo small{display:block;margin-top:11px;color:#dbeafe;font-size:13px}.cma-custo-resumo strong{display:block;margin-top:3px;font-size:34px;line-height:1.15}.cma-custo-resumo em{display:block;margin-top:6px;color:#fbbf24;font-size:12px;font-style:normal;font-weight:700}.cma-custo-linha{display:flex;justify-content:space-between;gap:18px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#475569;font-size:13px}.cma-custo-linha span{max-width:72%}.cma-custo-linha strong{color:#1e293b;white-space:nowrap}.cma-custo-desconto strong{color:#b91c1c}.cma-custo-sub{padding-left:12px;background:#f8fafc}.cma-custo-total-linha{margin-top:4px;padding-top:12px;border-top:2px solid #dbeafe;border-bottom:0;font-weight:800;color:#172554}.cma-custo-total-linha strong{color:#172554;font-size:14px}@media(max-width:800px){.cma-custo-grid{grid-template-columns:1fr}.cma-custo-card{padding:15px}.cma-custo-segmentado{grid-template-columns:1fr}.cma-custo-pergunta{align-items:flex-start;flex-direction:column}.cma-custo-simnao{width:100%;grid-template-columns:1fr 1fr}.cma-custo-resumo strong{font-size:30px}.cma-custo-linha{font-size:14px;line-height:1.45}.cma-custo-linha span{max-width:68%}}`;
    document.head.appendChild(style);

    section.querySelectorAll('input').forEach(i=>i.addEventListener('input',recalcular));
    section.querySelectorAll('input[type="radio"]').forEach(i=>i.addEventListener('change',recalcular));
    recalcular();
    if(window.location.hash==='#custo-empregado')setTimeout(()=>showSection('custo-empregado',botao),60);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criar);else criar();
})();