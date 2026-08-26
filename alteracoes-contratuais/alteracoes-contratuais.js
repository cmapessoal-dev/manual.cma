(function(){
  if(window.CMAAlteracoesContratuais)return;

  function abrirPagina(id){
    if(typeof navigateManual==='function'){navigateManual(id);return;}
    if(typeof showSection==='function')showSection(id,typeof getMenuButton==='function'?getMenuButton(id):null);
  }

  function criarBotaoMenu(){
    const menu=document.getElementById('manual-menu');
    if(!menu)return false;
    const existente=[...menu.querySelectorAll('button')].find(b=>(b.getAttribute('onclick')||'').includes("'alteracoes-contratuais'"));
    if(existente)return true;
    const b=document.createElement('button');
    b.type='button';
    b.setAttribute('onclick',"showSection('alteracoes-contratuais', this)");
    b.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';
    b.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/></svg> Alterações Contratuais';
    const referencia=typeof getMenuButton==='function'?getMenuButton('beneficios'):null;
    if(referencia)referencia.insertAdjacentElement('beforebegin',b);
    else menu.appendChild(b);
    return true;
  }

  function checklistHTML(){return `
    <div class="cma-alt-check-head">
      <div><span>Material de apoio</span><h3>Checklist de Alteração Contratual</h3><p>Conferências antes de efetivar uma mudança nas condições do contrato de trabalho.</p></div>
      <button type="button" class="cma-alt-check-fechar" aria-label="Fechar checklist">×</button>
    </div>
    <div class="cma-alt-check-corpo">
      <section><h4>1. Identifique a alteração</h4><ul><li>Salário ou forma de remuneração.</li><li>Cargo ou função.</li><li>Jornada, horário ou escala.</li><li>Local de trabalho.</li><li>Duração ou modalidade do contrato.</li><li>Benefícios ou outras condições contratuais.</li></ul></section>
      <section><h4>2. Data de vigência</h4><ul><li>Definir a data exata em que a nova condição passa a valer.</li><li>Verificar se haverá reflexo na folha da competência.</li><li>Em caso de CCT, acordo ou dissídio, conferir a data de efeito aplicável.</li></ul></section>
      <section><h4>3. Segurança da alteração</h4><ul><li>Confirmar a concordância do empregado quando necessária.</li><li>Verificar se a mudança não gera prejuízo direto ou indireto ao empregado.</li><li>Conferir a CCT e políticas aplicáveis.</li></ul></section>
      <section><h4>4. Documentação</h4><ul><li>Formalizar a alteração por escrito quando aplicável.</li><li>Guardar termo, comunicação, promoção ou documento que originou a mudança.</li><li>Manter a data de vigência consistente com os documentos.</li></ul></section>
      <section><h4>5. eSocial</h4><ul><li>Verificar se a mudança deve ser informada no evento S-2206.</li><li>Transmitir a alteração dentro do prazo aplicável.</li><li>Quando houver impacto nos totalizadores, transmitir antes da folha da competência.</li></ul></section>
      <section><h4>6. Conferência final</h4><ul><li>Revisar salário, cargo, jornada, local e benefícios após a alteração.</li><li>Confirmar os reflexos na folha e demais rotinas trabalhistas.</li><li>Arquivar os documentos da alteração.</li></ul></section>
    </div>
    <div class="cma-alt-check-acoes"><button type="button" class="cma-alt-check-imprimir">Imprimir checklist</button></div>`;}

  function abrirChecklist(){
    let modal=document.getElementById('cma-alt-checklist-modal');
    if(!modal){
      modal=document.createElement('div');modal.id='cma-alt-checklist-modal';modal.className='cma-alt-check-modal';
      modal.innerHTML=`<div class="cma-alt-check-backdrop"></div><div class="cma-alt-check-painel">${checklistHTML()}</div>`;
      document.body.appendChild(modal);
      modal.querySelector('.cma-alt-check-fechar').addEventListener('click',()=>modal.classList.remove('is-open'));
      modal.querySelector('.cma-alt-check-backdrop').addEventListener('click',()=>modal.classList.remove('is-open'));
      modal.querySelector('.cma-alt-check-imprimir').addEventListener('click',()=>window.print());
    }
    modal.classList.add('is-open');
  }

  function criar(){
    const main=document.querySelector('#manual-conteudo main');
    if(!main)return false;
    criarBotaoMenu();
    if(document.getElementById('alteracoes-contratuais'))return true;
    const sec=document.createElement('section');sec.id='alteracoes-contratuais';sec.className='manual-section hidden fade-in';
    sec.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
        <div><h3 class="text-2xl font-bold text-blue-950">Alterações Contratuais</h3><p class="text-sm text-gray-500 mt-1">Cuidados antes de alterar condições do contrato de trabalho.</p></div>
      </div>
      <div class="cma-alt-info-head"><span>Alteração contratual</span><h4>O que deve ser conferido antes da mudança</h4><p>Alterações de salário, função, jornada, local de trabalho, duração do contrato ou outras condições devem ser analisadas antes de sua aplicação e registradas com a data correta de vigência.</p></div>
      <div class="cma-alt-info-lista">
        <section class="cma-alt-info-item cma-alt-regra"><h5>Regra geral: não pode haver prejuízo ao empregado</h5><p>Nos contratos individuais de trabalho, a alteração das condições exige mútuo consentimento e não pode resultar, direta ou indiretamente, em prejuízo ao empregado. Alterações prejudiciais podem ser consideradas nulas.</p><span>CLT, art. 468</span></section>
        <section class="cma-alt-info-item"><h5>Salário, cargo e função</h5><p>Promoções, reajustes, mudanças de cargo ou função e alterações na forma de remuneração devem ter data de vigência definida e ser formalizadas de forma coerente com a folha e o eSocial.</p></section>
        <section class="cma-alt-info-item"><h5>Jornada, horário e escala</h5><p>Mudanças de jornada ou horário precisam respeitar os limites legais, a CCT e as condições anteriormente ajustadas. Antes da alteração, confirme também intervalos, folgas e eventual impacto salarial.</p><button type="button" class="cma-alt-info-link" data-abrir="calculadora-jornada">Conferir jornada →</button></section>
        <section class="cma-alt-info-item"><h5>Local de trabalho e demais condições</h5><p>A mudança de local deve ser avaliada conforme as condições do contrato e as regras aplicáveis à transferência. Benefícios e outras condições também devem ser revistos quando a alteração produzir reflexos sobre o vínculo.</p></section>
        <section class="cma-alt-info-item"><h5>Registro no eSocial — S-2206</h5><p>O evento S-2206 registra alterações como remuneração, duração do contrato, local, cargo ou função e jornada. Como regra, o envio ocorre até o dia 15 do mês seguinte ou antes do evento de remuneração da competência quando a alteração impactar os totalizadores.</p></section>
      </div>
      <aside class="cma-alt-material"><div class="cma-alt-material-icone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/></svg></div><div><span>Material de apoio</span><h5>Checklist de Alteração Contratual</h5><p>Abra a relação separada com as principais conferências antes de efetivar a mudança.</p></div><button type="button" class="cma-alt-material-btn">Abrir checklist</button></aside>`;
    const base=document.getElementById('baselegal');if(base)main.insertBefore(sec,base);else main.appendChild(sec);
    sec.querySelectorAll('[data-abrir]').forEach(b=>b.addEventListener('click',()=>abrirPagina(b.dataset.abrir)));
    sec.querySelector('.cma-alt-material-btn').addEventListener('click',abrirChecklist);
    instalarEstilo();
    return true;
  }

  function instalarEstilo(){
    if(document.getElementById('cma-alt-style'))return;
    const st=document.createElement('style');st.id='cma-alt-style';st.textContent=`
      .cma-alt-info-head{margin-bottom:22px}.cma-alt-info-head>span{display:block;margin-bottom:5px;color:#2563eb;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cma-alt-info-head h4{margin:0;color:#172554;font-size:22px;font-weight:850}.cma-alt-info-head p,.cma-alt-info-item p{margin:8px 0 0!important;color:#475569!important;font-size:15px!important;line-height:1.7!important;text-align:left!important}.cma-alt-info-lista{border-top:1px solid #e2e8f0}.cma-alt-info-item{padding:19px 2px;border-bottom:1px solid #e2e8f0}.cma-alt-info-item h5{margin:0;color:#172554;font-size:17px;font-weight:850}.cma-alt-regra{padding:18px 16px;margin:0 -14px;border-left:4px solid #f59e0b;background:#fffbeb}.cma-alt-regra>span{display:inline-block;margin-top:7px;color:#92400e;font-size:12px;font-weight:800}.cma-alt-info-link{margin-top:10px;padding:0;border:0;background:transparent;color:#1d4ed8;font-size:14px;font-weight:850;cursor:pointer}.cma-alt-material{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;margin-top:24px;padding:17px 18px;border:1px solid #bfdbfe;border-radius:12px;background:#f8fbff}.cma-alt-material-icone{display:grid;width:44px;height:44px;place-items:center;border-radius:11px;background:#eff6ff;color:#1e3a8a}.cma-alt-material-icone svg{width:22px;height:22px}.cma-alt-material span{display:block;color:#2563eb;font-size:11px;font-weight:900;letter-spacing:.07em;text-transform:uppercase}.cma-alt-material h5{margin:2px 0;color:#172554;font-size:17px;font-weight:850}.cma-alt-material p{margin:0!important;color:#64748b!important;font-size:14px!important;line-height:1.55!important;text-align:left!important}.cma-alt-material-btn{padding:10px 14px;border:0;border-radius:9px;background:#172554;color:#fff;font-size:13.5px;font-weight:850;cursor:pointer;white-space:nowrap}.cma-alt-check-modal{display:none;position:fixed;inset:0;z-index:9999}.cma-alt-check-modal.is-open{display:block}.cma-alt-check-backdrop{position:absolute;inset:0;background:rgba(15,23,42,.55)}.cma-alt-check-painel{position:relative;z-index:1;width:min(800px,calc(100% - 28px));max-height:calc(100vh - 36px);overflow:auto;margin:18px auto;padding:24px;border-radius:16px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.25)}.cma-alt-check-head{display:flex;justify-content:space-between;gap:18px;padding-bottom:16px;border-bottom:1px solid #e2e8f0}.cma-alt-check-head span{color:#2563eb;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cma-alt-check-head h3{margin:3px 0;color:#172554;font-size:24px;font-weight:900}.cma-alt-check-head p{margin:0;color:#64748b;font-size:14px}.cma-alt-check-fechar{width:38px;height:38px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;color:#475569;font-size:25px;cursor:pointer}.cma-alt-check-corpo{display:grid;grid-template-columns:1fr 1fr;gap:0 26px;padding-top:8px}.cma-alt-check-corpo section{padding:16px 0;border-bottom:1px solid #f1f5f9}.cma-alt-check-corpo h4{margin:0 0 8px;color:#172554;font-size:16px;font-weight:850}.cma-alt-check-corpo ul{margin:0;padding-left:20px;color:#475569;font-size:14.5px;line-height:1.7}.cma-alt-check-acoes{display:flex;justify-content:flex-end;padding-top:18px}.cma-alt-check-imprimir{padding:10px 15px;border:0;border-radius:9px;background:#172554;color:#fff;font-weight:850;cursor:pointer}@media(max-width:700px){.cma-alt-info-head p,.cma-alt-info-item p{font-size:16px!important}.cma-alt-info-item h5{font-size:18px}.cma-alt-material{grid-template-columns:auto 1fr}.cma-alt-material-btn{grid-column:1/-1;width:100%;font-size:15px;padding:12px}.cma-alt-check-corpo{grid-template-columns:1fr}.cma-alt-check-painel{padding:20px}}@media print{body>*{visibility:hidden!important}#cma-alt-checklist-modal,#cma-alt-checklist-modal *{visibility:visible!important}#cma-alt-checklist-modal{display:block!important;position:absolute!important;inset:0!important}.cma-alt-check-backdrop,.cma-alt-check-fechar,.cma-alt-check-acoes{display:none!important}.cma-alt-check-painel{width:100%!important;max-height:none!important;overflow:visible!important;margin:0!important;padding:0!important;box-shadow:none!important}.cma-alt-check-corpo{grid-template-columns:1fr 1fr!important}}
    `;document.head.appendChild(st);
  }

  window.CMAAlteracoesContratuais={criar,abrirChecklist,criarBotaoMenu};
  let tentativas=0;(function iniciar(){if(criar())return;if(++tentativas<50)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',criar);
  document.addEventListener('cma:navegacao-atualizada',criarBotaoMenu);
})();