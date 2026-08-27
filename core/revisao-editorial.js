(function(){
  if(window.CMARevisaoEditorial)return;

  const norm=t=>(t||'').replace(/\s+/g,' ').trim().toLowerCase();
  const achar=(selector,trecho,raiz=document)=>[...raiz.querySelectorAll(selector)].find(el=>norm(el.textContent).includes(norm(trecho)))||null;

  function substituirCard(trecho,html){
    const titulo=achar('strong,h4',trecho);
    const card=titulo?.closest('.bg-white,.p-3');
    if(card)card.innerHTML=html;
    return !!card;
  }

  function cipa(){
    const sec=document.getElementById('sst');
    const titulo=sec&&achar('h4','CIPA — Comissão Interna',sec);
    const card=titulo?.closest('.bg-white');
    if(card){
      card.innerHTML=`
        <h4 class="font-bold text-blue-950 text-sm mb-2">CIPA — Comissão Interna de Prevenção de Acidentes e de Assédio</h4>
        <p class="text-sm text-blue-950 leading-relaxed mb-2"><strong>Até 19 empregados:</strong> o estabelecimento não se enquadra no Quadro I de dimensionamento da NR-5, independentemente do grau de risco. Nessa situação, quando não houver atendimento por SESMT, a organização deve nomear formalmente um representante dentre seus empregados para auxiliar nas ações de prevenção e promover o treinamento previsto na NR-5.</p>
        <p class="text-sm text-blue-950 leading-relaxed mb-2"><strong>A partir de 20 empregados:</strong> a necessidade de constituir CIPA e o seu dimensionamento passam a depender do número de empregados e do grau de risco do estabelecimento, conforme o Quadro I da NR-5. Por isso, a quantidade de empregados, isoladamente, não define a obrigatoriedade de CIPA nessa faixa.</p>
        <p class="text-sm text-blue-950 leading-relaxed mb-2"><strong>Exceções e situações específicas:</strong> quando o estabelecimento for atendido por SESMT, este desempenha as atribuições previstas para o representante nomeado. O MEI é dispensado da nomeação. Prestadoras de serviços possuem regras específicas na NR-5 que também devem ser verificadas.</p>
        <p class="text-sm text-blue-950 leading-relaxed mb-2">A CIPA e o representante nomeado devem atuar de forma efetiva na prevenção de acidentes, doenças relacionadas ao trabalho, assédio sexual e outras formas de violência no ambiente laboral.</p>
        <div class="mt-3 bg-amber-50 border-l-4 border-amber-600 p-3 rounded-r"><p class="text-xs text-amber-950 font-semibold leading-relaxed"><strong>Orientação CMA:</strong> consulte a clínica responsável pelos procedimentos de SST para confirmar o enquadramento do estabelecimento, treinamento, documentação e demais exigências aplicáveis.</p></div>`;
    }

    substituirCard('CIPA (Empresas Acima de 20 Funcionários)',`<strong class="text-blue-950 block mb-0.5">CIPA e representante nomeado da NR-5:</strong> Até 19 empregados, o estabelecimento não se enquadra no Quadro I da NR-5, independentemente do grau de risco; quando não atendido por SESMT, deve ser nomeado representante treinado, ressalvada a dispensa aplicável ao MEI. A partir de 20 empregados, o dimensionamento da CIPA deve ser verificado conforme o número de empregados e o grau de risco do estabelecimento.`);
  }

  function recibos(){
    substituirCard('Assinatura de Recibos',`<strong class="text-blue-950 block mb-0.5">Ciência e comprovação dos pagamentos:</strong> Sempre que possível, colha a assinatura do empregado nos recibos e demonstrativos ou utilize meio eletrônico que permita comprovar sua ciência. Comprovantes bancários demonstram a transferência do valor, mas a documentação do demonstrativo ajuda a comprovar quais parcelas foram apresentadas e quitadas. A assinatura manuscrita não é a única forma possível de comprovação; o importante é preservar meios seguros de demonstrar o pagamento e a ciência do trabalhador.`);
  }

  function estagio(){
    substituirCard('Estagiários (Lei nº 11.788/2008)',`<strong class="text-blue-950 block mb-0.5">Estagiários (Lei nº 11.788/2008):</strong> O estágio deve manter finalidade educacional, compatibilidade entre as atividades desempenhadas e o Termo de Compromisso, acompanhamento efetivo e os demais requisitos da Lei nº 11.788/2008. O estagiário não deve ser utilizado como substituto de empregado comum. Metas, cobranças, rotinas ou responsabilidades incompatíveis com o caráter pedagógico, especialmente quando acompanhadas de desvio das atividades previstas, podem evidenciar descaracterização do estágio. A manutenção do estágio em desconformidade com a Lei pode caracterizar vínculo de emprego para todos os fins trabalhistas e previdenciários.`);
  }

  function cargos(){
    const sec=document.getElementById('cargos');
    if(!sec)return;
    const p=achar('p','Diferenciar remunerações para nomenclaturas parecidas',sec);
    if(p)p.innerHTML=`A existência de salários diferentes não gera, por si só, equiparação salarial. A CLT permite diferenças quando não estão presentes os requisitos do trabalho de igual valor, considerando, entre outros pontos, identidade de função, mesmo estabelecimento, igual produtividade e perfeição técnica, diferença de tempo para o mesmo empregador de até quatro anos e diferença de tempo na função de até dois anos. Quando a empresa pretende estruturar diferenças permanentes por níveis como <strong>Júnior, Pleno e Sênior</strong> ou faixas <strong>1, 2 e 3</strong>, é recomendável formalizar critérios objetivos de evolução em quadro de carreira ou Plano de Cargos e Salários, que pode ser instituído por norma interna ou negociação coletiva e não depende de homologação ou registro em órgão público.`;
    const exp=document.getElementById('exp-cargos');
    if(exp)exp.innerHTML=`<strong>Equiparação salarial:</strong> ocorre quando são preenchidos os requisitos do art. 461 da CLT para trabalho de igual valor. Diferenças salariais podem ser legítimas quando esses requisitos não estão presentes ou quando a empresa possui quadro de carreira ou Plano de Cargos e Salários válido, com critérios objetivos de progressão.`;
  }

  function premio(){
    substituirCard('Pagamentos "Por Fora"',`<strong class="text-blue-950 block mb-0.5">Pagamentos “por fora” e prêmios:</strong> Verbas de natureza salarial, como salário, comissões e horas extras, devem ser corretamente registradas e submetidas às incidências aplicáveis. O prêmio possui tratamento próprio: para ser caracterizado como prêmio nos termos do art. 457 da CLT, deve decorrer de <strong>desempenho superior ao ordinariamente esperado</strong> no exercício das atividades. A simples utilização do nome “prêmio” não afasta a natureza salarial quando o pagamento, na realidade, remunera desempenho normal, metas ordinárias ou contraprestação habitual pelo trabalho.`);
  }

  function atestados(){
    const sec=document.getElementById('afastamentos');
    const titulo=sec&&achar('strong','Fluxo e Prazo de Envio de Documentos',sec);
    const card=titulo?.closest('.bg-white');
    if(card)card.innerHTML=`<strong class="text-blue-950 block mb-1">Entrega e recebimento de atestados:</strong><p class="text-gray-600 leading-relaxed text-sm">A legislação trabalhista não estabelece um prazo geral único para a entrega do atestado médico pelo empregado. Assim, na ausência de regra específica em norma coletiva ou em regulamento interno válido da empresa, o atestado não deve ser rejeitado automaticamente apenas porque foi apresentado posteriormente. A empresa pode estabelecer procedimento interno e prazo razoável para comunicação e entrega dos documentos, devendo dar ciência prévia aos empregados e avaliar situações justificadas ou excepcionais antes de recusar o documento.</p>`;
  }

  function ctps(){
    substituirCard('Carteira de Trabalho Digital',`<strong class="text-blue-950 block mb-0.5">Carteira de Trabalho Digital:</strong> Para as contratações e anotações atuais, as informações prestadas pelo empregador no eSocial substituem, em regra, as anotações que eram feitas na CTPS física. A carteira física antiga, porém, <strong>deve ser guardada pelo trabalhador</strong>, pois continua sendo documento importante para comprovar vínculos e informações do histórico profissional anterior.`);
  }

  function markdown(){
    document.querySelectorAll('.manual-section p,.manual-section li,.manual-section td,.manual-section div').forEach(el=>{
      if(el.children.length&&![...el.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&(n.nodeValue||'').includes('**')))return;
      if(!el.innerHTML.includes('**'))return;
      el.innerHTML=el.innerHTML.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
    });
  }

  function alertas(){
    document.querySelectorAll('.manual-section h4').forEach(h=>{
      if(/ALERTA CRÍTICO:/i.test(h.textContent))h.innerHTML=h.innerHTML.replace(/ALERTA CRÍTICO:/i,'ATENÇÃO:');
    });
  }

  function revisaoCapa(){
    const badge=document.querySelector('.cma-hero-badge');
    if(badge)badge.textContent='PARÂMETROS • COMPETÊNCIA AGOSTO/2026';
    const hero=document.querySelector('.cma-hero-content');
    if(hero){
      const walker=document.createTreeWalker(hero,NodeFilter.SHOW_TEXT);
      let n;while(n=walker.nextNode()){
        if((n.nodeValue||'').includes('Atualizado em Agosto de 2026'))n.nodeValue=n.nodeValue.replace('Atualizado em Agosto de 2026','Última revisão: 27/08/2026');
      }
    }
  }

  function aplicar(){
    cipa();recibos();estagio();cargos();premio();atestados();ctps();markdown();alertas();revisaoCapa();
  }

  window.CMARevisaoEditorial={aplicar};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(aplicar,0),{once:true});else setTimeout(aplicar,0);
  document.addEventListener('cma:modulos-prontos',aplicar);
})();