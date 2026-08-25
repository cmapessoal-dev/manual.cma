(function(){
  if(window.CMATiposContratosComplementos)return;

  function localizarCard(titulo){
    const sec=document.getElementById('experiencia');
    if(!sec)return null;
    return [...sec.querySelectorAll('.cma-tipo-card')].find(card=>(card.querySelector('h4')?.textContent||'').trim()===titulo)||null;
  }

  function aplicar(){
    const aprendiz=localizarCard('Contrato de Aprendizagem');
    const estagio=localizarCard('Estágio');
    if(!aprendiz||!estagio)return false;

    if(aprendiz.dataset.cmaCompleto!=='1'){
      aprendiz.dataset.cmaCompleto='1';
      aprendiz.innerHTML=`<span class="cma-tipo-tag cma-tipo-tag-especial">Contratação especial</span><h4>Contrato de Aprendizagem</h4><p>Contrato especial, por prazo determinado, destinado à formação técnico-profissional metódica de adolescentes e jovens, com atividades teóricas e práticas vinculadas a programa de aprendizagem.</p><dl><div><dt>Quando pode contratar</dt><dd>O estabelecimento deve possuir <strong>pelo menos 7 empregados em funções que demandem formação profissional</strong>. Abaixo desse quantitativo, a contratação de aprendiz não é admitida, pois ultrapassaria o limite máximo legal da cota.</dd></div><div><dt>Cota</dt><dd>De <strong>5% a 15%</strong>, calculada sobre os empregados do estabelecimento cujas funções demandem formação profissional, observadas as exclusões legais.</dd></div><div><dt>Idade</dt><dd>Em regra, de <strong>14 a 24 anos incompletos</strong>. Para pessoa com deficiência, não se aplica o limite máximo de idade.</dd></div><div><dt>Prazo</dt><dd>Em regra, até <strong>2 anos</strong>, observadas as exceções legais.</dd></div><div><dt>Formação</dt><dd>O aprendiz deve estar vinculado a programa de aprendizagem desenvolvido por entidade qualificada, conciliando formação teórica e prática.</dd></div></dl><div class="cma-tipo-alerta"><strong>Atenção:</strong> a análise da cota é feita por estabelecimento e considera as funções que demandam formação profissional, e não simplesmente o total geral de empregados da empresa.</div>`;
    }

    if(estagio.dataset.cmaCompleto!=='1'){
      estagio.dataset.cmaCompleto='1';
      estagio.innerHTML=`<span class="cma-tipo-tag cma-tipo-tag-especial">Vínculo formativo</span><h4>Estágio</h4><p>O estágio é uma atividade educativa supervisionada e <strong>não gera vínculo de emprego</strong> quando todos os requisitos da Lei nº 11.788/2008 são cumpridos.</p><dl><div><dt>Formalização</dt><dd>Exige <strong>Termo de Compromisso de Estágio (TCE)</strong> celebrado entre estudante, parte concedente e instituição de ensino, com plano de atividades compatível com o curso.</dd></div><div><dt>Estudante</dt><dd>Deve possuir matrícula e frequência regular na instituição de ensino, e as atividades precisam ser compatíveis com sua formação.</dd></div><div><dt>Supervisão</dt><dd>A parte concedente deve indicar empregado com formação ou experiência na área para orientar e supervisionar o estágio, observando o limite legal de estagiários por supervisor.</dd></div><div><dt>Seguro</dt><dd>É obrigatória a contratação de <strong>seguro contra acidentes pessoais</strong> em favor do estagiário, com apólice compatível com valores de mercado e prevista no TCE. No estágio obrigatório, a instituição de ensino pode assumir essa contratação.</dd></div><div><dt>Jornada</dt><dd>Deve ser compatível com as atividades escolares e respeitar os limites previstos na Lei do Estágio, conforme o nível de ensino.</dd></div><div><dt>Bolsa e transporte</dt><dd>No estágio <strong>não obrigatório</strong>, bolsa ou outra contraprestação e auxílio-transporte são obrigatórios. No estágio obrigatório, a concessão é facultativa.</dd></div><div><dt>Recesso</dt><dd>É assegurado recesso proporcional, sendo de <strong>30 dias</strong> quando o estágio tiver duração igual ou superior a 1 ano, preferencialmente durante as férias escolares.</dd></div><div><dt>Duração</dt><dd>Na mesma parte concedente, em regra, não pode ultrapassar <strong>2 anos</strong>, exceto para estagiário com deficiência.</dd></div></dl><div class="cma-tipo-alerta"><strong>Atenção:</strong> ausência de TCE, atividades incompatíveis com o curso, falta de supervisão, seguro irregular ou descumprimento dos demais requisitos pode descaracterizar o estágio e gerar reconhecimento de vínculo empregatício.</div>`;
    }
    return true;
  }

  window.CMATiposContratosComplementos={aplicar};
  let tentativas=0;(function iniciar(){if(aplicar())return;if(++tentativas<50)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
  document.addEventListener('cma:navegacao-atualizada',aplicar);
})();