(function(){
  const ORDEM=[
    ['apresentacao','Apresentação'],
    ['introducao','Introdução e Alinhamento'],
    ['admissao','Admissão de Funcionários'],
    ['experiencia','Contrato de Experiência'],
    ['jornada','Jornada e Horas Extras'],
    ['comercio-feriados','Trabalho no Comércio em Feriados'],
    ['afastamentos','Atestados e Afastamentos'],
    ['faltas-justificaveis','Faltas Justificáveis'],
    ['sst','Programas e Laudos'],
    ['sst-cipa','CIPA'],
    ['sst-riscos-psicossociais','Riscos Psicossociais'],
    ['sst-campanhas','Campanhas de Saúde'],
    ['ferias','Programação de Férias'],
    ['beneficios','Gestão de Benefícios'],
    ['demissao','CCT e Rotinas de Demissão'],
    ['acidente','Acidente de Trabalho'],
    ['mei','Contratação de MEI/Autônomos'],
    ['cargos','Plano de Cargos e Salários'],
    ['cronograma','Calendário de Obrigações'],
    ['guarda-documentos','Prazos de Guarda de Documentos'],
    ['modelos','Modelos de Documentos'],
    ['custo-empregado','Custo do Empregado'],
    ['tabela-multas','Tabela de Multas Trabalhistas'],
    ['baselegal','Bibliografia e Base Legal']
  ];

  function aplicar(){
    if(typeof manualSections==='undefined')return false;
    const disponiveis=ORDEM.filter(([id])=>document.getElementById(id)).map(([id,nome])=>({id,nome}));
    manualSections.splice(0,manualSections.length,...disponiveis);
    document.querySelectorAll('#manual-menu button').forEach(b=>{if((b.getAttribute('onclick')||'').includes("'fiscalizacao'"))b.remove();});
    document.getElementById('fiscalizacao')?.classList.add('cma-secao-legada');
    if(typeof updateSectionNavigation==='function')manualSections.forEach(x=>updateSectionNavigation(x.id));
    window.CMA_MANUAL_SECTIONS=manualSections;
    document.dispatchEvent(new CustomEvent('cma:navegacao-atualizada',{detail:{secoes:manualSections.map(x=>x.id)}}));
    return true;
  }

  let n=0;(function tentar(){if(aplicar())return;if(++n<30)setTimeout(tentar,150)})();
})();
