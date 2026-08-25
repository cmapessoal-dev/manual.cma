(function(){
  if(window.CMACalculadoraTempoParcial)return;

  const moeda=v=>(Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const numero=id=>{const e=document.getElementById(id);if(!e)return 0;const n=parseFloat(String(e.value||'0').replace(',','.'));return Number.isFinite(n)?n:0;};

  function recalcular(){
    const salario=Math.max(0,numero('cma-tp-salario'));
    const horasSemanais=Math.max(0,numero('cma-tp-horas-semanais'));
    const horasMensais=horasSemanais*5;
    const valorHora=salario/220;
    const proporcional=valorHora*horasMensais;

    const total=document.getElementById('cma-tp-total');
    const horas=document.getElementById('cma-tp-horas-mensais');
    const hora=document.getElementById('cma-tp-valor-hora');
    const memoria=document.getElementById('cma-tp-memoria');
    const alerta=document.getElementById('cma-tp-alerta');
    if(total)total.textContent=moeda(proporcional);
    if(horas)horas.textContent=`${horasMensais.toLocaleString('pt-BR',{maximumFractionDigits:2})} horas`;
    if(hora)hora.textContent=moeda(valorHora);
    if(memoria)memoria.textContent=`${moeda(salario)} ÷ 220 × ${horasMensais.toLocaleString('pt-BR',{maximumFractionDigits:2})} = ${moeda(proporcional)}`;
    if(alerta)alerta.classList.toggle('hidden',!(horasSemanais>30));
  }

  function criar(){
    const menu=document.getElementById('manual-menu'),main=document.querySelector('#manual-conteudo main');
    if(!menu||!main||document.getElementById('calculadora-tempo-parcial'))return false;

    const b=document.createElement('button');
    b.type='button';
    b.setAttribute('onclick',"showSection('calculadora-tempo-parcial', this)");
    b.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';
    b.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><path d="M7 19h10"/></svg> Salário — Tempo Parcial';
    const ant=typeof getMenuButton==='function'?getMenuButton('calculadora-pro-labore'):null;
    if(ant)ant.insertAdjacentElement('afterend',b);else menu.appendChild(b);

    const s=document.createElement('section');
    s.id='calculadora-tempo-parcial';
    s.className='manual-section hidden fade-in';
    s.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
        <div><h3 class="text-2xl font-bold text-blue-950">Calculadora de Salário — Tempo Parcial</h3><p class="text-sm text-gray-500 mt-1">Calcule o salário proporcional conforme a jornada semanal reduzida.</p></div>
        <button type="button" onclick="toggleExplainer('exp-calculadora-tp')" class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold hover:bg-slate-300 shrink-0">Como calculamos?</button>
      </div>
      <div id="exp-calculadora-tp" class="hidden bg-slate-100 border border-slate-300 p-3 rounded mb-4 text-sm text-slate-700 space-y-2">
        <p><strong>1.</strong> A jornada semanal informada é multiplicada por 5 para chegar ao equivalente mensal.</p>
        <p><strong>2.</strong> O salário mensal de referência é dividido pelo divisor 220 para encontrar o valor-hora.</p>
        <p><strong>3.</strong> O valor-hora é multiplicado pelas horas mensais proporcionais.</p>
        <p><strong>Fórmula:</strong> salário integral ÷ 220 × (horas semanais × 5).</p>
      </div>
      <div class="cma-tp-grid">
        <div class="cma-tp-card cma-tp-form">
          <h4>Dados para o cálculo</h4>
          <label>Salário mensal de referência — jornada integral</label>
          <div class="cma-tp-money"><span>R$</span><input id="cma-tp-salario" type="number" min="0" step="0.01" value="0" placeholder="Ex.: 2200,00"></div>
          <label>Horas de trabalho por semana</label>
          <div class="cma-tp-horas"><input id="cma-tp-horas-semanais" type="number" min="0" max="30" step="0.5" value="26"><span>horas/semana</span></div>
          <div class="cma-tp-exemplo">Exemplo: <strong>26 horas semanais × 5 = 130 horas mensais.</strong></div>
          <div id="cma-tp-alerta" class="hidden cma-tp-alerta"><strong>Atenção:</strong> jornada acima de 30 horas semanais não se enquadra no limite geral do regime de tempo parcial do art. 58-A da CLT.</div>
        </div>
        <div class="cma-tp-resultados">
          <div class="cma-tp-resumo"><span>Salário proporcional estimado</span><strong id="cma-tp-total">R$ 0,00</strong></div>
          <div class="cma-tp-card"><h4>Memória de cálculo</h4>
            <div class="cma-tp-linha"><span>Horas mensais proporcionais</span><strong id="cma-tp-horas-mensais">130 horas</strong></div>
            <div class="cma-tp-linha"><span>Valor da hora de referência</span><strong id="cma-tp-valor-hora">R$ 0,00</strong></div>
            <div class="cma-tp-formula"><span>Fórmula aplicada</span><strong id="cma-tp-memoria">R$ 0,00 ÷ 220 × 130 = R$ 0,00</strong></div>
          </div>
        </div>
      </div>
      <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r mt-4"><strong class="text-blue-950 block mb-1">Referência do cálculo</strong><p class="text-blue-950 text-sm leading-relaxed">A ferramenta parte de um salário de referência para jornada integral de 44 horas semanais, cujo divisor mensal é 220. O salário do empregado em tempo parcial é calculado proporcionalmente à jornada semanal informada. Antes da contratação, também deve ser observado o piso salarial e a norma coletiva aplicável.</p></div>`;

    const base=document.getElementById('baselegal');
    if(base)main.insertBefore(s,base);else main.appendChild(s);

    const st=document.createElement('style');
    st.id='cma-tp-style';
    st.textContent=`.cma-tp-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:18px}.cma-tp-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 6px 18px rgba(15,23,42,.05)}.cma-tp-card h4{margin:0 0 15px;color:#172554;font-size:17px;font-weight:800}.cma-tp-form label{display:block;margin:14px 0 7px;color:#334155;font-size:14px;font-weight:700}.cma-tp-form input{width:100%;padding:11px 12px;border:0;outline:none;background:#fff;font-size:15px}.cma-tp-money,.cma-tp-horas{display:flex;align-items:center;border:1px solid #cbd5e1;border-radius:9px;overflow:hidden}.cma-tp-money:focus-within,.cma-tp-horas:focus-within{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.cma-tp-money span,.cma-tp-horas span{padding:11px;background:#f8fafc;color:#64748b;font-weight:700;white-space:nowrap}.cma-tp-money span{border-right:1px solid #e2e8f0}.cma-tp-horas span{border-left:1px solid #e2e8f0}.cma-tp-exemplo{margin-top:13px;padding:10px 12px;border-radius:9px;background:#f8fafc;color:#475569;font-size:13px;line-height:1.5}.cma-tp-alerta{margin-top:12px;padding:10px 12px;border-radius:9px;background:#fffbeb;color:#78350f;font-size:13px;line-height:1.5}.cma-tp-resultados{display:flex;flex-direction:column;gap:14px}.cma-tp-resumo{padding:22px;border-radius:14px;background:linear-gradient(135deg,#061a46,#082f7d);color:#fff}.cma-tp-resumo span{display:block;color:#bfdbfe;font-size:13px}.cma-tp-resumo strong{display:block;margin-top:5px;font-size:34px}.cma-tp-linha{display:flex;justify-content:space-between;gap:18px;padding:10px 0;border-bottom:1px solid #f1f5f9;color:#475569;font-size:14px}.cma-tp-linha strong{color:#172554;white-space:nowrap}.cma-tp-formula{margin-top:14px;padding:12px;border-radius:10px;background:#f8fafc}.cma-tp-formula span{display:block;color:#64748b;font-size:12px;font-weight:700}.cma-tp-formula strong{display:block;margin-top:5px;color:#172554;font-size:14px;line-height:1.5}@media(max-width:800px){.cma-tp-grid{grid-template-columns:1fr}.cma-tp-form input{font-size:16px}.cma-tp-resumo strong{font-size:30px}}`;
    document.head.appendChild(st);

    s.querySelectorAll('input').forEach(i=>i.addEventListener('input',recalcular));
    if(window.CMAFerramentas)CMAFerramentas.adicionarAcoes('calculadora-tempo-parcial',{onLimpar:recalcular});
    recalcular();
    if(window.CMAExportadorCalculadoras)CMAExportadorCalculadoras.aplicar();
    if(location.hash==='#calculadora-tempo-parcial')setTimeout(()=>showSection('calculadora-tempo-parcial',b),80);
    return true;
  }

  window.CMACalculadoraTempoParcial={criar,recalcular};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criar);else criar();
})();