(function(){
  if(window.CMAApuradorPonto)return;

  const DIAS=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  const PADRAO=[0,480,480,480,480,480,240];
  const estado={feriados:new Map(),padrao:[...PADRAO]};

  function minutos(valor){
    if(!valor||!/^(\d{1,2}):(\d{2})$/.test(valor))return null;
    const [h,m]=valor.split(':').map(Number);
    return h>=0&&h<24&&m>=0&&m<60?h*60+m:null;
  }
  function duracao(inicio,fim){
    const a=typeof inicio==='number'?inicio:minutos(inicio),b=typeof fim==='number'?fim:minutos(fim);
    if(a===null||b===null)return null;
    return b<a?b+1440-a:b-a;
  }
  function formatar(valor,comSinal=false){
    const n=Math.round(Number(valor)||0),s=n<0?'-':comSinal&&n>0?'+':'';
    const a=Math.abs(n);return `${s}${String(Math.floor(a/60)).padStart(2,'0')}:${String(a%60).padStart(2,'0')}`;
  }
  function calcularNoturno(marcacoes=[]){
    let real=0;
    for(let i=0;i<4;i+=2){
      let inicio=minutos(marcacoes[i]),fim=minutos(marcacoes[i+1]);if(inicio===null||fim===null)continue;if(fim<inicio)fim+=1440;
      [-1,0,1].forEach(dia=>{const a=1320+dia*1440,b=1740+dia*1440;real+=Math.max(0,Math.min(fim,b)-Math.max(inicio,a));});
    }
    return {real};
  }
  function analisarDia({previsto=0,marcacoes=[],situacao='trabalhado',especial=false,margem=10,noturno=true}={}){
    const base=Math.max(0,Number(previsto)||0);
    if(situacao==='folga'||situacao==='suspensao')return {valido:true,previsto:0,trabalhado:0,credito:0,extra:0,extra50:0,extra100:0,atraso:0,saldo:0,especial,margem:false};
    if(situacao==='abono')return {valido:true,previsto:base,trabalhado:0,credito:base,extra:0,extra50:0,extra100:0,atraso:0,saldo:0,especial,margem:false};
    if(situacao==='falta')return {valido:true,previsto:base,trabalhado:0,credito:0,extra:0,extra50:0,extra100:0,atraso:base,saldo:-base,especial,margem:false};
    const preenchidas=marcacoes.filter(Boolean).length;
    if(!preenchidas)return {valido:false,vazio:true,previsto:base,trabalhado:0,credito:0,extra:0,atraso:0,saldo:0,especial,margem:false};
    const pares=[];
    for(let i=0;i<4;i+=2){
      if(!marcacoes[i]&&!marcacoes[i+1])continue;
      if(!marcacoes[i]||!marcacoes[i+1])return {valido:false,incompleto:true,previsto:base,trabalhado:0,credito:0,extra:0,atraso:0,saldo:0,especial,margem:false};
      const d=duracao(marcacoes[i],marcacoes[i+1]);
      if(d===null)return {valido:false,incompleto:true,previsto:base,trabalhado:0,credito:0,extra:0,atraso:0,saldo:0,especial,margem:false};
      pares.push(d);
    }
    const trabalhado=pares.reduce((a,b)=>a+b,0),saldo=trabalhado-base,extra=Math.max(0,saldo),noite=noturno?calcularNoturno(marcacoes):{real:0};
    return {valido:true,previsto:base,trabalhado,credito:0,extra,extra50:especial?0:extra,extra100:especial?trabalhado:0,noturnoReal:noite.real,atraso:Math.max(0,-saldo),saldo,especial,margem:!especial&&Math.abs(saldo)>0&&Math.abs(saldo)<=Math.max(0,Number(margem)||0)};
  }
  function dataLocal(chave){const [a,m,d]=chave.split('-').map(Number);return new Date(a,m-1,d);}
  function chaveData(data){return `${data.getFullYear()}-${String(data.getMonth()+1).padStart(2,'0')}-${String(data.getDate()).padStart(2,'0')}`;}
  function periodoAtual(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;}
  function nomeMes(valor){if(!/^\d{4}-\d{2}$/.test(valor))return 'Período';const [a,m]=valor.split('-').map(Number);return new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(new Date(a,m-1,1));}
  function previstoDoDia(dia){return estado.padrao[dia]||0;}
  function escapar(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML;}
  function opcoesSituacao(valor){return [['trabalhado','Trabalhado'],['falta','Falta'],['abono','Abono'],['folga','Folga'],['suspensao','Suspensão']].map(([v,n])=>`<option value="${v}"${v===valor?' selected':''}>${n}</option>`).join('');}

  function linhaData(data){
    const chave=chaveData(data),especial=data.getDay()===0||estado.feriados.has(chave),feriado=estado.feriados.get(chave)||'';
    return `<tr data-ap-dia="${chave}"><td class="cma-ap-data"><strong>${String(data.getDate()).padStart(2,'0')}</strong><span>${DIAS[data.getDay()]}${feriado?` • ${escapar(feriado)}`:''}</span></td><td><select data-campo="situacao" aria-label="Situação em ${chave}">${opcoesSituacao('trabalhado')}</select></td><td><input data-campo="previsto" type="time" value="${formatar(especial?0:previstoDoDia(data.getDay()))}" aria-label="Jornada prevista em ${chave}"></td><td class="cma-ap-marcas"><input data-campo="m1" type="time" aria-label="Primeira marcação em ${chave}"><input data-campo="m2" type="time" aria-label="Segunda marcação em ${chave}"><input data-campo="m3" type="time" aria-label="Terceira marcação em ${chave}"><input data-campo="m4" type="time" aria-label="Quarta marcação em ${chave}"></td><td data-saida="trabalhado">—</td><td data-saida="extra50">—</td><td data-saida="extra100">—</td><td class="cma-ap-col-noturno" data-saida="noturno">—</td><td data-saida="atraso">—</td><td data-saida="status"><span class="cma-ap-tag ${especial?'especial':'pendente'}">${especial?'Dom./feriado':'Pendente'}</span></td></tr>`;
  }
  function montarPeriodo(){
    const periodo=document.getElementById('cma-ap-periodo')?.value||periodoAtual(),corpo=document.getElementById('cma-ap-corpo');if(!corpo)return;
    const [ano,mes]=periodo.split('-').map(Number),ultimo=new Date(ano,mes,0).getDate();let html='';
    for(let d=1;d<=ultimo;d++)html+=linhaData(new Date(ano,mes-1,d));
    corpo.innerHTML=html;document.getElementById('cma-ap-mes').textContent=nomeMes(periodo);
    corpo.querySelectorAll('input,select').forEach(el=>{el.addEventListener('input',recalcular);el.addEventListener('change',recalcular);});recalcular();
  }
  function adicionarFeriado(){
    const data=document.getElementById('cma-ap-feriado-data')?.value,nome=document.getElementById('cma-ap-feriado-nome')?.value.trim();
    if(!data||!nome)return;estado.feriados.set(data,nome);renderFeriados();atualizarFeriadoNaTabela(data,true);recalcular();
  }
  function atualizarFeriadoNaTabela(chave,ativo){
    const tr=document.querySelector(`#cma-ap-corpo tr[data-ap-dia="${chave}"]`);if(!tr)return;
    const data=dataLocal(chave),nome=estado.feriados.get(chave)||'',rotulo=tr.querySelector('.cma-ap-data span'),previsto=tr.querySelector('[data-campo="previsto"]');
    if(rotulo)rotulo.textContent=`${DIAS[data.getDay()]}${nome?` • ${nome}`:''}`;
    if(previsto)previsto.value=formatar(ativo?0:previstoDoDia(data.getDay()));
  }
  function renderFeriados(){
    const box=document.getElementById('cma-ap-feriados-lista');if(!box)return;
    box.innerHTML=[...estado.feriados].sort().map(([d,n])=>`<button type="button" data-remover-feriado="${d}" title="Remover feriado">${d.split('-').reverse().join('/')} • ${escapar(n)} <span>×</span></button>`).join('')||'<span>Nenhum feriado informado.</span>';
    box.querySelectorAll('[data-remover-feriado]').forEach(b=>b.addEventListener('click',()=>{const data=b.dataset.removerFeriado;estado.feriados.delete(data);renderFeriados();atualizarFeriadoNaTabela(data,false);recalcular();}));
  }
  function aplicarJornadaSemanal(){
    DIAS.forEach((_,dia)=>{estado.padrao[dia]=minutos(document.getElementById(`cma-ap-padrao-${dia}`)?.value)||0;});
    document.querySelectorAll('#cma-ap-corpo tr').forEach(tr=>{
      const data=dataLocal(tr.dataset.apDia),especial=data.getDay()===0||estado.feriados.has(tr.dataset.apDia),campo=tr.querySelector('[data-campo="previsto"]');if(campo)campo.value=formatar(especial?0:previstoDoDia(data.getDay()));
    });
    recalcular();
  }
  function recalcular(){
    const margem=Math.max(0,Number(document.getElementById('cma-ap-margem')?.value)||0),hoje=new Date();hoje.setHours(0,0,0,0);
    const tot={previsto:0,trabalhado:0,comum:0,especial:0,noturno:0,atraso:0,saldo:0,pendentes:0,naoInformados:0,informados:0,margem:0};
    document.querySelectorAll('#cma-ap-corpo tr').forEach(tr=>{
      const get=n=>tr.querySelector(`[data-campo="${n}"]`),data=dataLocal(tr.dataset.apDia),especial=data.getDay()===0||estado.feriados.has(tr.dataset.apDia);
      const r=analisarDia({previsto:minutos(get('previsto').value)||0,marcacoes:['m1','m2','m3','m4'].map(n=>get(n).value),situacao:get('situacao').value,especial,margem,noturno:true});
      tot.previsto+=r.previsto;
      if(r.valido){tot.informados++;tot.trabalhado+=r.trabalhado+r.credito;tot.atraso+=r.atraso;tot.saldo+=r.saldo;tot.especial+=r.extra100||0;tot.comum+=r.extra50||0;tot.noturno+=r.noturnoReal||0;if(r.margem)tot.margem++;}
      else if(!r.vazio)tot.pendentes++;
      else if(r.previsto>0&&data<hoje)tot.naoInformados++;
      tr.querySelector('[data-saida="trabalhado"]').textContent=r.valido?formatar(r.trabalhado+r.credito):'—';
      tr.querySelector('[data-saida="extra50"]').textContent=r.valido&&r.extra50?formatar(r.extra50):'—';
      tr.querySelector('[data-saida="extra100"]').textContent=r.valido&&r.extra100?formatar(r.extra100):'—';
      tr.querySelector('[data-saida="noturno"]').textContent=r.valido&&r.noturnoReal?formatar(r.noturnoReal):'—';
      tr.querySelector('[data-saida="atraso"]').textContent=r.valido&&r.atraso?formatar(r.atraso):'—';
      const status=tr.querySelector('[data-saida="status"]');let texto='Pendente',classe='pendente';
      if(r.valido){if(r.margem){texto='Na margem';classe='margem';}else if(r.extra100){texto='Hora extra 100%';classe='positivo';}else if(r.extra50){texto='Hora extra 50%';classe='positivo';}else if(r.saldo<0){texto='Atraso/falta';classe='negativo';}else{texto='Conferido';classe='ok';}}
      else if(r.incompleto){texto='Marcações incompletas';classe='negativo';}
      else if(r.previsto===0){texto='Sem jornada prevista';classe='ok';}
      else if(data<hoje){texto='Não informado';classe='negativo';}
      else if(data>hoje){texto='Aguardando';classe='pendente';}
      status.innerHTML=`<span class="cma-ap-tag ${classe}">${texto}</span>`;
      tr.classList.toggle('cma-ap-linha-inativa',['folga','suspensao'].includes(get('situacao').value));
    });
    const valores={trabalhado:tot.trabalhado,comum:tot.comum,especial:tot.especial,'noturno-total':tot.noturno,atraso:tot.atraso};
    Object.entries(valores).forEach(([k,v])=>{const e=document.getElementById(`cma-ap-${k}`);if(e)e.textContent=formatar(v);});
    const aviso=document.getElementById('cma-ap-aviso');
    const mensagens=[];
    if(tot.pendentes)mensagens.push(`${tot.pendentes} dia(s) com marcações incompletas foram excluídos da apuração.`);
    if(tot.naoInformados)mensagens.push(`${tot.naoInformados} dia(s) anteriores com jornada prevista ainda não foram informados.`);
    if(tot.margem)mensagens.push(`${tot.margem} dia(s) ficaram dentro da margem informada; os minutos continuam demonstrados.`);
    aviso.textContent=mensagens.join(' ')||(tot.informados?'Apuração preenchida sem pendências identificadas.':'Preencha as marcações para iniciar a conferência.');
    aviso.className=`cma-ap-aviso ${tot.pendentes||tot.naoInformados?'erro':tot.margem?'atencao':''}`;
  }
  function limpar(){
    estado.feriados.clear();renderFeriados();montarPeriodo();
  }
  function imprimir(){document.body.classList.add('cma-ap-imprimindo');window.print();setTimeout(()=>document.body.classList.remove('cma-ap-imprimindo'),200);}
  function criar(){
    const menu=document.getElementById('manual-menu'),main=document.querySelector('#manual-conteudo main');if(!menu||!main||document.getElementById('apurador-ponto'))return;
    const b=document.createElement('button');b.type='button';b.setAttribute('onclick',"showSection('apurador-ponto', this)");b.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 mr-2.5 shrink-0"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 9h18M8 13h3M8 17h6"/></svg> Apurador de Ponto';
    const ant=typeof getMenuButton==='function'?getMenuButton('calculadora-jornada'):null;if(ant)ant.insertAdjacentElement('afterend',b);else menu.appendChild(b);
    const s=document.createElement('section');s.id='apurador-ponto';s.className='manual-section hidden fade-in cma-calculadora-padrao';s.innerHTML=`
      <div class="cma-ap-cab"><div><h3>Apurador de Ponto</h3><p>Conferência mensal das marcações, atrasos e excedentes de jornada.</p></div><div class="cma-ap-acoes"><button id="cma-ap-imprimir" type="button">Imprimir</button><button id="cma-ap-limpar" type="button">Limpar</button></div></div>
      <div class="cma-ap-config"><div><label>Empresa</label><input id="cma-ap-empresa" type="text" placeholder="Nome da empresa"></div><div><label>Empregado</label><input id="cma-ap-empregado" type="text" placeholder="Nome do empregado"></div><div><label>Competência</label><input id="cma-ap-periodo" type="month" value="${periodoAtual()}"></div><div><label>Margem para sinalização (min)</label><input id="cma-ap-margem" type="number" min="0" max="60" value="10"></div></div>
      <details class="cma-ap-feriados cma-ap-jornada"><summary>Configurar jornada semanal prevista</summary><div class="cma-ap-semana">${DIAS.map((dia,i)=>`<div><label>${dia}</label><input id="cma-ap-padrao-${i}" type="time" value="${formatar(PADRAO[i])}"></div>`).join('')}</div><div class="cma-ap-semana-acoes"><p>Defina a duração prevista para cada dia e aplique à competência. Depois, ainda é possível ajustar dias específicos diretamente na tabela.</p><button id="cma-ap-aplicar-padrao" type="button">Aplicar à competência</button></div></details>
      <details class="cma-ap-feriados"><summary>Informar feriados da competência</summary><div class="cma-ap-feriado-form"><div><label>Data</label><input id="cma-ap-feriado-data" type="date"></div><div><label>Descrição</label><input id="cma-ap-feriado-nome" type="text" placeholder="Ex.: feriado municipal"></div><button id="cma-ap-add-feriado" type="button">Adicionar</button></div><div id="cma-ap-feriados-lista" class="cma-ap-feriados-lista"></div></details>
      <div class="cma-ap-resumo"><div><span>Horas trabalhadas/abonadas</span><strong id="cma-ap-trabalhado">00:00</strong></div><div class="principal"><span>Horas extras 50%</span><strong id="cma-ap-comum">00:00</strong></div><div class="principal cma-ap-100"><span>Horas extras 100%</span><strong id="cma-ap-especial">00:00</strong></div><div class="cma-ap-col-noturno"><span>Período noturno</span><strong id="cma-ap-noturno-total">00:00</strong></div><div><span>Atrasos e faltas</span><strong id="cma-ap-atraso">00:00</strong></div></div>
      <div id="cma-ap-aviso" class="cma-ap-aviso">Preencha as marcações para iniciar a conferência.</div>
      <div class="cma-ap-tabela-wrap"><table class="cma-ap-tabela"><caption>Apuração de <span id="cma-ap-mes"></span></caption><thead><tr><th>Dia</th><th>Situação</th><th>Previsto</th><th>Marcações (entrada e saída)</th><th>Trabalhado</th><th>HE 50%</th><th>HE 100%</th><th class="cma-ap-col-noturno">H. noturnas</th><th>Atraso/falta</th><th>Conferência</th></tr></thead><tbody id="cma-ap-corpo"></tbody></table></div>
      <div class="cma-ap-nota"><strong>Como interpretar</strong><p>O apurador classifica como hora extra a 50% o excedente de segunda-feira a sábado. Aos domingos e nos feriados informados, as horas trabalhadas são demonstradas a 100%. A margem apenas sinaliza diferenças pequenas e não retira minutos automaticamente.</p><p>As horas trabalhadas entre 22h e 5h são identificadas automaticamente e demonstradas pelo tempo real transcorrido, sem conversão da hora noturna e sem cálculo do valor em reais. Assim, uma saída às 22h05 registra 00:05 de período noturno. Prorrogações após as 5h, compensações, banco de horas, regras coletivas e jornadas especiais devem ser analisados antes do fechamento. Os dados permanecem somente nesta página e não são enviados ou salvos pelo Manual.</p></div>`;
    const base=document.getElementById('baselegal');if(base)main.insertBefore(s,base);else main.appendChild(s);instalarEstilo();
    document.getElementById('cma-ap-periodo').addEventListener('change',montarPeriodo);document.getElementById('cma-ap-margem').addEventListener('input',recalcular);document.getElementById('cma-ap-aplicar-padrao').addEventListener('click',aplicarJornadaSemanal);document.getElementById('cma-ap-add-feriado').addEventListener('click',adicionarFeriado);document.getElementById('cma-ap-limpar').addEventListener('click',limpar);document.getElementById('cma-ap-imprimir').addEventListener('click',imprimir);renderFeriados();montarPeriodo();
    const secoesAmplas=['apurador-ponto','custo-empregado','calculadora-folha'].map(id=>document.getElementById(id)).filter(Boolean),largura=()=>document.getElementById('manual-conteudo')?.classList.toggle('cma-ferramenta-ampla',secoesAmplas.some(sec=>sec.classList.contains('active')&&!sec.classList.contains('hidden')));
    secoesAmplas.forEach(sec=>new MutationObserver(largura).observe(sec,{attributes:true,attributeFilter:['class']}));largura();
    if(location.hash==='#apurador-ponto')setTimeout(()=>showSection('apurador-ponto',b),80);
  }
  function instalarEstilo(){
    if(document.getElementById('cma-ap-style'))return;const st=document.createElement('style');st.id='cma-ap-style';st.textContent=`
      #manual-conteudo.cma-ferramenta-ampla{transition:max-width .2s ease}#apurador-ponto{--ap-azul:#172554;--ap-borda:#dbe3ee;--ap-texto:#334155}#apurador-ponto .cma-ap-cab{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid #e2e8f0}#apurador-ponto .cma-ap-cab h3{margin:0;color:var(--ap-azul);font-size:26px;font-weight:800}#apurador-ponto .cma-ap-cab p{margin:5px 0 0;color:#64748b;font-size:15px;text-align:left}.cma-ap-acoes{display:flex;gap:7px}.cma-ap-acoes button,.cma-ap-feriado-form button,.cma-ap-semana-acoes button{min-height:40px;padding:8px 13px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#334155;font-weight:800;cursor:pointer}.cma-ap-config{display:grid;grid-template-columns:1.25fr 1.25fr .8fr .8fr;gap:12px;margin-bottom:14px}.cma-ap-config label,.cma-ap-feriado-form label,.cma-ap-semana label{display:block;margin-bottom:5px;color:var(--ap-texto);font-size:12.5px;font-weight:800}.cma-ap-config input,.cma-ap-feriado-form input,.cma-ap-semana input{width:100%;min-height:43px;padding:8px 10px;border:1px solid #cbd5e1;border-radius:9px;box-sizing:border-box}.cma-ap-feriados{margin:0 0 12px;border:1px solid var(--ap-borda);border-radius:10px;background:#f8fafc}.cma-ap-feriados summary{padding:12px 14px;color:var(--ap-azul);font-size:13px;font-weight:800;cursor:pointer}.cma-ap-semana{display:grid;grid-template-columns:repeat(7,1fr);gap:8px;padding:0 14px 10px}.cma-ap-semana-acoes{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:0 14px 13px}.cma-ap-semana-acoes p{max-width:650px;margin:0!important;color:#64748b!important;font-size:12px!important;line-height:1.45!important;text-align:left!important}.cma-ap-semana-acoes button{flex:0 0 auto;background:#172554;color:#fff;border-color:#172554}.cma-ap-feriado-form{display:grid;grid-template-columns:.7fr 1.4fr auto;gap:10px;align-items:end;padding:0 14px 12px}.cma-ap-feriados-lista{display:flex;flex-wrap:wrap;gap:7px;padding:0 14px 13px;color:#64748b;font-size:12px}.cma-ap-feriados-lista button{padding:6px 9px;border:1px solid #bfdbfe;border-radius:999px;background:#eff6ff;color:#1e3a8a;font-size:12px}.cma-ap-resumo{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:16px 0 12px}.cma-ap-resumo>div{padding:12px;border:1px solid var(--ap-borda);border-radius:10px;background:#fff}.cma-ap-resumo .principal{background:var(--ap-azul);border-color:var(--ap-azul)}.cma-ap-resumo .cma-ap-100{background:#7c2d12;border-color:#7c2d12}.cma-ap-resumo span{display:block;color:#64748b;font-size:11px;line-height:1.25}.cma-ap-resumo strong{display:block;margin-top:5px;color:var(--ap-azul);font-size:20px;font-variant-numeric:tabular-nums}.cma-ap-resumo .principal span{color:#dbeafe}.cma-ap-resumo .principal strong{color:#fff}.cma-ap-resumo .cma-ap-100 span{color:#ffedd5}.cma-ap-aviso{margin-bottom:12px;padding:10px 12px;border-radius:8px;background:#f1f5f9;color:#475569;font-size:12.5px}.cma-ap-aviso.atencao{background:#fffbeb;color:#92400e}.cma-ap-aviso.erro{background:#fef2f2;color:#991b1b}.cma-ap-tabela-wrap{overflow:auto;border:1px solid var(--ap-borda);border-radius:12px;background:#fff}.cma-ap-tabela{width:100%;min-width:1220px;border-collapse:collapse}.cma-ap-tabela caption{padding:13px 14px;background:#f8fafc;color:var(--ap-azul);font-weight:800;text-align:left;text-transform:capitalize}.cma-ap-tabela th{padding:9px 8px;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;background:#f8fafc;color:#64748b;font-size:11px;text-align:left}.cma-ap-tabela td{padding:7px 8px;border-bottom:1px solid #eef2f7;color:#475569;font-size:12px;vertical-align:middle}.cma-ap-tabela tr:last-child td{border-bottom:0}.cma-ap-data strong{display:block;color:var(--ap-azul);font-size:14px}.cma-ap-data span{display:block;color:#64748b;font-size:10.5px;white-space:nowrap}.cma-ap-tabela input,.cma-ap-tabela select{height:36px;padding:5px 6px;border:1px solid #cbd5e1;border-radius:7px;background:#fff;font-size:12px}.cma-ap-tabela select{min-width:105px}.cma-ap-marcas{display:grid;grid-template-columns:repeat(4,82px);gap:5px}.cma-ap-tabela td.positivo{color:#047857;font-weight:800}.cma-ap-tabela td.negativo{color:#b91c1c;font-weight:800}.cma-ap-tag{display:inline-block;padding:4px 7px;border-radius:999px;background:#f1f5f9;color:#64748b;font-size:10.5px;font-weight:800;white-space:nowrap}.cma-ap-tag.ok{background:#ecfdf5;color:#047857}.cma-ap-tag.positivo{background:#eff6ff;color:#1d4ed8}.cma-ap-tag.negativo{background:#fef2f2;color:#b91c1c}.cma-ap-tag.margem{background:#fffbeb;color:#92400e}.cma-ap-linha-inativa{opacity:.65}.cma-ap-nota{margin-top:15px;padding:15px 16px;border-left:3px solid #94a3b8;border-radius:0 8px 8px 0;background:#f8fafc;color:#475569}.cma-ap-nota strong{color:var(--ap-azul)}.cma-ap-nota p{margin:5px 0 0!important;color:#475569!important;font-size:13px!important;line-height:1.55!important;text-align:left!important}
      @media(min-width:1024px){#manual-conteudo.cma-ferramenta-ampla{max-width:96rem!important;grid-template-columns:240px minmax(0,1fr)!important}#manual-conteudo.cma-ferramenta-ampla>aside,#manual-conteudo.cma-ferramenta-ampla>main{grid-column:span 1/span 1!important}}@media(max-width:1000px){.cma-ap-config{grid-template-columns:1fr 1fr}.cma-ap-semana{grid-template-columns:repeat(4,1fr)}.cma-ap-resumo{grid-template-columns:repeat(2,1fr)}}@media(max-width:640px){#apurador-ponto .cma-ap-cab{display:block}#apurador-ponto .cma-ap-cab h3{font-size:24px}.cma-ap-acoes{margin-top:13px}.cma-ap-acoes button{flex:1}.cma-ap-config{grid-template-columns:1fr}.cma-ap-semana{grid-template-columns:1fr 1fr}.cma-ap-semana-acoes{align-items:stretch;flex-direction:column}.cma-ap-feriado-form{grid-template-columns:1fr}.cma-ap-resumo{grid-template-columns:1fr 1fr}.cma-ap-resumo strong{font-size:18px}.cma-ap-tabela-wrap{margin-right:-8px}.cma-ap-tabela input,.cma-ap-tabela select,.cma-ap-config input,.cma-ap-feriado-form input,.cma-ap-semana input{font-size:16px}.cma-ap-nota p{font-size:14px!important}}
      @media print{body.cma-ap-imprimindo>*{display:none!important}body.cma-ap-imprimindo #manual-conteudo,body.cma-ap-imprimindo #manual-conteudo main,body.cma-ap-imprimindo #apurador-ponto{display:block!important}body.cma-ap-imprimindo #apurador-ponto{position:absolute;inset:0;padding:0}body.cma-ap-imprimindo #apurador-ponto .cma-voltar-central,body.cma-ap-imprimindo .cma-ap-acoes,body.cma-ap-imprimindo .cma-ap-feriados{display:none!important}body.cma-ap-imprimindo .cma-ap-tabela-wrap{overflow:visible}.cma-ap-tabela{min-width:0;font-size:8px}.cma-ap-marcas{grid-template-columns:repeat(4,1fr)}}`;
    document.head.appendChild(st);
  }

  window.CMAApuradorPonto={minutos,duracao,formatar,calcularNoturno,analisarDia,criar,versao:'1.7'};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criar);else criar();
})();
