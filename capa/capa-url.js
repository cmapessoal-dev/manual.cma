(function(){
  function carregarAcessoRapido(){
    if(document.getElementById('cma-acesso-rapido-loader')||document.getElementById('cma-acesso-rapido'))return;
    const script=document.createElement('script');
    script.id='cma-acesso-rapido-loader';
    script.src='capa/acesso-rapido.js?v=20260822';
    document.body.appendChild(script);
  }

  function instalarUrlDaCapa(){
    carregarAcessoRapido();
    const capa=document.querySelector('.cma-hero');
    if(!capa||window.__cmaUrlCapaInstalada)return;
    window.__cmaUrlCapaInstalada=true;

    let habilitado=false;
    setTimeout(()=>{habilitado=true;},900);

    const limparHashDaCapa=()=>{
      if(!habilitado||!window.location.hash)return;
      const r=capa.getBoundingClientRect();
      const alturaVisivel=Math.max(0,Math.min(window.innerHeight,r.bottom)-Math.max(0,r.top));
      const proporcao=alturaVisivel/Math.max(1,Math.min(capa.offsetHeight,window.innerHeight));
      if(proporcao>=0.65){
        history.replaceState({section:'capa'},'',window.location.pathname+window.location.search);
      }
    };

    let ticking=false;
    window.addEventListener('scroll',()=>{
      if(ticking)return;
      ticking=true;
      requestAnimationFrame(()=>{
        limparHashDaCapa();
        ticking=false;
      });
    },{passive:true});

    window.addEventListener('pageshow',()=>setTimeout(limparHashDaCapa,1000));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',instalarUrlDaCapa);else instalarUrlDaCapa();
})();
