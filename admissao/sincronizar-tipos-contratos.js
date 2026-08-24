(function(){
  function aplicar(){
    const registro=window.CMARegistroManual;
    const pagina=registro?.pagina?.('experiencia');
    if(pagina)pagina.nome='Tipos de Contratos';

    const menu=document.getElementById('manual-menu');
    if(!menu)return false;
    const botao=[...menu.querySelectorAll('button')].find(b=>(b.getAttribute('onclick')||'').includes("'experiencia'"));
    if(!botao)return false;
    const textos=[...botao.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE);
    if(textos.length)textos[textos.length-1].textContent=' Tipos de Contratos';
    else botao.append(document.createTextNode(' Tipos de Contratos'));
    return true;
  }

  let tentativas=0;(function iniciar(){aplicar();if(++tentativas<40)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();
