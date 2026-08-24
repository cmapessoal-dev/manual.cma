(function(){
  function aplicar(){
    if(typeof manualSections==='undefined'||!window.CMARegistroManual)return false;
    const disponiveis=CMARegistroManual.paginas
      .filter(p=>document.getElementById(p.id))
      .map(p=>({id:p.id,nome:p.nome}));
    manualSections.splice(0,manualSections.length,...disponiveis);
    document.querySelectorAll('#manual-menu button').forEach(b=>{
      if((b.getAttribute('onclick')||'').includes("'fiscalizacao'"))b.remove();
    });
    document.getElementById('fiscalizacao')?.classList.add('cma-secao-legada');
    if(typeof updateSectionNavigation==='function')manualSections.forEach(x=>updateSectionNavigation(x.id));
    window.CMA_MANUAL_SECTIONS=manualSections;
    document.dispatchEvent(new CustomEvent('cma:navegacao-atualizada',{detail:{secoes:manualSections.map(x=>x.id)}}));
    return true;
  }
  let n=0;(function tentar(){if(aplicar())return;if(++n<40)setTimeout(tentar,150)})();
})();
