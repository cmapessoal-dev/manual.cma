(function(){
  function aplicar(){
    const registro=window.CMARegistroManual;
    const pagina=registro?.pagina?.('experiencia');
    if(pagina) pagina.nome='Tipos de Contratos';

    const menu=document.getElementById('manual-menu');
    if(menu){
      const botao=[...menu.querySelectorAll('button')].find(b=>(b.getAttribute('onclick')||'').includes("'experiencia'"));
      if(botao){
        [...botao.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE).forEach(n=>n.remove());
        botao.appendChild(document.createTextNode(' Tipos de Contratos'));
      }
    }

    const sec=document.getElementById('experiencia');
    const titulo=sec?.querySelector('h3');
    if(titulo && /Contrato de Experi[eê]ncia/i.test(titulo.textContent||'')) titulo.textContent='Tipos de Contratos';
  }

  let tentativas=0;
  (function iniciar(){aplicar();if(++tentativas<40)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
  document.addEventListener('cma:navegacao-atualizada',aplicar);
})();
