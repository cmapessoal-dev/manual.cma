(function(){
  if(window.CMAPadraoRotinas)return;
  function aplicar(){
    if(document.getElementById('cma-padrao-rotinas-style'))return true;
    const st=document.createElement('style');
    st.id='cma-padrao-rotinas-style';
    st.textContent=`
      #admissao,#alteracoes-contratuais,#afastamentos,#ferias,#demissao{--cma-navy:#172554;--cma-blue:#2563eb;--cma-text:#475569;--cma-muted:#64748b;--cma-line:#e2e8f0;--cma-soft:#f8fbff;--cma-alert:#fffbeb;--cma-alert-line:#f59e0b}
      #admissao [class*="-info-head"],#alteracoes-contratuais [class*="-info-head"],#afastamentos [class*="-info-head"],#ferias [class*="-info-head"],#demissao [class*="-info-head"]{margin-bottom:22px!important}
      #admissao [class*="-info-head"]>span,#alteracoes-contratuais [class*="-info-head"]>span,#afastamentos [class*="-info-head"]>span,#ferias [class*="-info-head"]>span,#demissao [class*="-info-head"]>span{display:block!important;margin-bottom:5px!important;color:var(--cma-blue)!important;font-size:12px!important;font-weight:900!important;letter-spacing:.08em!important;text-transform:uppercase!important}
      #admissao [class*="-info-head"] h4,#alteracoes-contratuais [class*="-info-head"] h4,#afastamentos [class*="-info-head"] h4,#ferias [class*="-info-head"] h4,#demissao [class*="-info-head"] h4{margin:0!important;color:var(--cma-navy)!important;font-size:22px!important;font-weight:850!important;line-height:1.3!important}
      #admissao [class*="-info-head"] p,#alteracoes-contratuais [class*="-info-head"] p,#afastamentos [class*="-info-head"] p,#ferias [class*="-info-head"] p,#demissao [class*="-info-head"] p{max-width:820px!important;margin:8px 0 0!important;color:var(--cma-muted)!important;font-size:15px!important;line-height:1.7!important;text-align:left!important}
      #admissao [class*="-info-lista"],#alteracoes-contratuais [class*="-info-lista"],#afastamentos [class*="-info-lista"],#ferias [class*="-info-lista"],#demissao [class*="-info-lista"]{border-top:1px solid var(--cma-line)!important}
      #admissao [class*="-info-item"],#alteracoes-contratuais [class*="-info-item"],#afastamentos [class*="-info-item"],#ferias [class*="-info-item"],#demissao [class*="-info-item"]{padding:19px 2px!important;border-bottom:1px solid var(--cma-line)!important}
      #admissao [class*="-info-item"] h5,#alteracoes-contratuais [class*="-info-item"] h5,#afastamentos [class*="-info-item"] h5,#ferias [class*="-info-item"] h5,#demissao [class*="-info-item"] h5{margin:0 0 6px!important;color:var(--cma-navy)!important;font-size:17px!important;font-weight:850!important;line-height:1.4!important}
      #admissao [class*="-info-item"] p,#alteracoes-contratuais [class*="-info-item"] p,#afastamentos [class*="-info-item"] p,#ferias [class*="-info-item"] p,#demissao [class*="-info-item"] p{margin:0!important;color:var(--cma-text)!important;font-size:15px!important;line-height:1.7!important;text-align:left!important}
      #admissao [class*="-info-link"],#alteracoes-contratuais [class*="-info-link"],#afastamentos [class*="-info-link"],#ferias [class*="-info-link"],#demissao [class*="-info-link"]{margin-top:10px!important;padding:0!important;border:0!important;background:transparent!important;color:#1d4ed8!important;font-size:14px!important;font-weight:850!important;cursor:pointer!important}
      #admissao [class*="-material"],#alteracoes-contratuais [class*="-material"],#afastamentos [class*="-material"],#ferias [class*="-material"],#demissao [class*="-material"]{box-sizing:border-box}
      #admissao aside[class*="-material"],#alteracoes-contratuais aside[class*="-material"],#afastamentos aside[class*="-material"],#ferias aside[class*="-material"],#demissao aside[class*="-material"]{display:grid!important;grid-template-columns:auto 1fr auto!important;gap:14px!important;align-items:center!important;margin-top:24px!important;padding:17px 18px!important;border:1px solid #bfdbfe!important;border-radius:12px!important;background:var(--cma-soft)!important}
      #admissao aside[class*="-material"] h5,#alteracoes-contratuais aside[class*="-material"] h5,#afastamentos aside[class*="-material"] h5,#ferias aside[class*="-material"] h5,#demissao aside[class*="-material"] h5{margin:2px 0!important;color:var(--cma-navy)!important;font-size:17px!important;font-weight:850!important}
      #admissao aside[class*="-material"] p,#alteracoes-contratuais aside[class*="-material"] p,#afastamentos aside[class*="-material"] p,#ferias aside[class*="-material"] p,#demissao aside[class*="-material"] p{margin:0!important;color:var(--cma-muted)!important;font-size:14px!important;line-height:1.55!important;text-align:left!important}
      #admissao aside[class*="-material"] button,#alteracoes-contratuais aside[class*="-material"] button,#afastamentos aside[class*="-material"] button,#ferias aside[class*="-material"] button,#demissao aside[class*="-material"] button{padding:10px 14px!important;border:0!important;border-radius:9px!important;background:var(--cma-navy)!important;color:#fff!important;font-size:13.5px!important;font-weight:850!important;cursor:pointer!important;white-space:nowrap!important}
      [class*="-check-painel"]{width:min(800px,calc(100% - 28px))!important;border-radius:16px!important}
      [class*="-check-corpo"] h4{font-size:16px!important;color:#172554!important;font-weight:850!important}
      [class*="-check-corpo"] ul{font-size:14.5px!important;line-height:1.7!important;color:#475569!important}
      @media(max-width:700px){
        #admissao [class*="-info-head"] h4,#alteracoes-contratuais [class*="-info-head"] h4,#afastamentos [class*="-info-head"] h4,#ferias [class*="-info-head"] h4,#demissao [class*="-info-head"] h4{font-size:21px!important}
        #admissao [class*="-info-head"] p,#alteracoes-contratuais [class*="-info-head"] p,#afastamentos [class*="-info-head"] p,#ferias [class*="-info-head"] p,#demissao [class*="-info-head"] p,#admissao [class*="-info-item"] p,#alteracoes-contratuais [class*="-info-item"] p,#afastamentos [class*="-info-item"] p,#ferias [class*="-info-item"] p,#demissao [class*="-info-item"] p{font-size:16px!important}
        #admissao [class*="-info-item"] h5,#alteracoes-contratuais [class*="-info-item"] h5,#afastamentos [class*="-info-item"] h5,#ferias [class*="-info-item"] h5,#demissao [class*="-info-item"] h5{font-size:18px!important}
        #admissao aside[class*="-material"],#alteracoes-contratuais aside[class*="-material"],#afastamentos aside[class*="-material"],#ferias aside[class*="-material"],#demissao aside[class*="-material"]{grid-template-columns:auto 1fr!important}
        #admissao aside[class*="-material"] button,#alteracoes-contratuais aside[class*="-material"] button,#afastamentos aside[class*="-material"] button,#ferias aside[class*="-material"] button,#demissao aside[class*="-material"] button{grid-column:1/-1!important;width:100%!important;padding:12px!important;font-size:15px!important}
        [class*="-check-corpo"] ul{font-size:15px!important}
      }
    `;
    document.head.appendChild(st);
    return true;
  }
  window.CMAPadraoRotinas={aplicar};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',aplicar,{once:true});else aplicar();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();