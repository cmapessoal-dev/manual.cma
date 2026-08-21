(function(){
  function carregarTabelaMultas(){
    if(document.getElementById('cma-tabela-multas-loader')||document.getElementById('tabela-multas'))return;
    const script=document.createElement('script');
    script.id='cma-tabela-multas-loader';
    script.src='multas/tabela-multas.js?v=20260821';
    document.body.appendChild(script);
  }

  function incluirBasesLegaisAtualizadas(){
    const secao=document.getElementById('baselegal');
    if(!secao||document.getElementById('cma-bases-legais-20260821')){carregarTabelaMultas();return;}

    const bloco=document.createElement('div');
    bloco.id='cma-bases-legais-20260821';
    bloco.className='mt-6 space-y-4 text-sm text-gray-700';
    bloco.innerHTML=`
      <div class="bg-blue-50 border-l-4 border-blue-900 p-4 rounded-r shadow-sm">
        <strong class="text-blue-950 block mb-1">Bases legais incluídas nas atualizações de agosto/2026</strong>
        <p class="text-blue-950 leading-relaxed">As normas abaixo fundamentam os conteúdos adicionados ao Manual sobre trabalho em domingos e feriados, riscos psicossociais, campanhas de saúde, faltas justificáveis, multas administrativas trabalhistas e guarda de documentos.</p>
      </div>

      <div class="bg-white p-4 rounded border border-gray-200 shadow-sm">
        <strong class="text-blue-950 block mb-2">Jornada, domingos e feriados</strong>
        <ul class="list-disc list-inside space-y-1 text-gray-600">
          <li><strong>Lei nº 10.101/2000</strong> — regras aplicáveis ao trabalho no comércio aos domingos e feriados.</li>
          <li><strong>Portaria MTE nº 1.316/2026</strong> — disciplina o trabalho em feriados nas atividades do comércio e as hipóteses de autorização permanente.</li>
          <li><strong>CLT, arts. 67 e 386</strong> — repouso semanal e escala de revezamento dominical aplicável às mulheres.</li>
          <li><strong>Lei nº 605/1949</strong> — repouso semanal remunerado e trabalho em feriados.</li>
        </ul>
      </div>

      <div class="bg-white p-4 rounded border border-gray-200 shadow-sm">
        <strong class="text-blue-950 block mb-2">SST, riscos psicossociais e saúde preventiva</strong>
        <ul class="list-disc list-inside space-y-1 text-gray-600">
          <li><strong>NR-1 — Disposições Gerais e Gerenciamento de Riscos Ocupacionais</strong> — inclusão dos fatores de risco psicossociais relacionados ao trabalho no GRO/PGR.</li>
          <li><strong>NR-17 — Ergonomia</strong> — referência complementar para avaliação da organização e das condições de trabalho.</li>
          <li><a class="text-blue-800 underline" href="https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/l15377.htm" target="_blank" rel="noopener"><strong>Lei nº 15.377/2026</strong></a> — inclusão do art. 169-A e do § 3º do art. 473 da CLT, com deveres de informação sobre vacinação, HPV, cânceres e exames preventivos.</li>
        </ul>
      </div>

      <div class="bg-white p-4 rounded border border-gray-200 shadow-sm">
        <strong class="text-blue-950 block mb-2">Faltas justificáveis — art. 473 da CLT</strong>
        <ul class="list-disc list-inside space-y-1 text-gray-600">
          <li><a class="text-blue-800 underline" href="https://www.planalto.gov.br/ccivil_03/decreto-lei/Del0229.htm#art473" target="_blank" rel="noopener"><strong>Decreto-Lei nº 229/1967</strong></a> — redação do art. 473 e hipóteses originais de ausência justificada.</li>
          <li><a class="text-blue-800 underline" href="https://www.planalto.gov.br/ccivil_03/_Ato2019-2022/2022/Lei/L14457.htm#art32" target="_blank" rel="noopener"><strong>Lei nº 14.457/2022</strong></a> — alterações dos incisos III e X do art. 473.</li>
          <li><a class="text-blue-800 underline" href="https://www.planalto.gov.br/ccivil_03/LEIS/L4375.htm#art65c" target="_blank" rel="noopener"><strong>Lei nº 4.375/1964</strong></a> — Lei do Serviço Militar, relacionada ao inciso VI.</li>
          <li><a class="text-blue-800 underline" href="https://www.planalto.gov.br/ccivil_03/decreto-lei/Del0757.htm#art1" target="_blank" rel="noopener"><strong>Decreto-Lei nº 757/1969</strong></a> — inclusão da hipótese relacionada às exigências do Serviço Militar.</li>
          <li><a class="text-blue-800 underline" href="https://www.planalto.gov.br/ccivil_03/LEIS/L9471.htm#art1" target="_blank" rel="noopener"><strong>Lei nº 9.471/1997</strong></a> — provas de vestibular.</li>
          <li><a class="text-blue-800 underline" href="https://www.planalto.gov.br/ccivil_03/LEIS/L9853.htm#art2" target="_blank" rel="noopener"><strong>Lei nº 9.853/1999</strong></a> — comparecimento a juízo.</li>
          <li><a class="text-blue-800 underline" href="https://www.planalto.gov.br/ccivil_03/_Ato2004-2006/2006/Lei/L11304.htm" target="_blank" rel="noopener"><strong>Lei nº 11.304/2006</strong></a> — representação sindical em reunião oficial de organismo internacional.</li>
          <li><a class="text-blue-800 underline" href="https://www.planalto.gov.br/ccivil_03/_Ato2015-2018/2016/Lei/L13257.htm#art37" target="_blank" rel="noopener"><strong>Lei nº 13.257/2016</strong></a> — acompanhamento de filho de até 6 anos em consulta médica.</li>
          <li><a class="text-blue-800 underline" href="https://www.planalto.gov.br/ccivil_03/_Ato2015-2018/2018/Lei/L13767.htm#art1" target="_blank" rel="noopener"><strong>Lei nº 13.767/2018</strong></a> — até 3 dias para exames preventivos de câncer.</li>
          <li><a class="text-blue-800 underline" href="https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/l15377.htm" target="_blank" rel="noopener"><strong>Lei nº 15.377/2026</strong></a> — dever de informar sobre exames preventivos de HPV e câncer, nos termos do art. 473, XII.</li>
          <li><a class="text-blue-800 underline" href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm" target="_blank" rel="noopener"><strong>CLT — art. 473, texto compilado</strong></a> — referência principal para consulta das hipóteses vigentes.</li>
        </ul>
      </div>

      <div class="bg-white p-4 rounded border border-gray-200 shadow-sm">
        <strong class="text-blue-950 block mb-2">Multas administrativas trabalhistas</strong>
        <ul class="list-disc list-inside space-y-1 text-gray-600">
          <li><strong>Portaria MTE nº 1.131, de 3 de julho de 2025</strong> — atualiza os valores e critérios das multas administrativas trabalhistas e altera os Anexos I e IV da Portaria MTP nº 667/2021.</li>
          <li><strong>Portaria MTP nº 667/2021</strong> — regulamenta o processo administrativo trabalhista e os parâmetros para aplicação das multas administrativas.</li>
        </ul>
      </div>

      <div class="bg-white p-4 rounded border border-gray-200 shadow-sm">
        <strong class="text-blue-950 block mb-2">Guarda de documentos trabalhistas, previdenciários, FGTS e SST</strong>
        <ul class="list-disc list-inside space-y-1 text-gray-600">
          <li><strong>Constituição Federal, art. 7º, XXIX</strong> — referência prescricional utilizada no material-base para diversos documentos trabalhistas.</li>
          <li><strong>Portaria MTP nº 671/2021</strong> — referências para CAGED e RAIS.</li>
          <li><strong>Decreto-Lei nº 2.052/1983</strong> — documentos relacionados ao PIS/PASEP.</li>
          <li><strong>Portaria nº 3.214/1978 e NRs 4, 5 e 7</strong> — documentos de SST, CIPA e exames ocupacionais.</li>
          <li><strong>Decreto nº 99.684/1990</strong> — referência indicada no material-base para documentos do FGTS.</li>
          <li><strong>Lei nº 5.172/1966 — CTN, art. 174</strong> — contribuição sindical.</li>
          <li><strong>Decreto nº 3.048/1999, art. 348</strong> e <strong>Súmula Vinculante nº 8 do STF</strong> — documentos previdenciários.</li>
          <li><strong>IN PRES/INSS nº 128/2022, art. 284, § 9º</strong> — PPP e comprovação de entrega ao trabalhador.</li>
          <li><strong>Resoluções CODEFAT nº 393/2004 e nº 957/2022</strong> — Comunicação de Dispensa e Seguro-Desemprego.</li>
          <li><strong>NR-1, item 1.5.7.3.3.1, e NR-7, item 7.6.1.1</strong> — guarda de documentos de PGR e PCMSO conforme o material-base.</li>
        </ul>
      </div>`;

    const nav=secao.querySelector('.cma-page-navigation');
    if(nav)secao.insertBefore(bloco,nav);else secao.appendChild(bloco);
    carregarTabelaMultas();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',incluirBasesLegaisAtualizadas);else incluirBasesLegaisAtualizadas();
})();
