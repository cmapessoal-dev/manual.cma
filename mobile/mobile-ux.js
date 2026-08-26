(function(){
  if(window.CMAMobileUX)return;

  let ultimoModoMobile=null;

  function instalarEstilo(){
    if(document.getElementById('cma-mobile-ux-style'))return;
    const st=document.createElement('style');
    st.id='cma-mobile-ux-style';
    st.textContent=`
      @media(max-width:1023px){
        html{scroll-padding-top:10px}
        body{overflow-x:hidden}
        #manual-conteudo{display:block!important;padding-left:12px!important;padding-right:12px!important;padding-top:16px!important}
        #manual-conteudo>aside{margin-bottom:14px!important}
        #manual-menu{position:static!important;top:auto!important;padding:0!important;border-radius:12px!important;overflow:hidden!important}
        #manual-menu>.cma-mobile-menu-toggle{display:flex!important}
        #manual-menu.cma-mobile-fechado>*:not(.cma-mobile-menu-toggle){display:none!important}
        #manual-menu button:not(.cma-mobile-menu-toggle){min-height:44px!important;padding:10px 12px!important;font-size:14px!important;line-height:1.35!important}
        #manual-menu button svg{flex:0 0 auto}
        main{width:100%!important;min-width:0!important}
        .manual-section{min-width:0!important}
        .manual-section>div:first-child{gap:10px!important}
        .manual-section h3{font-size:22px!important;line-height:1.25!important}
        .manual-section p,.manual-section li{overflow-wrap:anywhere}
        .cma-page-navigation{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important;margin-top:24px!important}
        .cma-page-navigation .cma-nav-btn{width:100%!important;min-height:44px!important;padding:11px 12px!important}
        .cma-page-navigation .cma-nav-btn:only-child{grid-column:1/-1!important}
        [class*="-check-painel"]{width:calc(100% - 16px)!important;max-height:calc(100dvh - 16px)!important;margin:8px auto!important;padding:18px!important;border-radius:14px!important}
        [class*="-check-head"]{gap:10px!important}
        [class*="-check-head"] h3{font-size:21px!important;line-height:1.25!important}
        [class*="-check-corpo"]{grid-template-columns:1fr!important}
        [class*="-check-acoes"]{display:grid!important;grid-template-columns:1fr!important;gap:8px!important}
        [class*="-check-acoes"] button{width:100%!important;min-height:44px!important}
        .cma-calendar-wrap,.cma-calendar-container,[class*="calendar-wrapper"]{max-width:100%!important;overflow-x:auto!important;-webkit-overflow-scrolling:touch!important}
        #cma-calendar-grid{min-width:680px!important}
        .cma-calendar-event{font-size:11px!important;line-height:1.2!important}
        table{max-width:100%}
        .overflow-x-auto{overscroll-behavior-inline:contain;-webkit-overflow-scrolling:touch}
        input,select,textarea{max-width:100%!important;font-size:16px!important}
        button,a{touch-action:manipulation}
      }
      @media(max-width:520px){
        header .max-w-7xl{padding-left:14px!important;padding-right:14px!important}
        header h1{font-size:18px!important;line-height:1.2!important;text-align:center!important}
        header p{text-align:center!important}
        .cma-hero-content{padding-left:18px!important;padding-right:18px!important}
        .cma-hero-title{font-size:clamp(30px,10vw,42px)!important;line-height:1.05!important}
        .cma-hero-subtitle{font-size:18px!important;line-height:1.35!important}
        .cma-hero-text{font-size:15px!important;line-height:1.65!important}
        .manual-section h3{font-size:21px!important}
        .cma-page-navigation{grid-template-columns:1fr!important}
        .cma-page-navigation .cma-nav-btn{grid-column:1!important}
      }
    `;
    document.head.appendChild(st);
  }

  function definirEstado(menu,toggle,fechado){
    menu.classList.toggle('cma-mobile-fechado',fechado);
    toggle.setAttribute('aria-expanded',String(!fechado));
    const indicador=toggle.querySelector('.cma-mobile-menu-indicador');
    if(indicador)indicador.textContent=fechado?'＋':'−';
  }

  function prepararMenu(){
    const menu=document.getElementById('manual-menu');
    if(!menu)return false;
    let toggle=menu.querySelector('.cma-mobile-menu-toggle');
    if(!toggle){
      toggle=document.createElement('button');
      toggle.type='button';
      toggle.className='cma-mobile-menu-toggle';
      toggle.style.cssText='display:none;width:100%;align-items:center;justify-content:space-between;gap:12px;padding:13px 14px;border:0;background:#172554;color:#fff;font-weight:800;font-size:15px;cursor:pointer';
      toggle.innerHTML='<span>Sumário do Manual</span><span class="cma-mobile-menu-indicador" aria-hidden="true">＋</span>';
      menu.insertBefore(toggle,menu.firstChild);
      toggle.addEventListener('click',()=>definirEstado(menu,toggle,!menu.classList.contains('cma-mobile-fechado')));
    }

    const modoMobile=innerWidth<1024;
    if(ultimoModoMobile===null){
      ultimoModoMobile=modoMobile;
      definirEstado(menu,toggle,modoMobile);
    }else if(modoMobile!==ultimoModoMobile){
      ultimoModoMobile=modoMobile;
      definirEstado(menu,toggle,modoMobile);
    }else if(!modoMobile){
      definirEstado(menu,toggle,false);
    }

    if(!menu.dataset.cmaMobileClicks){
      menu.dataset.cmaMobileClicks='1';
      menu.addEventListener('click',e=>{
        const b=e.target.closest('button');
        if(!b||b.classList.contains('cma-mobile-menu-toggle')||innerWidth>=1024)return;
        setTimeout(()=>definirEstado(menu,toggle,true),40);
      });
    }
    return true;
  }

  function ajustar(){instalarEstilo();prepararMenu();}
  window.CMAMobileUX={ajustar};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ajustar,{once:true});else ajustar();
  document.addEventListener('cma:modulos-prontos',ajustar);
  document.addEventListener('cma:navegacao-atualizada',ajustar);
  window.addEventListener('resize',()=>{clearTimeout(window.__cmaMobileResize);window.__cmaMobileResize=setTimeout(prepararMenu,120)});
})();