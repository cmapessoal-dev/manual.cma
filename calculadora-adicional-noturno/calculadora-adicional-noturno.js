(function(){
  function moeda(v){return (Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function numero(id){const e=document.getElementById(id);if(!e)return 0;const n=parseFloat(String(e.value||'0').replace(',','.'));return Number.isFinite(n)?n:0;}
  function minutosHora(v){if(!v)return null;const [h,m]=v.split(':').map(Number);return h*60+m;}
  function fmtMin(m){m=Math.max(0,Math.round(m));return `${Math.floor(m/60)}h ${String(m%60).padStart(2,'0')}min`;}
  function fmtHoras(v){return `${(Number(v)||0).toFixed(2).replace('.',',')} h`;}
  function overlap(a,b,c,d){return Math.max(0,Math.min(b,d)-Math.max(a,c));}
  function linha(label,valor,classe=''){return `<div class="cma-an-linha ${classe}"><span>${label}</span><strong>${valor}</strong></div>`;}

  function jornada(){
    const ei=minutosHora(document.getElementById('cma-an-entrada')?.value),si=minutosHora(document.getElementById('cma-an-saida')?.value);
    if(ei===null||si===null)return null;
    let entrada=ei,saida=si;if(saida<=entrada)saida+=1440;
    let intervalo=null;const ii=minutosHora(document.getElementById('cma-an-int-inicio')?.value),fi=minutosHora(document.getElementById('cma-an-int-fim')?.value);
    if(ii!==null&&fi!==null){let ini=ii,fim=fi;while(ini<entrada)ini+=1440;while(fim<=ini)fim+=1440;intervalo=[ini,fim];}
    const trabalhado=(a,b)=>{let x=overlap(entrada,saida,a,b);if(intervalo)x-=overlap(intervalo[0],intervalo[1],Math.max(entrada,a),Math.min(saida,b));return Math.max(0,x);};
    let noturno=0,prorrogacao=0,janelaCompleta=false;
    for(let d=-1;d<=2;d++){
      const ini=d*1440+1320,fim=d*1440+1740;
      noturno+=trabalhado(ini,fim);
      if(!janelaCompleta&&entrada<=ini&&saida>fim){janelaCompleta=true;if(document.getElementById('cma-an-prorrogacao')?.checked)prorrogacao=trabalhado(fim,saida);}
    }
    return {entrada,saida,intervalo,noturno,prorrogacao,janelaCompleta,totalReal:noturno+prorrogacao};
  }

  function recalcular(){
    const j=jornada();if(!j)return;
    const salario=numero('cma-an-salario'),outras=numero('cma-an-outras'),divisor=Math.max(1,numero('cma-an-divisor')||220),percentual=Math.max(0,numero('cma-an-percentual')||20);
    const base=salario+outras,valorHora=base/divisor,horasNoturnas=j.noturno/52.5,horasProrrogadas=j.prorrogacao/52.5,totalHoras=horasNoturnas+horasProrrogadas,adicional=valorHora*totalHoras*(percentual/100);
    document.getElementById('cma-an-total').textContent=moeda(adicional);
    document.getElementById('cma-an-resumo-sub').textContent=`${fmtHoras(totalHoras)} noturnas computadas • adicional de ${percentual.toLocaleString('pt-BR')}%`;
    document.getElementById('cma-an-composicao').innerHTML=
      linha('Período noturno real (22h às 5h)',fmtMin(j.noturno))+
      linha('Horas noturnas reduzidas',fmtHoras(horasNoturnas))+
      linha('Prorrogação após 5h considerada',fmtMin(j.prorrogacao))+
      linha('Horas reduzidas da prorrogação',fmtHoras(horasProrrogadas))+
      linha('Total de horas noturnas computadas',fmtHoras(totalHoras),'cma-an-total-linha');
    document.getElementById('cma-an-valores').innerHTML=
      linha('Valor da hora normal',moeda(valorHora))+
      linha(`Adicional noturno (${percentual.toLocaleString('pt-BR')}%)`,moeda(adicional),'cma-an-total-linha');
    document.getElementById('cma-an-base').textContent=moeda(base);
    document.getElementById('cma-an-divisor-memoria').textContent=divisor.toLocaleString('pt-BR');
    document.getElementById('cma-an-hora-reduzida').textContent='52min30s';
    document.getElementById('cma-an-prorrogacao-status').textContent=document.getElementById('cma-an-prorrogacao')?.checked?(j.janelaCompleta?'Aplicada quando cabível':'Jornada não abrange 22h–5h integralmente'):'Desconsiderada';
  }

  function criar(){
    const menu=document.getElementById('manual-menu'),main=document.querySelector('#manual-conteudo main');if(!menu||!main||document.getElementById('calculadora-adicional-noturno'))return;
    const b=document.createElement('button');b.type='button';b.setAttribute('onclick',"showSection('calculadora-adicional-noturno', this)");b.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';b.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9"/></svg> Adicional Noturno';const ant=typeof getMenuButton==='function'?getMenuButton('calculadora-horas-extras'):null;if(ant)ant.insertAdjacentElement('afterend',b);else menu.appendChild(b);
    const s=document.createElement('section');s.id='calculadora-adicional-noturno';s.className='manual-section hidden fade-in';s.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4"><div><h3 class="text-2xl font-bold text-blue-950">Calculadora de Adicional Noturno</h3><p class="text-sm text-gray-500 mt-1">Cálculo do trabalho noturno urbano com hora reduzida e prorrogação após as 5h.</p></div><button type="button" onclick="toggleExplainer('exp-calculadora-an')" class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold hover:bg-slate-300 shrink-0">Como calculamos?</button></div>
      <div id="exp-calculadora-an" class="hidden bg-slate-100 border border-slate-300 p-3 rounded mb-4 text-xs text-slate-700 space-y-2"><p><strong>Período noturno urbano:</strong> 22h às 5h.</p><p><strong>Hora reduzida:</strong> cada hora noturna é computada como 52min30s.</p><p><strong>Adicional:</strong> percentual informado sobre o valor da hora normal; o padrão legal urbano é 20%.</p><p><strong>Prorrogação:</strong> quando marcada, a ferramenta considera o período após as 5h se a jornada tiver abrangido integralmente o período noturno. Confira a CCT/ACT aplicável.</p></div>
      <div class="cma-an-grid"><div class="cma-an-card cma-an-form"><h4>1. Dados para o cálculo</h4>
        <div class="cma-an-duplo"><div><label>Empresa</label><input id="cma-an-empresa" type="text" placeholder="Nome da empresa"></div><div><label>Nome do empregado</label><input id="cma-an-empregado" type="text" placeholder="Nome do empregado"></div></div>
        <label>Salário base</label><div class="cma-an-money"><span>R$</span><input id="cma-an-salario" type="number" min="0" step="0.01" value="0"></div>
        <label>Outras parcelas salariais que integram a hora <small>(opcional)</small></label><div class="cma-an-money"><span>R$</span><input id="cma-an-outras" type="number" min="0" step="0.01" value="0"></div>
        <div class="cma-an-duplo"><div><label>Divisor mensal</label><input id="cma-an-divisor" type="number" min="1" step="1" value="220" data-cma-default="220"></div><div><label>Adicional noturno (%)</label><input id="cma-an-percentual" type="number" min="0" step="0.01" value="20" data-cma-default="20"></div></div>
        <div class="cma-an-bloco"><strong>Jornada</strong><div class="cma-an-duplo"><div><label>Entrada</label><input id="cma-an-entrada" type="time" value="22:00"></div><div><label>Saída</label><input id="cma-an-saida" type="time" value="05:00"></div></div></div>
        <div class="cma-an-bloco"><strong>Intervalo</strong><div class="cma-an-duplo"><div><label>Início do intervalo</label><input id="cma-an-int-inicio" type="time"></div><div><label>Fim do intervalo</label><input id="cma-an-int-fim" type="time"></div></div><small>Deixe em branco se não houver intervalo dentro da jornada informada.</small></div>
        <label class="cma-an-check"><input id="cma-an-prorrogacao" type="checkbox" checked> Considerar prorrogação após as 5h quando a jornada abranger integralmente 22h–5h</label>
      </div><div class="cma-an-resultados"><div class="cma-an-resumo"><span>Adicional noturno estimado</span><strong id="cma-an-total">R$ 0,00</strong><em id="cma-an-resumo-sub">0,00 h noturnas computadas</em></div><div class="cma-an-card"><h4>2. Apuração das horas</h4><div id="cma-an-composicao"></div></div><div class="cma-an-card"><h4>3. Valor do adicional</h4><div id="cma-an-valores"></div></div><div class="cma-an-card cma-an-memoria"><h4>4. Memória do cálculo</h4><div><span>Base salarial da hora</span><strong id="cma-an-base">R$ 0,00</strong></div><div><span>Divisor mensal</span><strong id="cma-an-divisor-memoria">220</strong></div><div><span>Hora noturna reduzida</span><strong id="cma-an-hora-reduzida">52min30s</strong></div><div><span>Prorrogação</span><strong id="cma-an-prorrogacao-status">—</strong></div></div></div></div>
      <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm mt-4"><strong class="text-amber-900 block mb-1">Aplicação da orientação</strong><p class="text-amber-950 text-sm leading-relaxed">A ferramenta utiliza como padrão o trabalho noturno urbano da CLT. Percentual, período noturno e regras de prorrogação podem ser modificados por legislação específica ou norma coletiva. Confira a CCT/ACT e a atividade do empregado antes do cálculo definitivo.</p></div>`;
    const base=document.getElementById('baselegal');if(base)main.insertBefore(s,base);else main.appendChild(s);
    const st=document.createElement('style');st.id='cma-an-style';st.textContent=`.cma-an-grid{display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);gap:18px}.cma-an-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 6px 18px rgba(15,23,42,.05)}.cma-an-card h4{margin:0 0 15px;color:#172554;font-size:17px;font-weight:800}.cma-an-form label{display:block;margin:12px 0 6px;color:#334155;font-size:14px;font-weight:700}.cma-an-form label small,.cma-an-bloco small{color:#94a3b8;font-weight:500}.cma-an-form input{width:100%;padding:10px 11px;border:1px solid #cbd5e1;border-radius:9px;outline:none}.cma-an-form input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.cma-an-duplo{display:grid;grid-template-columns:1fr 1fr;gap:10px}.cma-an-money{display:flex;border:1px solid #cbd5e1;border-radius:9px;overflow:hidden}.cma-an-money span{padding:10px;background:#f8fafc;border-right:1px solid #e2e8f0;color:#64748b;font-weight:700}.cma-an-money input{border:0;border-radius:0;box-shadow:none!important}.cma-an-bloco{margin-top:16px;padding:13px;border:1px solid #e2e8f0;border-radius:11px;background:#f8fafc}.cma-an-bloco>strong{color:#172554;font-size:13px}.cma-an-check{display:flex!important;align-items:flex-start;gap:9px;margin-top:16px!important;padding:12px;border-radius:9px;background:#eff6ff;color:#1e3a8a!important}.cma-an-check input{width:auto!important;margin-top:2px}.cma-an-resultados{display:flex;flex-direction:column;gap:14px}.cma-an-resumo{padding:22px;border-radius:14px;background:linear-gradient(135deg,#061a46,#082f7d);color:#fff}.cma-an-resumo span{display:block;color:#bfdbfe;font-size:13px}.cma-an-resumo strong{display:block;margin-top:5px;font-size:34px}.cma-an-resumo em{display:block;margin-top:7px;color:#fbbf24;font-size:12px;font-style:normal;font-weight:700}.cma-an-linha{display:flex;justify-content:space-between;gap:18px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#475569;font-size:13px}.cma-an-linha strong{color:#1e293b;white-space:nowrap}.cma-an-total-linha{margin-top:4px;padding-top:11px;border-top:2px solid #dbeafe;border-bottom:0;font-weight:800}.cma-an-memoria>div{display:flex;justify-content:space-between;gap:15px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:12.5px}.cma-an-memoria strong{color:#172554;text-align:right}@media(max-width:800px){.cma-an-grid{grid-template-columns:1fr}.cma-an-duplo{grid-template-columns:1fr}.cma-an-form input{font-size:16px}.cma-an-resumo strong{font-size:30px}}`;document.head.appendChild(st);
    s.querySelectorAll('input').forEach(i=>{i.addEventListener('input',recalcular);i.addEventListener('change',recalcular);});if(window.CMAFerramentas)CMAFerramentas.adicionarAcoes('calculadora-adicional-noturno',{onLimpar:()=>{document.getElementById('cma-an-entrada').value='22:00';document.getElementById('cma-an-saida').value='05:00';document.getElementById('cma-an-int-inicio').value='';document.getElementById('cma-an-int-fim').value='';document.getElementById('cma-an-prorrogacao').checked=true;recalcular();}});recalcular();if(window.CMAExportadorCalculadoras)CMAExportadorCalculadoras.aplicar();if(location.hash==='#calculadora-adicional-noturno')setTimeout(()=>showSection('calculadora-adicional-noturno',b),80);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criar);else criar();
})();
