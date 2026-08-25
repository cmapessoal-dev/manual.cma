(function(){
  function abrir(id){
    if(typeof navigateManual==='function'){navigateManual(id);return;}
    if(typeof showSection==='function')showSection(id,typeof getMenuButton==='function'?getMenuButton(id):null);
  }

  function aplicar(){
    const guia=document.getElementById('cma-guia-admissao');
    const lista=guia?.querySelector('.cma-fluxo-lista');
    if(!guia||!lista||guia.dataset.cmaVisualCompacto==='1')return false;
    guia.dataset.cmaVisualCompacto='1';

    lista.innerHTML=`
      <section class="cma-adm-linha cma-adm-linha-destaque">
        <div class="cma-adm-marcador">1</div>
        <div class="cma-adm-conteudo">
          <h5>Definir a contratação</h5>
          <p>Antes do envio, confirme o tipo de contrato e o regime aplicável: prazo indeterminado, prazo determinado, experiência, intermitente ou tempo parcial.</p>
          <button type="button" class="cma-adm-acao" data-abrir="experiencia">Ver tipos de contratos →</button>
        </div>
      </section>

      <section class="cma-adm-linha">
        <div class="cma-adm-marcador">2</div>
        <div class="cma-adm-conteudo">
          <h5>Dados da admissão</h5>
          <div class="cma-adm-itens">
            <span>Responsável pelas informações</span><span>Contratante</span><span>CNPJ, CPF ou CEI</span>
            <span>Nome completo</span><span>Data da admissão</span><span>Função</span><span>Salário ou piso</span>
            <span>Período de experiência, quando aplicável</span>
          </div>
        </div>
      </section>

      <section class="cma-adm-linha">
        <div class="cma-adm-marcador">3</div>
        <div class="cma-adm-conteudo">
          <h5>Jornada e benefícios</h5>
          <div class="cma-adm-duas-colunas">
            <div><strong>Jornada</strong><p>Entrada, intervalo, saída e folga de segunda-feira a domingo.</p><button type="button" class="cma-adm-acao" data-abrir="calculadora-jornada">Conferir jornada →</button></div>
            <div><strong>Benefícios</strong><p>Vale-transporte casa → trabalho e trabalho → casa, além de vale-refeição ou vale-alimentação.</p></div>
          </div>
        </div>
      </section>

      <section class="cma-adm-linha">
        <div class="cma-adm-marcador">4</div>
        <div class="cma-adm-conteudo">
          <h5>Documentos e informações pessoais</h5>
          <div class="cma-adm-grupos">
            <div><strong>Funcionário</strong><p>PIS, RG, CPF, título de eleitor, CNH quando houver, endereço, telefone e e-mail.</p></div>
            <div><strong>Documentos para envio</strong><p>ASO admissional, declaração de escolaridade, certidão de casamento quando houver, reservista quando aplicável e exame toxicológico para motorista.</p></div>
            <div><strong>Dependentes</strong><p>Certidão de nascimento, CPF, cartão de vacinação e comprovante de frequência escolar dos filhos, quando aplicável.</p></div>
          </div>
        </div>
      </section>

      <section class="cma-adm-linha cma-adm-linha-final">
        <div class="cma-adm-marcador">5</div>
        <div class="cma-adm-conteudo">
          <h5>Conferência final</h5>
          <p>Revise se as informações estão completas, registre observações relevantes e confira a autodeclaração étnico-racial prevista no formulário admissional antes do envio ao Departamento Pessoal.</p>
          <div class="cma-adm-aviso"><strong>Importante:</strong> o ASO admissional deve ser realizado antes do início das atividades e o registro precisa ser transmitido ao eSocial dentro do prazo aplicável.</div>
        </div>
      </section>`;

    lista.querySelectorAll('[data-abrir]').forEach(b=>b.addEventListener('click',()=>abrir(b.dataset.abrir)));
    instalarEstilo();
    return true;
  }

  function instalarEstilo(){
    if(document.getElementById('cma-guia-admissao-visual-style'))return;
    const st=document.createElement('style');
    st.id='cma-guia-admissao-visual-style';
    st.textContent=`
      #cma-guia-admissao .cma-fluxo-lista{display:block!important;position:relative;margin-top:18px!important}
      #cma-guia-admissao .cma-fluxo-lista:before{content:"";position:absolute;left:18px;top:20px;bottom:24px;width:2px;background:#dbeafe}
      .cma-adm-linha{position:relative;display:grid;grid-template-columns:38px minmax(0,1fr);gap:15px;padding:0 0 22px;background:transparent!important;border:0!important;box-shadow:none!important}
      .cma-adm-marcador{position:relative;z-index:1;display:grid;place-items:center;width:36px;height:36px;border-radius:50%;background:#fff;border:2px solid #bfdbfe;color:#1e3a8a;font-size:13px;font-weight:900}
      .cma-adm-linha-destaque .cma-adm-marcador{background:#1e3a8a;border-color:#1e3a8a;color:#fff}
      .cma-adm-conteudo{padding:3px 0 0}.cma-adm-conteudo h5{margin:0 0 7px;color:#172554;font-size:16px;font-weight:850}.cma-adm-conteudo>p{margin:0!important;color:#64748b!important;font-size:13px!important;line-height:1.6!important;text-align:left!important}
      .cma-adm-itens{display:flex;flex-wrap:wrap;gap:7px 8px;margin-top:8px}.cma-adm-itens span{padding:6px 9px;border:1px solid #e2e8f0;border-radius:999px;background:#f8fafc;color:#475569;font-size:11.5px;font-weight:700}
      .cma-adm-duas-colunas{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:8px}.cma-adm-duas-colunas>div,.cma-adm-grupos>div{padding:12px 13px;border:1px solid #e2e8f0;border-radius:10px;background:#fff}.cma-adm-duas-colunas strong,.cma-adm-grupos strong{display:block;margin-bottom:4px;color:#334155;font-size:12px}.cma-adm-duas-colunas p,.cma-adm-grupos p{margin:0!important;color:#64748b!important;font-size:12px!important;line-height:1.5!important;text-align:left!important}
      .cma-adm-grupos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:8px}
      .cma-adm-acao{margin-top:9px;padding:0;border:0;background:none;color:#1d4ed8;font-size:12px;font-weight:850;cursor:pointer}.cma-adm-acao:hover{text-decoration:underline}
      .cma-adm-aviso{margin-top:10px;padding:10px 12px;border-left:3px solid #f59e0b;border-radius:0 8px 8px 0;background:#fffbeb;color:#78350f;font-size:12px;line-height:1.5}
      .cma-adm-linha-final{padding-bottom:2px}
      @media(max-width:760px){#cma-guia-admissao .cma-fluxo-lista:before{left:16px}.cma-adm-linha{grid-template-columns:34px minmax(0,1fr);gap:12px;padding-bottom:20px}.cma-adm-marcador{width:32px;height:32px;font-size:12px}.cma-adm-conteudo h5{font-size:15px}.cma-adm-conteudo>p{font-size:13px!important}.cma-adm-duas-colunas,.cma-adm-grupos{grid-template-columns:1fr}.cma-adm-itens span{font-size:12px}}
    `;
    document.head.appendChild(st);
  }

  window.CMAGuiaAdmissaoVisual={aplicar};
  let tentativas=0;(function iniciar(){if(aplicar())return;if(++tentativas<50)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();
