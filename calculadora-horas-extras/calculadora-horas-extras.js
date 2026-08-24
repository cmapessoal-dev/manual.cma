(function(){
  function moeda(v){return (Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function numero(id){const e=document.getElementById(id);if(!e)return 0;const n=parseFloat(String(e.value||'0').replace(',','.'));return Number.isFinite(n)?n:0;}
  function horasDec(h,m){return Math.max(0,numero(h))+Math.max(0,numero(m))/60;}
  function linha(label,valor,classe=''){return `<div class="cma-he-linha ${classe}"><span>${label}</span><strong>${moeda(valor)}</strong></div>`;}
  function competenciaAtual(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;}
  function contarCalendario(valor){
    if(!/^\d{4}-\d{2}$/.test(valor||''))return null;
    const [ano,mesTxt]=valor.split('-').map(Number),mes=mesTxt-1,totalDias=new Date(ano,mes+1,0).getDate();
    const feriados=typeof getCmaHolidays==='function'?getCmaHolidays(ano):{};
    let uteis=0,dsr=0;
    for(let dia=1;dia<=totalDias;dia++){
      const data=new Date(ano,mes,dia),semana=data.getDay();
      const chave=typeof dateKey==='function'?dateKey(ano,mes,dia):`${ano}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
      const feriado=!!feriados[chave];
      if(semana===0||feriado)dsr++;
      else if(semana>=1&&semana<=6)uteis++;
    }
    return {uteis,dsr};
  }
  function preencherCalendario(){
    const comp=document.getElementById('cma-he-competencia');if(!comp)return;
    const c=contarCalendario(comp.value);if(!c)return;
    const u=document.getElementById('cma-he-uteis'),d=document.getElementById('cma-he-dsr-dias');
    if(u)u.value=c.uteis;if(d)d.value=c.dsr;
    recalcular();
  }
  function recalcular(){
    const salario=numero('cma-he-salario'),outras=numero('cma-he-outras'),divisor=Math.max(1,numero('cma-he-divisor')||220),base=salario+outras,valorHora=base/divisor;
    const h1=horasDec('cma-he-h1','cma-he-m1'),p1=Math.max(0,numero('cma-he-p1')),h2=horasDec('cma-he-h2','cma-he-m2'),p2=Math.max(0,numero('cma-he-p2'));
    const he1=valorHora*h1*(1+p1/100),he2=valorHora*h2*(1+p2/100),totalHE=he1+he2;
    const uteis=Math.max(0,numero('cma-he-uteis')),dsrDias=Math.max(0,numero('cma-he-dsr-dias')),dsr=uteis>0?totalHE/uteis*dsrDias:0,total=totalHE+dsr;
    document.getElementById('cma-he-total').textContent=moeda(total);
    document.getElementById('cma-he-resumo-sub').textContent=`Horas extras: ${moeda(totalHE)} • DSR: ${moeda(dsr)}`;
    document.getElementById('cma-he-composicao').innerHTML=linha(`HE ${p1}% — ${h1.toFixed(2).replace('.',',')} h`,he1)+linha(`HE ${p2}% — ${h2.toFixed(2).replace('.',',')} h`,he2)+linha('Total de horas extras',totalHE,'cma-he-total-linha');
    document.getElementById('cma-he-dsr').innerHTML=linha('DSR sobre horas extras',dsr)+linha('Total geral',total,'cma-he-total-linha');
    document.getElementById('cma-he-base').textContent=moeda(base);
    document.getElementById('cma-he-valor-hora').textContent=moeda(valorHora);
    document.getElementById('cma-he-divisor-memoria').textContent=divisor.toLocaleString('pt-BR');
    document.getElementById('cma-he-formula-dsr').textContent=uteis>0?`${moeda(totalHE)} ÷ ${uteis} × ${dsrDias}`:'Informe dias úteis e DSR';
  }
  function criar(){
    const menu=document.getElementById('manual-menu'),main=document.querySelector('#manual-conteudo main');if(!menu||!main||document.getElementById('calculadora-horas-extras'))return;
    const b=document.createElement('button');b.type='button';b.setAttribute('onclick',"showSection('calculadora-horas-extras', this)");b.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';b.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><path d="M19 5l2-2"/></svg> Horas Extras e DSR';const ant=typeof getMenuButton==='function'?getMenuButton('calculadora-decimo-terceiro'):null;if(ant)ant.insertAdjacentElement('afterend',b);else menu.appendChild(b);
    const s=document.createElement('section');s.id='calculadora-horas-extras';s.className='manual-section hidden fade-in';s.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4"><div><h3 class="text-2xl font-bold text-blue-950">Calculadora de Horas Extras e DSR</h3><p class="text-sm text-gray-500 mt-1">Cálculo de horas extras com percentuais editáveis e DSR automático pela competência.</p></div><button type="button" onclick="toggleExplainer('exp-calculadora-he')" class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold hover:bg-slate-300 shrink-0">Como calculamos?</button></div>
      <div id="exp-calculadora-he" class="hidden bg-slate-100 border border-slate-300 p-3 rounded mb-4 text-xs text-slate-700 space-y-2"><p><strong>Valor da hora:</strong> base salarial informada ÷ divisor mensal.</p><p><strong>Hora extra:</strong> valor da hora × quantidade de horas × (1 + percentual adicional).</p><p><strong>DSR:</strong> total das horas extras ÷ dias úteis × dias de repouso. Pela competência escolhida, a ferramenta considera como dias úteis segunda a sábado, excluindo feriados do calendário do Manual; domingos e feriados compõem os dias de DSR, sem duplicar feriado que caia no domingo.</p><p><strong>Ajustes:</strong> os campos de dias úteis e DSR permanecem editáveis para situações específicas de escala ou norma coletiva.</p></div>
      <div class="cma-he-grid"><div class="cma-he-card cma-he-form"><h4>1. Dados para o cálculo</h4>
        <div class="cma-he-duplo"><div><label>Empresa</label><input id="cma-he-empresa" type="text" placeholder="Nome da empresa"></div><div><label>Nome do empregado</label><input id="cma-he-empregado" type="text" placeholder="Nome do empregado"></div></div>
        <label>Salário base</label><div class="cma-he-money"><span>R$</span><input id="cma-he-salario" type="number" min="0" step="0.01" value="0"></div>
        <label>Outras parcelas salariais que integram a hora <small>(opcional)</small></label><div class="cma-he-money"><span>R$</span><input id="cma-he-outras" type="number" min="0" step="0.01" value="0"></div>
        <div class="cma-he-duplo"><div><label>Divisor mensal</label><input id="cma-he-divisor" type="number" min="1" step="1" value="220" data-cma-default="220"></div><div><label>Competência do DSR</label><input id="cma-he-competencia" type="month"></div></div>
        <div class="cma-he-bloco"><strong>Faixa de horas extras 1</strong><div class="cma-he-triplo"><div><label>Horas</label><input id="cma-he-h1" type="number" min="0" step="1" value="0"></div><div><label>Minutos</label><input id="cma-he-m1" type="number" min="0" max="59" step="1" value="0"></div><div><label>Adicional %</label><input id="cma-he-p1" type="number" min="0" step="1" value="50" data-cma-default="50"></div></div></div>
        <div class="cma-he-bloco"><strong>Faixa de horas extras 2</strong><div class="cma-he-triplo"><div><label>Horas</label><input id="cma-he-h2" type="number" min="0" step="1" value="0"></div><div><label>Minutos</label><input id="cma-he-m2" type="number" min="0" max="59" step="1" value="0"></div><div><label>Adicional %</label><input id="cma-he-p2" type="number" min="0" step="1" value="100" data-cma-default="100"></div></div></div>
        <div class="cma-he-duplo"><div><label>Dias úteis <small>(automático)</small></label><input id="cma-he-uteis" type="number" min="0" step="1" value="0"></div><div><label>Domingos/feriados <small>(automático)</small></label><input id="cma-he-dsr-dias" type="number" min="0" step="1" value="0"></div></div>
      </div><div class="cma-he-resultados"><div class="cma-he-resumo"><span>Total estimado — HE + DSR</span><strong id="cma-he-total">R$ 0,00</strong><em id="cma-he-resumo-sub">Horas extras: R$ 0,00 • DSR: R$ 0,00</em></div><div class="cma-he-card"><h4>2. Horas extras</h4><div id="cma-he-composicao"></div></div><div class="cma-he-card"><h4>3. DSR e total</h4><div id="cma-he-dsr"></div></div><div class="cma-he-card cma-he-memoria"><h4>4. Memória do cálculo</h4><div><span>Base salarial da hora</span><strong id="cma-he-base">R$ 0,00</strong></div><div><span>Valor da hora normal</span><strong id="cma-he-valor-hora">R$ 0,00</strong></div><div><span>Divisor mensal</span><strong id="cma-he-divisor-memoria">220</strong></div><div><span>Fórmula do DSR</span><strong id="cma-he-formula-dsr">Informe dias úteis e DSR</strong></div></div></div></div>
      <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm mt-4"><strong class="text-amber-900 block mb-1">Aplicação da orientação</strong><p class="text-amber-950 text-sm leading-relaxed">Percentual de hora extra, divisor, parcelas que integram a base e forma de cálculo do DSR podem variar conforme jornada, categoria e norma coletiva. Os dias automáticos seguem o calendário do Manual e podem ser ajustados manualmente quando necessário.</p></div>`;
    const base=document.getElementById('baselegal');if(base)main.insertBefore(s,base);else main.appendChild(s);
    const st=document.createElement('style');st.id='cma-he-style';st.textContent=`.cma-he-grid{display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);gap:18px}.cma-he-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 6px 18px rgba(15,23,42,.05)}.cma-he-card h4{margin:0 0 15px;color:#172554;font-size:17px;font-weight:800}.cma-he-form label{display:block;margin:12px 0 6px;color:#334155;font-size:14px;font-weight:700}.cma-he-form label small{color:#94a3b8;font-weight:500}.cma-he-form input{width:100%;padding:10px 11px;border:1px solid #cbd5e1;border-radius:9px;outline:none}.cma-he-form input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.cma-he-duplo{display:grid;grid-template-columns:1fr 1fr;gap:10px}.cma-he-triplo{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}.cma-he-money{display:flex;border:1px solid #cbd5e1;border-radius:9px;overflow:hidden}.cma-he-money span{padding:10px;background:#f8fafc;border-right:1px solid #e2e8f0;color:#64748b;font-weight:700}.cma-he-money input{border:0;border-radius:0;box-shadow:none!important}.cma-he-bloco{margin-top:16px;padding:13px;border:1px solid #e2e8f0;border-radius:11px;background:#f8fafc}.cma-he-bloco>strong{color:#172554;font-size:13px}.cma-he-resultados{display:flex;flex-direction:column;gap:14px}.cma-he-resumo{padding:22px;border-radius:14px;background:linear-gradient(135deg,#061a46,#082f7d);color:#fff}.cma-he-resumo span{display:block;color:#bfdbfe;font-size:13px}.cma-he-resumo strong{display:block;margin-top:5px;font-size:34px}.cma-he-resumo em{display:block;margin-top:7px;color:#fbbf24;font-size:12px;font-style:normal;font-weight:700}.cma-he-linha{display:flex;justify-content:space-between;gap:18px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#475569;font-size:13px}.cma-he-linha strong{color:#1e293b;white-space:nowrap}.cma-he-total-linha{margin-top:4px;padding-top:11px;border-top:2px solid #dbeafe;border-bottom:0;font-weight:800}.cma-he-memoria>div{display:flex;justify-content:space-between;gap:15px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:12.5px}.cma-he-memoria strong{color:#172554;text-align:right}@media(max-width:800px){.cma-he-grid{grid-template-columns:1fr}.cma-he-duplo,.cma-he-triplo{grid-template-columns:1fr}.cma-he-form input{font-size:16px}.cma-he-resumo strong{font-size:30px}}`;document.head.appendChild(st);
    const competencia=s.querySelector('#cma-he-competencia');competencia.value=competenciaAtual();competencia.addEventListener('change',preencherCalendario);
    s.querySelectorAll('input:not(#cma-he-competencia)').forEach(i=>i.addEventListener('input',recalcular));
    preencherCalendario();
    if(window.CMAFerramentas)CMAFerramentas.adicionarAcoes('calculadora-horas-extras',{onLimpar:()=>{competencia.value=competenciaAtual();preencherCalendario();}});
    if(window.CMAExportadorCalculadoras)CMAExportadorCalculadoras.aplicar();if(location.hash==='#calculadora-horas-extras')setTimeout(()=>showSection('calculadora-horas-extras',b),80);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criar);else criar();
})();
