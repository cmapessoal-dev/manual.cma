(function(){
  function min(v){if(!v)return null;const [h,m]=v.split(':').map(Number);return h*60+m;}
  function dur(ini,fim){if(ini===null||fim===null)return 0;let f=fim;if(f<=ini)f+=1440;return f-ini;}
  function fmt(m){m=Math.max(0,Math.round(m||0));return `${Math.floor(m/60)}h ${String(m%60).padStart(2,'0')}min`;}
  function linha(label,valor,classe=''){return `<div class="cma-jd-linha ${classe}"><span>${label}</span><strong>${valor}</strong></div>`;}
  function status(texto,tipo){return `<div class="cma-jd-status ${tipo}">${texto}</div>`;}
  function numero(id,padrao=0){const e=document.getElementById(id);const n=parseFloat(e?.value||'');return Number.isFinite(n)?n:padrao;}
  function sim(id){return document.querySelector(`#calculadora-jornada [data-jd-toggle="${id}"] button.ativo`)?.dataset.valor==='sim';}
  function recalcular(){
    const entrada=min(document.getElementById('cma-jd-entrada')?.value),saida=min(document.getElementById('cma-jd-saida')?.value);
    if(entrada===null||saida===null)return;
    const temIntervalo=sim('intervalo');
    const intIni=temIntervalo?min(document.getElementById('cma-jd-int-inicio')?.value):null;
    const intFim=temIntervalo?min(document.getElementById('cma-jd-int-fim')?.value):null;
    const jornadaBruta=dur(entrada,saida);
    let intervalo=0;if(intIni!==null&&intFim!==null)intervalo=dur(intIni,intFim);
    const trabalhado=Math.max(0,jornadaBruta-intervalo);
    const dias=Math.max(1,Math.min(7,numero('cma-jd-dias',5)));
    const escala12=sim('12x36');
    const semanal=escala12?null:trabalhado*dias;
    const limiteDiario=escala12?720:480;
    const excessoDia=Math.max(0,trabalhado-limiteDiario);
    const excessoSemana=semanal===null?0:Math.max(0,semanal-2640);

    let minimoIntervalo=0;if(trabalhado>360)minimoIntervalo=60;else if(trabalhado>240)minimoIntervalo=15;
    const intrajornadaOk=intervalo>=minimoIntervalo;

    const trabalhaSeguinte=sim('seguinte');
    const proxEntrada=trabalhaSeguinte?min(document.getElementById('cma-jd-proxima-entrada')?.value):null;
    let descanso=null;if(proxEntrada!==null){let fimAbs=saida;if(fimAbs<=entrada)fimAbs+=1440;let prox=proxEntrada;while(prox<=fimAbs)prox+=1440;descanso=prox-fimAbs;}
    const interOk=descanso===null?null:descanso>=660;

    const principal=document.getElementById('cma-jd-total');principal.textContent=fmt(trabalhado);
    document.getElementById('cma-jd-resumo-sub').textContent=escala12?`Escala 12x36 • intervalo ${fmt(intervalo)}`:`${dias} dia(s)/semana • ${fmt(semanal)} semanais`;
    document.getElementById('cma-jd-apuracao').innerHTML=
      linha('Período entre entrada e saída',fmt(jornadaBruta))+linha('(-) Intervalo',fmt(intervalo))+linha('Tempo efetivamente trabalhado',fmt(trabalhado),'cma-jd-total-linha')+
      (semanal!==null?linha(`Carga semanal estimada (${dias} dia(s))`,fmt(semanal)):'');

    let analise='';
    if(escala12){analise+=status(trabalhado<=720?'Jornada diária dentro de 12h na escala informada.':'Jornada superior a 12h na escala 12x36.',''+(trabalhado<=720?'ok':'erro'));}
    else{
      analise+=status(excessoDia===0?'Sem excesso sobre 8h diárias.':`Excesso diário estimado: ${fmt(excessoDia)}.`,excessoDia===0?'ok':'atencao');
      analise+=status(excessoSemana===0?'Carga semanal dentro de 44h.':`Excesso semanal estimado: ${fmt(excessoSemana)}.`,excessoSemana===0?'ok':'atencao');
    }
    if(minimoIntervalo===0)analise+=status('A jornada informada não exige intervalo intrajornada mínimo pela regra geral.','ok');
    else analise+=status(intrajornadaOk?`Intervalo informado atende ao mínimo geral de ${fmt(minimoIntervalo)}.`:`Intervalo abaixo do mínimo geral de ${fmt(minimoIntervalo)}.`,intrajornadaOk?'ok':'erro');
    if(interOk!==null)analise+=status(interOk?`Interjornada de ${fmt(descanso)}: atende às 11h mínimas.`:`Interjornada de ${fmt(descanso)}: inferior às 11h mínimas.`,interOk?'ok':'erro');
    document.getElementById('cma-jd-analise').innerHTML=analise;
    document.getElementById('cma-jd-memoria').innerHTML=
      linha('Jornada bruta',fmt(jornadaBruta))+linha('Intervalo descontado',fmt(intervalo))+linha('Jornada líquida',fmt(trabalhado))+
      linha('Referência diária',escala12?'12h — regime 12x36':'8h — regra geral')+
      linha('Referência semanal',escala12?'Regime especial 12x36':'44h — regra geral')+
      linha('Intervalo mínimo geral',fmt(minimoIntervalo))+
      linha('Interjornada mínima','11h consecutivas');
  }
  function toggle(id,simInicial,aoMudar){const wrap=document.querySelector(`#calculadora-jornada [data-jd-toggle="${id}"]`);if(!wrap)return;const bs=[...wrap.querySelectorAll('button')];function set(v){bs.forEach(b=>b.classList.toggle('ativo',b.dataset.valor===(v?'sim':'nao')));const det=wrap.querySelector('.cma-jd-detalhe');if(det)det.hidden=!v;aoMudar?.(v);recalcular();}bs.forEach(b=>b.addEventListener('click',()=>set(b.dataset.valor==='sim')));set(simInicial);}
  function criar(){
    const menu=document.getElementById('manual-menu'),main=document.querySelector('#manual-conteudo main');if(!menu||!main||document.getElementById('calculadora-jornada'))return;
    const b=document.createElement('button');b.type='button';b.setAttribute('onclick',"showSection('calculadora-jornada', this)");b.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';b.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> Calculadora de Jornada';
    const ant=typeof getMenuButton==='function'?getMenuButton('calculadora-folha'):null;if(ant)ant.insertAdjacentElement('afterend',b);else menu.appendChild(b);
    const s=document.createElement('section');s.id='calculadora-jornada';s.className='manual-section hidden fade-in';s.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4"><div><h3 class="text-2xl font-bold text-blue-950">Calculadora de Jornada e Escala</h3><p class="text-sm text-gray-500 mt-1">Analise jornada diária, carga semanal, intervalos e descanso entre jornadas.</p></div></div>
      <div class="cma-jd-grid"><div class="cma-jd-card cma-jd-form"><h4>1. Dados da jornada</h4>
        <div class="cma-jd-duplo"><div><label>Empresa</label><input id="cma-jd-empresa" type="text" placeholder="Nome da empresa"></div><div><label>Empregado</label><input id="cma-jd-empregado" type="text" placeholder="Nome do empregado"></div></div>
        <div class="cma-jd-duplo"><div><label>Entrada</label><input id="cma-jd-entrada" type="time" value="08:00"></div><div><label>Saída</label><input id="cma-jd-saida" type="time" value="17:00"></div></div>
        <div class="cma-jd-toggle" data-jd-toggle="intervalo"><div class="cma-jd-cab"><strong>Possui intervalo?</strong><div><button type="button" data-valor="sim">Sim</button><button type="button" data-valor="nao">Não</button></div></div><div class="cma-jd-detalhe"><div class="cma-jd-duplo"><div><label>Início do intervalo</label><input id="cma-jd-int-inicio" type="time" value="12:00"></div><div><label>Fim do intervalo</label><input id="cma-jd-int-fim" type="time" value="13:00"></div></div></div></div>
        <div class="cma-jd-toggle" data-jd-toggle="12x36"><div class="cma-jd-cab"><strong>É escala 12x36?</strong><div><button type="button" data-valor="sim">Sim</button><button type="button" data-valor="nao">Não</button></div></div></div>
        <div id="cma-jd-semanal"><label>Dias trabalhados por semana</label><input id="cma-jd-dias" type="number" min="1" max="7" step="1" value="5" data-cma-default="5"></div>
        <div class="cma-jd-toggle" data-jd-toggle="seguinte"><div class="cma-jd-cab"><strong>Trabalha novamente no dia seguinte?</strong><div><button type="button" data-valor="sim">Sim</button><button type="button" data-valor="nao">Não</button></div></div><div class="cma-jd-detalhe"><label>Entrada da próxima jornada</label><input id="cma-jd-proxima-entrada" type="time" value="08:00"></div></div>
      </div><div class="cma-jd-resultados"><div class="cma-jd-resumo"><span>Jornada efetiva diária</span><strong id="cma-jd-total">0h 00min</strong><em id="cma-jd-resumo-sub">—</em></div><div class="cma-jd-card"><h4>2. Apuração</h4><div id="cma-jd-apuracao"></div></div><div class="cma-jd-card"><h4>3. Análise da jornada</h4><div id="cma-jd-analise" class="cma-jd-status-lista"></div></div><details class="cma-jd-card cma-jd-como"><summary>Como calculamos?</summary><div id="cma-jd-memoria" class="cma-jd-memoria"></div><p class="cma-jd-nota">A análise usa a regra geral da CLT. CCT/ACT, categorias especiais, compensações, banco de horas e jornadas especiais podem alterar os limites aplicáveis.</p></details></div></div>
      <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm mt-4"><strong class="text-amber-900 block mb-1">Importante</strong><p class="text-amber-950 text-sm leading-relaxed">Na regra geral, a duração normal é de até 8 horas diárias e 44 semanais. Entre jornadas, o descanso mínimo é de 11 horas. Jornadas superiores a 6 horas exigem, em regra, intervalo mínimo de 1 hora; acima de 4 e até 6 horas, 15 minutos. Normas coletivas e regimes especiais devem ser conferidos antes da conclusão definitiva.</p></div>`;
    const base=document.getElementById('baselegal');if(base)main.insertBefore(s,base);else main.appendChild(s);
    const st=document.createElement('style');st.id='cma-jd-style';st.textContent=`.cma-jd-grid{display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);gap:18px}.cma-jd-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 6px 18px rgba(15,23,42,.05)}.cma-jd-card h4{margin:0 0 15px;color:#172554;font-size:17px;font-weight:800}.cma-jd-form label{display:block;margin:12px 0 6px;color:#334155;font-size:14px;font-weight:700}.cma-jd-form input{width:100%;padding:10px 11px;border:1px solid #cbd5e1;border-radius:9px;outline:none}.cma-jd-duplo{display:grid;grid-template-columns:1fr 1fr;gap:10px}.cma-jd-toggle{margin-top:12px;border:1px solid #e2e8f0;border-radius:11px;overflow:hidden}.cma-jd-cab{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;background:#f8fafc}.cma-jd-cab strong{color:#172554;font-size:13.5px}.cma-jd-cab>div{display:flex;gap:5px}.cma-jd-cab button{min-width:48px;padding:6px 10px;border:1px solid #cbd5e1;border-radius:7px;background:#fff;color:#64748b;font-size:12px;font-weight:800}.cma-jd-cab button.ativo[data-valor=sim]{background:#172554;color:#fff;border-color:#172554}.cma-jd-cab button.ativo[data-valor=nao]{background:#e2e8f0;color:#334155}.cma-jd-detalhe{padding:0 12px 12px}.cma-jd-resultados{display:flex;flex-direction:column;gap:14px}.cma-jd-resumo{padding:22px;border-radius:14px;background:linear-gradient(135deg,#061a46,#082f7d);color:#fff}.cma-jd-resumo span{display:block;color:#bfdbfe;font-size:13px}.cma-jd-resumo strong{display:block;margin-top:5px;font-size:34px}.cma-jd-resumo em{display:block;margin-top:7px;color:#fbbf24;font-size:12px;font-style:normal;font-weight:700}.cma-jd-linha{display:flex;justify-content:space-between;gap:18px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#475569;font-size:13px}.cma-jd-linha strong{color:#1e293b;text-align:right}.cma-jd-total-linha{margin-top:4px;padding-top:11px;border-top:2px solid #dbeafe;font-weight:800}.cma-jd-status-lista{display:flex;flex-direction:column;gap:8px}.cma-jd-status{padding:10px 12px;border-radius:9px;font-size:12.5px;font-weight:700}.cma-jd-status.ok{background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0}.cma-jd-status.atencao{background:#fffbeb;color:#92400e;border:1px solid #fde68a}.cma-jd-status.erro{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}.cma-jd-como summary{cursor:pointer;color:#172554;font-weight:800}.cma-jd-memoria{margin-top:12px}.cma-jd-nota{margin-top:12px;color:#64748b;font-size:11.5px;line-height:1.5}@media(max-width:800px){.cma-jd-grid{grid-template-columns:1fr}.cma-jd-duplo{grid-template-columns:1fr}.cma-jd-cab{align-items:flex-start;flex-direction:column}.cma-jd-cab>div{width:100%}.cma-jd-cab button{flex:1}.cma-jd-form input{font-size:16px}}`;document.head.appendChild(st);
    s.querySelectorAll('input').forEach(i=>{i.addEventListener('input',recalcular);i.addEventListener('change',recalcular);});
    toggle('intervalo',true);toggle('12x36',false,v=>{document.getElementById('cma-jd-semanal').hidden=v;});toggle('seguinte',true);
    recalcular();if(window.CMAFerramentas)CMAFerramentas.adicionarAcoes('calculadora-jornada',{onLimpar:recalcular});if(window.CMAExportadorCalculadoras)CMAExportadorCalculadoras.aplicar();if(location.hash==='#calculadora-jornada')setTimeout(()=>showSection('calculadora-jornada',b),80);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criar);else criar();
})();
