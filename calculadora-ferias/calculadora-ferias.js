(function(){
  function moeda(v){return (Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function numero(id){const el=document.getElementById(id);if(!el)return 0;const n=parseFloat(String(el.value||'0').replace(',','.'));return Number.isFinite(n)?n:0;}
  function inteiro(id){return Math.max(0,Math.floor(numero(id)));}
  function linha(label,valor,classe=''){return `<div class="cma-ferias-linha ${classe}"><span>${label}</span><strong>${moeda(valor)}</strong></div>`;}
  function recalcular(){
    if(!window.CMATributos2026)return;
    const salario=numero('cma-ferias-salario'),medias=numero('cma-ferias-medias'),dias=Math.min(30,Math.max(1,inteiro('cma-ferias-dias')||30));
    const baseRemuneracao=salario+medias,ferias=baseRemuneracao*(dias/30),terco=ferias/3,bruto=ferias+terco;
    const inss=CMATributos2026.calcularINSS(bruto);
    const ir=CMATributos2026.calcularIRRF({rendimentos:bruto,inss:inss.valor,dependentes:inteiro('cma-ferias-dependentes'),pensao:numero('cma-ferias-pensao'),outrasDeducoes:numero('cma-ferias-outras-deducoes')});
    const liquido=Math.max(0,bruto-inss.valor-ir.valor);
    document.getElementById('cma-ferias-total').textContent=moeda(liquido);
    document.getElementById('cma-ferias-bruto-resumo').textContent=`Bruto: ${moeda(bruto)}`;
    document.getElementById('cma-ferias-proventos').innerHTML=linha('Remuneração de férias',ferias)+linha('1/3 constitucional',terco)+linha('Total bruto',bruto,'cma-ferias-total-linha');
    document.getElementById('cma-ferias-descontos').innerHTML=linha('INSS',inss.valor)+linha('IRRF',ir.valor)+linha('Total de descontos',inss.valor+ir.valor,'cma-ferias-total-linha');
    document.getElementById('cma-ferias-ir-metodo').textContent=ir.metodo;
    document.getElementById('cma-ferias-ir-base').textContent=moeda(ir.base);
    document.getElementById('cma-ferias-ir-antes').textContent=moeda(ir.impostoAntesReducao);
    document.getElementById('cma-ferias-ir-reducao').textContent=moeda(ir.reducao);
    document.getElementById('cma-ferias-inss-base').textContent=moeda(inss.baseLimitada);
  }
  function criar(){
    const menu=document.getElementById('manual-menu'),main=document.querySelector('#manual-conteudo main');if(!menu||!main||document.getElementById('calculadora-ferias'))return;
    const botao=document.createElement('button');botao.type='button';botao.setAttribute('onclick',"showSection('calculadora-ferias', this)");botao.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';botao.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg> Calculadora de Férias';
    const custo=typeof getMenuButton==='function'?getMenuButton('custo-empregado'):null;if(custo)custo.insertAdjacentElement('afterend',botao);else menu.appendChild(botao);
    const section=document.createElement('section');section.id='calculadora-ferias';section.className='manual-section hidden fade-in';section.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4"><div><h3 class="text-2xl font-bold text-blue-950">Calculadora de Férias</h3><p class="text-sm text-gray-500 mt-1">Estimativa de férias gozadas com INSS e IRRF — parâmetros 2026.</p></div><button type="button" onclick="toggleExplainer('exp-calculadora-ferias')" class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold hover:bg-slate-300 shrink-0">Como calculamos?</button></div>
      <div id="exp-calculadora-ferias" class="hidden bg-slate-100 border border-slate-300 p-3 rounded mb-4 text-xs text-slate-700 space-y-2"><p><strong>Remuneração de férias:</strong> salário base + médias informadas, proporcionalmente aos dias de férias.</p><p><strong>1/3 constitucional:</strong> um terço da remuneração de férias.</p><p><strong>INSS:</strong> cálculo progressivo pelas faixas de 2026, limitado ao teto previdenciário.</p><p><strong>IRRF:</strong> calculado separadamente sobre as férias, comparando deduções legais com o desconto simplificado e aplicando a redução mensal de 2026 quando cabível.</p></div>
      <div class="cma-ferias-grid">
        <div class="cma-ferias-card cma-ferias-form"><h4>1. Dados para o cálculo</h4>
          <div class="cma-ferias-duplo"><div><label>Empresa</label><input id="cma-ferias-empresa" type="text" placeholder="Nome da empresa"></div><div><label>Nome do empregado</label><input id="cma-ferias-empregado" type="text" placeholder="Nome do empregado"></div></div>
          <label>Salário base</label><div class="cma-ferias-money"><span>R$</span><input id="cma-ferias-salario" type="number" min="0" step="0.01" value="0"></div>
          <label>Médias salariais para férias <small>(horas extras, comissões etc.)</small></label><div class="cma-ferias-money"><span>R$</span><input id="cma-ferias-medias" type="number" min="0" step="0.01" value="0"></div>
          <div class="cma-ferias-duplo"><div><label>Dias de férias</label><input id="cma-ferias-dias" type="number" min="1" max="30" step="1" value="30" data-cma-default="30"></div><div><label>Dependentes para IRRF</label><input id="cma-ferias-dependentes" type="number" min="0" step="1" value="0"></div></div>
          <label>Pensão alimentícia dedutível <small>(opcional)</small></label><div class="cma-ferias-money"><span>R$</span><input id="cma-ferias-pensao" type="number" min="0" step="0.01" value="0"></div>
          <label>Outras deduções legais de IRRF <small>(opcional)</small></label><div class="cma-ferias-money"><span>R$</span><input id="cma-ferias-outras-deducoes" type="number" min="0" step="0.01" value="0"></div>
        </div>
        <div class="cma-ferias-resultados">
          <div class="cma-ferias-resumo"><span>Líquido estimado das férias</span><strong id="cma-ferias-total">R$ 0,00</strong><em id="cma-ferias-bruto-resumo">Bruto: R$ 0,00</em></div>
          <div class="cma-ferias-card"><h4>2. Proventos</h4><div id="cma-ferias-proventos"></div></div>
          <div class="cma-ferias-card"><h4>3. Descontos</h4><div id="cma-ferias-descontos"></div></div>
          <div class="cma-ferias-card cma-ferias-memoria"><h4>4. Memória tributária</h4><div><span>Base limitada do INSS</span><strong id="cma-ferias-inss-base">R$ 0,00</strong></div><div><span>Método usado no IRRF</span><strong id="cma-ferias-ir-metodo">—</strong></div><div><span>Base do IRRF</span><strong id="cma-ferias-ir-base">R$ 0,00</strong></div><div><span>IR antes da redução 2026</span><strong id="cma-ferias-ir-antes">R$ 0,00</strong></div><div><span>Redução do IR 2026</span><strong id="cma-ferias-ir-reducao">R$ 0,00</strong></div></div>
        </div>
      </div>
      <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm mt-4"><strong class="text-amber-900 block mb-1">Escopo desta primeira versão</strong><p class="text-amber-950 text-sm leading-relaxed">A calculadora estima férias gozadas e os descontos de INSS e IRRF. Abono pecuniário, adiantamento de 13º, férias em dobro e situações especiais serão incluídos em etapas próprias para manter as incidências corretamente separadas.</p></div>`;
    const base=document.getElementById('baselegal');if(base)main.insertBefore(section,base);else main.appendChild(section);
    const st=document.createElement('style');st.id='cma-ferias-style';st.textContent=`.cma-ferias-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:18px}.cma-ferias-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 6px 18px rgba(15,23,42,.05)}.cma-ferias-card h4{margin:0 0 15px;color:#172554;font-size:17px;font-weight:800}.cma-ferias-form label{display:block;margin:13px 0 6px;color:#334155;font-size:14px;font-weight:700}.cma-ferias-form label small{color:#94a3b8;font-weight:500}.cma-ferias-form input{width:100%;padding:10px 11px;border:1px solid #cbd5e1;border-radius:9px;outline:none;background:#fff}.cma-ferias-form input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.cma-ferias-duplo{display:grid;grid-template-columns:1fr 1fr;gap:10px}.cma-ferias-money{display:flex;border:1px solid #cbd5e1;border-radius:9px;overflow:hidden}.cma-ferias-money:focus-within{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.cma-ferias-money span{padding:10px;background:#f8fafc;border-right:1px solid #e2e8f0;color:#64748b;font-weight:700}.cma-ferias-money input{border:0;border-radius:0;box-shadow:none!important}.cma-ferias-resultados{display:flex;flex-direction:column;gap:14px}.cma-ferias-resumo{padding:22px;border-radius:14px;background:linear-gradient(135deg,#061a46,#082f7d);color:#fff}.cma-ferias-resumo span{display:block;color:#bfdbfe;font-size:13px}.cma-ferias-resumo strong{display:block;margin-top:5px;font-size:34px}.cma-ferias-resumo em{display:block;margin-top:7px;color:#fbbf24;font-size:12px;font-style:normal;font-weight:700}.cma-ferias-linha{display:flex;justify-content:space-between;gap:18px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#475569;font-size:13px}.cma-ferias-linha strong{color:#1e293b;white-space:nowrap}.cma-ferias-total-linha{margin-top:4px;padding-top:11px;border-top:2px solid #dbeafe;border-bottom:0;font-weight:800}.cma-ferias-memoria>div{display:flex;justify-content:space-between;gap:15px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:12.5px}.cma-ferias-memoria>div:last-child{border-bottom:0}.cma-ferias-memoria strong{color:#172554;text-align:right}@media(max-width:800px){.cma-ferias-grid{grid-template-columns:1fr}.cma-ferias-duplo{grid-template-columns:1fr}.cma-ferias-form input{font-size:16px}.cma-ferias-resumo strong{font-size:30px}.cma-ferias-linha{font-size:14px}}`;document.head.appendChild(st);
    section.querySelectorAll('input').forEach(i=>i.addEventListener('input',recalcular));
    if(window.CMAFerramentas)CMAFerramentas.adicionarAcoes('calculadora-ferias',{onLimpar:recalcular});
    recalcular();
    if(location.hash==='#calculadora-ferias')setTimeout(()=>showSection('calculadora-ferias',botao),80);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criar);else criar();
})();
