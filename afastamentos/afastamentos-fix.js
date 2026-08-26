(function(){
  function aplicar(){
    const sec=document.getElementById('afastamentos');
    if(!sec)return false;
    if(sec.querySelector('.cma-af-info-head')&&sec.querySelector('.cma-af-material'))return true;

    let alvo=sec.querySelector('.space-y-4.text-sm.text-gray-700');
    if(!alvo){
      const filhos=[...sec.children];
      const cabecalho=filhos.find(el=>el.querySelector&&el.querySelector('h3'))||filhos[0];
      alvo=document.createElement('div');
      alvo.className='cma-afastamentos-conteudo-aplicado';
      if(cabecalho&&cabecalho.nextSibling)sec.insertBefore(alvo,cabecalho.nextSibling);else sec.appendChild(alvo);
      filhos.forEach(el=>{
        if(el!==cabecalho&&el!==alvo&&!el.classList.contains('cma-page-navigation'))el.remove();
      });
    }

    alvo.innerHTML=`
      <div class="cma-af-info-head">
        <span>Atestados e afastamentos</span>
        <h4>Primeiro, identifique qual é a situação</h4>
        <p>Nem todo documento entregue pelo empregado produz o mesmo efeito. Antes de lançar a ausência, identifique o tipo de documento, a quantidade de dias, a origem do afastamento e se já houve afastamentos anteriores pelo mesmo motivo.</p>
      </div>
      <div class="cma-af-info-lista">
        <section class="cma-af-info-item"><h5>Atestado médico</h5><p>O atestado médico informa a necessidade de afastamento do empregado por motivo de saúde. Confira o período indicado, a data de emissão e a identificação do profissional. A quantidade de dias é essencial para definir o tratamento na folha e eventual encaminhamento ao INSS.</p></section>
        <section class="cma-af-info-item cma-af-regra-doc"><h5>Declaração de comparecimento ou acompanhamento</h5><p>A declaração comprova que o empregado compareceu ou acompanhou alguém em atendimento, mas não equivale automaticamente a um atestado médico. O abono deve ser analisado conforme a hipótese legal, a CCT e a documentação apresentada.</p><span>Exemplo: a CLT assegura 1 dia por ano para acompanhar filho de até 6 anos em consulta médica.</span></section>
        <section class="cma-af-info-item cma-af-regra-15"><h5>Afastamento superior a 15 dias</h5><p>Nos casos de incapacidade por doença ou acidente, a empresa paga os primeiros 15 dias. Quando o afastamento ultrapassa esse período, o caso deve ser encaminhado para análise do benefício por incapacidade temporária do INSS.</p><span>Verifique também afastamentos anteriores pela mesma doença dentro de 60 dias.</span></section>
        <section class="cma-af-info-item"><h5>Afastamentos dentro de 60 dias</h5><p>Atestados pela mesma doença podem precisar ser somados quando ocorrem dentro de 60 dias. Se a soma ultrapassar 15 dias, deve ser analisado o afastamento previdenciário e o correspondente registro no eSocial.</p></section>
        <section class="cma-af-info-item"><h5>Acidente ou doença relacionada ao trabalho</h5><p>Quando houver relação com o trabalho, deve-se avaliar a emissão da CAT. Havendo benefício acidentário, existem efeitos específicos, como depósito de FGTS durante o benefício e estabilidade após o retorno.</p><button type="button" class="cma-af-info-link" data-abrir="acidente">Ver acidente de trabalho →</button></section>
        <section class="cma-af-info-item"><h5>Licença-maternidade</h5><p>A licença-maternidade é, em regra, de 120 dias. O início, a documentação e situações especiais, como internação hospitalar da mãe ou do recém-nascido, devem ser analisados conforme o caso.</p></section>
        <section class="cma-af-info-item cma-af-regra-retorno"><h5>Retorno ao trabalho após 30 dias ou mais</h5><p>Quando o empregado ficou afastado por doença ou acidente por período igual ou superior a 30 dias, o exame clínico de retorno deve ser realizado antes de ele reassumir as funções.</p><span>NR-7, item 7.5.9</span></section>
        <section class="cma-af-info-item"><h5>Registro no eSocial</h5><p>O S-2230 é utilizado para informar afastamentos temporários, prorrogações e retornos. O prazo varia conforme o motivo e a duração do afastamento, por isso a informação deve chegar ao Departamento Pessoal assim que o documento for recebido.</p></section>
      </div>
      <aside class="cma-af-material">
        <div class="cma-af-material-icone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 13h6M9 17h6"/></svg></div>
        <div><span>Material de apoio</span><h5>Checklist de Afastamento</h5><p>Conferência de documento, dias, INSS, CAT, eSocial e retorno ao trabalho.</p></div>
        <button type="button" class="cma-af-material-btn">Abrir checklist</button>
      </aside>`;

    alvo.querySelectorAll('[data-abrir]').forEach(b=>b.addEventListener('click',()=>{
      const id=b.dataset.abrir;
      if(typeof navigateManual==='function')navigateManual(id);else if(typeof showSection==='function')showSection(id,typeof getMenuButton==='function'?getMenuButton(id):null);
    }));
    alvo.querySelector('.cma-af-material-btn')?.addEventListener('click',()=>{
      if(window.CMAAfastamentosConteudo?.abrirChecklist)window.CMAAfastamentosConteudo.abrirChecklist();
    });
    sec.dataset.cmaAfastamentosConteudo='1';
    return true;
  }

  let tentativas=0;(function iniciar(){if(aplicar())return;if(++tentativas<60)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
  document.addEventListener('cma:navegacao-atualizada',aplicar);
})();