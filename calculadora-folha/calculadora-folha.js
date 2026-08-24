(function(){
  const F=()=>window.CMAFerramentas;
  const T=()=>window.CMATributos2026;
  function numero(id){const e=document.getElementById(id);if(!e)return 0;const n=parseFloat(String(e.value||'0').replace(',','.'));return Number.isFinite(n)?n:0;}
  function moeda(v){return (Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function horas(h,m){return Math.max(0,numero(h))+Math.max(0,numero(m))/60;}
  function linha(label,valor,classe=''){return `<div class="cma-folha-linha ${classe}"><span>${label}</span><strong>${moeda(valor)}</strong></div>`;}
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
    const comp=document.getElementById('cma-folha-competencia');if(!comp)return;
    const c=contarCalendario(comp.value);if(c){document.getElementById('cma-folha-uteis').value=c.uteis;document.getElementById('cma-folha-dsr-dias').value=c.dsr;}
    recalcular();
  }
  function recalcular(){
    if(!T())return;
    const salario=Math.max(0,numero('cma-folha-salario'));
    const fixas=Math.max(0,numero('cma-folha-fixas'));
    const outrosTrib=Math.max(0,numero('cma-folha-outros-trib'));
    const premio=Math.max(0,numero('cma-folha-premio'));
    const divisor=Math.max(1,numero('cma-folha-divisor')||220);
    const divisorDia=Math.max(1,numero('cma-folha-divisor-dia')||30);
    const baseHora=salario+fixas,valorHora=baseHora/divisor;
    const he50=valorHora*horas('cma-folha-he50-h','cma-folha-he50-m')*1.5;
    const he100=valorHora*horas('cma-folha-he100-h','cma-folha-he100-m')*2;
    const totalHE=he50+he100;
    const uteis=Math.max(0,numero('cma-folha-uteis')),dsrDias=Math.max(0,numero('cma-folha-dsr-dias'));
    const dsrHE=uteis>0?totalHE/uteis*dsrDias:0;
    const horasNot=horas('cma-folha-not-h','cma-folha-not-m'),percNot=Math.max(0,numero('cma-folha-not-pct'));
    const adicionalNoturno=valorHora*horasNot*(percNot/100);
    const diasFalta=Math.max(0,numero('cma-folha-faltas'));
    const descontoFaltas=(salario/divisorDia)*diasFalta;
    const descontoAtrasos=(salario/divisor)*horas('cma-folha-atraso-h','cma-folha-atraso-m');
    const dsrPerdidos=Math.max(0,numero('cma-folha-dsr-perdidos'));
    const descontoDSR=(salario/divisorDia)*dsrPerdidos;
    const descontosJornada=descontoFaltas+descontoAtrasos+descontoDSR;
    const tributavelAntes=salario+fixas+outrosTrib+he50+he100+dsrHE+adicionalNoturno;
    const remuneracaoTributavel=Math.max(0,tributavelAntes-descontosJornada);
    const dependentes=Math.max(0,Math.floor(numero('cma-folha-dependentes')));
    const pensao=Math.max(0,numero('cma-folha-pensao'));
    const outrosDescontos=Math.max(0,numero('cma-folha-outros-desc'));
    const inss=T().calcularINSS(remuneracaoTributavel);
    const irrf=T().calcularIRRF({rendimentos:remuneracaoTributavel,inss:inss.valor,dependentes,pensao});
    const totalProventos=tributavelAntes+premio;
    const liquido=Math.max(0,totalProventos-descontosJornada-inss.valor-irrf.valor-pensao-outrosDescontos);
    document.getElementById('cma-folha-liquido').textContent=moeda(liquido);
    document.getElementById('cma-folha-resumo-sub').textContent=`Bruto: ${moeda(totalProventos)} • INSS: ${moeda(inss.valor)} • IRRF: ${moeda(irrf.valor)}`;
    document.getElementById('cma-folha-proventos').innerHTML=
      linha('Salário base',salario)+linha('Parcelas salariais fixas',fixas)+linha('Outros proventos tributáveis',outrosTrib)+linha('Horas extras 50%',he50)+linha('Horas extras 100%',he100)+linha('DSR sobre horas extras',dsrHE)+linha(`Adicional noturno (${percNot}%)`,adicionalNoturno)+linha('Prêmio sem incidência',premio)+linha('Total de proventos',totalProventos,'cma-folha-total-linha');
    document.getElementById('cma-folha-descontos').innerHTML=
      linha(`Faltas (${diasFalta.toLocaleString('pt-BR')} dia(s))`,descontoFaltas)+linha('Atrasos',descontoAtrasos)+linha(`DSR perdido (${dsrPerdidos.toLocaleString('pt-BR')} dia(s))`,descontoDSR)+linha('INSS',inss.valor)+linha('IRRF',irrf.valor)+linha('Pensão alimentícia',pensao)+linha('Outros descontos',outrosDescontos)+linha('Líquido estimado',liquido,'cma-folha-total-linha');
    document.getElementById('cma-folha-base-hora').textContent=moeda(baseHora);
    document.getElementById('cma-folha-valor-hora').textContent=moeda(valorHora);
    document.getElementById('cma-folha-rem-trib').textContent=moeda(remuneracaoTributavel);
    document.getElementById('cma-folha-base-inss').textContent=moeda(inss.baseLimitada);
    document.getElementById('cma-folha-inss').textContent=moeda(inss.valor);
    document.getElementById('cma-folha-ir-metodo').textContent=irrf.metodo;
    document.getElementById('cma-folha-ir-deducao').textContent=moeda(irrf.deducaoUsada);
    document.getElementById('cma-folha-ir-base').textContent=moeda(irrf.base);
    document.getElementById('cma-folha-ir-antes').textContent=moeda(irrf.impostoAntesReducao);
    document.getElementById('cma-folha-ir-reducao').textContent=moeda(irrf.reducao);
    document.getElementById('cma-folha-dsr-formula').textContent=uteis>0?`${moeda(totalHE)} ÷ ${uteis} × ${dsrDias}`:'Informe dias úteis e DSR';
  }
  function criar(){
    const menu=document.getElementById('manual-menu'),main=document.querySelector('#manual-conteudo main');
    if(!menu||!main||document.getElementById('calculadora-folha'))return;
    const b=document.createElement('button');b.type='button';b.setAttribute('onclick',"showSection('calculadora-folha', this)");b.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';b.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10M7 12h4M7 16h4M15 12v4"/></svg> Simulador de Folha';
    const ant=typeof getMenuButton==='function'?getMenuButton('calculadora-faltas-atrasos'):null;if(ant)ant.insertAdjacentElement('afterend',b);else menu.appendChild(b);
    const s=document.createElement('section');s.id='calculadora-folha';s.className='manual-section hidden fade-in';s.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4"><div><h3 class="text-2xl font-bold text-blue-950">Simulador de Folha de Pagamento</h3><p class="text-sm text-gray-500 mt-1">Simulação mensal com proventos, variáveis, faltas, atrasos, INSS, IRRF e salário líquido.</p></div><button type="button" onclick="toggleExplainer('exp-calculadora-folha')" class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold hover:bg-slate-300 shrink-0">Como calculamos?</button></div>
      <div id="exp-calculadora-folha" class="hidden bg-slate-100 border border-slate-300 p-3 rounded mb-4 text-xs text-slate-700 space-y-2"><p><strong>Remuneração tributável:</strong> salário e demais parcelas tributáveis, acrescidos das variáveis e reduzidos pelos descontos de faltas, atrasos e DSR.</p><p><strong>INSS:</strong> cálculo progressivo conforme as faixas vigentes em 2026, respeitando o teto previdenciário.</p><p><strong>IRRF:</strong> a ferramenta compara deduções legais com o desconto simplificado mensal e utiliza automaticamente a alternativa mais favorável, aplicando também a redução do imposto vigente em 2026.</p><p><strong>Horas extras:</strong> calculadas sobre a base da hora informada e com DSR automático pela competência. O adicional noturno deve ser informado em horas noturnas já apuradas/convertidas; para jornadas complexas, utilize a calculadora específica de Adicional Noturno.</p></div>
      <div class="cma-folha-grid"><div class="cma-folha-card cma-folha-form"><h4>1. Dados da folha</h4>
        <div class="cma-folha-duplo"><div><label>Empresa</label><input id="cma-folha-empresa" type="text" placeholder="Nome da empresa"></div><div><label>Nome do empregado</label><input id="cma-folha-empregado" type="text" placeholder="Nome do empregado"></div></div>
        <div class="cma-folha-duplo"><div><label>Competência</label><input id="cma-folha-competencia" type="month"></div><div><label>Salário base</label><div class="cma-folha-money"><span>R$</span><input id="cma-folha-salario" type="number" min="0" step="0.01" value="0"></div></div></div>
        <div class="cma-folha-duplo"><div><label>Parcelas salariais fixas <small>(integram a base da hora)</small></label><div class="cma-folha-money"><span>R$</span><input id="cma-folha-fixas" type="number" min="0" step="0.01" value="0"></div></div><div><label>Outros proventos tributáveis</label><div class="cma-folha-money"><span>R$</span><input id="cma-folha-outros-trib" type="number" min="0" step="0.01" value="0"></div></div></div>
        <div class="cma-folha-triplo"><div><label>Divisor mensal</label><input id="cma-folha-divisor" type="number" min="1" step="1" value="220" data-cma-default="220"></div><div><label>Divisor faltas/DSR</label><input id="cma-folha-divisor-dia" type="number" min="1" step="1" value="30" data-cma-default="30"></div><div><label>Dependentes IRRF</label><input id="cma-folha-dependentes" type="number" min="0" step="1" value="0"></div></div>
        <div class="cma-folha-bloco"><strong>Horas extras</strong><div class="cma-folha-quatro"><div><label>HE 50% — horas</label><input id="cma-folha-he50-h" type="number" min="0" step="1" value="0"></div><div><label>Minutos</label><input id="cma-folha-he50-m" type="number" min="0" max="59" step="1" value="0"></div><div><label>HE 100% — horas</label><input id="cma-folha-he100-h" type="number" min="0" step="1" value="0"></div><div><label>Minutos</label><input id="cma-folha-he100-m" type="number" min="0" max="59" step="1" value="0"></div></div><div class="cma-folha-duplo"><div><label>Dias úteis <small>(automático)</small></label><input id="cma-folha-uteis" type="number" min="0" step="1" value="0"></div><div><label>Domingos/feriados <small>(automático)</small></label><input id="cma-folha-dsr-dias" type="number" min="0" step="1" value="0"></div></div></div>
        <div class="cma-folha-bloco"><strong>Adicional noturno</strong><div class="cma-folha-triplo"><div><label>Horas noturnas</label><input id="cma-folha-not-h" type="number" min="0" step="1" value="0"></div><div><label>Minutos</label><input id="cma-folha-not-m" type="number" min="0" max="59" step="1" value="0"></div><div><label>Adicional %</label><input id="cma-folha-not-pct" type="number" min="0" step="1" value="20" data-cma-default="20"></div></div></div>
        <div class="cma-folha-bloco"><strong>Faltas, atrasos e DSR</strong><div class="cma-folha-quatro"><div><label>Dias de falta</label><input id="cma-folha-faltas" type="number" min="0" step="1" value="0"></div><div><label>Atraso — horas</label><input id="cma-folha-atraso-h" type="number" min="0" step="1" value="0"></div><div><label>Minutos</label><input id="cma-folha-atraso-m" type="number" min="0" max="59" step="1" value="0"></div><div><label>DSR perdidos</label><input id="cma-folha-dsr-perdidos" type="number" min="0" step="1" value="0"></div></div></div>
        <div class="cma-folha-duplo"><div><label>Prêmio sem incidência <small>(somente quando legalmente caracterizado)</small></label><div class="cma-folha-money"><span>R$</span><input id="cma-folha-premio" type="number" min="0" step="0.01" value="0"></div></div><div><label>Pensão alimentícia</label><div class="cma-folha-money"><span>R$</span><input id="cma-folha-pensao" type="number" min="0" step="0.01" value="0"></div></div></div>
        <label>Outros descontos da folha <small>(VT, VR, convênios etc.)</small></label><div class="cma-folha-money"><span>R$</span><input id="cma-folha-outros-desc" type="number" min="0" step="0.01" value="0"></div>
      </div><div class="cma-folha-resultados"><div class="cma-folha-resumo"><span>Salário líquido estimado</span><strong id="cma-folha-liquido">R$ 0,00</strong><em id="cma-folha-resumo-sub">Bruto: R$ 0,00 • INSS: R$ 0,00 • IRRF: R$ 0,00</em></div><div class="cma-folha-card"><h4>2. Proventos</h4><div id="cma-folha-proventos"></div></div><div class="cma-folha-card"><h4>3. Descontos e líquido</h4><div id="cma-folha-descontos"></div></div><div class="cma-folha-card cma-folha-memoria"><h4>4. Memória tributária</h4><div><span>Base da hora</span><strong id="cma-folha-base-hora">R$ 0,00</strong></div><div><span>Valor da hora normal</span><strong id="cma-folha-valor-hora">R$ 0,00</strong></div><div><span>Remuneração tributável</span><strong id="cma-folha-rem-trib">R$ 0,00</strong></div><div><span>Base limitada do INSS</span><strong id="cma-folha-base-inss">R$ 0,00</strong></div><div><span>INSS do empregado</span><strong id="cma-folha-inss">R$ 0,00</strong></div><div><span>Método do IRRF</span><strong id="cma-folha-ir-metodo">—</strong></div><div><span>Dedução usada no IRRF</span><strong id="cma-folha-ir-deducao">R$ 0,00</strong></div><div><span>Base do IRRF</span><strong id="cma-folha-ir-base">R$ 0,00</strong></div><div><span>IRRF antes da redução 2026</span><strong id="cma-folha-ir-antes">R$ 0,00</strong></div><div><span>Redução do IRRF 2026</span><strong id="cma-folha-ir-reducao">R$ 0,00</strong></div><div><span>Fórmula DSR das horas extras</span><strong id="cma-folha-dsr-formula">—</strong></div></div></div></div>
      <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm mt-4"><strong class="text-amber-900 block mb-1">Simulação para conferência</strong><p class="text-amber-950 text-sm leading-relaxed">A ferramenta estima uma folha mensal comum. Incidências podem variar conforme natureza da rubrica, convenção coletiva, múltiplos vínculos, decisões judiciais e particularidades do empregado. Prêmio sem incidência somente deve ser utilizado quando a verba estiver efetivamente enquadrada nos requisitos legais.</p></div>`;
    const base=document.getElementById('baselegal');if(base)main.insertBefore(s,base);else main.appendChild(s);
    const st=document.createElement('style');st.id='cma-folha-style';st.textContent=`.cma-folha-grid{display:grid;grid-template-columns:minmax(0,1.04fr) minmax(0,.96fr);gap:18px}.cma-folha-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 6px 18px rgba(15,23,42,.05)}.cma-folha-card h4{margin:0 0 15px;color:#172554;font-size:17px;font-weight:800}.cma-folha-form label{display:block;margin:11px 0 6px;color:#334155;font-size:13px;font-weight:700}.cma-folha-form label small{color:#94a3b8;font-weight:500}.cma-folha-form input{width:100%;padding:10px 11px;border:1px solid #cbd5e1;border-radius:9px;outline:none}.cma-folha-form input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.cma-folha-duplo{display:grid;grid-template-columns:1fr 1fr;gap:10px}.cma-folha-triplo{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.cma-folha-quatro{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.cma-folha-money{display:flex;border:1px solid #cbd5e1;border-radius:9px;overflow:hidden}.cma-folha-money span{padding:10px;background:#f8fafc;border-right:1px solid #e2e8f0;color:#64748b;font-weight:700}.cma-folha-money input{border:0;border-radius:0;box-shadow:none!important}.cma-folha-bloco{margin-top:15px;padding:13px;border:1px solid #e2e8f0;border-radius:11px;background:#f8fafc}.cma-folha-bloco>strong{color:#172554;font-size:13px}.cma-folha-resultados{display:flex;flex-direction:column;gap:14px}.cma-folha-resumo{padding:22px;border-radius:14px;background:linear-gradient(135deg,#061a46,#082f7d);color:#fff}.cma-folha-resumo span{display:block;color:#bfdbfe;font-size:13px}.cma-folha-resumo>strong{display:block;margin-top:5px;font-size:34px}.cma-folha-resumo em{display:block;margin-top:7px;color:#fbbf24;font-size:12px;font-style:normal;font-weight:700}.cma-folha-linha{display:flex;justify-content:space-between;gap:18px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#475569;font-size:13px}.cma-folha-linha strong{color:#1e293b;white-space:nowrap}.cma-folha-total-linha{margin-top:4px;padding-top:11px;border-top:2px solid #dbeafe;border-bottom:0;font-weight:800}.cma-folha-memoria>div{display:flex;justify-content:space-between;gap:15px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:12.5px}.cma-folha-memoria strong{color:#172554;text-align:right}@media(max-width:900px){.cma-folha-grid{grid-template-columns:1fr}.cma-folha-quatro{grid-template-columns:1fr 1fr}}@media(max-width:640px){.cma-folha-duplo,.cma-folha-triplo,.cma-folha-quatro{grid-template-columns:1fr}.cma-folha-form input{font-size:16px}.cma-folha-resumo>strong{font-size:30px}}`;document.head.appendChild(st);
    const comp=document.getElementById('cma-folha-competencia');comp.value=competenciaAtual();comp.addEventListener('change',preencherCalendario);
    s.querySelectorAll('input:not(#cma-folha-competencia)').forEach(i=>i.addEventListener('input',recalcular));
    preencherCalendario();
    if(F())F().adicionarAcoes('calculadora-folha',{onLimpar:()=>{comp.value=competenciaAtual();preencherCalendario();}});
    document.dispatchEvent(new CustomEvent('cma:calculadora-folha-pronta'));
  }
  let n=0;(function tentar(){if(document.getElementById('manual-menu')&&document.querySelector('#manual-conteudo main')&&T()){criar();return;}if(++n<50)setTimeout(tentar,150);})();
})();
