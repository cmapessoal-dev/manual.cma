(function(){
  function criarSecaoGuardaDocumentos(){
    const menu=document.getElementById('manual-menu');
    const main=document.querySelector('#manual-conteudo main');
    if(!menu||!main||document.getElementById('guarda-documentos'))return;

    const botao=document.createElement('button');
    botao.type='button';
    botao.setAttribute('onclick',"showSection('guarda-documentos', this)");
    botao.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';
    botao.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-4 h-4 mr-2.5 shrink-0"><path d="M4 4h16v16H4z"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M8 10h8"/><path d="M8 14h5"/></svg> Prazos de Guarda de Documentos';

    const baseBtn=typeof getMenuButton==='function'?getMenuButton('baselegal'):null;
    if(baseBtn)menu.insertBefore(botao,baseBtn);else menu.appendChild(botao);

    const linhas=[
      ['1','Acordo de Compensação','5 anos durante a vigência do contrato, até 2 anos após a rescisão','CF, art. 7º, XXIX'],
      ['2','Acordo de Prorrogação','5 anos durante a vigência do contrato, até 2 anos após a rescisão','CF, art. 7º, XXIX'],
      ['3','Atestado Médico','5 anos durante a vigência do contrato, até 2 anos após a rescisão','CF, art. 7º, XXIX'],
      ['4','Autorização para desconto não previsto em lei','5 anos durante a vigência do contrato, até 2 anos após a rescisão','CF, art. 7º, XXIX'],
      ['5','Aviso Prévio','2 anos','CF, art. 7º, XXIX'],
      ['6','CAGED — Cadastro Geral de Empregados e Desempregados','5 anos a contar da data do envio','Portaria MTP nº 671/2021, art. 157, § 2º'],
      ['7','Comprovante de Cadastramento PIS/PASEP','10 anos','Decreto-Lei nº 2.052/1983, arts. 3º e 10'],
      ['8','Declaração de Instalação (NR-2 — Portaria nº 3.214/1978)','Indeterminado','Conforme referência do material-base'],
      ['9','Exames Médicos (ASO)','20 anos, no mínimo, após a rescisão do contrato com o empregado','Portaria nº 3.214/1978 — NR-7'],
      ['10','FGTS — documentos','30 anos','Decreto nº 99.684/1990'],
      ['11','Folha de votação de eleição da CIPA','5 anos','Portaria nº 3.214/1978 — NR-5'],
      ['12','GRCS — Guia de Recolhimento de Contribuição Sindical','5 anos','CTN — Lei nº 5.172/1966, art. 174'],
      ['13','Documentos do INSS sujeitos à fiscalização','5 anos. Na hipótese de dolo, fraude ou simulação, observar a regra específica indicada na fundamentação legal.','Súmula Vinculante nº 8 do STF e Decreto nº 3.048/1999, art. 348, § 2º'],
      ['14','Livro de Atas da CIPA','Indeterminado','Conforme referência do material-base'],
      ['15','Livro de Inspeção do Trabalho','Indeterminado','Conforme referência do material-base'],
      ['16','Mapa Anual de Acidente de Trabalho','5 anos','Portaria nº 3.214/1978 — NR-4'],
      ['17','Pedido de Demissão','2 anos','CF, art. 7º, XXIX'],
      ['18','PPP — Perfil Profissiográfico Previdenciário e comprovação de entrega ao trabalhador','20 anos','IN PRES/INSS nº 128/2022, art. 284, § 9º'],
      ['19','RAIS','5 anos','Portaria MTP nº 671/2021, art. 152'],
      ['20','Recibo de abono de férias','5 anos durante a vigência do contrato, até 2 anos após a rescisão','CF, art. 7º, XXIX'],
      ['21','Recibo de adiantamento salarial','5 anos durante a vigência do contrato, até 2 anos após a rescisão','CF, art. 7º, XXIX'],
      ['22','Recibo de entrega da Comunicação de Dispensa — CD (Seguro-Desemprego)','5 anos para os recibos emitidos até 22/09/2022','Resolução CODEFAT nº 393/2004, revogada pela Resolução CODEFAT nº 957/2022'],
      ['23','Recibo de gozo de férias','5 anos durante a vigência do contrato, até 2 anos após a rescisão','CF, art. 7º, XXIX'],
      ['24','Recibo de pagamento de salário','5 anos durante a vigência do contrato, até 2 anos após a rescisão','CF, art. 7º, XXIX'],
      ['25','Registro de Empregados','Indeterminado','Conforme referência do material-base'],
      ['26','Salário-Educação — documentos de convênios','5 anos. Na hipótese de dolo, fraude ou simulação, observar a regra específica indicada na fundamentação legal.','Decreto-Lei nº 1.422/1975, art. 1º, § 3º; Súmula Vinculante nº 8 do STF; Decreto nº 3.048/1999, art. 348, § 2º'],
      ['27','Salário-Família — comprovantes de pagamento e cópia das certidões (vacinação e frequência escolar)','5 anos. Na hipótese de ocorrência de dolo, fraude ou simulação, observar a regra específica indicada na fundamentação legal.','Decreto nº 3.048/1999, art. 348, caput e § 2º'],
      ['28','Salário-Maternidade','5 anos. Na hipótese de dolo, fraude ou simulação, observar a regra específica indicada na fundamentação legal.','Súmula Vinculante nº 8 do STF e Decreto nº 3.048/1999, art. 348, § 2º'],
      ['29','Solicitação de abono de férias','5 anos durante a vigência do contrato, até 2 anos após a rescisão','CF, art. 7º, XXIX'],
      ['30','Segurança e Saúde no Trabalho — PCMSO e PGR','20 anos','NR-7, item 7.6.1.1; NR-1, item 1.5.7.3.3.1'],
      ['31','Termo de Rescisão de Contrato de Trabalho','2 anos','CF, art. 7º, XXIX'],
      ['32','Vale-Transporte','5 anos durante a vigência do contrato, até 2 anos após a rescisão','CF, art. 7º, XXIX']
    ];

    const section=document.createElement('section');
    section.id='guarda-documentos';
    section.className='manual-section hidden fade-in';
    section.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
        <h3 class="text-2xl font-bold text-blue-950 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 text-blue-950 w-7 h-7"><path d="M4 4h16v16H4z"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M8 10h8"/><path d="M8 14h5"/></svg>
          Guarda de Documentos Trabalhistas, Previdenciários e FGTS
        </h3>
        <button onclick="toggleExplainer('exp-guarda-documentos')" class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold hover:bg-slate-300 flex items-center shrink-0">Entenda os Termos</button>
      </div>

      <div id="exp-guarda-documentos" class="hidden bg-slate-100 border border-slate-300 p-3 rounded mb-4 text-xs text-slate-700 space-y-2">
        <p><strong>Prazo de guarda:</strong> período durante o qual o documento deve permanecer arquivado e disponível para comprovação, fiscalização ou defesa da empresa.</p>
        <p><strong>Prazo indeterminado:</strong> indica que o documento deve ser preservado sem uma data final previamente definida no material de referência.</p>
        <p><strong>Fundamentação legal:</strong> norma utilizada como referência para o prazo indicado. A legislação pode ser alterada, por isso os prazos devem ser revistos periodicamente.</p>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-900 p-4 rounded-r shadow-sm mb-4">
        <strong class="text-blue-950 block mb-1">Orientação para organização documental</strong>
        <p class="text-blue-950 text-sm leading-relaxed">A empresa deve manter seus documentos trabalhistas, previdenciários, de FGTS e de SST organizados e acessíveis durante todo o período de guarda aplicável. Sempre que possível, mantenha cópias digitais com controle de acesso, identificação do empregado e período correspondente.</p>
      </div>

      <div class="cma-guarda-table-wrap">
        <table class="cma-guarda-table">
          <thead><tr><th>Nº</th><th>Documento</th><th>Período</th><th>Fundamentação Legal</th></tr></thead>
          <tbody>${linhas.map(l=>`<tr><td>${l[0]}</td><td>${l[1]}</td><td>${l[2]}</td><td>${l[3]}</td></tr>`).join('')}</tbody>
        </table>
      </div>

      <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm mt-4">
        <strong class="text-amber-900 block mb-1">Atenção aos documentos com prazo indeterminado</strong>
        <p class="text-amber-950 text-sm leading-relaxed">Os documentos classificados como de guarda indeterminada devem ser preservados, pois podem ser solicitados em fiscalização. O descarte documental deve considerar não apenas o prazo trabalhista, mas também eventuais obrigações previdenciárias, fiscais, de SST e de proteção de dados.</p>
      </div>`;

    const base=document.getElementById('baselegal');
    if(base)main.insertBefore(section,base);else main.appendChild(section);

    if(typeof manualSections!=='undefined'&&!manualSections.some(x=>x.id==='guarda-documentos')){
      const pos=manualSections.findIndex(x=>x.id==='baselegal');
      manualSections.splice(pos>=0?pos:manualSections.length,0,{id:'guarda-documentos',nome:'Prazos de Guarda de Documentos'});
    }

    const style=document.createElement('style');
    style.id='cma-guarda-documentos-style';
    style.textContent=`.cma-guarda-table-wrap{width:100%;overflow-x:auto;border:1px solid #e2e8f0;border-radius:12px;background:#fff}.cma-guarda-table{width:100%;min-width:900px;border-collapse:collapse;font-size:12px}.cma-guarda-table th{padding:11px 10px;background:#172554;color:#fff;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.03em}.cma-guarda-table th:first-child,.cma-guarda-table td:first-child{width:50px;text-align:center}.cma-guarda-table td{padding:10px;border-bottom:1px solid #e5e7eb;vertical-align:top;color:#475569;line-height:1.45}.cma-guarda-table td:nth-child(2){font-weight:700;color:#1e293b;min-width:210px}.cma-guarda-table td:nth-child(3){min-width:270px}.cma-guarda-table td:nth-child(4){min-width:250px}.cma-guarda-table tbody tr:nth-child(even){background:#f8fafc}.cma-guarda-table tbody tr:last-child td{border-bottom:0}@media(max-width:640px){.cma-guarda-table{font-size:11px}.cma-guarda-table th,.cma-guarda-table td{padding:9px 8px}}`;
    document.head.appendChild(style);

    if(window.location.hash==='#guarda-documentos')setTimeout(()=>showSection('guarda-documentos',botao),50);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criarSecaoGuardaDocumentos);else criarSecaoGuardaDocumentos();
})();