(function(){
  if(window.CMAFeriasConteudo)return;

  function abrirPagina(id){
    if(typeof navigateManual==='function'){navigateManual(id);return;}
    if(typeof showSection==='function')showSection(id,typeof getMenuButton==='function'?getMenuButton(id):null);
  }

  function checklistHTML(){return `
    <div class="cma-fer-check-head">
      <div><span>Material de apoio</span><h3>Checklist de Férias</h3><p>Conferências essenciais antes da programação e do pagamento das férias.</p></div>
      <button type="button" class="cma-fer-check-fechar" aria-label="Fechar checklist">×</button>
    </div>
    <div class="cma-fer-check-corpo">
      <section><h4>1. Períodos</h4><ul><li>Conferir o período aquisitivo.</li><li>Conferir o período concessivo e a data-limite para o gozo.</li><li>Verificar se há férias vencidas ou risco de ultrapassar o período concessivo.</li></ul></section>
      <section><h4>2. Data de início</h4><ul><li>Definir a data pretendida para início.</li><li>Conferir o DSR do empregado.</li><li>Conferir feriados próximos.</li><li><strong>Não iniciar as férias nos 2 dias que antecedem feriado ou DSR.</strong></li></ul></section>
      <section><h4>3. Quantidade de dias</h4><ul><li>Definir se as férias serão integrais ou fracionadas.</li><li>No fracionamento, obter concordância do empregado.</li><li>Um período deve ter pelo menos 14 dias corridos.</li><li>Os demais períodos devem ter pelo menos 5 dias corridos cada.</li></ul></section>
      <section><h4>4. Abono pecuniário</h4><ul><li>Verificar se o empregado solicitou a conversão de até 1/3 das férias em abono.</li><li>Conferir se a solicitação foi feita dentro do prazo legal aplicável.</li></ul></section>
      <section><h4>5. Aviso e pagamento</h4><ul><li>Entregar o aviso de férias com antecedência mínima de 30 dias.</li><li>Efetuar o pagamento das férias e do 1/3 constitucional até 2 dias antes do início do gozo.</li></ul></section>
      <section><h4>6. Cálculo</h4><ul><li>Conferir salário-base e médias que integrem as férias.</li><li>Revisar adicionais e demais parcelas aplicáveis.</li><li>Conferir o valor final antes do pagamento.</li></ul></section>
    </div>
    <div class="cma-fer-check-acoes"><button type="button" class="cma-fer-check-calcular">Abrir calculadora de férias</button><button type="button" class="cma-fer-check-imprimir">Imprimir checklist</button></div>`;}

  function abrirChecklist(){
    let modal=document.getElementById('cma-ferias-checklist-modal');
    if(!modal){
      modal=document.createElement('div');
      modal.id='cma-ferias-checklist-modal';
      modal.className='cma-fer-check-modal';
      modal.innerHTML=`<div class="cma-fer-check-backdrop"></div><div class="cma-fer-check-painel">${checklistHTML()}</div>`;
      document.body.appendChild(modal);
      modal.querySelector('.cma-fer-check-fechar').addEventListener('click',()=>modal.classList.remove('is-open'));
      modal.querySelector('.cma-fer-check-backdrop').addEventListener('click',()=>modal.classList.remove('is-open'));
      modal.querySelector('.cma-fer-check-imprimir').addEventListener('click',()=>window.print());
      modal.querySelector('.cma-fer-check-calcular').addEventListener('click',()=>{modal.classList.remove('is-open');abrirPagina('calculadora-ferias');});
    }
    modal.classList.add('is-open');
  }

  function aplicar(){
    const sec=document.getElementById('ferias');
    if(!sec||sec.dataset.cmaFeriasConteudo==='1')return false;
    const alvo=sec.querySelector('.space-y-4.text-sm.text-gray-700');
    if(!alvo)return false;
    sec.dataset.cmaFeriasConteudo='1';

    alvo.innerHTML=`
      <div class="cma-fer-info-head">
        <span>Programação de férias</span>
        <h4>O que deve ser conferido antes da concessão</h4>
        <p>As férias devem ser planejadas dentro do período concessivo, com definição correta da data de início, quantidade de dias, eventual fracionamento, aviso e pagamento.</p>
      </div>

      <div class="cma-fer-info-lista">
        <section class="cma-fer-info-item">
          <h5>Período aquisitivo e período concessivo</h5>
          <p>Após completar o período aquisitivo, a empresa deve programar o gozo dentro do período concessivo. A programação deve evitar o vencimento do prazo, pois a concessão fora do período legal pode gerar pagamento em dobro.</p>
        </section>

        <section class="cma-fer-info-item cma-fer-regra-inicio">
          <h5>Regra para a data de início</h5>
          <p><strong>As férias não podem começar nos 2 dias que antecedem feriado ou o descanso semanal remunerado (DSR) do empregado.</strong> Antes de confirmar a programação, confira sempre o DSR da escala e os feriados aplicáveis.</p>
          <span>CLT, art. 134, §3º</span>
        </section>

        <section class="cma-fer-info-item">
          <h5>Fracionamento</h5>
          <p>Com a concordância do empregado, as férias podem ser divididas em até 3 períodos. Um deles deve ter no mínimo 14 dias corridos e os demais não podem ser inferiores a 5 dias corridos cada.</p>
        </section>

        <section class="cma-fer-info-item">
          <h5>Aviso e pagamento</h5>
          <p>O aviso de férias deve ser comunicado por escrito com antecedência mínima de 30 dias. O pagamento das férias acrescidas de 1/3 constitucional deve ser realizado até 2 dias antes do início do gozo.</p>
          <button type="button" class="cma-fer-info-link" data-abrir="calculadora-ferias">Calcular férias →</button>
        </section>
      </div>

      <aside class="cma-fer-material">
        <div class="cma-fer-material-icone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 13h6M9 17h6"/></svg></div>
        <div><span>Material de apoio</span><h5>Checklist de Férias</h5><p>Abra a relação separada com as conferências de período, data de início, fracionamento, aviso, pagamento e cálculo.</p></div>
        <button type="button" class="cma-fer-material-btn">Abrir checklist</button>
      </aside>`;

    alvo.querySelectorAll('[data-abrir]').forEach(b=>b.addEventListener('click',()=>abrirPagina(b.dataset.abrir)));
    alvo.querySelector('.cma-fer-material-btn')?.addEventListener('click',abrirChecklist);
    instalarEstilo();
    return true;
  }

  function instalarEstilo(){
    if(document.getElementById('cma-ferias-conteudo-style'))return;
    const st=document.createElement('style');
    st.id='cma-ferias-conteudo-style';
    st.textContent=`
      #ferias .cma-fer-info-head{margin-bottom:22px}.cma-fer-info-head>span{display:block;margin-bottom:5px;color:#2563eb;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cma-fer-info-head h4{margin:0;color:#172554;font-size:22px;font-weight:850;line-height:1.3}.cma-fer-info-head p{max-width:820px;margin:8px 0 0!important;color:#64748b!important;font-size:15px!important;line-height:1.7!important;text-align:left!important}.cma-fer-info-lista{border-top:1px solid #e2e8f0}.cma-fer-info-item{padding:19px 2px;border-bottom:1px solid #e2e8f0}.cma-fer-info-item h5{margin:0 0 6px;color:#172554;font-size:17px;font-weight:850}.cma-fer-info-item p{margin:0!important;color:#475569!important;font-size:15px!important;line-height:1.7!important;text-align:left!important}.cma-fer-info-item>span{display:inline-block;margin-top:7px;color:#92400e;font-size:12px;font-weight:800}.cma-fer-regra-inicio{padding:18px 16px;margin:0 -14px;border-left:4px solid #f59e0b;background:#fffbeb}.cma-fer-info-link{margin-top:10px;padding:0;border:0;background:transparent;color:#1d4ed8;font-size:14px;font-weight:850;cursor:pointer}.cma-fer-info-link:hover{text-decoration:underline}.cma-fer-material{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;margin-top:24px;padding:17px 18px;border:1px solid #bfdbfe;border-radius:12px;background:#f8fbff}.cma-fer-material-icone{display:grid;width:44px;height:44px;place-items:center;border-radius:11px;background:#eff6ff;color:#1e3a8a}.cma-fer-material-icone svg{width:22px;height:22px}.cma-fer-material span{display:block;color:#2563eb;font-size:11px;font-weight:900;letter-spacing:.07em;text-transform:uppercase}.cma-fer-material h5{margin:2px 0;color:#172554;font-size:17px;font-weight:850}.cma-fer-material p{margin:0!important;color:#64748b!important;font-size:14px!important;line-height:1.55!important;text-align:left!important}.cma-fer-material-btn{padding:10px 14px;border:0;border-radius:9px;background:#172554;color:#fff;font-size:13.5px;font-weight:850;cursor:pointer;white-space:nowrap}.cma-fer-material-btn:hover{background:#1e3a8a}.cma-fer-check-modal{display:none;position:fixed;inset:0;z-index:9999}.cma-fer-check-modal.is-open{display:block}.cma-fer-check-backdrop{position:absolute;inset:0;background:rgba(15,23,42,.55)}.cma-fer-check-painel{position:relative;z-index:1;width:min(800px,calc(100% - 28px));max-height:calc(100vh - 36px);overflow:auto;margin:18px auto;padding:24px;border-radius:16px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.25)}.cma-fer-check-head{display:flex;justify-content:space-between;gap:18px;padding-bottom:16px;border-bottom:1px solid #e2e8f0}.cma-fer-check-head span{color:#2563eb;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cma-fer-check-head h3{margin:3px 0;color:#172554;font-size:24px;font-weight:900}.cma-fer-check-head p{margin:0;color:#64748b;font-size:14px}.cma-fer-check-fechar{width:38px;height:38px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;color:#475569;font-size:25px;line-height:1;cursor:pointer}.cma-fer-check-corpo{display:grid;grid-template-columns:1fr 1fr;gap:0 26px;padding-top:8px}.cma-fer-check-corpo section{padding:16px 0;border-bottom:1px solid #f1f5f9}.cma-fer-check-corpo h4{margin:0 0 8px;color:#172554;font-size:16px;font-weight:850}.cma-fer-check-corpo ul{margin:0;padding-left:20px;color:#475569;font-size:14.5px;line-height:1.7}.cma-fer-check-acoes{display:flex;justify-content:flex-end;gap:10px;padding-top:18px}.cma-fer-check-acoes button{padding:10px 15px;border:0;border-radius:9px;font-weight:850;cursor:pointer}.cma-fer-check-calcular{background:#eff6ff;color:#1e3a8a}.cma-fer-check-imprimir{background:#172554;color:#fff}@media(max-width:700px){.cma-fer-info-head h4{font-size:21px}.cma-fer-info-head p,.cma-fer-info-item p{font-size:16px!important}.cma-fer-info-item h5{font-size:18px}.cma-fer-regra-inicio{margin:0 -8px;padding:17px 12px}.cma-fer-material{grid-template-columns:auto 1fr}.cma-fer-material-btn{grid-column:1/-1;width:100%;font-size:15px;padding:12px}.cma-fer-material p{font-size:15px!important}.cma-fer-check-corpo{grid-template-columns:1fr}.cma-fer-check-painel{padding:20px}.cma-fer-check-corpo ul{font-size:15px}.cma-fer-check-acoes{flex-direction:column}.cma-fer-check-acoes button{width:100%}}@media print{body>*{visibility:hidden!important}#cma-ferias-checklist-modal,#cma-ferias-checklist-modal *{visibility:visible!important}#cma-ferias-checklist-modal{display:block!important;position:absolute!important;inset:0!important}.cma-fer-check-backdrop,.cma-fer-check-fechar,.cma-fer-check-acoes{display:none!important}.cma-fer-check-painel{width:100%!important;max-height:none!important;overflow:visible!important;margin:0!important;padding:0!important;box-shadow:none!important}.cma-fer-check-corpo{grid-template-columns:1fr 1fr!important}}
    `;
    document.head.appendChild(st);
  }

  window.CMAFeriasConteudo={aplicar,abrirChecklist};
  let tentativas=0;(function iniciar(){if(aplicar())return;if(++tentativas<50)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();