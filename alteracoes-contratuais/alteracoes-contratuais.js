(function(){
  if(window.CMAAlteracoesContratuais)return;

  function abrirPagina(id){
    if(typeof navigateManual==='function'){navigateManual(id);return;}
    if(typeof showSection==='function')showSection(id,typeof getMenuButton==='function'?getMenuButton(id):null);
  }

  function criarBotaoMenu(){
    const menu=document.getElementById('manual-menu');
    if(!menu)return false;
    let b=[...menu.querySelectorAll('button')].find(x=>(x.getAttribute('onclick')||'').includes("'alteracoes-contratuais'"));
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.setAttribute('onclick',"showSection('alteracoes-contratuais', this)");
      b.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';
      b.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/></svg> Alterações Contratuais';
    }
    const tipos=typeof getMenuButton==='function'?getMenuButton('experiencia'):null;
    if(tipos&&tipos.nextElementSibling!==b)tipos.insertAdjacentElement('afterend',b);
    else if(!b.parentElement)menu.appendChild(b);
    return true;
  }

  function checklistHTML(){return `
    <div class="cma-alt-check-head"><div><span>Material de apoio</span><h3>Checklist de Alteração Contratual</h3><p>Conferências essenciais antes de efetivar qualquer mudança no contrato.</p></div><button type="button" class="cma-alt-check-fechar" aria-label="Fechar checklist">×</button></div>
    <div class="cma-alt-check-corpo">
      <section><h4>1. Acordo entre as partes</h4><ul><li>Confirmar que empregador e empregado estão de acordo com a alteração.</li><li>Formalizar a mudança por escrito quando aplicável.</li></ul></section>
      <section><h4>2. Ausência de prejuízo</h4><ul><li>Verificar se a mudança não causa prejuízo direto ou indireto ao empregado.</li><li>Conferir contrato, CCT e demais regras aplicáveis.</li></ul></section>
      <section><h4>3. Salário</h4><ul><li>Não reduzir o salário por acordo individual.</li><li>Eventual redução salarial somente pode ocorrer nas hipóteses admitidas por convenção ou acordo coletivo.</li></ul></section>
      <section><h4>4. Data e efeitos</h4><ul><li>Definir a data exata de vigência.</li><li>Conferir reflexos em salário, função, jornada, benefícios e folha.</li></ul></section>
      <section><h4>5. Registro</h4><ul><li>Guardar o documento que originou a alteração.</li><li>Verificar a necessidade de atualização no eSocial.</li></ul></section>
    </div>`;}

  function abrirChecklist(){
    let modal=document.getElementById('cma-alt-checklist-modal');
    if(!modal){
      modal=document.createElement('div');modal.id='cma-alt-checklist-modal';modal.className='cma-alt-check-modal';
      modal.innerHTML=`<div class="cma-alt-check-backdrop"></div><div class="cma-alt-check-painel">${checklistHTML()}</div>`;
      document.body.appendChild(modal);
      modal.querySelector('.cma-alt-check-fechar').addEventListener('click',()=>modal.classList.remove('is-open'));
      modal.querySelector('.cma-alt-check-backdrop').addEventListener('click',()=>modal.classList.remove('is-open'));
    }
    modal.classList.add('is-open');
  }

  function criar(){
    const main=document.querySelector('#manual-conteudo main');
    if(!main)return false;
    criarBotaoMenu();
    if(document.getElementById('alteracoes-contratuais'))return true;

    const sec=document.createElement('section');
    sec.id='alteracoes-contratuais';
    sec.className='manual-section hidden fade-in';
    sec.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
        <div><h3 class="text-2xl font-bold text-blue-950">Alterações Contratuais</h3><p class="text-sm text-gray-500 mt-1">Regras para mudanças nas condições do contrato de trabalho.</p></div>
      </div>

      <div class="cma-alt-intro">
        <span>Regra principal</span>
        <h4>A alteração deve ocorrer em mútuo acordo</h4>
        <p>As condições do contrato de trabalho não podem ser alteradas de forma unilateral quando a mudança depender da concordância das partes. Como regra, a alteração deve ocorrer por <strong>mútuo consentimento entre empregador e empregado</strong> e não pode gerar prejuízo direto ou indireto ao trabalhador.</p>
      </div>

      <div class="cma-alt-destaques">
        <section><strong>Mútuo acordo</strong><p>A mudança deve ser aceita pelas partes e, sempre que aplicável, formalizada por escrito.</p><small>CLT, art. 468</small></section>
        <section><strong>Sem prejuízo ao empregado</strong><p>Mesmo com concordância, uma alteração que cause prejuízo direto ou indireto ao empregado pode ser considerada nula.</p><small>CLT, art. 468</small></section>
        <section class="cma-alt-salario"><strong>Não pode haver redução salarial por acordo individual</strong><p>O salário é irredutível. Eventual redução somente pode ocorrer nas hipóteses admitidas por <strong>convenção ou acordo coletivo de trabalho</strong>.</p><small>Constituição Federal, art. 7º, VI</small></section>
      </div>

      <div class="cma-alt-conteudo">
        <section><h5>O que pode exigir alteração contratual?</h5><p>Mudanças de salário, cargo ou função, jornada, horário, escala, local de trabalho, modalidade ou duração do contrato e outras condições anteriormente ajustadas devem ser analisadas antes de serem aplicadas.</p></section>
        <section><h5>Antes de efetivar a mudança</h5><p>Defina a nova condição e sua data de vigência, confirme a concordância do empregado quando necessária, verifique se não haverá prejuízo e confira a convenção coletiva aplicável. Depois disso, formalize a alteração e atualize os registros correspondentes.</p></section>
        <section><h5>Jornada e horário</h5><p>Alterações de jornada ou horário também devem respeitar os limites legais e convencionais e não podem representar prejuízo ao empregado.</p><button type="button" class="cma-alt-info-link" data-abrir="calculadora-jornada">Conferir jornada →</button></section>
        <section><h5>Registro no eSocial</h5><p>Quando a alteração modificar informações contratuais que devam ser atualizadas no eSocial, o registro deve refletir corretamente a nova condição e a data em que ela passou a valer.</p></section>
      </div>

      <aside class="cma-alt-material"><div><span>Material de apoio</span><h5>Checklist de Alteração Contratual</h5><p>Conferência rápida antes de efetivar a mudança.</p></div><button type="button" class="cma-alt-material-btn">Abrir checklist</button></aside>`;

    const tipos=document.getElementById('experiencia');
    if(tipos&&tipos.parentElement===main)tipos.insertAdjacentElement('afterend',sec);
    else{const base=document.getElementById('baselegal');if(base)main.insertBefore(sec,base);else main.appendChild(sec);}

    sec.querySelectorAll('[data-abrir]').forEach(b=>b.addEventListener('click',()=>abrirPagina(b.dataset.abrir)));
    sec.querySelector('.cma-alt-material-btn').addEventListener('click',abrirChecklist);
    instalarEstilo();
    return true;
  }

  function instalarEstilo(){
    if(document.getElementById('cma-alt-style'))return;
    const st=document.createElement('style');st.id='cma-alt-style';st.textContent=`
      .cma-alt-intro{padding:20px 22px;margin-bottom:20px;border-left:4px solid #1d4ed8;background:#f8fbff;border-radius:0 12px 12px 0}.cma-alt-intro>span,.cma-alt-material span{display:block;color:#2563eb;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cma-alt-intro h4{margin:4px 0 8px;color:#172554;font-size:23px;font-weight:900}.cma-alt-intro p,.cma-alt-destaques p,.cma-alt-conteudo p,.cma-alt-material p{margin:0!important;color:#475569!important;font-size:15.5px!important;line-height:1.72!important;text-align:left!important}.cma-alt-destaques{display:grid;gap:0;border-top:1px solid #e2e8f0}.cma-alt-destaques section{padding:18px 2px;border-bottom:1px solid #e2e8f0}.cma-alt-destaques strong{display:block;color:#172554;font-size:18px;font-weight:900}.cma-alt-destaques small{display:inline-block;margin-top:7px;color:#64748b;font-size:12px;font-weight:800}.cma-alt-destaques .cma-alt-salario{margin:0 -14px;padding:18px 16px;border-left:4px solid #dc2626;background:#fff7f7}.cma-alt-destaques .cma-alt-salario strong{color:#991b1b}.cma-alt-conteudo{margin-top:18px}.cma-alt-conteudo section{padding:18px 2px;border-bottom:1px solid #e2e8f0}.cma-alt-conteudo h5{margin:0 0 6px;color:#172554;font-size:17px;font-weight:850}.cma-alt-info-link{margin-top:10px;padding:0;border:0;background:transparent;color:#1d4ed8;font-size:14px;font-weight:850;cursor:pointer}.cma-alt-material{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:24px;padding:18px;border:1px solid #bfdbfe;border-radius:12px;background:#f8fbff}.cma-alt-material h5{margin:2px 0;color:#172554;font-size:17px;font-weight:850}.cma-alt-material-btn{padding:10px 14px;border:0;border-radius:9px;background:#172554;color:#fff;font-size:14px;font-weight:850;cursor:pointer;white-space:nowrap}.cma-alt-check-modal{display:none;position:fixed;inset:0;z-index:9999}.cma-alt-check-modal.is-open{display:block}.cma-alt-check-backdrop{position:absolute;inset:0;background:rgba(15,23,42,.55)}.cma-alt-check-painel{position:relative;z-index:1;width:min(760px,calc(100% - 28px));max-height:calc(100vh - 36px);overflow:auto;margin:18px auto;padding:24px;border-radius:16px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.25)}.cma-alt-check-head{display:flex;justify-content:space-between;gap:18px;padding-bottom:16px;border-bottom:1px solid #e2e8f0}.cma-alt-check-head span{color:#2563eb;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cma-alt-check-head h3{margin:3px 0;color:#172554;font-size:24px;font-weight:900}.cma-alt-check-head p{margin:0;color:#64748b;font-size:14px}.cma-alt-check-fechar{width:38px;height:38px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;color:#475569;font-size:25px;cursor:pointer}.cma-alt-check-corpo section{padding:16px 0;border-bottom:1px solid #f1f5f9}.cma-alt-check-corpo h4{margin:0 0 8px;color:#172554;font-size:16px;font-weight:850}.cma-alt-check-corpo ul{margin:0;padding-left:20px;color:#475569;font-size:15px;line-height:1.7}@media(max-width:700px){.cma-alt-intro p,.cma-alt-destaques p,.cma-alt-conteudo p,.cma-alt-material p{font-size:16px!important}.cma-alt-material{align-items:stretch;flex-direction:column}.cma-alt-material-btn{width:100%;font-size:15px;padding:12px}.cma-alt-intro h4{font-size:22px}.cma-alt-destaques strong{font-size:18px}}
    `;document.head.appendChild(st);
  }

  window.CMAAlteracoesContratuais={criar,abrirChecklist,criarBotaoMenu};
  let tentativas=0;(function iniciar(){if(criar())return;if(++tentativas<50)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',criar);
  document.addEventListener('cma:navegacao-atualizada',criarBotaoMenu);
})();