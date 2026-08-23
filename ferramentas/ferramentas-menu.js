(function(){
  const grupos=[
    {
      id:'rotinas',
      titulo:'Rotinas Trabalhistas',
      icone:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
      itens:['admissao','experiencia','jornada','comercio-feriados','afastamentos','faltas-justificaveis','ferias','beneficios','demissao','acidente','mei','cargos']
    },
    {
      id:'sst',
      titulo:'SST',
      icone:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
      itens:['sst']
    },
    {
      id:'prazos',
      titulo:'Prazos e Calendários',
      icone:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
      itens:['cronograma','guarda-documentos']
    },
    {
      id:'ferramentas',
      titulo:'Ferramentas',
      icone:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.9 7.9l-5.7 5.7a2.1 2.1 0 0 1-3-3l5.7-5.7a6 6 0 0 1 7.9-7.9z"/>',
      itens:['modelos','custo-empregado']
    },
    {
      id:'referencias',
      titulo:'Referências',
      icone:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
      itens:['tabela-multas','baselegal']
    }
  ];

  const subtemasSST=[
    ['cma-sst-programas','Programas e Laudos'],
    ['cma-sst-cipa','CIPA'],
    ['cma-sst-riscos-psicossociais','Riscos Psicossociais'],
    ['cma-sst-campanhas','Campanhas de Saúde']
  ];

  let organizando=false;
  let agendado=false;

  function instalarEstilo(){
    if(document.getElementById('cma-ferramentas-menu-style'))return;
    const st=document.createElement('style');
    st.id='cma-ferramentas-menu-style';
    st.textContent=`
      @media(min-width:1024px){
        #manual-menu{max-height:calc(100vh - 3rem);overflow-y:auto;overscroll-behavior:contain;scrollbar-gutter:stable;padding-right:10px}
        #manual-menu::-webkit-scrollbar{width:7px}
        #manual-menu::-webkit-scrollbar-track{background:transparent}
        #manual-menu::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:999px}
        #manual-menu::-webkit-scrollbar-thumb:hover{background:#94a3b8}
      }
      .cma-sumario-grupo{margin:3px 0}
      .cma-sumario-toggle{display:flex;align-items:center;width:100%;gap:9px;padding:9px 12px;border:0;border-left:4px solid transparent;border-radius:6px;background:transparent;color:#475569;font-size:14px;font-weight:700;text-align:left;cursor:pointer;transition:.18s}
      .cma-sumario-toggle:hover{background:#f8fafc;color:#172554}
      .cma-sumario-toggle svg{width:16px;height:16px;flex:0 0 16px}
      .cma-sumario-seta{margin-left:auto;font-size:15px;line-height:1;transition:transform .2s;color:#94a3b8}
      .cma-sumario-grupo.is-open>.cma-sumario-toggle{background:#f8fafc;color:#172554}
      .cma-sumario-grupo.is-open>.cma-sumario-toggle .cma-sumario-seta{transform:rotate(180deg)}
      .cma-sumario-submenu{display:none;margin:2px 0 5px 10px;padding-left:10px;border-left:1px solid #e2e8f0}
      .cma-sumario-grupo.is-open>.cma-sumario-submenu{display:block}
      .cma-sumario-submenu>button{padding-left:10px!important;font-size:13px!important}
      .cma-sumario-submenu>button svg{width:15px!important;height:15px!important}
      .cma-sst-subtemas{margin:2px 0 5px 25px;padding-left:9px;border-left:1px dashed #cbd5e1}
      .cma-sst-subtema{display:block;width:100%;padding:6px 8px;border:0;border-radius:5px;background:transparent;color:#64748b;font-size:12px;font-weight:600;text-align:left;cursor:pointer;transition:.15s}
      .cma-sst-subtema:hover{background:#f1f5f9;color:#172554}
      #manual-menu>.border-t{display:none!important}
      @media(max-width:640px){
        .cma-sumario-toggle{font-size:15px;padding-top:10px;padding-bottom:10px}
        .cma-sumario-submenu>button{font-size:14px!important}
        .cma-sst-subtema{font-size:13px;padding:7px 8px}
      }
    `;
    document.head.appendChild(st);
  }

  function localizarBotao(id){
    const menu=document.getElementById('manual-menu');
    if(!menu)return null;
    return [...menu.querySelectorAll('button')].find(b=>{
      if(b.classList.contains('cma-sumario-toggle')||b.classList.contains('cma-sst-subtema'))return false;
      return (b.getAttribute('onclick')||'').includes(`'${id}'`);
    })||null;
  }

  function removerFiscalizacao(){
    const botao=localizarBotao('fiscalizacao');
    if(botao)botao.remove();
    if(typeof manualSections!=='undefined'){
      const i=manualSections.findIndex(x=>x.id==='fiscalizacao');
      if(i>=0)manualSections.splice(i,1);
    }
  }

  function abrirGrupo(grupo,estado,fecharOutros){
    if(!grupo)return;
    if(estado&&fecharOutros){
      document.querySelectorAll('#manual-menu .cma-sumario-grupo.is-open').forEach(g=>{
        if(g!==grupo){
          g.classList.remove('is-open');
          const t=g.querySelector(':scope > .cma-sumario-toggle');
          if(t)t.setAttribute('aria-expanded','false');
        }
      });
    }
    grupo.classList.toggle('is-open',estado);
    const toggle=grupo.querySelector(':scope > .cma-sumario-toggle');
    if(toggle)toggle.setAttribute('aria-expanded',String(estado));
  }

  function criarEstruturaGrupo(menu,cfg){
    let grupo=document.getElementById(`cma-sumario-${cfg.id}`);
    if(grupo)return grupo;
    grupo=document.createElement('div');
    grupo.id=`cma-sumario-${cfg.id}`;
    grupo.className='cma-sumario-grupo';
    grupo.innerHTML=`
      <button type="button" class="cma-sumario-toggle" aria-expanded="false" aria-controls="cma-sumario-submenu-${cfg.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${cfg.icone}</svg>
        <span>${cfg.titulo}</span>
        <span class="cma-sumario-seta" aria-hidden="true">⌄</span>
      </button>
      <div id="cma-sumario-submenu-${cfg.id}" class="cma-sumario-submenu"></div>`;
    menu.appendChild(grupo);
    const toggle=grupo.querySelector('.cma-sumario-toggle');
    toggle.addEventListener('click',()=>abrirGrupo(grupo,!grupo.classList.contains('is-open'),true));
    return grupo;
  }

  function criarSubtemasSST(grupo){
    const submenu=grupo.querySelector('.cma-sumario-submenu');
    const botaoSST=localizarBotao('sst');
    if(!submenu||!botaoSST)return;
    let bloco=submenu.querySelector('.cma-sst-subtemas');
    if(!bloco){
      bloco=document.createElement('div');
      bloco.className='cma-sst-subtemas';
      bloco.innerHTML=subtemasSST.map(([id,rotulo])=>`<button type="button" class="cma-sst-subtema" data-alvo="${id}">${rotulo}</button>`).join('');
      botaoSST.insertAdjacentElement('afterend',bloco);
      bloco.querySelectorAll('.cma-sst-subtema').forEach(btn=>btn.addEventListener('click',()=>{
        abrirGrupo(grupo,true,true);
        if(typeof showSection==='function')showSection('sst',botaoSST);
        setTimeout(()=>{
          const alvo=document.getElementById(btn.dataset.alvo);
          if(alvo)alvo.scrollIntoView({behavior:'smooth',block:'start'});
        },100);
      }));
    }
  }

  function reorganizar(){
    const menu=document.getElementById('manual-menu');
    if(!menu||organizando)return false;
    organizando=true;
    try{
      removerFiscalizacao();
      const intro=localizarBotao('introducao');
      let ancora=intro?intro.nextSibling:null;

      grupos.forEach(cfg=>{
        const grupo=criarEstruturaGrupo(menu,cfg);
        if(ancora!==grupo){
          if(ancora)menu.insertBefore(grupo,ancora);else menu.appendChild(grupo);
        }
        const submenu=grupo.querySelector('.cma-sumario-submenu');
        cfg.itens.forEach(id=>{
          const botao=localizarBotao(id);
          if(botao&&botao.parentElement!==submenu){
            submenu.appendChild(botao);
            if(!botao.dataset.cmaGrupoLigado){
              botao.dataset.cmaGrupoLigado='1';
              botao.addEventListener('click',()=>abrirGrupo(grupo,true,true));
            }
          }
        });
        if(cfg.id==='sst')criarSubtemasSST(grupo);
        ancora=grupo.nextSibling;
      });

      const hash=(location.hash||'').replace(/^#/,'');
      let grupoAtivo=null;
      grupos.forEach(cfg=>{
        const grupo=document.getElementById(`cma-sumario-${cfg.id}`);
        const botoes=cfg.itens.map(localizarBotao).filter(Boolean);
        const ativo=botoes.some(b=>b.classList.contains('bg-blue-50')||b.classList.contains('active-menu-btn'));
        if(ativo||cfg.itens.includes(hash))grupoAtivo=grupo;
      });
      if(grupoAtivo)abrirGrupo(grupoAtivo,true,true);
      return true;
    }finally{
      organizando=false;
    }
  }

  function agendarReorganizacao(){
    if(agendado)return;
    agendado=true;
    requestAnimationFrame(()=>{agendado=false;reorganizar();});
  }

  function observarAtivos(){
    const menu=document.getElementById('manual-menu');
    if(!menu)return;
    const obs=new MutationObserver(muts=>{
      if(organizando)return;
      const relevante=muts.some(m=>m.type==='childList'||(m.type==='attributes'&&m.attributeName==='class'));
      if(relevante)agendarReorganizacao();
    });
    obs.observe(menu,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }

  function iniciar(){
    instalarEstilo();
    let tentativas=0;
    (function tentar(){
      const menu=document.getElementById('manual-menu');
      if(menu){
        reorganizar();
        observarAtivos();
        setTimeout(reorganizar,500);
        setTimeout(reorganizar,1500);
        setTimeout(reorganizar,3000);
        return;
      }
      if(++tentativas<60)setTimeout(tentar,200);
    })();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();