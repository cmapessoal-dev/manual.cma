(function(){
  if(window.CMASSTPadrao)return;

  function aplicar(){
    if(document.getElementById('cma-sst-padrao-style'))return true;
    const st=document.createElement('style');
    st.id='cma-sst-padrao-style';
    st.textContent=`
      #sst,#sst-cipa,#sst-riscos-psicossociais,#sst-campanhas{--cma-navy:#172554;--cma-blue:#2563eb;--cma-text:#475569;--cma-muted:#64748b;--cma-line:#e2e8f0;--cma-soft:#f8fbff;--cma-alert:#fffbeb;--cma-alert-line:#f59e0b}
      #sst>div:first-child,#sst-cipa>div:first-child,#sst-riscos-psicossociais>div:first-child,#sst-campanhas>div:first-child{margin-bottom:22px!important;padding-bottom:14px!important;border-bottom:1px solid var(--cma-line)!important}
      #sst>div:first-child h3,#sst-cipa>div:first-child h3,#sst-riscos-psicossociais>div:first-child h3,#sst-campanhas>div:first-child h3{margin:0!important;color:var(--cma-navy)!important;font-size:24px!important;font-weight:900!important;line-height:1.3!important}
      #sst>div:first-child p,#sst-cipa>div:first-child p,#sst-riscos-psicossociais>div:first-child p,#sst-campanhas>div:first-child p{margin:7px 0 0!important;color:var(--cma-muted)!important;font-size:15px!important;line-height:1.65!important;text-align:left!important}

      #sst .space-y-4.text-sm.text-gray-700,#sst-cipa .space-y-4.text-sm.text-gray-700,#sst-riscos-psicossociais .space-y-4.text-sm.text-gray-700,#sst-campanhas .space-y-4.text-sm.text-gray-700{display:block!important}
      #sst .bg-white,#sst-cipa .bg-white,#sst-riscos-psicossociais .bg-white,#sst-campanhas .bg-white{margin:0!important;padding:19px 2px!important;border:0!important;border-top:1px solid var(--cma-line)!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}
      #sst .bg-white:last-child,#sst-cipa .bg-white:last-child,#sst-riscos-psicossociais .bg-white:last-child,#sst-campanhas .bg-white:last-child{border-bottom:1px solid var(--cma-line)!important}
      #sst .bg-white h4,#sst-cipa .bg-white h4,#sst-riscos-psicossociais .bg-white h4,#sst-campanhas .bg-white h4{margin:0 0 7px!important;color:var(--cma-navy)!important;font-size:17px!important;font-weight:850!important;line-height:1.4!important}
      #sst .bg-white p,#sst-cipa .bg-white p,#sst-riscos-psicossociais .bg-white p,#sst-campanhas .bg-white p,#sst .bg-white li,#sst-cipa .bg-white li,#sst-riscos-psicossociais .bg-white li,#sst-campanhas .bg-white li{color:var(--cma-text)!important;font-size:15px!important;line-height:1.7!important;text-align:left!important}
      #sst .bg-white ul,#sst-cipa .bg-white ul,#sst-riscos-psicossociais .bg-white ul,#sst-campanhas .bg-white ul{margin-top:8px!important}

      #sst .bg-amber-50,#sst-cipa .bg-amber-50,#sst-riscos-psicossociais .bg-amber-50,#sst-campanhas .bg-amber-50{margin:18px 0!important;padding:14px 15px!important;border:1px solid #bfdbfe!important;border-left:4px solid var(--cma-blue)!important;border-radius:10px!important;background:var(--cma-soft)!important;box-shadow:none!important}
      #sst .bg-amber-50 strong,#sst-cipa .bg-amber-50 strong,#sst-riscos-psicossociais .bg-amber-50 strong,#sst-campanhas .bg-amber-50 strong,#sst .bg-amber-50 p,#sst-cipa .bg-amber-50 p,#sst-riscos-psicossociais .bg-amber-50 p,#sst-campanhas .bg-amber-50 p{color:var(--cma-navy)!important}

      #sst .bg-red-50,#sst-cipa .bg-red-50,#sst-riscos-psicossociais .bg-red-50,#sst-campanhas .bg-red-50{margin:14px 0!important;padding:13px 14px!important;border:1px solid #bfdbfe!important;border-left:4px solid var(--cma-blue)!important;border-radius:10px!important;background:var(--cma-soft)!important;box-shadow:none!important}
      #sst .bg-red-50 strong,#sst-cipa .bg-red-50 strong,#sst-riscos-psicossociais .bg-red-50 strong,#sst-campanhas .bg-red-50 strong,#sst .bg-red-50 p,#sst-cipa .bg-red-50 p,#sst-riscos-psicossociais .bg-red-50 p,#sst-campanhas .bg-red-50 p{color:var(--cma-navy)!important}

      #sst .bg-blue-50,#sst-cipa .bg-blue-50,#sst-riscos-psicossociais .bg-blue-50,#sst-campanhas .bg-blue-50{margin:14px 0!important;padding:13px 14px!important;border:1px solid #bfdbfe!important;border-left:4px solid var(--cma-blue)!important;border-radius:10px!important;background:var(--cma-soft)!important;box-shadow:none!important}
      #sst .bg-blue-50 strong,#sst-cipa .bg-blue-50 strong,#sst-riscos-psicossociais .bg-blue-50 strong,#sst-campanhas .bg-blue-50 strong,#sst .bg-blue-50 p,#sst-cipa .bg-blue-50 p,#sst-riscos-psicossociais .bg-blue-50 p,#sst-campanhas .bg-blue-50 p{color:var(--cma-navy)!important}

      #exp-sst{font-size:14px!important;line-height:1.65!important;border-color:var(--cma-line)!important;background:#f8fafc!important;color:var(--cma-text)!important}

      @media(max-width:700px){
        #sst>div:first-child h3,#sst-cipa>div:first-child h3,#sst-riscos-psicossociais>div:first-child h3,#sst-campanhas>div:first-child h3{font-size:22px!important}
        #sst>div:first-child p,#sst-cipa>div:first-child p,#sst-riscos-psicossociais>div:first-child p,#sst-campanhas>div:first-child p,#sst .bg-white p,#sst-cipa .bg-white p,#sst-riscos-psicossociais .bg-white p,#sst-campanhas .bg-white p,#sst .bg-white li,#sst-cipa .bg-white li,#sst-riscos-psicossociais .bg-white li,#sst-campanhas .bg-white li{font-size:16px!important}
        #sst .bg-white h4,#sst-cipa .bg-white h4,#sst-riscos-psicossociais .bg-white h4,#sst-campanhas .bg-white h4{font-size:18px!important}
      }
    `;
    document.head.appendChild(st);
    return true;
  }

  window.CMASSTPadrao={aplicar};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',aplicar,{once:true});else aplicar();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();