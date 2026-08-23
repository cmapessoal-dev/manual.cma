(function(){
  if(window.CMAFerramentas)return;

  function texto(id){const el=document.getElementById(id);return el?(el.value||'').trim():'';}
  function numero(id){const el=document.getElementById(id);if(!el)return 0;const n=parseFloat(String(el.value||'0').replace(',','.'));return Number.isFinite(n)?n:0;}
  function moeda(v){return (Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}

  function limpar(secao,callback){
    if(!secao)return;
    secao.querySelectorAll('input[type="text"],input[type="number"],textarea').forEach(el=>{
      if(el.type==='number')el.value=el.dataset.cmaDefault||'0';else el.value='';
    });
    const grupos=new Set([...secao.querySelectorAll('input[type="radio"]')].map(x=>x.name));
    grupos.forEach(nome=>{
      const radios=[...secao.querySelectorAll(`input[type="radio"][name="${CSS.escape(nome)}"]`)];
      const padrao=radios.find(r=>r.dataset.cmaDefault==='true')||radios[0];
      radios.forEach(r=>r.checked=r===padrao);
    });
    secao.querySelectorAll('select').forEach(el=>el.selectedIndex=0);
    secao.querySelectorAll('input').forEach(el=>el.dispatchEvent(new Event('change',{bubbles:true})));
    if(typeof callback==='function')callback();
  }

  function adicionarAcoes(secaoId,{onLimpar}={}){
    const secao=document.getElementById(secaoId);if(!secao||secao.querySelector('.cma-ferramenta-acoes'))return;
    const cab=secao.querySelector(':scope > div:first-child');if(!cab)return;
    const acoes=document.createElement('div');acoes.className='cma-ferramenta-acoes';
    const limparBtn=document.createElement('button');limparBtn.type='button';limparBtn.className='cma-ferramenta-limpar';limparBtn.textContent='Limpar campos';
    limparBtn.addEventListener('click',()=>limpar(secao,onLimpar));acoes.appendChild(limparBtn);cab.appendChild(acoes);
  }

  function identificacao(){return {empresa:texto('cma-custo-empresa'),empregado:texto('cma-custo-empregado')};}

  window.CMAFerramentas={texto,numero,moeda,limpar,adicionarAcoes,identificacao,versao:'1.0'};

  if(!document.getElementById('cma-ferramentas-base-style')){
    const st=document.createElement('style');st.id='cma-ferramentas-base-style';st.textContent=`
      .cma-ferramenta-acoes{display:flex;align-items:center;gap:8px;margin-left:auto}.cma-ferramenta-limpar{padding:7px 10px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#475569;font-size:12px;font-weight:800;cursor:pointer}.cma-ferramenta-limpar:hover{background:#f8fafc;color:#172554}@media(max-width:640px){.cma-ferramenta-acoes{width:100%;margin:10px 0 0}.cma-ferramenta-limpar{width:100%;font-size:14px;padding:10px}}
    `;document.head.appendChild(st);
  }

  function aplicar(){if(document.getElementById('custo-empregado'))adicionarAcoes('custo-empregado');}
  aplicar();document.addEventListener('cma:modulos-prontos',aplicar);
})();
