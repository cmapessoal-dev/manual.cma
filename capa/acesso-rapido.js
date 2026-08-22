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
    const hero=document.querySelector('.cma-hero-content');
    const actions=document.querySelector('.cma-hero-actions');
    if(!hero||!actions)return false;

    const bloco=document.createElement('div');
    bloco.id='cma-acesso-rapido';
    bloco.className='cma-acesso-rapido';
    bloco.innerHTML=`
      <div class="cma-acesso-rapido-titulo">Acesso rápido</div>
      <div class="cma-acesso-rapido-grid">
        ${atalhos.map(a=>`<button type="button" class="cma-acesso-rapido-item" data-id="${a.id}">${a.rotulo}<span aria-hidden="true">→</span></button>`).join('')}
      </div>`;

    actions.insertAdjacentElement('afterend',bloco);
    bloco.querySelectorAll('.cma-acesso-rapido-item').forEach(btn=>btn.addEventListener('click',()=>abrir(btn.dataset.id)));
    return true;
  }

  function estilo(){
    if(document.getElementById('cma-acesso-rapido-style'))return;
    const st=document.createElement('style');
    st.id='cma-acesso-rapido-style';
    st.textContent=`
      .cma-acesso-rapido{width:min(760px,100%);margin:22px auto 0;padding:14px 16px 15px;border:1px solid rgba(255,255,255,.13);border-radius:14px;background:rgba(255,255,255,.055);backdrop-filter:blur(8px);box-shadow:0 10px 28px rgba(0,0,0,.08)}
      .cma-acesso-rapido-titulo{margin-bottom:10px;color:rgba(255,255,255,.72);font-size:11px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;text-align:left}
      .cma-acesso-rapido-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
      .cma-acesso-rapido-item{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:38px;padding:8px 10px;border:1px solid rgba(255,255,255,.12);border-radius:9px;background:rgba(255,255,255,.075);color:#fff;font-size:12px;font-weight:700;text-align:left;cursor:pointer;transition:.18s}
      .cma-acesso-rapido-item:hover{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.22);transform:translateY(-1px)}
      .cma-acesso-rapido-item span{color:#fbbf24;font-size:14px;flex:0 0 auto}
      @media(max-width:760px){.cma-acesso-rapido{margin-top:18px;padding:12px}.cma-acesso-rapido-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.cma-acesso-rapido-item{font-size:13px;min-height:42px}}
      @media(max-width:390px){.cma-acesso-rapido-grid{grid-template-columns:1fr}}
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
