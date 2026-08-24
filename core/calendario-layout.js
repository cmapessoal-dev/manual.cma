(function(){
  if(document.getElementById('cma-calendario-layout-style'))return;
  const st=document.createElement('style');
  st.id='cma-calendario-layout-style';
  st.textContent=`
    .cma-calendar-wrapper{width:100%;max-width:100%;margin-top:18px!important;margin-bottom:28px!important;margin-left:auto!important;margin-right:auto!important;box-sizing:border-box}
    .cma-calendar-header{display:grid!important;grid-template-columns:40px minmax(0,1fr) 40px!important;align-items:center!important;column-gap:12px!important}
    .cma-calendar-heading{min-width:0;text-align:center!important}
    .cma-calendar-arrow{display:flex!important;align-items:center!important;justify-content:center!important;margin:0!important;padding:0!important}
    .cma-calendar-weekdays,.cma-calendar-grid{width:100%!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:1px!important;box-sizing:border-box}
    .cma-calendar-weekdays>div,.cma-calendar-day{min-width:0!important;box-sizing:border-box!important}
    .cma-calendar-weekdays>div{display:flex;align-items:center;justify-content:center;text-align:center}
    .cma-calendar-day-number{text-align:center}
    @media(max-width:640px){
      .cma-calendar-header{grid-template-columns:34px minmax(0,1fr) 34px!important;column-gap:8px!important}
      .cma-calendar-arrow{width:34px!important;height:34px!important}
      .cma-calendar-weekdays>div{padding-left:2px!important;padding-right:2px!important}
      .cma-calendar-day{padding-left:3px!important;padding-right:3px!important}
    }
  `;
  document.head.appendChild(st);
})();
