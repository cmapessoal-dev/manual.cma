(function(){
  function aplicar(){
    if(document.getElementById('cma-tipos-contratos-tipografia-style'))return;
    const st=document.createElement('style');
    st.id='cma-tipos-contratos-tipografia-style';
    st.textContent=`
      #experiencia > div:first-child h3{font-size:24px!important;line-height:1.3!important}
      #experiencia > div:first-child p{font-size:14px!important;line-height:1.6!important}
      #experiencia .cma-tipo-card h4{font-size:16px!important;line-height:1.4!important}
      #experiencia .cma-tipo-card>p{font-size:14px!important;line-height:1.65!important}
      #experiencia .cma-tipo-card dt{font-size:14px!important;line-height:1.55!important}
      #experiencia .cma-tipo-card dd{font-size:14px!important;line-height:1.6!important}
      #experiencia .cma-tipo-alerta{font-size:14px!important;line-height:1.6!important}
      #experiencia .cma-fluxo-link{font-size:14px!important}
      #experiencia .cma-tipo-tag{font-size:11px!important;line-height:1.3!important}
      @media(max-width:760px){
        #experiencia .cma-tipo-card h4{font-size:17px!important}
        #experiencia .cma-tipo-card>p,
        #experiencia .cma-tipo-card dt,
        #experiencia .cma-tipo-card dd,
        #experiencia .cma-tipo-alerta{font-size:14px!important}
      }
    `;
    document.head.appendChild(st);
  }
  window.CMATiposContratosTipografia={aplicar};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',aplicar,{once:true});else aplicar();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();
