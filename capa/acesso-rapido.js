(function(){
  const atalhos=[
    {id:'admissao',rotulo:'Admissão'},
    {id:'jornada',rotulo:'Jornada'},
    {id:'ferias',rotulo:'Férias'},
    {id:'demissao',rotulo:'Demissão'},
    {id:'modelos',rotulo:'Modelos'},
    {id:'custo-empregado',rotulo:'Custo do Empregado'},
    {id:'cronograma',rotulo:'Calendário'}
  ];

  function abrir(id){
    const secao=document.getElementById(id);
    if(!secao)return;
    let botao=null;
    if(typeof getMenuButton==='function')botao=getMenuButton(id);
    if(!botao)botao=[...document.querySelectorAll('#manual-menu button')].find(b=>(b.getAttribute('onclick')||'').includes("'"+id+"'"));
    if(typeof showSection==='function')showSection(id,botao||null);
    else secao.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(()=>{
      const main=document.querySelector('#manual-conteudo main');
      if(main)main.scrollIntoView({behavior:'smooth',block:'start'});
    },80);
  }

  function criar(){
    if(document.getElementById('cma-acesso-rapido'))return true;
    const actions=document.querySelector('.cma-hero-actions');
    if(!actions)return false;

    const bloco=document.createElement('div');
    bloco.id='cma-acesso-rapido';
    bloco.className='cma-acesso-rapido';
    bloco.innerHTML=`
      <span class="cma-acesso-rapido-titulo">Acesso rápido:</span>
      <div class="cma-acesso-rapido-links">
        ${atalhos.map((a,i)=>`<button type="button" class="cma-acesso-rapido-link" data-id="${a.id}">${a.rotulo}</button>${i<atalhos.length-1?'<span class="cma-acesso-rapido-sep" aria-hidden="true">•</span>':''}`).join('')}
      </div>`;

    actions.insertAdjacentElement('afterend',bloco);
    bloco.querySelectorAll('.cma-acesso-rapido-link').forEach(btn=>btn.addEventListener('click',()=>abrir(btn.dataset.id)));
    return true;
  }

  function estilo(){
    if(document.getElementById('cma-acesso-rapido-style'))return;
    const st=document.createElement('style');
    st.id='cma-acesso-rapido-style';
    st.textContent=`
      .cma-acesso-rapido{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:7px 10px;width:min(900px,100%);margin:18px auto 0;color:rgba(255,255,255,.65)}
      .cma-acesso-rapido-titulo{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}
      .cma-acesso-rapido-links{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:5px 8px}
      .cma-acesso-rapido-link{padding:2px 0;border:0;background:transparent;color:rgba(255,255,255,.86);font-size:12px;font-weight:600;cursor:pointer;transition:.18s;text-decoration:none}
      .cma-acesso-rapido-link:hover{color:#fff;text-decoration:underline;text-underline-offset:3px}
      .cma-acesso-rapido-sep{color:rgba(255,255,255,.28);font-size:10px}
      @media(max-width:640px){.cma-acesso-rapido{margin-top:15px;gap:6px}.cma-acesso-rapido-titulo{width:100%;text-align:center}.cma-acesso-rapido-links{gap:5px 7px}.cma-acesso-rapido-link{font-size:12.5px}}
    `;
    document.head.appendChild(st);
  }

  function iniciar(){
    estilo();
    let tentativas=0;
    (function tentar(){if(criar())return;if(++tentativas<40)setTimeout(tentar,250)})();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
