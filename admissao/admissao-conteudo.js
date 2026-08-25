(function(){
  if(window.CMAAdmissaoConteudo)return;

  function abrirPagina(id){
    if(typeof navigateManual==='function'){navigateManual(id);return;}
    if(typeof showSection==='function')showSection(id,typeof getMenuButton==='function'?getMenuButton(id):null);
  }

  function checklistHTML(){return `
    <div class="cma-adm-check-head">
      <div><span>Material de apoio</span><h3>Checklist de Admissão</h3><p>Relação de informações e documentos para encaminhamento da admissão.</p></div>
      <button type="button" class="cma-adm-check-fechar" aria-label="Fechar checklist">×</button>
    </div>
    <div class="cma-adm-check-corpo">
      <section><h4>1. Identificação</h4><ul><li>Responsável pelas informações</li><li>Contratante</li><li>CNPJ / CPF / CEI</li></ul></section>
      <section><h4>2. Funcionário e contratação</h4><ul><li>Nome completo</li><li>Data para admissão</li><li>Função</li><li>Salário ou piso</li><li>Período de experiência, quando aplicável</li></ul></section>
      <section><h4>3. Benefícios e jornada</h4><ul><li>Vale-transporte: casa → trabalho e trabalho → casa</li><li>Vale-refeição / alimentação</li><li>Horário de trabalho, intervalos e folga</li></ul></section>
      <section><h4>4. Dados pessoais</h4><ul><li>PIS</li><li>RG e CPF</li><li>Título de eleitor</li><li>CNH: número, categoria e validade, quando houver</li><li>Endereço completo</li><li>Telefone e e-mail</li></ul></section>
      <section><h4>5. Documentos para acompanhar</h4><ul><li>Exame admissional (ASO)</li><li>Declaração de escolaridade</li><li>Certidão de casamento, quando houver</li><li>Certificado de reservista, quando aplicável</li><li>Exame toxicológico para função de motorista</li></ul></section>
      <section><h4>6. Dependentes — filhos(as)</h4><ul><li>Certidão de nascimento</li><li>CPF</li><li>Cartão de vacinação</li><li>Comprovante de frequência escolar</li></ul></section>
    </div>
    <div class="cma-adm-check-acoes"><button type="button" class="cma-adm-check-imprimir">Imprimir checklist</button></div>`;}

  function abrirChecklist(){
    let modal=document.getElementById('cma-adm-checklist-modal');
    if(!modal){
      modal=document.createElement('div');
      modal.id='cma-adm-checklist-modal';
      modal.className='cma-adm-check-modal';
      modal.innerHTML=`<div class="cma-adm-check-backdrop"></div><div class="cma-adm-check-painel">${checklistHTML()}</div>`;
      document.body.appendChild(modal);
      modal.querySelector('.cma-adm-check-fechar').addEventListener('click',()=>modal.classList.remove('is-open'));
      modal.querySelector('.cma-adm-check-backdrop').addEventListener('click',()=>modal.classList.remove('is-open'));
      modal.querySelector('.cma-adm-check-imprimir').addEventListener('click',()=>window.print());
    }
    modal.classList.add('is-open');
  }

  function aplicar(){
    const sec=document.getElementById('admissao');
    const guia=document.getElementById('cma-guia-admissao');
    if(!sec||!guia||guia.dataset.cmaConteudoLimpo==='1')return false;
    guia.dataset.cmaConteudoLimpo='1';
    guia.innerHTML=`
      <div class="cma-adm-info-head">
        <span>Admissão de funcionários</span>
        <h4>O que deve ser definido antes da contratação</h4>
        <p>A admissão precisa ser organizada antes do início das atividades. O objetivo é garantir que dados contratuais, jornada, benefícios, documentos e exame admissional estejam definidos para o registro correto do empregado.</p>
      </div>

      <div class="cma-adm-info-lista">
        <section class="cma-adm-info-item">
          <h5>Definições da contratação</h5>
          <p>Antes do envio da admissão, confirme a função, salário, data de início, tipo de contrato, jornada, intervalo, folga e benefícios que serão concedidos.</p>
          <button type="button" class="cma-adm-info-link" data-abrir="experiencia">Consultar tipos de contratos →</button>
        </section>

        <section class="cma-adm-info-item">
          <h5>Documentação e exame admissional</h5>
          <p>Os dados pessoais e documentos do empregado devem estar completos, e o exame admissional deve ser realizado antes do início das atividades.</p>
        </section>

        <section class="cma-adm-info-item">
          <h5>Registro antes do início do trabalho</h5>
          <p>A admissão deve estar preparada e transmitida dentro do prazo aplicável, antes de o empregado iniciar suas atividades. Períodos de trabalho sem o devido registro não devem ser utilizados como forma de “teste”.</p>
        </section>

        <section class="cma-adm-info-item">
          <h5>Conferência da jornada e dos benefícios</h5>
          <p>A jornada informada deve refletir a rotina real de trabalho, com horários de entrada, saída, intervalos e folgas. Os benefícios também devem ser definidos antes do processamento da admissão.</p>
          <button type="button" class="cma-adm-info-link" data-abrir="calculadora-jornada">Conferir jornada →</button>
        </section>
      </div>

      <aside class="cma-adm-material">
        <div class="cma-adm-material-icone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 13h6M9 17h6"/></svg></div>
        <div><span>Material de apoio</span><h5>Checklist de Admissão</h5><p>Abra a relação separada com os dados e documentos necessários para encaminhar uma admissão.</p></div>
        <button type="button" class="cma-adm-material-btn">Abrir checklist</button>
      </aside>`;

    guia.querySelectorAll('[data-abrir]').forEach(b=>b.addEventListener('click',()=>abrirPagina(b.dataset.abrir)));
    guia.querySelector('.cma-adm-material-btn')?.addEventListener('click',abrirChecklist);
    instalarEstilo();
    return true;
  }

  function instalarEstilo(){
    if(document.getElementById('cma-admissao-conteudo-style'))return;
    const st=document.createElement('style');st.id='cma-admissao-conteudo-style';st.textContent=`
      #cma-guia-admissao{margin-top:18px}.cma-adm-info-head{margin-bottom:22px}.cma-adm-info-head>span{display:block;margin-bottom:5px;color:#2563eb;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cma-adm-info-head h4{margin:0;color:#172554;font-size:22px;font-weight:850;line-height:1.3}.cma-adm-info-head p{max-width:820px;margin:8px 0 0!important;color:#64748b!important;font-size:15px!important;line-height:1.7!important;text-align:left!important}.cma-adm-info-lista{border-top:1px solid #e2e8f0}.cma-adm-info-item{padding:19px 2px;border-bottom:1px solid #e2e8f0}.cma-adm-info-item h5{margin:0 0 6px;color:#172554;font-size:17px;font-weight:850}.cma-adm-info-item p{margin:0!important;color:#475569!important;font-size:15px!important;line-height:1.7!important;text-align:left!important}.cma-adm-info-link{margin-top:10px;padding:0;border:0;background:transparent;color:#1d4ed8;font-size:14px;font-weight:850;cursor:pointer}.cma-adm-info-link:hover{text-decoration:underline}.cma-adm-material{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;margin-top:24px;padding:17px 18px;border:1px solid #bfdbfe;border-radius:12px;background:#f8fbff}.cma-adm-material-icone{display:grid;width:44px;height:44px;place-items:center;border-radius:11px;background:#eff6ff;color:#1e3a8a}.cma-adm-material-icone svg{width:22px;height:22px}.cma-adm-material span{display:block;color:#2563eb;font-size:11px;font-weight:900;letter-spacing:.07em;text-transform:uppercase}.cma-adm-material h5{margin:2px 0;color:#172554;font-size:17px;font-weight:850}.cma-adm-material p{margin:0!important;color:#64748b!important;font-size:14px!important;line-height:1.55!important;text-align:left!important}.cma-adm-material-btn{padding:10px 14px;border:0;border-radius:9px;background:#172554;color:#fff;font-size:13.5px;font-weight:850;cursor:pointer;white-space:nowrap}.cma-adm-material-btn:hover{background:#1e3a8a}.cma-adm-check-modal{display:none;position:fixed;inset:0;z-index:9999}.cma-adm-check-modal.is-open{display:block}.cma-adm-check-backdrop{position:absolute;inset:0;background:rgba(15,23,42,.55)}.cma-adm-check-painel{position:relative;z-index:1;width:min(760px,calc(100% - 28px));max-height:calc(100vh - 36px);overflow:auto;margin:18px auto;padding:24px;border-radius:16px;background:#fff;box-shadow:0 24px 70px rgba(15,23,42,.25)}.cma-adm-check-head{display:flex;justify-content:space-between;gap:18px;padding-bottom:16px;border-bottom:1px solid #e2e8f0}.cma-adm-check-head span{color:#2563eb;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cma-adm-check-head h3{margin:3px 0;color:#172554;font-size:24px;font-weight:900}.cma-adm-check-head p{margin:0;color:#64748b;font-size:14px}.cma-adm-check-fechar{width:38px;height:38px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;color:#475569;font-size:25px;line-height:1;cursor:pointer}.cma-adm-check-corpo{display:grid;grid-template-columns:1fr 1fr;gap:0 26px;padding-top:8px}.cma-adm-check-corpo section{padding:16px 0;border-bottom:1px solid #f1f5f9}.cma-adm-check-corpo h4{margin:0 0 8px;color:#172554;font-size:16px;font-weight:850}.cma-adm-check-corpo ul{margin:0;padding-left:20px;color:#475569;font-size:14.5px;line-height:1.7}.cma-adm-check-acoes{display:flex;justify-content:flex-end;padding-top:18px}.cma-adm-check-imprimir{padding:10px 15px;border:0;border-radius:9px;background:#172554;color:#fff;font-weight:850;cursor:pointer}@media(max-width:700px){.cma-adm-info-head h4{font-size:21px}.cma-adm-info-head p,.cma-adm-info-item p{font-size:16px!important}.cma-adm-info-item h5{font-size:18px}.cma-adm-material{grid-template-columns:auto 1fr}.cma-adm-material-btn{grid-column:1/-1;width:100%;font-size:15px;padding:12px}.cma-adm-material p{font-size:15px!important}.cma-adm-check-corpo{grid-template-columns:1fr}.cma-adm-check-painel{padding:20px}.cma-adm-check-corpo ul{font-size:15px}}@media print{body>*{visibility:hidden!important}#cma-adm-checklist-modal,#cma-adm-checklist-modal *{visibility:visible!important}#cma-adm-checklist-modal{display:block!important;position:absolute!important;inset:0!important}.cma-adm-check-backdrop,.cma-adm-check-fechar,.cma-adm-check-acoes{display:none!important}.cma-adm-check-painel{width:100%!important;max-height:none!important;overflow:visible!important;margin:0!important;padding:0!important;box-shadow:none!important}.cma-adm-check-corpo{grid-template-columns:1fr 1fr!important}}
    `;document.head.appendChild(st);
  }

  window.CMAAdmissaoConteudo={aplicar,abrirChecklist};
  let tentativas=0;(function iniciar(){if(aplicar())return;if(++tentativas<50)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();