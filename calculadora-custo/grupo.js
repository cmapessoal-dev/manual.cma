(function(){
  const funcionarios=[];
  let editandoId=null;

  function moeda(valor){return (Number(valor)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function texto(id){const el=document.getElementById(id);return el?String(el.value||'').trim():'';}
  function textoGrupo(idGrupo,idPadrao){return texto(idGrupo)||texto(idPadrao);}
  function numero(id){const n=parseFloat(String(texto(id)||'0').replace(',','.'));return Number.isFinite(n)?n:0;}
  function opcao(nome,padrao=''){const el=document.querySelector(`input[name="${nome}"]:checked`);return el?el.value:padrao;}
  function escapar(valor){return String(valor||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function idNovo(){return window.crypto&&crypto.randomUUID?crypto.randomUUID():`cma-${Date.now()}-${Math.random().toString(16).slice(2)}`;}

  function garantirIdentificacao(secao){
    const form=secao.querySelector('.cma-custo-form');
    const regime=[...form.querySelectorAll('.cma-custo-label')].find(x=>(x.textContent||'').includes('Regime da empresa'));
    if(!form||!regime)return;
    if(!document.getElementById('cma-custo-grupo-identificacao')){
      const grupo=document.createElement('div');
      grupo.id='cma-custo-grupo-identificacao';grupo.className='cma-custo-identificacao cma-grupo-identificacao cma-grupo-hidden';
      grupo.innerHTML='<div><label class="cma-custo-label" for="cma-custo-grupo-empresa-campo">Empresa</label><input id="cma-custo-grupo-empresa-campo" class="cma-custo-texto" type="text" autocomplete="organization" placeholder="Nome da empresa"></div><div><label class="cma-custo-label" for="cma-custo-grupo-empregado-campo">Nome do empregado</label><input id="cma-custo-grupo-empregado-campo" class="cma-custo-texto" type="text" autocomplete="off" placeholder="Nome do empregado"></div>';
      form.insertBefore(grupo,regime);
    }
    if(document.getElementById('cma-custo-empresa'))return;
    const bloco=document.createElement('div');
    bloco.className='cma-custo-identificacao';
    bloco.innerHTML='<div><label class="cma-custo-label" for="cma-custo-empresa">Empresa</label><input id="cma-custo-empresa" class="cma-custo-texto" type="text" autocomplete="organization" placeholder="Nome da empresa"></div><div><label class="cma-custo-label" for="cma-custo-empregado">Nome do empregado</label><input id="cma-custo-empregado" class="cma-custo-texto" type="text" autocomplete="name" placeholder="Nome do empregado"></div>';
    form.insertBefore(bloco,regime);
  }

  function lerAtual(){
    const bruto={
      empresa:textoGrupo('cma-custo-grupo-empresa-campo','cma-custo-empresa'),nome:textoGrupo('cma-custo-grupo-empregado-campo','cma-custo-empregado'),regime:opcao('cma-regime','simples'),
      salario:numero('cma-custo-salario'),temComissao:opcao('cma-comissao','nao')==='sim',comissao:numero('cma-custo-comissao'),
      competencia:texto('cma-custo-competencia'),diasUteis:numero('cma-custo-dias-uteis'),diasDsr:numero('cma-custo-dias-dsr'),
      temGratificacao:opcao('cma-gratificacao','nao')==='sim',gratificacao:numero('cma-custo-gratificacao'),
      risco:opcao('cma-risco','nenhum'),grauInsalubridade:numero('cma-custo-insal-grau'),baseInsalubridade:numero('cma-custo-insal-base'),
      temVT:opcao('cma-vt','nao')==='sim',vtBruto:numero('cma-custo-vt'),percentualVT:numero('cma-custo-vt-percentual'),
      temAlim:opcao('cma-alim','nao')==='sim',alimBruto:numero('cma-custo-alim'),percentualAlim:numero('cma-custo-alim-percentual'),
      plano:numero('cma-custo-plano'),outros:numero('cma-custo-outros')
    };
    const calculo=window.CMA_CALCULAR_CUSTO({
      regime:bruto.regime,salario:bruto.salario,comissao:bruto.temComissao?bruto.comissao:0,diasUteis:bruto.diasUteis,diasDsr:bruto.diasDsr,
      gratificacao:bruto.temGratificacao?bruto.gratificacao:0,risco:bruto.risco,grauInsalubridade:bruto.grauInsalubridade,
      baseInsalubridade:bruto.baseInsalubridade,temVT:bruto.temVT,vtBruto:bruto.vtBruto,percentualVT:bruto.percentualVT,
      temAlim:bruto.temAlim,alimBruto:bruto.alimBruto,percentualAlim:bruto.percentualAlim,plano:bruto.plano,outros:bruto.outros
    });
    return {bruto,calculo};
  }

  function totais(){
    return funcionarios.reduce((t,f)=>{
      const v=f.calculo;
      t.remuneracao+=v.remuneracao;
      t.beneficios+=v.custoVT+v.custoAlim+v.plano+v.outros;
      t.encargos+=v.fgtsRemuneracao+v.encargosFolha;
      t.provisoes+=v.provisoes;
      t.total+=v.total;
      return t;
    },{quantidade:funcionarios.length,remuneracao:0,beneficios:0,encargos:0,provisoes:0,total:0});
  }

  function dadosPublicos(){
    return {empresa:funcionarios[0]?.bruto.empresa||textoGrupo('cma-custo-grupo-empresa-campo','cma-custo-empresa')||'Não informada',funcionarios:funcionarios.map(f=>({id:f.id,bruto:{...f.bruto},calculo:{...f.calculo}})),totais:totais()};
  }
  window.CMA_OBTER_GRUPO_CUSTO=dadosPublicos;

  function exportarGrupo(){
    if(typeof window.CMA_EXPORTAR_CUSTO_GRUPO==='function')window.CMA_EXPORTAR_CUSTO_GRUPO();
    else alert('O exportador ainda está sendo carregado. Tente novamente em instantes.');
  }
  function garantirBotaoPdf(){
    let botao=document.getElementById('cma-exportar-grupo-pdf');if(botao)return botao;
    const acoes=document.querySelector('#cma-custo-grupo-painel .cma-grupo-botoes');if(!acoes)return null;
    botao=document.createElement('button');botao.type='button';botao.id='cma-exportar-grupo-pdf';botao.textContent='Exportar grupo em PDF';botao.addEventListener('click',exportarGrupo);acoes.appendChild(botao);return botao;
  }

  function renderizar(){
    const lista=document.getElementById('cma-custo-grupo-lista'),resumo=document.getElementById('cma-custo-grupo-resumo');
    const vazio=document.getElementById('cma-custo-grupo-vazio');
    if(!lista||!resumo)return;
    const t=totais();
    resumo.innerHTML=`
      <div><span>Funcionários</span><strong>${t.quantidade}</strong></div>
      <div><span>Remuneração</span><strong>${moeda(t.remuneracao)}</strong></div>
      <div><span>Benefícios</span><strong>${moeda(t.beneficios)}</strong></div>
      <div><span>Encargos mensais</span><strong>${moeda(t.encargos)}</strong></div>
      <div><span>Provisões</span><strong>${moeda(t.provisoes)}</strong></div>
      <div class="cma-grupo-total"><span>Custo total mensal</span><strong>${moeda(t.total)}</strong></div>`;
    lista.innerHTML=funcionarios.map((f,i)=>`<article class="cma-grupo-item" data-id="${f.id}">
      <div class="cma-grupo-numero">${i+1}</div><div class="cma-grupo-dados"><strong>${escapar(f.bruto.nome)}</strong><span>${escapar(f.bruto.regime==='simples'?'Simples Nacional':'Não optante pelo Simples')} • Salário ${moeda(f.bruto.salario)}</span></div>
      <div class="cma-grupo-valor"><span>Custo mensal</span><strong>${moeda(f.calculo.total)}</strong></div>
      <div class="cma-grupo-acoes"><button type="button" data-acao="editar">Editar</button><button type="button" data-acao="duplicar">Duplicar</button><button type="button" data-acao="excluir" class="cma-grupo-excluir">Excluir</button></div>
    </article>`).join('');
    if(vazio)vazio.hidden=funcionarios.length>0;
    garantirBotaoPdf();
    document.dispatchEvent(new CustomEvent('cma:custo-grupo-atualizado',{detail:dadosPublicos()}));
  }

  function definirRadio(nome,valor){
    const el=document.querySelector(`input[name="${nome}"][value="${valor}"]`);
    if(el){el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));}
  }
  function definirValor(id,valor,evento='input'){
    const el=document.getElementById(id);if(!el)return;el.value=valor??'';el.dispatchEvent(new Event(evento,{bubbles:true}));
  }

  function aplicar(bruto){
    definirValor('cma-custo-grupo-empresa-campo',bruto.empresa);
    definirValor('cma-custo-grupo-empregado-campo',bruto.nome);
    definirValor('cma-custo-empresa',bruto.empresa);
    definirValor('cma-custo-empregado',bruto.nome);
    definirRadio('cma-regime',bruto.regime);
    definirValor('cma-custo-salario',bruto.salario);
    definirRadio('cma-comissao',bruto.temComissao?'sim':'nao');definirValor('cma-custo-comissao',bruto.comissao);
    definirValor('cma-custo-competencia',bruto.competencia,'change');
    definirRadio('cma-gratificacao',bruto.temGratificacao?'sim':'nao');definirValor('cma-custo-gratificacao',bruto.gratificacao);
    definirRadio('cma-risco',bruto.risco);definirValor('cma-custo-insal-grau',bruto.grauInsalubridade,'change');definirValor('cma-custo-insal-base',bruto.baseInsalubridade);
    definirRadio('cma-vt',bruto.temVT?'sim':'nao');definirValor('cma-custo-vt',bruto.vtBruto);definirValor('cma-custo-vt-percentual',bruto.percentualVT);
    definirRadio('cma-alim',bruto.temAlim?'sim':'nao');definirValor('cma-custo-alim',bruto.alimBruto);definirValor('cma-custo-alim-percentual',bruto.percentualAlim);
    definirValor('cma-custo-plano',bruto.plano);definirValor('cma-custo-outros',bruto.outros);
  }

  function limpar(){
    const empresa=textoGrupo('cma-custo-grupo-empresa-campo','cma-custo-empresa'),regime=opcao('cma-regime','simples'),competencia=texto('cma-custo-competencia');
    editandoId=null;
    aplicar({empresa,nome:'',regime,salario:0,temComissao:false,comissao:0,competencia,diasUteis:0,diasDsr:0,temGratificacao:false,gratificacao:0,risco:'nenhum',grauInsalubridade:10,baseInsalubridade:0,temVT:false,vtBruto:0,percentualVT:6,temAlim:false,alimBruto:0,percentualAlim:20,plano:0,outros:0});
    atualizarBotaoSalvar();
    (document.getElementById('cma-custo-grupo-empregado-campo')||document.getElementById('cma-custo-empregado'))?.focus();
  }

  function atualizarBotaoSalvar(){
    const botao=document.getElementById('cma-custo-grupo-salvar');if(!botao)return;
    botao.textContent=editandoId?'Salvar alterações':'Adicionar funcionário ao grupo';
  }

  function salvar(){
    const atual=lerAtual();
    if(!atual.bruto.nome){alert('Informe o nome do empregado antes de adicioná-lo ao grupo.');(document.getElementById('cma-custo-grupo-empregado-campo')||document.getElementById('cma-custo-empregado'))?.focus();return;}
    if(atual.bruto.salario<=0){alert('Informe o salário base antes de adicionar o empregado.');document.getElementById('cma-custo-salario')?.focus();return;}
    if(editandoId){
      const indice=funcionarios.findIndex(f=>f.id===editandoId);
      if(indice>=0)funcionarios[indice]={id:editandoId,...atual};
    }else funcionarios.push({id:idNovo(),...atual});
    renderizar();limpar();
    document.getElementById('cma-custo-grupo-status').textContent='Funcionário incluído. Preencha os dados do próximo empregado.';
  }

  function editar(id,duplicar=false){
    const item=funcionarios.find(f=>f.id===id);if(!item)return;
    editandoId=duplicar?null:id;
    const bruto={...item.bruto,nome:duplicar?`${item.bruto.nome} — cópia`:item.bruto.nome};
    aplicar(bruto);atualizarBotaoSalvar();
    document.getElementById('cma-custo-grupo-status').textContent=duplicar?'Cópia carregada. Ajuste os dados e adicione ao grupo.':'Funcionário carregado para edição.';
    document.querySelector('.cma-custo-form')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function excluir(id){
    const item=funcionarios.find(f=>f.id===id);if(!item)return;
    if(!confirm(`Excluir ${item.bruto.nome} da simulação em grupo?`))return;
    const indice=funcionarios.findIndex(f=>f.id===id);funcionarios.splice(indice,1);
    if(editandoId===id)limpar();renderizar();
  }

  function mudarModo(modo){
    const grupo=modo==='grupo';
    document.getElementById('cma-custo-grupo-painel')?.classList.toggle('cma-grupo-hidden',!grupo);
    document.getElementById('cma-custo-grupo-acao')?.classList.toggle('cma-grupo-hidden',!grupo);
    document.getElementById('cma-custo-grupo-identificacao')?.classList.toggle('cma-grupo-hidden',!grupo);
    document.querySelectorAll('.cma-custo-modo button').forEach(b=>{const ativo=b.dataset.modo===modo;b.classList.toggle('ativo',ativo);b.setAttribute('aria-selected',String(ativo));});
  }

  function instalar(){
    const secao=document.getElementById('custo-empregado');
    if(!secao||typeof window.CMA_CALCULAR_CUSTO!=='function')return false;
    if(document.getElementById('cma-custo-grupo-painel'))return true;
    garantirIdentificacao(secao);
    const grid=secao.querySelector('.cma-custo-grid'),form=secao.querySelector('.cma-custo-form');if(!grid||!form)return false;
    const seletor=document.createElement('div');seletor.className='cma-custo-modo';seletor.setAttribute('role','tablist');
    seletor.innerHTML='<button type="button" class="ativo" data-modo="individual" role="tab" aria-selected="true">Simulação individual</button><button type="button" data-modo="grupo" role="tab" aria-selected="false">Simulação em grupo</button>';
    grid.parentNode.insertBefore(seletor,grid);
    const painel=document.createElement('div');painel.id='cma-custo-grupo-painel';painel.className='cma-grupo-painel cma-grupo-hidden';
    painel.innerHTML=`<div class="cma-grupo-cabecalho"><div><strong>Resumo consolidado</strong><span>Adicione os empregados um por vez. Os cálculos individuais serão somados automaticamente.</span></div><div class="cma-grupo-botoes"><button type="button" id="cma-custo-grupo-novo">Novo funcionário</button></div></div><div id="cma-custo-grupo-resumo" class="cma-grupo-resumo"></div><p id="cma-custo-grupo-vazio" class="cma-grupo-vazio">Nenhum funcionário foi adicionado. Preencha o formulário abaixo e clique em “Adicionar funcionário ao grupo”.</p><div id="cma-custo-grupo-lista" class="cma-grupo-lista"></div>`;
    grid.parentNode.insertBefore(painel,grid);
    const acao=document.createElement('div');acao.id='cma-custo-grupo-acao';acao.className='cma-grupo-acao cma-grupo-hidden';
    acao.innerHTML='<button type="button" id="cma-custo-grupo-salvar">Adicionar funcionário ao grupo</button><small id="cma-custo-grupo-status">O funcionário somente entra no total após clicar neste botão.</small>';
    form.appendChild(acao);
    seletor.addEventListener('click',e=>{const b=e.target.closest('[data-modo]');if(b)mudarModo(b.dataset.modo);});
    document.getElementById('cma-custo-grupo-salvar').addEventListener('click',salvar);
    document.getElementById('cma-custo-grupo-novo').addEventListener('click',limpar);
    const botoesGrupo=painel.querySelector('.cma-grupo-botoes');
    new MutationObserver(()=>{if(!document.getElementById('cma-exportar-grupo-pdf'))requestAnimationFrame(garantirBotaoPdf);}).observe(botoesGrupo,{childList:true});
    document.getElementById('cma-custo-grupo-lista').addEventListener('click',e=>{const b=e.target.closest('[data-acao]'),item=e.target.closest('[data-id]');if(!b||!item)return;if(b.dataset.acao==='editar')editar(item.dataset.id);if(b.dataset.acao==='duplicar')editar(item.dataset.id,true);if(b.dataset.acao==='excluir')excluir(item.dataset.id);});
    if(!document.getElementById('cma-custo-grupo-style')){const st=document.createElement('style');st.id='cma-custo-grupo-style';st.textContent=`
      .cma-custo-identificacao{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px}.cma-custo-texto{width:100%;padding:11px 12px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#0f172a;font-size:14px;outline:none}.cma-custo-texto:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}
      .cma-custo-modo{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 16px;padding:5px;border:1px solid #dbe5f1;border-radius:12px;background:#f8fafc}.cma-custo-modo button{padding:11px 14px;border-radius:8px;color:#475569;font-size:14px;font-weight:800;cursor:pointer}.cma-custo-modo button.ativo{background:#172554;color:#fff;box-shadow:0 4px 12px rgba(23,37,84,.18)}.cma-grupo-hidden{display:none!important}
      .cma-grupo-painel{margin-bottom:18px;padding:17px;border:1px solid #cbd5e1;border-radius:14px;background:#fff;box-shadow:0 6px 18px rgba(15,23,42,.05)}.cma-grupo-cabecalho{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px}.cma-grupo-cabecalho strong{display:block;color:#172554;font-size:17px}.cma-grupo-cabecalho span{display:block;margin-top:3px;color:#64748b;font-size:12.5px}.cma-grupo-botoes{display:flex;gap:8px}.cma-grupo-botoes button{padding:9px 12px;border:1px solid #bfdbfe;border-radius:8px;background:#eff6ff;color:#1e3a8a;font-size:12.5px;font-weight:800;cursor:pointer}.cma-grupo-botoes button:disabled{opacity:.45;cursor:not-allowed}
      .cma-grupo-resumo{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.cma-grupo-resumo>div{padding:11px 12px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc}.cma-grupo-resumo span{display:block;color:#64748b;font-size:11.5px}.cma-grupo-resumo strong{display:block;margin-top:3px;color:#172554;font-size:16px}.cma-grupo-resumo .cma-grupo-total{background:#172554;border-color:#172554}.cma-grupo-resumo .cma-grupo-total span{color:#bfdbfe}.cma-grupo-resumo .cma-grupo-total strong{color:#fff}
      .cma-grupo-vazio{margin:14px 0 0;padding:12px;border:1px dashed #cbd5e1;border-radius:9px;color:#64748b;font-size:13px;text-align:center}.cma-grupo-lista{display:flex;flex-direction:column;gap:8px;margin-top:14px}.cma-grupo-item{display:grid;grid-template-columns:34px minmax(0,1fr) auto auto;align-items:center;gap:11px;padding:10px 11px;border:1px solid #e2e8f0;border-radius:10px}.cma-grupo-numero{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;background:#eff6ff;color:#1e3a8a;font-weight:800}.cma-grupo-dados strong,.cma-grupo-dados span,.cma-grupo-valor span,.cma-grupo-valor strong{display:block}.cma-grupo-dados strong{color:#172554}.cma-grupo-dados span,.cma-grupo-valor span{margin-top:2px;color:#64748b;font-size:11.5px}.cma-grupo-valor{text-align:right}.cma-grupo-valor strong{color:#172554}.cma-grupo-acoes{display:flex;gap:5px}.cma-grupo-acoes button{padding:7px 8px;border-radius:7px;background:#f1f5f9;color:#334155;font-size:11.5px;font-weight:700;cursor:pointer}.cma-grupo-acoes .cma-grupo-excluir{color:#b91c1c;background:#fef2f2}
      .cma-grupo-acao{margin-top:18px;padding-top:16px;border-top:1px solid #e2e8f0}.cma-grupo-acao button{width:100%;padding:12px;border-radius:9px;background:#172554;color:#fff;font-size:14px;font-weight:800;cursor:pointer}.cma-grupo-acao small{display:block;margin-top:7px;color:#64748b;font-size:11.5px;text-align:center}
      @media(max-width:800px){.cma-custo-identificacao{grid-template-columns:1fr}.cma-custo-texto{font-size:16px}.cma-grupo-cabecalho{align-items:flex-start;flex-direction:column}.cma-grupo-botoes{width:100%;flex-direction:column}.cma-grupo-botoes button{width:100%;font-size:14px}.cma-grupo-resumo{grid-template-columns:1fr 1fr}.cma-grupo-item{grid-template-columns:34px minmax(0,1fr) auto}.cma-grupo-valor{grid-column:2/4;text-align:left}.cma-grupo-acoes{grid-column:1/4;display:grid;grid-template-columns:repeat(3,1fr)}.cma-grupo-acoes button{font-size:13px;padding:9px 6px}}
      @media(max-width:480px){.cma-custo-modo{grid-template-columns:1fr}.cma-grupo-resumo{grid-template-columns:1fr}.cma-grupo-item{grid-template-columns:34px minmax(0,1fr)}.cma-grupo-valor{grid-column:2}.cma-grupo-acoes{grid-column:1/3}}
    `;document.head.appendChild(st);}
    renderizar();return true;
  }

  let tentativas=0;function iniciar(){if(instalar())return;if(++tentativas<80)setTimeout(iniciar,250);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
