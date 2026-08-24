(function(){
  function moeda(v){return (Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function numero(id){const el=document.getElementById(id);if(!el)return 0;const n=parseFloat(String(el.value||'0').replace(',','.'));return Number.isFinite(n)?n:0;}
  function inteiro(id){return Math.max(0,Math.floor(numero(id)));}
  function linha(label,valor,classe=''){return `<div class="cma-13-linha ${classe}"><span>${label}</span><strong>${moeda(valor)}</strong></div>`;}

  function recalcular(){
    if(!window.CMATributos2026)return;
    const salario=numero('cma-13-salario'),medias=numero('cma-13-medias'),avos=Math.min(12,Math.max(1,inteiro('cma-13-avos')||12));
    const remuneracao=salario+medias,total13=remuneracao*(avos/12),primeira=numero('cma-13-primeira');
    const inss=CMATributos2026.calcularINSS(total13);
    const ir=CMATributos2026.calcularIRRF({rendimentos:total13,inss:inss.valor,dependentes:inteiro('cma-13-dependentes'),pensao:numero('cma-13-pensao'),outrasDeducoes:numero('cma-13-outras-deducoes')});
    const liquidoTotal=Math.max(0,total13-inss.valor-ir.valor);
    const segunda=Math.max(0,total13-primeira-inss.valor-ir.valor);
    const sugerida=total13/2;

    document.getElementById('cma-13-total').textContent=moeda(segunda);
    document.getElementById('cma-13-resumo-sub').textContent=`13º bruto total: ${moeda(total13)} • líquido total estimado: ${moeda(liquidoTotal)}`;
    document.getElementById('cma-13-proventos').innerHTML=
      linha(`13º proporcional — ${avos}/12`,total13)+
      linha('1ª parcela sugerida para planejamento (50%)',sugerida)+
      linha('13º bruto total',total13,'cma-13-total-linha');
    document.getElementById('cma-13-descontos').innerHTML=
      linha('(-) 1ª parcela já paga',primeira)+
      linha('(-) INSS sobre o 13º',inss.valor)+
      linha('(-) IRRF exclusivo sobre o 13º',ir.valor)+
      linha('2ª parcela / saldo líquido',segunda,'cma-13-total-linha');
    document.getElementById('cma-13-inss-base').textContent=moeda(inss.baseLimitada);
    document.getElementById('cma-13-ir-metodo').textContent=ir.metodo;
    document.getElementById('cma-13-ir-base').textContent=moeda(ir.base);
    document.getElementById('cma-13-ir-antes').textContent=moeda(ir.impostoAntesReducao);
    document.getElementById('cma-13-ir-reducao').textContent=moeda(ir.reducao);
  }

  function criar(){
    const menu=document.getElementById('manual-menu'),main=document.querySelector('#manual-conteudo main');
    if(!menu||!main||document.getElementById('calculadora-decimo-terceiro'))return;

    const botao=document.createElement('button');
    botao.type='button';botao.setAttribute('onclick',"showSection('calculadora-decimo-terceiro', this)");
    botao.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';
    botao.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h2"/><path d="M13 15h4"/></svg> Calculadora de 13º Salário';
    const ferias=typeof getMenuButton==='function'?getMenuButton('calculadora-ferias'):null;
    if(ferias)ferias.insertAdjacentElement('afterend',botao);else menu.appendChild(botao);

    const section=document.createElement('section');section.id='calculadora-decimo-terceiro';section.className='manual-section hidden fade-in';
    section.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4"><div><h3 class="text-2xl font-bold text-blue-950">Calculadora de 13º Salário</h3><p class="text-sm text-gray-500 mt-1">Estimativa do 13º proporcional, 1ª parcela, INSS, IRRF e saldo da 2ª parcela — parâmetros 2026.</p></div><button type="button" onclick="toggleExplainer('exp-calculadora-13')" class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold hover:bg-slate-300 shrink-0">Como calculamos?</button></div>
      <div id="exp-calculadora-13" class="hidden bg-slate-100 border border-slate-300 p-3 rounded mb-4 text-xs text-slate-700 space-y-2"><p><strong>13º proporcional:</strong> remuneração de referência × quantidade de avos ÷ 12.</p><p><strong>1ª parcela:</strong> não sofre desconto de INSS e IRRF no momento do adiantamento. A ferramenta mostra 50% do 13º total apenas como referência e permite informar o valor efetivamente adiantado.</p><p><strong>INSS:</strong> calculado sobre o valor total do 13º, separadamente da remuneração mensal.</p><p><strong>IRRF:</strong> tributação exclusiva na fonte sobre o 13º, considerando INSS, dependentes e demais deduções admitidas, com comparação ao desconto simplificado e aplicação da redução de 2026 quando cabível.</p></div>

      <div class="cma-13-grid">
        <div class="cma-13-card cma-13-form"><h4>1. Dados para o cálculo</h4>
          <div class="cma-13-duplo"><div><label>Empresa</label><input id="cma-13-empresa" type="text" placeholder="Nome da empresa"></div><div><label>Nome do empregado</label><input id="cma-13-empregado" type="text" placeholder="Nome do empregado"></div></div>
          <label>Salário base de referência</label><div class="cma-13-money"><span>R$</span><input id="cma-13-salario" type="number" min="0" step="0.01" value="0"></div>
          <label>Médias salariais do 13º <small>(horas extras, adicional noturno, comissões etc.)</small></label><div class="cma-13-money"><span>R$</span><input id="cma-13-medias" type="number" min="0" step="0.01" value="0"></div>
          <div class="cma-13-duplo"><div><label>Avos de 13º</label><input id="cma-13-avos" type="number" min="1" max="12" step="1" value="12" data-cma-default="12"></div><div><label>Dependentes para IRRF</label><input id="cma-13-dependentes" type="number" min="0" step="1" value="0"></div></div>
          <label>1ª parcela já paga <small>(informe o valor efetivamente adiantado)</small></label><div class="cma-13-money"><span>R$</span><input id="cma-13-primeira" type="number" min="0" step="0.01" value="0"></div>
          <label>Pensão alimentícia dedutível do 13º <small>(opcional)</small></label><div class="cma-13-money"><span>R$</span><input id="cma-13-pensao" type="number" min="0" step="0.01" value="0"></div>
          <label>Outras deduções legais do 13º <small>(opcional)</small></label><div class="cma-13-money"><span>R$</span><input id="cma-13-outras-deducoes" type="number" min="0" step="0.01" value="0"></div>
        </div>

        <div class="cma-13-resultados">
          <div class="cma-13-resumo"><span>2ª parcela / saldo líquido estimado</span><strong id="cma-13-total">R$ 0,00</strong><em id="cma-13-resumo-sub">13º bruto total: R$ 0,00</em></div>
          <div class="cma-13-card"><h4>2. Composição do 13º</h4><div id="cma-13-proventos"></div></div>
          <div class="cma-13-card"><h4>3. Descontos e saldo</h4><div id="cma-13-descontos"></div></div>
          <div class="cma-13-card cma-13-memoria"><h4>4. Memória tributária</h4><div><span>Base limitada do INSS</span><strong id="cma-13-inss-base">R$ 0,00</strong></div><div><span>Método usado no IRRF</span><strong id="cma-13-ir-metodo">—</strong></div><div><span>Base do IRRF</span><strong id="cma-13-ir-base">R$ 0,00</strong></div><div><span>IR antes da redução 2026</span><strong id="cma-13-ir-antes">R$ 0,00</strong></div><div><span>Redução do IR 2026</span><strong id="cma-13-ir-reducao">R$ 0,00</strong></div></div>
        </div>
      </div>
      <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm mt-4"><strong class="text-amber-900 block mb-1">Importante</strong><p class="text-amber-950 text-sm leading-relaxed">O valor final do 13º pode exigir ajuste de médias variáveis, diferenças salariais, afastamentos, faltas que interfiram nos avos e outras particularidades. A ferramenta é uma estimativa para conferência e planejamento.</p></div>`;

    const base=document.getElementById('baselegal');if(base)main.insertBefore(section,base);else main.appendChild(section);
    const st=document.createElement('style');st.id='cma-13-style';st.textContent=`.cma-13-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:18px}.cma-13-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 6px 18px rgba(15,23,42,.05)}.cma-13-card h4{margin:0 0 15px;color:#172554;font-size:17px;font-weight:800}.cma-13-form label{display:block;margin:13px 0 6px;color:#334155;font-size:14px;font-weight:700}.cma-13-form label small{color:#94a3b8;font-weight:500}.cma-13-form input{width:100%;padding:10px 11px;border:1px solid #cbd5e1;border-radius:9px;outline:none;background:#fff}.cma-13-form input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.cma-13-duplo{display:grid;grid-template-columns:1fr 1fr;gap:10px}.cma-13-money{display:flex;border:1px solid #cbd5e1;border-radius:9px;overflow:hidden}.cma-13-money:focus-within{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.cma-13-money span{padding:10px;background:#f8fafc;border-right:1px solid #e2e8f0;color:#64748b;font-weight:700}.cma-13-money input{border:0;border-radius:0;box-shadow:none!important}.cma-13-resultados{display:flex;flex-direction:column;gap:14px}.cma-13-resumo{padding:22px;border-radius:14px;background:linear-gradient(135deg,#061a46,#082f7d);color:#fff}.cma-13-resumo span{display:block;color:#bfdbfe;font-size:13px}.cma-13-resumo strong{display:block;margin-top:5px;font-size:34px}.cma-13-resumo em{display:block;margin-top:7px;color:#fbbf24;font-size:12px;font-style:normal;font-weight:700}.cma-13-linha{display:flex;justify-content:space-between;gap:18px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#475569;font-size:13px}.cma-13-linha strong{color:#1e293b;white-space:nowrap}.cma-13-total-linha{margin-top:4px;padding-top:11px;border-top:2px solid #dbeafe;border-bottom:0;font-weight:800}.cma-13-memoria>div{display:flex;justify-content:space-between;gap:15px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:12.5px}.cma-13-memoria>div:last-child{border-bottom:0}.cma-13-memoria strong{color:#172554;text-align:right}@media(max-width:800px){.cma-13-grid{grid-template-columns:1fr}.cma-13-duplo{grid-template-columns:1fr}.cma-13-form input{font-size:16px}.cma-13-resumo strong{font-size:30px}.cma-13-linha{font-size:14px}}`;document.head.appendChild(st);
    section.querySelectorAll('input').forEach(i=>i.addEventListener('input',recalcular));
    if(window.CMAFerramentas)CMAFerramentas.adicionarAcoes('calculadora-decimo-terceiro',{onLimpar:recalcular});
    recalcular();
    if(location.hash==='#calculadora-decimo-terceiro')setTimeout(()=>showSection('calculadora-decimo-terceiro',botao),80);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criar);else criar();
})();
