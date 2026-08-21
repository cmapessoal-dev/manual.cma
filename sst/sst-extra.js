(function(){
  function carregarComplementosGerais(){
    if(!document.getElementById('cma-faltas-justificaveis-loader')){
      const faltas=document.createElement('script');
      faltas.id='cma-faltas-justificaveis-loader';
      faltas.src='faltas-justificaveis/faltas-justificaveis.js?v=20260821';
      document.body.appendChild(faltas);
    }
    if(!document.getElementById('cma-bibliografia-extra-loader')){
      const bibliografia=document.createElement('script');
      bibliografia.id='cma-bibliografia-extra-loader';
      bibliografia.src='bibliografia/bibliografia-extra.js?v=20260821';
      document.body.appendChild(bibliografia);
    }
    if(!document.getElementById('cma-guarda-documentos-loader')){
      const guarda=document.createElement('script');
      guarda.id='cma-guarda-documentos-loader';
      guarda.src='guarda-documentos/guarda-documentos.js?v=20260821';
      document.body.appendChild(guarda);
    }
  }

  function removerCipaOriginal(secao){
    const titulo=Array.from(secao.querySelectorAll('h4')).find(h=>(h.textContent||'').includes('CIPA'));
    if(!titulo)return;
    const card=titulo.closest('.bg-white');
    if(card)card.remove();
  }

  function atualizarEntendaTermos(secao){
    const exp=secao.querySelector('#exp-sst');
    if(!exp)return;
    exp.className='hidden bg-slate-100 border border-slate-300 p-3 rounded mb-4 text-xs text-slate-700 space-y-3';
    exp.innerHTML=`
      <div><strong>PGR — Programa de Gerenciamento de Riscos:</strong> documento central do Gerenciamento de Riscos Ocupacionais (GRO), composto pelo inventário de riscos e pelo plano de ação. Deve identificar, avaliar e controlar os riscos ocupacionais existentes na empresa.</div>
      <div><strong>PCMSO — Programa de Controle Médico de Saúde Ocupacional:</strong> programa médico previsto na NR-7, elaborado a partir dos riscos identificados no PGR. Define o acompanhamento da saúde ocupacional e os exames admissionais, periódicos, de retorno, mudança de risco e demissionais.</div>
      <div><strong>LTCAT — Laudo Técnico das Condições Ambientais do Trabalho:</strong> laudo previdenciário elaborado por médico do trabalho ou engenheiro de segurança do trabalho para registrar a existência ou não de exposição a agentes nocivos e subsidiar informações previdenciárias, inclusive o PPP.</div>`;
  }

  function incluirAtualizacoesSST(){
    const secao=document.getElementById('sst');
    if(!secao){carregarComplementosGerais();return;}

    atualizarEntendaTermos(secao);
    removerCipaOriginal(secao);

    const conteudo=secao.querySelector('.space-y-4.text-sm.text-gray-700');
    if(!conteudo){carregarComplementosGerais();return;}

    const antigo=document.getElementById('cma-sst-atualizacoes');
    if(antigo)antigo.remove();

    const wrapper=document.createElement('div');
    wrapper.id='cma-sst-atualizacoes';
    wrapper.className='space-y-4';
    wrapper.innerHTML=`
      <div class="bg-white p-4 rounded border border-gray-200 shadow-sm">
        <h4 class="font-bold text-blue-950 text-sm mb-3">Programas e Laudos de SST — o que são e quais os principais prazos</h4>

        <div class="space-y-4 text-gray-600 text-sm leading-relaxed">
          <div>
            <p><strong class="text-blue-950">1. PGR — Programa de Gerenciamento de Riscos</strong></p>
            <p>Tem como finalidade identificar, avaliar e controlar os riscos ocupacionais, por meio do inventário de riscos e do plano de ação. Deve refletir continuamente a realidade do ambiente e da organização do trabalho.</p>
            <p class="mt-1"><strong>Prazo de revisão:</strong> a avaliação de riscos deve ser revista, no máximo, a cada <strong>2 anos</strong>. Para organizações com certificação válida em sistema de gestão de SST, o prazo pode chegar a <strong>3 anos</strong>. A revisão deve ocorrer antes desse prazo sempre que houver mudanças relevantes, acidentes, doenças relacionadas ao trabalho, falhas nas medidas de prevenção ou alteração de requisitos legais.</p>
          </div>

          <div class="border-t border-gray-100 pt-3">
            <p><strong class="text-blue-950">2. PCMSO — Programa de Controle Médico de Saúde Ocupacional</strong></p>
            <p>É o programa médico da empresa e deve ser elaborado considerando os riscos identificados no PGR. Organiza o acompanhamento clínico e os exames ocupacionais dos empregados.</p>
            <p class="mt-1"><strong>Principais prazos da NR-7:</strong></p>
            <ul class="list-disc list-inside space-y-1 mt-1">
              <li><strong>Admissional:</strong> antes de o empregado iniciar suas atividades;</li>
              <li><strong>Periódico:</strong> em regra, anualmente para empregados expostos a riscos ocupacionais ou com condições que aumentem a suscetibilidade; para os demais empregados, a cada <strong>2 anos</strong>, ressalvadas periodicidades específicas;</li>
              <li><strong>Retorno ao trabalho:</strong> antes da reassunção das funções, após afastamento igual ou superior a <strong>30 dias</strong> por doença ou acidente;</li>
              <li><strong>Mudança de risco ocupacional:</strong> antes da mudança;</li>
              <li><strong>Demissional:</strong> em até <strong>10 dias</strong> após o término do contrato, podendo haver dispensa conforme a data do último exame ocupacional e o grau de risco da empresa;</li>
              <li><strong>Relatório analítico do PCMSO:</strong> elaborado <strong>anualmente</strong>.</li>
            </ul>
          </div>

          <div class="border-t border-gray-100 pt-3">
            <p><strong class="text-blue-950">3. LTCAT — Laudo Técnico das Condições Ambientais do Trabalho</strong></p>
            <p>É um laudo de natureza previdenciária que registra tecnicamente a exposição dos trabalhadores a agentes nocivos. É utilizado como base para informações relacionadas à aposentadoria especial e ao PPP.</p>
            <p class="mt-1"><strong>Prazo / atualização:</strong> não existe uma validade única de 1 ou 2 anos aplicável a todas as empresas. O LTCAT deve permanecer <strong>atualizado em relação às condições reais do ambiente</strong> e ser revisto sempre que houver alteração relevante, como mudança de leiaute, máquinas, equipamentos, processo produtivo, medidas de proteção ou organização do trabalho.</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded border border-gray-200 shadow-sm">
        <h4 class="font-bold text-blue-950 text-sm mb-2">Riscos Psicossociais — NR-1 e PGR</h4>
        <p class="text-gray-600 leading-relaxed text-sm mb-3">Desde 26 de maio de 2026, a NR-1 passou a incluir expressamente os <strong>fatores de risco psicossociais relacionados ao trabalho</strong> no Gerenciamento de Riscos Ocupacionais (GRO). A empresa deve avaliar esses fatores dentro do PGR e registrar as medidas de prevenção aplicáveis.</p>
        <strong class="text-blue-950 block mb-2 text-sm">Principais fatores que devem ser avaliados:</strong>
        <ul class="list-disc list-inside space-y-1 text-gray-600 text-sm mb-3">
          <li>sobrecarga de trabalho, excesso de demandas e pressão excessiva;</li>
          <li>falta de suporte da liderança e organização inadequada do trabalho;</li>
          <li>conflitos interpessoais, assédio moral, assédio sexual e outras formas de violência;</li>
          <li>baixa autonomia, falhas de comunicação e insegurança relacionada ao trabalho;</li>
          <li>situações capazes de contribuir para estresse ocupacional, esgotamento e outros impactos à saúde mental.</li>
        </ul>
        <p class="text-gray-600 leading-relaxed text-sm">A análise deve se concentrar nas condições e na organização do trabalho, buscando identificar os fatores de risco e definir medidas de prevenção, acompanhamento e melhoria do ambiente laboral.</p>
      </div>

      <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm">
        <strong class="text-amber-900 block mb-1">Orientação CMA — atualização do PGR</strong>
        <p class="text-amber-950 leading-relaxed text-sm">A empresa deve entrar em contato com a clínica ou profissional responsável pelo SST para revisar o PGR, verificar a metodologia adequada para avaliação dos riscos psicossociais e definir o respectivo plano de ação. A análise e as medidas devem considerar a realidade de cada empresa.</p>
      </div>

      <div class="bg-white p-4 rounded border border-gray-200 shadow-sm">
        <h4 class="font-bold text-blue-950 text-sm mb-2">CIPA — Comissão Interna de Prevenção de Acidentes e de Assédio</h4>
        <p class="text-sm text-gray-600 leading-relaxed mb-2">A necessidade de constituição da CIPA depende do número de empregados, do grau de risco e do dimensionamento previsto na NR-5. Quando o estabelecimento não se enquadrar no quadro de dimensionamento, deverá ser observada a regra aplicável ao <strong>representante nomeado da NR-5</strong>.</p>
        <ul class="list-disc list-inside space-y-1 text-gray-600 text-sm mb-3">
          <li>atuar na prevenção de acidentes e doenças relacionadas ao trabalho;</li>
          <li>acompanhar medidas de prevenção e condições de trabalho;</li>
          <li>participar das ações de prevenção e combate ao assédio sexual e às demais formas de violência no trabalho;</li>
          <li>atuar de forma integrada com o PGR e demais ações de SST.</li>
        </ul>
        <div class="bg-red-50 border-l-4 border-red-600 p-3 rounded-r">
          <p class="text-xs text-red-900 font-semibold leading-relaxed"><strong>Orientação CMA:</strong> consulte a clínica ou o profissional responsável pelo SST para confirmar o correto dimensionamento da CIPA, a necessidade de representante nomeado, os treinamentos e os procedimentos aplicáveis ao estabelecimento.</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded border border-gray-200 shadow-sm">
        <h4 class="font-bold text-blue-950 text-sm mb-2">Campanhas de Vacinação e Prevenção em Saúde</h4>
        <p class="text-gray-600 leading-relaxed text-sm mb-3">A Lei nº 15.377/2026 estabeleceu deveres de informação e conscientização em saúde. As empresas devem disponibilizar aos empregados informações sobre <strong>campanhas oficiais de vacinação</strong>, HPV e os cânceres de <strong>mama, colo do útero e próstata</strong>, observando as orientações do Ministério da Saúde.</p>
        <strong class="text-blue-950 block mb-2 text-sm">A empresa deve:</strong>
        <ul class="list-disc list-inside space-y-1 text-gray-600 text-sm mb-3">
          <li>divulgar informações sobre campanhas oficiais de vacinação;</li>
          <li>promover ações de conscientização sobre HPV e os cânceres previstos na legislação;</li>
          <li>orientar os empregados sobre acesso aos serviços de diagnóstico e prevenção;</li>
          <li>informar os trabalhadores sobre o direito de ausência para realização dos exames preventivos abrangidos pela CLT.</li>
        </ul>
        <div class="bg-blue-50 border-l-4 border-blue-900 p-3 rounded-r">
          <p class="text-blue-950 text-sm leading-relaxed"><strong>Ausência para exames preventivos:</strong> a CLT permite a ausência, sem prejuízo do salário, por até <strong>3 dias em cada 12 meses de trabalho</strong> para realização de exames preventivos de câncer devidamente comprovados.</p>
        </div>
      </div>

      <div class="bg-red-50 border-l-4 border-red-600 p-4 rounded-r shadow-sm">
        <strong class="text-red-800 block mb-1">Atenção à documentação</strong>
        <p class="text-red-950 leading-relaxed text-sm">Os programas e ações de SST devem permanecer coerentes entre si e com a realidade da empresa. Alterações no ambiente, processos, funções, máquinas, riscos ocupacionais ou organização do trabalho devem ser comunicadas à clínica ou ao profissional responsável para avaliação da necessidade de atualização dos documentos.</p>
      </div>`;

    conteudo.appendChild(wrapper);
    carregarComplementosGerais();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',incluirAtualizacoesSST);
  }else{
    incluirAtualizacoesSST();
  }
})();