(function(){
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
      .cma-ferramentas-grupo{margin:4px 0}
      .cma-ferramentas-toggle{display:flex;align-items:center;width:100%;gap:9px;padding:9px 12px;border:0;border-left:4px solid transparent;border-radius:6px;background:transparent;color:#475569;font-size:14px;font-weight:700;text-align:left;cursor:pointer;transition:.18s}
      .cma-ferramentas-toggle:hover{background:#f8fafc;color:#172554}
      .cma-ferramentas-toggle svg{width:16px;height:16px;flex:0 0 16px}
      .cma-ferramentas-seta{margin-left:auto;font-size:15px;line-height:1;transition:transform .2s;color:#94a3b8}
      .cma-ferramentas-grupo.is-open .cma-ferramentas-seta{transform:rotate(180deg)}
      .cma-ferramentas-submenu{display:none;margin:2px 0 4px 10px;padding-left:10px;border-left:1px solid #e2e8f0}
      .cma-ferramentas-grupo.is-open .cma-ferramentas-submenu{display:block}
      .cma-ferramentas-submenu>button{padding-left:10px!important;font-size:13px!important}
      .cma-ferramentas-submenu>button svg{width:15px!important;height:15px!important}
      @media(max-width:640px){.cma-ferramentas-toggle{font-size:15px;padding-top:10px;padding-bottom:10px}.cma-ferramentas-submenu>button{font-size:14px!important}}
    `;
    document.head.appendChild(st);
  }

  function localizarBotao(id){
    if(typeof getMenuButton==='function')return getMenuButton(id);
    return [...document.querySelectorAll('#manual-menu button')].find(b=>(b.getAttribute('onclick')||'').includes(`'${id}'`));
  }

  function criarGrupo(){
    const menu=document.getElementById('manual-menu');
    const botaoCusto=localizarBotao('custo-empregado');
    const botaoModelos=localizarBotao('modelos');
    if(!menu||!botaoCusto||!botaoModelos)return false;
    if(document.getElementById('cma-ferramentas-grupo'))return true;

    const referencia=botaoModelos;
    const grupo=document.createElement('div');
    grupo.id='cma-ferramentas-grupo';
    grupo.className='cma-ferramentas-grupo';
    grupo.innerHTML=`
      <button type="button" class="cma-ferramentas-toggle" aria-expanded="false" aria-controls="cma-ferramentas-submenu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.9 7.9l-5.7 5.7a2.1 2.1 0 0 1-3-3l5.7-5.7a6 6 0 0 1 7.9-7.9z"/></svg>
        <span>Ferramentas</span>
        <span class="cma-ferramentas-seta" aria-hidden="true">⌄</span>
      </button>
      <div id="cma-ferramentas-submenu" class="cma-ferramentas-submenu"></div>`;

    menu.insertBefore(grupo,referencia);
    const submenu=grupo.querySelector('.cma-ferramentas-submenu');
    submenu.appendChild(botaoModelos);
    submenu.appendChild(botaoCusto);

    const toggle=grupo.querySelector('.cma-ferramentas-toggle');
    function abrir(estado){
      grupo.classList.toggle('is-open',estado);
      toggle.setAttribute('aria-expanded',String(estado));
    }
    toggle.addEventListener('click',()=>abrir(!grupo.classList.contains('is-open')));

    [botaoModelos,botaoCusto].forEach(botao=>botao.addEventListener('click',()=>abrir(true)));

    const hash=(location.hash||'').replace('#','');
    abrir(hash==='custo-empregado'||hash==='modelos');

    const obs=new MutationObserver(()=>{
      const ativo=[botaoModelos,botaoCusto].some(botao=>botao.classList.contains('bg-blue-50')||botao.classList.contains('active-menu-btn'));
      if(ativo)abrir(true);
    });
    [botaoModelos,botaoCusto].forEach(botao=>obs.observe(botao,{attributes:true,attributeFilter:['class']}));
    return true;
  }

  function iniciar(){
    instalarEstilo();
    let tentativas=0;
    (function tentar(){if(criarGrupo())return;if(++tentativas<60)setTimeout(tentar,200)})();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
