(function(){
  if(window.CMATitulosDemissao)return;

  function trocarTextoPreservandoIcone(el,texto){
    if(!el)return;
    const noTexto=[...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());
    if(noTexto)noTexto.textContent=' '+texto;
    else el.appendChild(document.createTextNode(' '+texto));
  }

  function aplicar(){
    const sec=document.getElementById('demissao');
    if(!sec)return false;

    trocarTextoPreservandoIcone(sec.querySelector('h3'),'Rescisão do Contrato de Trabalho');
    const btn=typeof getMenuButton==='function'?getMenuButton('demissao'):null;
    trocarTextoPreservandoIcone(btn,'Rescisão do Contrato de Trabalho');

    const rotulo=sec.querySelector('.cma-dem-info-head > span');
    if(rotulo)rotulo.textContent='Desligamento de funcionários';
    return true;
  }

  window.CMATitulosDemissao={aplicar};
  let n=0;(function tentar(){if(aplicar())return;if(++n<50)setTimeout(tentar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
  document.addEventListener('cma:navegacao-atualizada',aplicar);
})();