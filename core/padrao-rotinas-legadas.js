(function(){
  if(window.CMAPadraoRotinasLegadas)return;
  const ids=['jornada','beneficios','sst','sst-cipa','sst-riscos-psicossociais','sst-campanhas','acidente','faltas-justificaveis','mei','cargos'];

  function aplicarClasses(){
    ids.forEach(id=>{
      const sec=document.getElementById(id);if(!sec)return;
      sec.classList.add('cma-rotina-legada-padronizada');
      sec.querySelectorAll('.space-y-4.text-sm.text-gray-700,.space-y-3.text-sm.text-gray-700').forEach(bloco=>bloco.classList.add('cma-legado-lista'));
      sec.querySelectorAll('.cma-legado-lista > div,.cma-legado-lista > section').forEach(item=>item.classList.add('cma-legado-item'));
    });
  }

  function instalarEstilo(){
    if(document.getElementById('cma-padrao-rotinas-legadas-style'))return;
    const st=document.createElement('style');st.id='cma-padrao-rotinas-legadas-style';st.textContent=`
      .cma-rotina-legada-padronizada{--cma-navy:#172554;--cma-blue:#2563eb;--cma-text:#475569;--cma-muted:#64748b;--cma-line:#e2e8f0;--cma-soft:#f8fbff;--cma-alert:#fffbeb;--cma-alert-line:#f59e0b}
      .cma-rotina-legada-padronizada>div:first-child{margin-bottom:18px!important;padding-bottom:14px!important}
      .cma-rotina-legada-padronizada h3{font-size:24px!important;line-height:1.3!important;color:var(--cma-navy)!important}
      .cma-rotina-legada-padronizada .cma-legado-lista{display:block!important;border-top:1px solid var(--cma-line)!important}
      .cma-rotina-legada-padronizada .cma-legado-lista>.cma-legado-item{margin:0!important;padding:19px 2px!important;border:0!important;border-bottom:1px solid var(--cma-line)!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
      .cma-rotina-legada-padronizada .cma-legado-item>strong:first-child,.cma-rotina-legada-padronizada .cma-legado-item>h4:first-child,.cma-rotina-legada-padronizada .cma-legado-item>h5:first-child{display:block!important;margin:0 0 6px!important;color:var(--cma-navy)!important;font-size:17px!important;line-height:1.4!important;font-weight:850!important}
      .cma-rotina-legada-padronizada p,.cma-rotina-legada-padronizada li{font-size:15px!important;line-height:1.7!important;color:var(--cma-text)!important;text-align:left!important}
      .cma-rotina-legada-padronizada .text-xs{font-size:13px!important;line-height:1.6!important}
      .cma-rotina-legada-padronizada .bg-amber-50,.cma-rotina-legada-padronizada .bg-yellow-50{border-left:4px solid var(--cma-alert-line)!important;background:var(--cma-alert)!important;border-radius:0 8px 8px 0!important;box-shadow:none!important}
      .cma-rotina-legada-padronizada .bg-blue-50{box-shadow:none!important}
      .cma-rotina-legada-padronizada button:not(.cma-nav-btn){font-size:13.5px}
      @media(max-width:700px){
        .cma-rotina-legada-padronizada h3{font-size:22px!important}
        .cma-rotina-legada-padronizada .cma-legado-item>strong:first-child,.cma-rotina-legada-padronizada .cma-legado-item>h4:first-child,.cma-rotina-legada-padronizada .cma-legado-item>h5:first-child{font-size:18px!important}
        .cma-rotina-legada-padronizada p,.cma-rotina-legada-padronizada li{font-size:16px!important}
      }
    `;document.head.appendChild(st);
  }

  function aplicar(){instalarEstilo();aplicarClasses();return true;}
  window.CMAPadraoRotinasLegadas={aplicar};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',aplicar,{once:true});else aplicar();
  document.addEventListener('cma:modulos-prontos',aplicar);
  document.addEventListener('cma:navegacao-atualizada',aplicar);
})();