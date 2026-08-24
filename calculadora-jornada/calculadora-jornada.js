(function(){
  const DIAS=[['seg','Segunda-feira'],['ter','Terça-feira'],['qua','Quarta-feira'],['qui','Quinta-feira'],['sex','Sexta-feira'],['sab','Sábado'],['dom','Domingo']];
  function min(v){if(!v)return null;const [h,m]=v.split(':').map(Number);return h*60+m;}
  function dur(ini,fim){if(ini===null||fim===null)return 0;let f=fim;if(f<=ini)f+=1440;return f-ini;}
  function fmt(m){m=Math.max(0,Math.round(m||0));return `${Math.floor(m/60)}h ${String(m%60).padStart(2,'0')}min`;}
  function linha(label,valor,classe=''){return `<div class="cma-jd-linha ${classe}"><span>${label}</span><strong>${valor}</strong></div>`;}
  function status(texto,tipo){return `<div class="cma-jd-status ${tipo}">${texto}</div>`;}
  function sim(id){return document.querySelector(`#calculadora-jornada [data-jd-toggle="${id}"] button.ativo`)?.dataset.valor==='sim';}
  function ativo(d){return !!document.getElementById(`cma-jd-${d}-ativo`)?.checked;}
  function dadosDia(d){
    if(!ativo(d))return null;
    const entrada=min(document.getElementById(`cma-jd-${d}-entrada`)?.value),saida=min(document.getElementById(`cma-jd-${d}-saida`)?.value);
    if(entrada===null||saida===null)return null;
    const ii=min(document.getElementById(`cma-jd-${d}-int-inicio`)?.value),fi=min(document.getElementById(`cma-jd-${d}-int-fim`)?.value);
    const bruto=dur(entrada,saida),intervalo=(ii!==null&&fi!==null)?dur(ii,fi):0,trabalhado=Math.max(0,bruto-intervalo);
    let minimo=0;if(trabalhado>360)minimo=60;else if(trabalhado>240)minimo=15;
    return {entrada,saida,bruto,intervalo,trabalhado,minimo,intervaloOk:intervalo>=minimo};
  }
  function replicar(){
    const campos=['entrada','saida','int-inicio','int-fim'];
    const base={};campos.forEach(c=>base[c]=document.getElementById(`cma-jd-seg-${c}`)?.value||'');
    ['ter','qua','qui','sex'].forEach(d=>{const ck=document.getElementById(`cma-jd-${d}-ativo`);if(ck)ck.checked=true;campos.forEach(c=>{const e=document.getElementById(`cma-jd-${d}-${c}`);if(e)e.value=base[c];});});
    recalcular();
  }
  function limparReplicados(){['ter','qua','qui','sex'].forEach(d=>{const ck=document.getElementById(`cma-jd-${d}-ativo`);if(ck)ck.checked=false;});recalcular();}
  function recalcular(){
    const escala12=sim('12x36');
    const dias=DIAS.map(([id,nome])=>({id,nome,d:dadosDia(id)})).filter(x=>x.d);
    let total=0,excessoDiario=0,problemasIntervalo=0;let ap='';
    dias.forEach(x=>{
      total+=x.d.trabalhado;
      const limite=escala12?720:480;
      excessoDiario+=Math.max(0,x.d.trabalhado-limite);
      if(!x.d.intervaloOk)problemasIntervalo++;
      ap+=linha(x.nome,`${fmt(x.d.trabalhado)}${x.d.intervalo?` • intervalo ${fmt(x.d.intervalo)}`:''}`);
    });
    if(!dias.length)ap='<p class="cma-jd-vazio">Selecione pelo menos um dia de trabalho.</p>';
    const excessoSemanal=escala12?0:Math.max(0,total-2640);
    document.getElementById('cma-jd-total').textContent=fmt(total);
    document.getElementById('cma-jd-resumo-sub').textContent=escala12?`${dias.length} plantão(ões) informado(s) • modo 12x36`:`${dias.length} dia(s) trabalhado(s) • referência semanal de 44h`;
    document.getElementById('cma-jd-apuracao').innerHTML=ap+(dias.length?linha('Total semanal informado',fmt(total),'cma-jd-total-linha'):'');
    let analise='';
    if(!dias.length)analise=status('Informe os dias e horários para iniciar a análise.','atencao');
    else{
      analise+=status(excessoDiario===0?(escala12?'Nenhuma jornada informada ultrapassa 12h.':'Nenhuma jornada informada ultrapassa 8h.'):`Excesso diário acumulado estimado: ${fmt(excessoDiario)}.`,excessoDiario===0?'ok':'atencao');
      if(!escala12)analise+=status(excessoSemanal===0?'Carga semanal dentro da referência de 44h.':`Excesso semanal estimado: ${fmt(excessoSemanal)}.`,excessoSemanal===0?'ok':'atencao');
      else analise+=status('Modo 12x36 ativado: não aplicamos a comparação semanal comum de 44h.','ok');
      analise+=status(problemasIntervalo===0?'Intervalos informados atendem à regra geral.':`${problemasIntervalo} dia(s) com intervalo abaixo do mínimo geral.`,problemasIntervalo===0?'ok':'erro');
      for(let i=0;i<dias.length-1;i++){
        const a=dias[i],b=dias[i+1];
        const idxA=DIAS.findIndex(x=>x[0]===a.id),idxB=DIAS.findIndex(x=>x[0]===b.id);
        if(idxB!==idxA+1)continue;
        let fim=a.d.saida;if(fim<=a.d.entrada)fim+=1440;let prox=1440+b.d.entrada;while(prox<=fim)prox+=1440;const descanso=prox-fim;
        analise+=status(descanso>=660?`${a.nome} → ${b.nome}: interjornada de ${fmt(descanso)}.`:`${a.nome} → ${b.nome}: interjornada de ${fmt(descanso)}, abaixo de 11h.`,descanso>=660?'ok':'erro');
      }
    }
    document.getElementById('cma-jd-analise').innerHTML=analise;
    document.getElementById('cma-jd-memoria').innerHTML=
      linha('Referência diária',escala12?'12h — regime 12x36':'8h — regra geral')+
      linha('Referência semanal',escala12?'Não comparada à regra comum de 44h':'44h — regra geral')+
      linha('Intervalo', 'até 4h: sem mínimo geral • acima de 4h até 6h: 15min • acima de 6h: 1h')+
      linha('Interjornada','11h consecutivas entre jornadas');
  }
  function toggle(id,inicial,aoMudar){const wrap=document.querySelector(`#calculadora-jornada [data-jd-toggle="${id}"]`);if(!wrap)return;const bs=[...wrap.querySelectorAll('button')];function set(v){bs.forEach(b=>b.classList.toggle('ativo',b.dataset.valor===(v?'sim':'nao')));aoMudar?.(v);recalcular();}bs.forEach(b=>b.addEventListener('click',()=>set(b.dataset.valor==='sim')));set(inicial);}
  function linhaDia(id,nome,ativoPadrao=false){return `<div class="cma-jd-dia" data-dia="${id}"><div class="cma-jd-dia-topo"><label class="cma-jd-check"><input id="cma-jd-${id}-ativo" type="checkbox" ${ativoPadrao?'checked':''}> <strong>${nome}</strong></label><span class="cma-jd-dia-total" id="cma-jd-${id}-total"></span></div><div class="cma-jd-dia-grid"><div><label>Entrada</label><input id="cma-jd-${id}-entrada" type="time" value="08:00"></div><div><label>Saída</label><input id="cma-jd-${id}-saida" type="time" value="17:00"></div><div><label>Intervalo início</label><input id="cma-jd-${id}-int-inicio" type="time" value="12:00"></div><div><label>Intervalo fim</label><input id="cma-jd-${id}-int-fim" type="time" value="13:00"></div></div></div>`;}
  function criar(){
    const menu=document.getElementById('manual-menu'),main=document.querySelector('#manual-conteudo main');if(!menu||!main||document.getElementById('calculadora-jornada'))return;
    const b=document.createElement('button');b.type='button';b.setAttribute('onclick',"showSection('calculadora-jornada', this)");b.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';b.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> Calculadora de Jornada';
    const ant=typeof getMenuButton==='function'?getMenuButton('calculadora-folha'):null;if(ant)ant.insertAdjacentElement('afterend',b);else menu.appendChild(b);
    const s=document.createElement('section');s.id='calculadora-jornada';s.className='manual-section hidden fade-in';
    s.innerHTML=`<div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4"><div><h3 class="text-2xl font-bold text-blue-950">Calculadora de Jornada e Escala</h3><p class="text-sm text-gray-500 mt-1">Monte a jornada por dia da semana e confira carga diária, semanal, intervalos e interjornada.</p></div></div>
      <div class="cma-jd-grid"><div class="cma-jd-card cma-jd-form"><h4>1. Jornada semanal</h4>
        <div class="cma-jd-duplo"><div><label>Empresa</label><input id="cma-jd-empresa" type="text" placeholder="Nome da empresa"></div><div><label>Empregado</label><input id="cma-jd-empregado" type="text" placeholder="Nome do empregado"></div></div>
        <div class="cma-jd-toggle" data-jd-toggle="12x36"><div class="cma-jd-cab"><div><strong>A jornada é 12x36?</strong><small id="cma-jd-12-status">Modo comum</small></div><div><button type="button" data-valor="sim">Sim</button><button type="button" data-valor="nao">Não</button></div></div></div>
        ${linhaDia('seg','Segunda-feira',true)}
        <div class="cma-jd-toggle" data-jd-toggle="replicar"><div class="cma-jd-cab"><div><strong>Replicar a segunda-feira de terça a sexta?</strong><small>Depois você pode alterar qualquer dia individualmente.</small></div><div><button type="button" data-valor="sim">Sim</button><button type="button" data-valor="nao">Não</button></div></div></div>
        ${linhaDia('ter','Terça-feira',false)}${linhaDia('qua','Quarta-feira',false)}${linhaDia('qui','Quinta-feira',false)}${linhaDia('sex','Sexta-feira',false)}${linhaDia('sab','Sábado',false)}${linhaDia('dom','Domingo',false)}
      </div><div class="cma-jd-resultados"><div class="cma-jd-resumo"><span>Carga semanal informada</span><strong id="cma-jd-total">0h 00min</strong><em id="cma-jd-resumo-sub">—</em></div><div class="cma-jd-card"><h4>2. Apuração por dia</h4><div id="cma-jd-apuracao"></div></div><div class="cma-jd-card"><h4>3. Análise da jornada</h4><div id="cma-jd-analise" class="cma-jd-status-lista"></div></div><details class="cma-jd-card cma-jd-como"><summary>Como calculamos?</summary><div id="cma-jd-memoria" class="cma-jd-memoria"></div><p class="cma-jd-nota">A análise usa a regra geral. CCT/ACT, categorias especiais, compensações, banco de horas e outras jornadas especiais podem alterar os limites aplicáveis.</p></details></div></div>
      <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm mt-4"><strong class="text-amber-900 block mb-1">Importante</strong><p class="text-amber-950 text-sm leading-relaxed">A ferramenta serve para conferência da jornada informada. Regimes especiais e regras coletivas devem ser analisados antes de concluir pela existência de horas extras ou irregularidades.</p></div>`;
    const base=document.getElementById('baselegal');if(base)main.insertBefore(s,base);else main.appendChild(s);
    const st=document.createElement('style');st.id='cma-jd-style';st.textContent=`.cma-jd-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:18px}.cma-jd-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 6px 18px rgba(15,23,42,.05)}.cma-jd-card h4{margin:0 0 15px;color:#172554;font-size:17px;font-weight:800}.cma-jd-form label{display:block;margin:9px 0 5px;color:#334155;font-size:13px;font-weight:700}.cma-jd-form input{width:100%;padding:9px 10px;border:1px solid #cbd5e1;border-radius:8px;outline:none}.cma-jd-duplo{display:grid;grid-template-columns:1fr 1fr;gap:10px}.cma-jd-toggle{margin-top:12px;border:1px solid #e2e8f0;border-radius:11px;overflow:hidden}.cma-jd-cab{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;background:#f8fafc}.cma-jd-cab>div:first-child{display:flex;flex-direction:column;gap:2px}.cma-jd-cab strong{color:#172554;font-size:13.5px}.cma-jd-cab small{color:#64748b;font-size:11px}.cma-jd-cab>div:last-child{display:flex;gap:5px}.cma-jd-cab button{min-width:48px;padding:6px 10px;border:1px solid #cbd5e1;border-radius:7px;background:#fff;color:#64748b;font-size:12px;font-weight:800}.cma-jd-cab button.ativo[data-valor=sim]{background:#172554;color:#fff;border-color:#172554}.cma-jd-cab button.ativo[data-valor=nao]{background:#e2e8f0;color:#334155}.cma-jd-dia{margin-top:10px;padding:12px;border:1px solid #e2e8f0;border-radius:10px;background:#fff}.cma-jd-dia-topo{display:flex;align-items:center;justify-content:space-between}.cma-jd-check{display:flex!important;align-items:center;gap:7px;margin:0!important}.cma-jd-check input{width:auto!important}.cma-jd-dia-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.cma-jd-dia-total{font-size:12px;color:#64748b}.cma-jd-resultados{display:flex;flex-direction:column;gap:14px}.cma-jd-resumo{padding:22px;border-radius:14px;background:linear-gradient(135deg,#061a46,#082f7d);color:#fff}.cma-jd-resumo span{display:block;color:#bfdbfe;font-size:13px}.cma-jd-resumo strong{display:block;margin-top:5px;font-size:34px}.cma-jd-resumo em{display:block;margin-top:7px;color:#fbbf24;font-size:12px;font-style:normal;font-weight:700}.cma-jd-linha{display:flex;justify-content:space-between;gap:18px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#475569;font-size:13px}.cma-jd-linha strong{color:#1e293b;text-align:right}.cma-jd-total-linha{margin-top:4px;padding-top:11px;border-top:2px solid #dbeafe;font-weight:800}.cma-jd-status-lista{display:flex;flex-direction:column;gap:8px}.cma-jd-status{padding:10px 12px;border-radius:9px;font-size:12.5px;font-weight:700}.cma-jd-status.ok{background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0}.cma-jd-status.atencao{background:#fffbeb;color:#92400e;border:1px solid #fde68a}.cma-jd-status.erro{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}.cma-jd-como summary{cursor:pointer;color:#172554;font-weight:800}.cma-jd-memoria{margin-top:12px}.cma-jd-nota,.cma-jd-vazio{margin-top:12px;color:#64748b;font-size:11.5px;line-height:1.5}@media(max-width:950px){.cma-jd-grid{grid-template-columns:1fr}.cma-jd-dia-grid{grid-template-columns:1fr 1fr}}@media(max-width:640px){.cma-jd-duplo,.cma-jd-dia-grid{grid-template-columns:1fr}.cma-jd-cab{align-items:flex-start;flex-direction:column}.cma-jd-cab>div:last-child{width:100%}.cma-jd-cab button{flex:1}.cma-jd-form input{font-size:16px}}`;document.head.appendChild(st);
    s.querySelectorAll('input').forEach(i=>{i.addEventListener('input',()=>{const d=i.id.match(/^cma-jd-(seg|ter|qua|qui|sex|sab|dom)-/);if(d){const x=dadosDia(d[1]);const out=document.getElementById(`cma-jd-${d[1]}-total`);if(out)out.textContent=x?fmt(x.trabalhado):'';}recalcular();});i.addEventListener('change',recalcular);});
    toggle('12x36',false,v=>{const stt=document.getElementById('cma-jd-12-status');if(stt)stt.textContent=v?'Modo 12x36 ativado':'Modo comum';});
    toggle('replicar',false,v=>{if(v)replicar();else limparReplicados();});
    recalcular();
    if(window.CMAFerramentas)CMAFerramentas.adicionarAcoes('calculadora-jornada',{onLimpar:recalcular});
    if(window.CMAExportadorCalculadoras)CMAExportadorCalculadoras.aplicar();
    if(location.hash==='#calculadora-jornada')setTimeout(()=>showSection('calculadora-jornada',b),80);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criar);else criar();
})();