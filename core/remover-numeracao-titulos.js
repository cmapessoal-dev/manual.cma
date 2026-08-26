(function(){
  if(window.CMARemoverNumeracaoTitulos)return;

  function limparTitulo(el){
    if(!el)return;
    const nodes=[...el.childNodes];
    const textoNode=nodes.find(n=>n.nodeType===Node.TEXT_NODE&&/\S/.test(n.textContent||''));
    if(textoNode){
      textoNode.textContent=(textoNode.textContent||'').replace(/^\s*\d+\s*[.\-:)]+\s*/, ' ');
      return;
    }
    const original=el.textContent||'';
    const limpo=original.replace(/^\s*\d+\s*[.\-:)]+\s*/, '');
    if(limpo!==original)el.textContent=limpo;
  }

  function aplicar(){
    document.querySelectorAll('.manual-section').forEach(sec=>{
      const h3=sec.querySelector('h3');
      if(h3)limparTitulo(h3);
    });
    return true;
  }

  window.CMARemoverNumeracaoTitulos={aplicar};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',aplicar,{once:true});else aplicar();
  document.addEventListener('cma:modulos-prontos',aplicar);
  document.addEventListener('cma:navegacao-atualizada',aplicar);
})();
