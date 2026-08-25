(function(){
  if(window.CMADemissaoConteudo)return;

  function abrirPagina(id){
    if(typeof navigateManual==='function'){navigateManual(id);return;}
    if(typeof showSection==='function')showSection(id,typeof getMenuButton==='function'?getMenuButton(id):null);
  }

  function checklistHTML(){return `
    <div class="cma-dem-check-head">
      <div><span>Material de apoio</span><h3>Checklist de Demissão</h3><p>Conferências essenciais antes de concluir o desligamento.</p></div>
      <button type="button" class="cma-dem-check-fechar" aria-label="Fechar checklist">×</button>
    </div>
    <div class="cma-dem-check-corpo">
      <section><h4>1. Tipo de desligamento</h4><ul><li>Confirmar o motivo e a modalidade da rescisão.</li><li>Verificar se é dispensa sem justa causa, pedido de demissão, acordo, término de contrato ou outra hipótese aplicável.</li><li>Conferir eventuais regras específicas da CCT.</li></ul></section>
      <section><h4>2. Aviso-prévio e data</h4><ul><li>Definir se o aviso será trabalhado ou indenizado.</li><li>Conferir a data de comunicação e a data efetiva do desligamento.</li><li>Quando aplicável, calcular a projeção do aviso-prévio.</li></ul></section>
      <section><h4>3. Pendências para o cálculo</h4><ul><li>Conferir salário, médias, adicionais e demais verbas habituais.</li><li>Informar faltas, atrasos, horas extras, banco de horas e descontos pendentes.</li><li>Conferir férias vencidas, férias proporcionais e 13º salário proporcional.</li></ul></section>
      <section><h4>4. Exame e documentos</h4><ul><li>Verificar a necessidade do exame demissional conforme a regra de SST aplicável.</li><li>Providenciar os documentos rescisórios pertinentes.</li><li>Conferir devolução de equipamentos, crachás, chaves e outros bens da empresa, quando houver.</li></ul></section>
      <section><h4>5. FGTS e seguro-desemprego</h4><ul><li>Conferir recolhimentos e informações rescisórias do FGTS quando aplicáveis.</li><li>Verificar direito e documentação do seguro-desemprego quando cabível.</li></ul></section>
      <section><h4>6. Prazo final</h4><ul><li>Conferir o prazo legal para pagamento das verbas rescisórias.</li><li>Revisar os valores antes do pagamento e da entrega dos documentos.</li></ul></section>
    </div>
    <div class="cma-dem-check-acoes"><button type="button" class="cma-dem-check-aviso">Calcular aviso-prévio</button><button type="button" class="cma-dem-check-imprimir">Imprimir checklist</button></div>`;}

  function abrirChecklist(){
    let modal=document.getElementById('cma-demissao-checklist-modal');
    if(!modal){
      modal=document.createElement('div');
      modal.id='cma-demissao-checklist-modal';
      modal.className='cma-dem-check-modal';
      modal.innerHTML=`<div class="cma-dem-check-backdrop"></div><div class="cma-dem-check-painel">${checklistHTML()}</div>`;
      document.body.appendChild(modal);
      modal.querySelector('.cma-dem-check-fechar').addEventListener('click',()=>modal.classList.remove('is-open'));
      modal.querySelector('.cma-dem-check-backdrop').addEventListener('click',()=>modal.classList.remove('is-open'));
      modal.querySelector('.cma-dem-check-imprimir').addEventListener('click',()=>window.print());
      modal.querySelector('.cma-dem-check-aviso').addEventListener('click',()=>{modal.classList.remove('is-open');abrirPagina('calculadora-aviso-previo');});
    }
    modal.classList.add('is-open');
  }

  function aplicar(){
    const sec=document.getElementById('demissao');
    if(!sec||sec.dataset.cmaDemissaoConteudo==='1')return false;
    const alvo=sec.querySelector('.space-y-4.text-sm.text-gray-700')||sec.querySelector('.space-y-4')||sec;
    sec.dataset.cmaDemissaoConteudo='1';

    alvo.innerHTML=`
      <div class="cma-dem-info-head">
        <span>Rotinas de demissão</span>
        <h4>O que deve ser definido antes do desligamento</h4>
        <p>Antes de processar a rescisão, é necessário confirmar o tipo de desligamento, a data, a forma do aviso-prévio, as verbas pendentes e as regras previstas na convenção coletiva aplicável.</p>
      </div>

      <div class="cma-dem-info-lista">
        <section class="cma-dem-info-item">
          <h5>Tipo de desligamento</h5>
          <p>A forma da rescisão altera diretamente as verbas devidas. Por isso, o motivo do desligamento deve ser confirmado antes do cálculo, especialmente nos casos de dispensa sem justa causa, pedido de demissão, acordo entre as partes e término de contrato.</p>
        </section>

        <section class="cma-dem-info-item">
          <h5>Aviso-prévio e data de desligamento</h5>
          <p>Defina se o aviso será trabalhado ou indenizado e confirme a data de comunicação e a data efetiva do término do contrato. Quando houver projeção do aviso-prévio, ela deve ser considerada para os efeitos legais aplicáveis.</p>
          <button type="button" class="cma-dem-info-link" data-abrir="calculadora-aviso-previo">Calcular aviso-prévio →</button>
        </section>

        <section class="cma-dem-info-item">
          <h5>CCT e informações para o cálculo</h5>
          <p>Antes do fechamento, confira a convenção coletiva e informe todas as variáveis que possam alterar a rescisão, como médias, adicionais, horas extras, faltas, banco de horas, férias pendentes e outros valores ou descontos existentes.</p>
        </section>

        <section class="cma-dem-info-item cma-dem-regra-prazo">
          <h5>Prazo para pagamento</h5>
          <p>As verbas rescisórias e os documentos relacionados ao desligamento devem ser entregues dentro do prazo legal aplicável. Como regra geral, o art. 477, §6º, da CLT estabelece o prazo de <strong>10 dias corridos contados do término do contrato</strong>.</p>
          <span>CLT, art. 477, §6º</span>
        </section>

        <section class="cma-dem-info-item">
          <h5>Exame, FGTS e documentos finais</h5>
          <p>Verifique a necessidade do exame demissional conforme as regras de SST, além dos procedimentos de FGTS, seguro-desemprego quando cabível e demais documentos necessários para a conclusão da rescisão.</p>
        </section>
      </div>

      <aside class="cma-dem-material">
        <div class="cma-dem-material-icone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 13h6M9 17h6"/></svg></div>
        <div><span>Material de apoio</span><h5>Checklist de Demissão</h5><p>Abra a relação separada com as conferências necessárias para preparar e concluir o desligamento.</p></div>
        <button type="button" class="cma-dem-material-btn">Abrir checklist</button>
      </aside>`;

    alvo.querySelectorAll('[data-abrir]').forEach(b=>b.addEventListener('click',()=>abrirPagina(b.dataset.abrir)));
    alvo.querySelector('.cma-dem-material-btn')?.addEventListener('click',abrirChecklist);
    instalarEstilo();
    return true;
  }

  function instalarEstilo(){
    if(document.getElementById('cma-demissao-conteudo-style'))return;
    const st=document.createElement('style');st.id='cma-demissao-conteudo-style';st.textContent=`
      #demissao .cma-dem-info-head{margin-bottom:22px}.cma-dem-info-head>span{display:block;margin-bottom:5px;color:#2563eb;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cma-dem-info-head h4{margin:0;color:#172554;font-size:22px;font-weight:850;line-height:1.3}.cma-dem-info-head p{max-width:820px;margin:8px 0 0!important;color:#64748b!important;font-size:15px!important;line-height:1.7!important;text-align:left!important}.cma-dem-info-lista{border-top:1px solid #e2e8f0}.cma-dem-info-item{padding:19px 2px;border-bottom:1px solid #e2e8f0}.cma-dem-info-item h5{margin:0 0 6px;color:#172554;font-size:17px;font-weight:850}.cma-dem-info-item p{margin:0!important;color:#475569!important;font-size:15px!important;line-height:1.7!important;text-align:left!important}.cma-dem-info-item>span{display:inline-block;margin-top:7px;color:#92400e;font-size:12px;font-weight:800}.cma-dem-regra-prazo{padding:18px 16px;margin:0 -14px;border-left:4px solid #f59e0b;background:#fffbeb}.cma-dem-info-link{margin-top:10px;padding:0;border:0;background:transparent;color:#1d4ed8;font-size:14px;font-weight:850;cursor:pointer}.cma-dem-info-link:hover{text-decoration:underline}.cma-dem-material{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;margin-top:24px;padding:17px 18px;border:1px solid #bfdbfe;border-radius:12px;background:#f8fbff}.cma-dem-material-icone{display:grid;width:44px;height:44px;place-items:center;border-radius:11px;background:#eff6ff;color:#1e3a8a}.cma-dem-material-icone svg{width:22px;height:22px}.cma-dem-material span{display:block;color:#2563eb;font-size:11px;font-weight:900;letter-spacing:.07em;text-transform:uppercase}.cma-dem-material h5{margin:2px 0;color:#172554;font-size:17px;font-weight:850}.cma-dem-material p{margin:0!important;color:#64748b!important;font-size:14px!important;line-height:1.55!important;text-align:left!important}.cma-dem-material-btn{padding:10px 14px;border:0;border-radius:9px;background:#172554;color:#fff;font-size:13.5px;font-weight:850;cursor:pointer;white-space:nowrap}.cma-dem-check-modal{display:none;position:fixed;inset:0;z-index:9999}.cma-dem-check-modal.is-open{display:block}.cma-dem-check-backdrop{position:absolute;inset:0;background:rgba(15,23,42,.55)}.cma-dem-check-painel{position:relative;z-index:1;width:min(800px,calc(100% - 28px));max-height:calc(100vh - 36px);overflow:auto;margin:18px auto;padding:24px;border-radius:16px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.25)}.cma-dem-check-head{display:flex;justify-content:space-between;gap:18px;padding-bottom:16px;border-bottom:1px solid #e2e8f0}.cma-dem-check-head span{color:#2563eb;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cma-dem-check-head h3{margin:3px 0;color:#172554;font-size:24px;font-weight:900}.cma-dem-check-head p{margin:0;color:#64748b;font-size:14px}.cma-dem-check-fechar{width:38px;height:38px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;color:#475569;font-size:25px;line-height:1;cursor:pointer}.cma-dem-check-corpo{display:grid;grid-template-columns:1fr 1fr;gap:0 26px;padding-top:8px}.cma-dem-check-corpo section{padding:16px 0;border-bottom:1px solid #f1f5f9}.cma-dem-check-corpo h4{margin:0 0 8px;color:#172554;font-size:16px;font-weight:850}.cma-dem-check-corpo ul{margin:0;padding-left:20px;color:#475569;font-size:14.5px;line-height:1.7}.cma-dem-check-acoes{display:flex;justify-content:flex-end;gap:10px;padding-top:18px}.cma-dem-check-acoes button{padding:10px 15px;border:0;border-radius:9px;font-weight:850;cursor:pointer}.cma-dem-check-aviso{background:#eff6ff;color:#1e3a8a}.cma-dem-check-imprimir{background:#172554;color:#fff}@media(max-width:700px){.cma-dem-info-head h4{font-size:21px}.cma-dem-info-head p,.cma-dem-info-item p{font-size:16px!important}.cma-dem-info-item h5{font-size:18px}.cma-dem-regra-prazo{margin:0 -8px;padding:17px 12px}.cma-dem-material{grid-template-columns:auto 1fr}.cma-dem-material-btn{grid-column:1/-1;width:100%;font-size:15px;padding:12px}.cma-dem-material p{font-size:15px!important}.cma-dem-check-corpo{grid-template-columns:1fr}.cma-dem-check-painel{padding:20px}.cma-dem-check-corpo ul{font-size:15px}.cma-dem-check-acoes{flex-direction:column}.cma-dem-check-acoes button{width:100%}}@media print{body>*{visibility:hidden!important}#cma-demissao-checklist-modal,#cma-demissao-checklist-modal *{visibility:visible!important}#cma-demissao-checklist-modal{display:block!important;position:absolute!important;inset:0!important}.cma-dem-check-backdrop,.cma-dem-check-fechar,.cma-dem-check-acoes{display:none!important}.cma-dem-check-painel{width:100%!important;max-height:none!important;overflow:visible!important;margin:0!important;padding:0!important;box-shadow:none!important}.cma-dem-check-corpo{grid-template-columns:1fr 1fr!important}}
    `;document.head.appendChild(st);
  }

  window.CMADemissaoConteudo={aplicar,abrirChecklist};
  let tentativas=0;(function iniciar(){if(aplicar())return;if(++tentativas<50)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();
