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
  }

  function incluirAtualizacoesSST(){
    const secao=document.getElementById('sst');
    if(!secao||document.getElementById('cma-sst-atualizacoes')){carregarComplementosGerais();return;}

    const conteudo=secao.querySelector('.space-y-4.text-sm.text-gray-700');
    if(!conteudo){carregarComplementosGerais();return;}

    const wrapper=document.createElement('div');
    wrapper.id='cma-sst-atualizacoes';
    wrapper.className='space-y-4';
    wrapper.innerHTML=`
      <div class="bg-white p-4 rounded border border-gray-200 shadow-sm">
        <h4 class="font-bold text-blue-950 text-sm mb-2">Riscos Psicossociais — NR-1 e PGR</h4>
        <p class="text-gray-600 leading-relaxed text-sm mb-3">Desde 26 de maio de 2026, a NR-1 passou a incluir expressamente os <strong>fatores de risco psicossociais relacionados ao trabalho</strong> no Gerenciamento de Riscos Ocupacionais (GRO). Na prática, a empresa deve avaliar esses fatores dentro do PGR, registrando os riscos identificados e as medidas de prevenção aplicáveis.</p>

        <strong class="text-blue-950 block mb-2 text-sm">Exemplos de fatores que devem ser avaliados:</strong>
        <ul class="list-disc list-inside space-y-1 text-gray-600 text-sm mb-3">
          <li>sobrecarga de trabalho, excesso de demandas e pressão excessiva;</li>
          <li>falta de suporte da liderança ou organização inadequada do trabalho;</li>
          <li>conflitos interpessoais, assédio moral, assédio sexual e outras formas de violência;</li>
          <li>baixa autonomia, comunicação deficiente e insegurança relacionada ao trabalho;</li>
          <li>situações que possam contribuir para estresse ocupacional e outros impactos à saúde mental.</li>
        </ul>

        <p class="text-gray-600 leading-relaxed text-sm">A avaliação não deve se limitar à existência de casos de adoecimento. O objetivo é identificar aspectos da <strong>organização e das condições de trabalho</strong> que possam gerar risco e definir medidas de prevenção, acompanhamento e melhoria do ambiente laboral.</p>
      </div>

      <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm">
        <strong class="text-amber-900 block mb-1">Orientação CMA — atualização do PGR</strong>
        <p class="text-amber-950 leading-relaxed text-sm">A empresa deve entrar em contato com a clínica ou profissional responsável pelos programas de SST para verificar a necessidade de <strong>revisão e atualização do PGR</strong>, incluindo a avaliação dos riscos psicossociais, a metodologia que será utilizada e o respectivo plano de ação. A definição técnica das medidas deve considerar a realidade de cada empresa e ser conduzida pelos profissionais responsáveis pelo SST.</p>
      </div>

      <div class="bg-white p-4 rounded border border-gray-200 shadow-sm">
        <h4 class="font-bold text-blue-950 text-sm mb-2">Campanhas de Vacinação e Prevenção em Saúde</h4>
        <p class="text-gray-600 leading-relaxed text-sm mb-3">A Lei nº 15.377/2026 incluiu o art. 169-A na CLT e estabeleceu novos deveres de informação e conscientização em saúde. As empresas devem disponibilizar aos empregados informações sobre <strong>campanhas oficiais de vacinação</strong>, sobre o <strong>HPV</strong> e sobre os cânceres de <strong>mama, colo do útero e próstata</strong>, observando as orientações e recomendações do Ministério da Saúde.</p>

        <strong class="text-blue-950 block mb-2 text-sm">A empresa deve:</strong>
        <ul class="list-disc list-inside space-y-1 text-gray-600 text-sm mb-3">
          <li>divulgar informações sobre campanhas oficiais de vacinação;</li>
          <li>promover ações de conscientização sobre HPV e sobre os cânceres de mama, colo do útero e próstata;</li>
          <li>orientar os empregados sobre o acesso aos serviços de diagnóstico e prevenção;</li>
          <li>informar expressamente os trabalhadores sobre o direito de ausência para realização dos exames preventivos abrangidos pela CLT.</li>
        </ul>

        <div class="bg-blue-50 border-l-4 border-blue-900 p-3 rounded-r">
          <p class="text-blue-950 text-sm leading-relaxed"><strong>Ausência para exames preventivos:</strong> a CLT permite a ausência, sem prejuízo do salário, por até <strong>3 dias em cada 12 meses de trabalho</strong> para realização de exames preventivos de câncer, desde que devidamente comprovados. A Lei nº 15.377/2026 também passou a exigir que o empregador informe os empregados sobre a possibilidade de ausência para exames preventivos de HPV e de câncer, nos termos do art. 473 da CLT.</p>
        </div>
      </div>

      <div class="bg-red-50 border-l-4 border-red-600 p-4 rounded-r shadow-sm">
        <strong class="text-red-800 block mb-1">Atenção à documentação</strong>
        <p class="text-red-950 leading-relaxed text-sm">As ações adotadas pela empresa devem ser registradas de forma organizada. No caso dos riscos psicossociais, o PGR deve refletir a identificação dos perigos, a avaliação dos riscos e o plano de ação correspondente. Para as campanhas de saúde, recomenda-se manter evidências das comunicações e orientações disponibilizadas aos trabalhadores.</p>
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
