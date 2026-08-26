(function(){
  if(window.CMAAfastamentosConteudo)return;

  function abrirPagina(id){
    if(typeof navigateManual==='function'){navigateManual(id);return;}
    if(typeof showSection==='function')showSection(id,typeof getMenuButton==='function'?getMenuButton(id):null);
  }

  function checklistHTML(){return `
    <div class="cma-af-check-head">
      <div><span>Material de apoio</span><h3>Checklist de Afastamento</h3><p>Conferências para tratar corretamente atestados, benefícios e retorno ao trabalho.</p></div>
      <button type="button" class="cma-af-check-fechar" aria-label="Fechar checklist">×</button>
    </div>
    <div class="cma-af-check-corpo">
      <section><h4>1. Documento recebido</h4><ul><li>Identificar se é atestado médico, declaração de comparecimento ou declaração de acompanhamento.</li><li>Conferir data de emissão, período informado e identificação do profissional ou estabelecimento.</li><li>Verificar regra interna e CCT aplicável para entrega do documento.</li></ul></section>
      <section><h4>2. Quantidade de dias</h4><ul><li>Conferir a quantidade total de dias de afastamento.</li><li>Verificar atestados anteriores pela mesma doença dentro de 60 dias.</li><li>Se o afastamento ultrapassar 15 dias, avaliar encaminhamento ao INSS e os prazos do eSocial.</li></ul></section>
      <section><h4>3. Origem do afastamento</h4><ul><li>Confirmar se o motivo é doença comum, acidente de qualquer natureza ou acidente/doença relacionada ao trabalho.</li><li>Em caso ocupacional, verificar a necessidade de CAT.</li><li>Conferir os efeitos em FGTS e estabilidade quando houver benefício acidentário.</li></ul></section>
      <section><h4>4. Folha e eSocial</h4><ul><li>Registrar corretamente os dias pagos pela empresa.</li><li>Verificar o evento S-2230 e o prazo aplicável ao caso.</li><li>Conferir início, prorrogação e término do afastamento.</li></ul></section>
      <section><h4>5. Retorno</h4><ul><li>Confirmar a data de cessação do benefício ou término do afastamento.</li><li>Se a ausência por doença ou acidente foi igual ou superior a 30 dias, encaminhar ao exame de retorno antes de reassumir as funções.</li><li>Conferir eventual restrição ou orientação da medicina ocupacional.</li></ul></section>
      <section><h4>6. Arquivo</h4><ul><li>Guardar atestados, decisões do INSS, CAT e documentos relacionados.</li><li>Manter coerência entre documento, folha, eSocial e prontuário ocupacional.</li></ul></section>
    </div>
    <div class="cma-af-check-acoes"><button type="button" class="cma-af-check-imprimir">Imprimir checklist</button></div>`;}

  function abrirChecklist(){
    let modal=document.getElementById('cma-afastamentos-checklist-modal');
    if(!modal){
      modal=document.createElement('div');modal.id='cma-afastamentos-checklist-modal';modal.className='cma-af-check-modal';
      modal.innerHTML=`<div class="cma-af-check-backdrop"></div><div class="cma-af-check-painel">${checklistHTML()}</div>`;
      document.body.appendChild(modal);
      modal.querySelector('.cma-af-check-fechar').addEventListener('click',()=>modal.classList.remove('is-open'));
      modal.querySelector('.cma-af-check-backdrop').addEventListener('click',()=>modal.classList.remove('is-open'));
      modal.querySelector('.cma-af-check-imprimir').addEventListener('click',()=>window.print());
    }
    modal.classList.add('is-open');
  }

  function aplicar(){
    const sec=document.getElementById('afastamentos');
    if(!sec||sec.dataset.cmaAfastamentosConteudo==='1')return false;
    const alvo=sec.querySelector('.space-y-4.text-sm.text-gray-700');
    if(!alvo)return false;
    sec.dataset.cmaAfastamentosConteudo='1';

    alvo.innerHTML=`
      <div class="cma-af-info-head">
        <span>Atestados e afastamentos</span>
        <h4>Primeiro, identifique qual é a situação</h4>
        <p>Nem todo documento entregue pelo empregado gera o mesmo efeito. Antes de lançar a ausência, identifique o tipo de documento, a quantidade de dias, a origem do afastamento e se já houve afastamentos anteriores pelo mesmo motivo.</p>
      </div>

      <div class="cma-af-info-lista">
        <section class="cma-af-info-item">
          <h5>Atestado médico</h5>
          <p>O atestado médico informa a necessidade de afastamento do empregado por motivo de saúde. Confira o período indicado, a data de emissão e a identificação do profissional. A quantidade de dias é essencial para definir o tratamento na folha e eventual encaminhamento ao INSS.</p>
        </section>

        <section class="cma-af-info-item cma-af-regra-doc">
          <h5>Declaração de comparecimento ou acompanhamento não é a mesma coisa que atestado</h5>
          <p>A declaração comprova que o empregado compareceu ou acompanhou alguém em atendimento, mas não determina, por si só, afastamento médico por vários dias. O abono deve ser analisado conforme a hipótese legal, a CCT e a documentação apresentada.</p>
          <span>Exemplo: a CLT assegura 1 dia por ano para acompanhar filho de até 6 anos em consulta médica.</span>
        </section>

        <section class="cma-af-info-item cma-af-regra-15">
          <h5>Doença ou acidente com mais de 15 dias</h5>
          <p>Para o empregado vinculado a empresa, os primeiros 15 dias de afastamento por incapacidade são de responsabilidade do empregador. Quando a incapacidade ultrapassa 15 dias, o caso deve ser encaminhado para análise do benefício por incapacidade temporária do INSS.</p>
          <span>INSS — benefício por incapacidade temporária</span>
        </section>

        <section class="cma-af-info-item">
          <h5>Atenção aos afastamentos dentro de 60 dias</h5>
          <p>Atestados pela mesma doença podem precisar ser somados quando ocorrem dentro de 60 dias. Se a soma ultrapassar 15 dias, o afastamento previdenciário e o S-2230 devem ser analisados. Também há regra específica quando o empregado retorna de benefício e se afasta novamente pela mesma doença dentro desse período.</p>
        </section>

        <section class="cma-af-info-item">
          <h5>Acidente ou doença relacionada ao trabalho</h5>
          <p>Quando houver relação com o trabalho, o tratamento é diferente do afastamento comum. Deve-se avaliar a emissão da CAT e, havendo benefício acidentário, existem efeitos específicos, como depósito de FGTS durante o benefício e estabilidade de 12 meses após o retorno.</p>
          <button type="button" class="cma-af-info-link" data-abrir="acidente">Ver acidente de trabalho →</button>
        </section>

        <section class="cma-af-info-item">
          <h5>Licença-maternidade</h5>
          <p>A empregada gestante tem direito, em regra, a 120 dias de licença-maternidade. O afastamento pode começar entre o 28º dia anterior ao parto e a data do nascimento, mediante a documentação aplicável. Situações de internação hospitalar da mãe ou do recém-nascido podem alterar a contagem do período.</p>
        </section>

        <section class="cma-af-info-item cma-af-regra-retorno">
          <h5>Retorno ao trabalho após 30 dias ou mais</h5>
          <p>Quando o empregado ficou afastado por doença ou acidente, de natureza ocupacional ou não, por período igual ou superior a 30 dias, o exame clínico de retorno deve ser realizado antes de ele reassumir suas funções.</p>
          <span>NR-7, item 7.5.9</span>
        </section>

        <section class="cma-af-info-item">
          <h5>Registro no eSocial</h5>
          <p>O S-2230 é utilizado para informar afastamentos temporários, prorrogações e retornos. O prazo varia conforme o motivo e a duração do afastamento; por isso, a informação deve ser enviada ao Departamento Pessoal assim que o documento for recebido.</p>
        </section>
      </div>

      <aside class="cma-af-material">
        <div class="cma-af-material-icone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 13h6M9 17h6"/></svg></div>
        <div><span>Material de apoio</span><h5>Checklist de Afastamento</h5><p>Abra a relação separada para conferir documento, dias, INSS, eSocial, retorno e arquivo.</p></div>
        <button type="button" class="cma-af-material-btn">Abrir checklist</button>
      </aside>`;

    alvo.querySelectorAll('[data-abrir]').forEach(b=>b.addEventListener('click',()=>abrirPagina(b.dataset.abrir)));
    alvo.querySelector('.cma-af-material-btn')?.addEventListener('click',abrirChecklist);
    instalarEstilo();
    return true;
  }

  function instalarEstilo(){
    if(document.getElementById('cma-afastamentos-conteudo-style'))return;
    const st=document.createElement('style');st.id='cma-afastamentos-conteudo-style';st.textContent=`
      #afastamentos .cma-af-info-head{margin-bottom:22px}.cma-af-info-head>span{display:block;margin-bottom:5px;color:#2563eb;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cma-af-info-head h4{margin:0;color:#172554;font-size:22px;font-weight:850;line-height:1.3}.cma-af-info-head p,.cma-af-info-item p{margin:8px 0 0!important;color:#475569!important;font-size:15px!important;line-height:1.7!important;text-align:left!important}.cma-af-info-lista{border-top:1px solid #e2e8f0}.cma-af-info-item{padding:19px 2px;border-bottom:1px solid #e2e8f0}.cma-af-info-item h5{margin:0;color:#172554;font-size:17px;font-weight:850}.cma-af-info-item>span{display:inline-block;margin-top:7px;color:#92400e;font-size:12px;font-weight:800}.cma-af-regra-doc,.cma-af-regra-15,.cma-af-regra-retorno{padding:18px 16px;margin:0 -14px;border-left:4px solid #f59e0b;background:#fffbeb}.cma-af-info-link{margin-top:10px;padding:0;border:0;background:transparent;color:#1d4ed8;font-size:14px;font-weight:850;cursor:pointer}.cma-af-info-link:hover{text-decoration:underline}.cma-af-material{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;margin-top:24px;padding:17px 18px;border:1px solid #bfdbfe;border-radius:12px;background:#f8fbff}.cma-af-material-icone{display:grid;width:44px;height:44px;place-items:center;border-radius:11px;background:#eff6ff;color:#1e3a8a}.cma-af-material-icone svg{width:22px;height:22px}.cma-af-material span{display:block;color:#2563eb;font-size:11px;font-weight:900;letter-spacing:.07em;text-transform:uppercase}.cma-af-material h5{margin:2px 0;color:#172554;font-size:17px;font-weight:850}.cma-af-material p{margin:0!important;color:#64748b!important;font-size:14px!important;line-height:1.55!important;text-align:left!important}.cma-af-material-btn{padding:10px 14px;border:0;border-radius:9px;background:#172554;color:#fff;font-size:13.5px;font-weight:850;cursor:pointer;white-space:nowrap}.cma-af-check-modal{display:none;position:fixed;inset:0;z-index:9999}.cma-af-check-modal.is-open{display:block}.cma-af-check-backdrop{position:absolute;inset:0;background:rgba(15,23,42,.55)}.cma-af-check-painel{position:relative;z-index:1;width:min(800px,calc(100% - 28px));max-height:calc(100vh - 36px);overflow:auto;margin:18px auto;padding:24px;border-radius:16px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.25)}.cma-af-check-head{display:flex;justify-content:space-between;gap:18px;padding-bottom:16px;border-bottom:1px solid #e2e8f0}.cma-af-check-head span{color:#2563eb;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cma-af-check-head h3{margin:3px 0;color:#172554;font-size:24px;font-weight:900}.cma-af-check-head p{margin:0;color:#64748b;font-size:14px}.cma-af-check-fechar{width:38px;height:38px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;color:#475569;font-size:25px;cursor:pointer}.cma-af-check-corpo{display:grid;grid-template-columns:1fr 1fr;gap:0 26px;padding-top:8px}.cma-af-check-corpo section{padding:16px 0;border-bottom:1px solid #f1f5f9}.cma-af-check-corpo h4{margin:0 0 8px;color:#172554;font-size:16px;font-weight:850}.cma-af-check-corpo ul{margin:0;padding-left:20px;color:#475569;font-size:14.5px;line-height:1.7}.cma-af-check-acoes{display:flex;justify-content:flex-end;padding-top:18px}.cma-af-check-imprimir{padding:10px 15px;border:0;border-radius:9px;background:#172554;color:#fff;font-weight:850;cursor:pointer}@media(max-width:700px){.cma-af-info-head p,.cma-af-info-item p{font-size:16px!important}.cma-af-info-item h5{font-size:18px}.cma-af-regra-doc,.cma-af-regra-15,.cma-af-regra-retorno{margin:0 -8px;padding:17px 12px}.cma-af-material{grid-template-columns:auto 1fr}.cma-af-material-btn{grid-column:1/-1;width:100%;font-size:15px;padding:12px}.cma-af-check-corpo{grid-template-columns:1fr}.cma-af-check-painel{padding:20px}.cma-af-check-corpo ul{font-size:15px}}@media print{body>*{visibility:hidden!important}#cma-afastamentos-checklist-modal,#cma-afastamentos-checklist-modal *{visibility:visible!important}#cma-afastamentos-checklist-modal{display:block!important;position:absolute!important;inset:0!important}.cma-af-check-backdrop,.cma-af-check-fechar,.cma-af-check-acoes{display:none!important}.cma-af-check-painel{width:100%!important;max-height:none!important;overflow:visible!important;margin:0!important;padding:0!important;box-shadow:none!important}.cma-af-check-corpo{grid-template-columns:1fr 1fr!important}}
    `;document.head.appendChild(st);
  }

  window.CMAAfastamentosConteudo={aplicar,abrirChecklist};
  let tentativas=0;(function iniciar(){if(aplicar())return;if(++tentativas<50)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();