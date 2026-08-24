(function(){
  if(window.CMAAdmissaoModalidades)return;

  const icone=(conteudo)=>`<span class="cma-fluxo-icone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${conteudo}</svg></span>`;

  function abrir(id){
    if(typeof navigateManual==='function'){navigateManual(id);return;}
    if(typeof showSection==='function')showSection(id,typeof getMenuButton==='function'?getMenuButton(id):null);
  }

  function renderAdmissao(){
    const sec=document.getElementById('admissao');
    if(!sec||document.getElementById('cma-guia-admissao'))return false;
    document.getElementById('cma-admissao-modalidades')?.remove();
    const alvo=sec.querySelector('.space-y-4.text-sm.text-gray-700')||sec;
    const bloco=document.createElement('div');
    bloco.id='cma-guia-admissao';
    bloco.className='cma-guia-admissao';
    bloco.innerHTML=`
      <div class="cma-fluxo-head">
        <span class="cma-fluxo-kicker">Guia de admissão</span>
        <h4>O que precisamos para iniciar uma admissão</h4>
        <p>Use esta sequência para reunir as informações antes do envio ao Departamento Pessoal. Os itens seguem a relação padrão de documentos e informações para admissão.</p>
      </div>

      <div class="cma-fluxo-lista">
        <section class="cma-fluxo-etapa cma-fluxo-destaque">
          <div class="cma-fluxo-topo">${icone('<path d="M6 3h12v18H6z"/><path d="M9 7h6M9 11h6M9 15h4"/>')}<div><span class="cma-fluxo-num">1</span><h5>Defina o tipo de contrato e o regime aplicável</h5></div></div>
          <p>Antes de preencher a admissão, confirme se a contratação será por prazo indeterminado, prazo determinado, experiência, intermitente ou se haverá regime de tempo parcial. Isso interfere diretamente nas informações que serão enviadas.</p>
          <button type="button" class="cma-fluxo-link" data-abrir="experiencia">Ver tipos de contratos →</button>
        </section>

        <section class="cma-fluxo-etapa">
          <div class="cma-fluxo-topo">${icone('<path d="M4 21V7l8-4 8 4v14"/><path d="M9 21v-6h6v6"/>')}<div><span class="cma-fluxo-num">2</span><h5>Identificação do pedido</h5></div></div>
          <ul><li>Responsável pelas informações</li><li>Contratante</li><li>CNPJ, CPF ou CEI do contratante</li></ul>
        </section>

        <section class="cma-fluxo-etapa">
          <div class="cma-fluxo-topo">${icone('<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2"/><path d="M19 8v6M16 11h6"/>')}<div><span class="cma-fluxo-num">3</span><h5>Dados do funcionário e da função</h5></div></div>
          <ul><li>Nome completo</li><li>Data para admissão</li><li>Função</li><li>Salário ou piso</li><li>Período de experiência, quando essa modalidade for utilizada</li></ul>
        </section>

        <section class="cma-fluxo-etapa">
          <div class="cma-fluxo-topo">${icone('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h4M7 14h2M15 10h2"/>')}<div><span class="cma-fluxo-num">4</span><h5>Benefícios</h5></div></div>
          <ul><li>Vale-transporte: valor diário casa → trabalho</li><li>Vale-transporte: valor diário trabalho → casa</li><li>Vale-refeição ou vale-alimentação: valor diário</li></ul>
        </section>

        <section class="cma-fluxo-etapa">
          <div class="cma-fluxo-topo">${icone('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')}<div><span class="cma-fluxo-num">5</span><h5>Horário de trabalho, intervalos e folga</h5></div></div>
          <p>Informe a jornada de segunda-feira a domingo, indicando entrada, início e fim do intervalo, saída e o dia de folga.</p>
          <button type="button" class="cma-fluxo-link" data-abrir="calculadora-jornada">Conferir jornada →</button>
        </section>

        <section class="cma-fluxo-etapa">
          <div class="cma-fluxo-topo">${icone('<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M7 15h10M7 18h7"/>')}<div><span class="cma-fluxo-num">6</span><h5>Dados e documentos pessoais</h5></div></div>
          <ul><li>PIS</li><li>Identidade (RG)</li><li>CPF</li><li>Título de eleitor</li><li>CNH: número, categoria e validade, quando houver</li><li>Endereço completo</li><li>Telefone</li><li>E-mail</li></ul>
        </section>

        <section class="cma-fluxo-etapa">
          <div class="cma-fluxo-topo">${icone('<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 13h6M9 17h6"/>')}<div><span class="cma-fluxo-num">7</span><h5>Documentos que devem acompanhar o pedido</h5></div></div>
          <ul><li>Exame admissional (ASO)</li><li>Declaração de escolaridade</li><li>Certidão de casamento, caso haja</li><li>Certificado de reservista, quando aplicável</li><li>Exame toxicológico para função de motorista</li></ul>
        </section>

        <section class="cma-fluxo-etapa">
          <div class="cma-fluxo-topo">${icone('<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M3 21v-2a5 5 0 0 1 5-5M21 21v-2a5 5 0 0 0-5-5"/>')}<div><span class="cma-fluxo-num">8</span><h5>Se houver dependentes — filhos(as)</h5></div></div>
          <ul><li>Certidão de nascimento</li><li>CPF</li><li>Cartão de vacinação</li><li>Comprovante de frequência escolar</li></ul>
        </section>

        <section class="cma-fluxo-etapa">
          <div class="cma-fluxo-topo">${icone('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>')}<div><span class="cma-fluxo-num">9</span><h5>Conferência final</h5></div></div>
          <p>Confira se os documentos e informações estão completos, registre detalhes ou observações gerais e verifique a documentação de autodeclaração étnico-racial prevista no formulário admissional.</p>
        </section>
      </div>`;
    alvo.appendChild(bloco);
    bloco.querySelectorAll('[data-abrir]').forEach(b=>b.addEventListener('click',()=>abrir(b.dataset.abrir)));
    return true;
  }

  function renderTipos(){
    const sec=document.getElementById('experiencia');
    if(!sec||sec.dataset.cmaTiposContratos==='1')return false;
    sec.dataset.cmaTiposContratos='1';
    sec.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
        <div><h3 class="text-2xl font-bold text-blue-950">Tipos de Contratos e Regimes de Contratação</h3><p class="text-sm text-gray-500 mt-1">Entenda as formas mais utilizadas de contratação antes de definir a admissão.</p></div>
      </div>
      <div class="cma-tipos-lista">
        <article class="cma-tipo-card"><span class="cma-tipo-tag">Tipo de contrato</span><h4>Contrato por Prazo Indeterminado</h4><p>É a forma mais comum de contratação. O vínculo começa sem data previamente definida para terminar.</p><dl><div><dt>Duração</dt><dd>Sem data final determinada.</dd></div><div><dt>Uso comum</dt><dd>Necessidade de trabalho contínua e permanente.</dd></div><div><dt>Direitos</dt><dd>Aplicam-se normalmente férias + 1/3, 13º salário, FGTS, INSS, DSR e demais direitos cabíveis.</dd></div></dl></article>

        <article class="cma-tipo-card"><span class="cma-tipo-tag">Tipo de contrato</span><h4>Contrato por Prazo Determinado</h4><p>É uma modalidade própria de contratação em que a data de término é previamente estabelecida ou depende da conclusão de um serviço ou acontecimento previsível.</p><dl><div><dt>Quando cabe</dt><dd>Em hipóteses legais de serviço cuja natureza ou transitoriedade justifique o prazo, atividade empresarial transitória ou outras situações autorizadas.</dd></div><div><dt>Limite geral</dt><dd>Em regra, não pode ultrapassar <strong>2 anos</strong>.</dd></div><div><dt>Prorrogação</dt><dd>Deve ser tratada com cuidado, pois sucessivas prorrogações podem descaracterizar o prazo determinado.</dd></div></dl><div class="cma-tipo-alerta"><strong>Importante:</strong> prazo determinado não é sinônimo de contrato de experiência. A experiência é apenas uma das espécies de contrato por prazo determinado.</div></article>

        <article class="cma-tipo-card"><span class="cma-tipo-tag">Espécie de prazo determinado</span><h4>Contrato de Experiência</h4><p>Serve para que empregado e empregador avaliem a adaptação à função e às condições de trabalho.</p><dl><div><dt>Limite</dt><dd>Máximo de <strong>90 dias</strong>.</dd></div><div><dt>Prorrogação</dt><dd>Admite uma única prorrogação, sempre respeitando o total de 90 dias.</dd></div><div><dt>Exemplos</dt><dd>45 + 45 dias, 60 + 30 dias ou outros períodos que respeitem o limite legal.</dd></div></dl><button type="button" class="cma-fluxo-link" data-abrir="calculadora-experiencia">Calcular período de experiência →</button></article>

        <article class="cma-tipo-card"><span class="cma-tipo-tag cma-tipo-tag-regime">Regime de jornada</span><h4>Tempo Parcial</h4><p>Não é um tipo contratual isolado, mas um regime de jornada reduzida que pode ser utilizado na contratação quando observados os limites legais.</p><dl><div><dt>Opção 1</dt><dd>Até <strong>30 horas semanais</strong>, sem horas suplementares semanais.</dd></div><div><dt>Opção 2</dt><dd>Até <strong>26 horas semanais</strong>, com até <strong>6 horas suplementares</strong> por semana.</dd></div><div><dt>Salário</dt><dd>Proporcional à jornada em relação ao empregado da mesma função em tempo integral.</dd></div></dl></article>

        <article class="cma-tipo-card"><span class="cma-tipo-tag">Tipo de contrato</span><h4>Contrato de Trabalho Intermitente</h4><p>Utilizado quando a prestação de serviços não é contínua, alternando períodos de trabalho e inatividade, com prestação mediante convocação.</p><dl><div><dt>Contrato</dt><dd>Deve ser escrito e indicar o valor da hora de trabalho.</dd></div><div><dt>Convocação</dt><dd>Com pelo menos <strong>3 dias corridos</strong> de antecedência; o empregado tem <strong>1 dia útil</strong> para responder e pode recusar sem romper o vínculo.</dd></div><div><dt>Pagamento</dt><dd><strong>Tudo é pago ao final de cada período de prestação de serviços:</strong> remuneração, férias proporcionais + 1/3, 13º proporcional, DSR e adicionais legais, discriminados no recibo.</dd></div><div><dt>Inatividade</dt><dd>Não é tempo à disposição e o trabalhador pode prestar serviços a outros contratantes.</dd></div></dl></article>

        <article class="cma-tipo-card"><span class="cma-tipo-tag cma-tipo-tag-especial">Contratação especial</span><h4>Contrato de Aprendizagem</h4><p>Contrato especial, por prazo determinado, destinado à formação técnico-profissional de adolescentes e jovens, observados os requisitos próprios do programa de aprendizagem.</p><dl><div><dt>Prazo</dt><dd>Em regra, até <strong>2 anos</strong>, observadas as exceções legais.</dd></div><div><dt>Formação</dt><dd>Combina atividades teóricas e práticas vinculadas ao programa de aprendizagem.</dd></div></dl></article>

        <article class="cma-tipo-card"><span class="cma-tipo-tag cma-tipo-tag-especial">Vínculo formativo</span><h4>Estágio</h4><p>O estágio não constitui vínculo empregatício quando são atendidos os requisitos legais, incluindo matrícula e frequência regular, termo de compromisso, compatibilidade das atividades e acompanhamento efetivo.</p><div class="cma-tipo-alerta"><strong>Atenção:</strong> o descumprimento dos requisitos legais pode caracterizar vínculo de emprego.</div></article>
      </div>`;
    sec.querySelectorAll('[data-abrir]').forEach(b=>b.addEventListener('click',()=>abrir(b.dataset.abrir)));
    return true;
  }

  function instalarEstilo(){
    if(document.getElementById('cma-admissao-modalidades-style'))return;
    const st=document.createElement('style');st.id='cma-admissao-modalidades-style';st.textContent=`
      .cma-guia-admissao,.cma-tipos-lista{margin-top:20px}.cma-fluxo-head{margin-bottom:14px}.cma-fluxo-kicker{display:block;margin-bottom:3px;color:#2563eb;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cma-fluxo-head h4{margin:0;color:#172554;font-size:20px;font-weight:850}.cma-fluxo-head p{margin:5px 0 0!important;color:#64748b!important;font-size:13px!important;line-height:1.55!important;text-align:left!important}
      .cma-fluxo-lista,.cma-tipos-lista{display:flex;flex-direction:column;gap:12px}.cma-fluxo-etapa,.cma-tipo-card{padding:16px 17px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;box-shadow:0 4px 12px rgba(15,23,42,.035)}.cma-fluxo-destaque{border-color:#bfdbfe;background:#f8fbff}.cma-fluxo-topo{display:flex;align-items:center;gap:11px}.cma-fluxo-icone{display:grid;width:37px;height:37px;place-items:center;flex:0 0 37px;border-radius:9px;background:#eff6ff;color:#1e3a8a}.cma-fluxo-icone svg{width:19px;height:19px}.cma-fluxo-num{display:block;color:#94a3b8;font-size:10px;font-weight:900;line-height:1}.cma-fluxo-etapa h5{margin:2px 0 0;color:#172554;font-size:14.5px;font-weight:850}.cma-fluxo-etapa p,.cma-tipo-card p{margin:10px 0 0!important;color:#64748b!important;font-size:12.8px!important;line-height:1.55!important;text-align:left!important}.cma-fluxo-etapa ul{margin:10px 0 0;padding-left:18px;list-style:disc;color:#475569}.cma-fluxo-etapa li{margin:4px 0;font-size:12.8px;line-height:1.45}.cma-fluxo-link{display:inline-flex;margin-top:11px;padding:8px 10px;border:1px solid #bfdbfe;border-radius:8px;background:#fff;color:#1e3a8a;font-size:12px;font-weight:850;cursor:pointer}.cma-fluxo-link:hover{background:#1e3a8a;color:#fff;border-color:#1e3a8a}
      .cma-tipo-card h4{margin:5px 0 0;color:#172554;font-size:17px;font-weight:850}.cma-tipo-tag{display:inline-flex;padding:4px 7px;border-radius:999px;background:#eff6ff;color:#1e3a8a;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.04em}.cma-tipo-tag-regime{background:#f0fdf4;color:#166534}.cma-tipo-tag-especial{background:#fefce8;color:#854d0e}.cma-tipo-card dl{margin:12px 0 0}.cma-tipo-card dl>div{display:grid;grid-template-columns:125px minmax(0,1fr);gap:10px;padding:8px 0;border-top:1px solid #f1f5f9}.cma-tipo-card dt{color:#475569;font-size:11.5px;font-weight:850}.cma-tipo-card dd{margin:0;color:#475569;font-size:12.5px;line-height:1.5}.cma-tipo-alerta{margin-top:11px;padding:10px 11px;border-radius:8px;background:#fffbeb;color:#78350f;font-size:11.8px;line-height:1.5}
      @media(max-width:760px){.cma-fluxo-etapa,.cma-tipo-card{padding:15px}.cma-tipo-card dl>div{grid-template-columns:1fr;gap:3px}.cma-fluxo-etapa li,.cma-fluxo-etapa p,.cma-tipo-card p,.cma-tipo-card dd{font-size:13px!important}}
    `;document.head.appendChild(st);
  }

  function aplicar(){instalarEstilo();renderAdmissao();renderTipos();}
  window.CMAAdmissaoModalidades={aplicar,renderAdmissao,renderTipos};
  let tentativas=0;(function iniciar(){aplicar();if(++tentativas<50)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();
