(function(){
  if(window.CMARegistroManual)return;

  const gruposMenu=[
    {id:'rotinas',titulo:'Rotinas Trabalhistas',icone:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'},
    {id:'sst',titulo:'SST',icone:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>'},
    {id:'prazos',titulo:'Prazos e Calendários',icone:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'},
    {id:'ferramentas',titulo:'Ferramentas',icone:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.9 7.9l-5.7 5.7a2.1 2.1 0 0 1-3-3l5.7-5.7a6 6 0 0 1 7.9-7.9z"/>',pagina:'central-ferramentas',direto:true},
    {id:'referencias',titulo:'Referências',icone:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'}
  ];

  const paginas=[
    {id:'apresentacao',nome:'Apresentação'},
    {id:'introducao',nome:'Introdução e Alinhamento'},
    {id:'admissao',nome:'Admissão de Funcionários',grupo:'rotinas'},
    {id:'experiencia',nome:'Tipos de Contratos',grupo:'rotinas'},
    {id:'alteracoes-contratuais',nome:'Alterações Contratuais',grupo:'rotinas'},
    {id:'jornada',nome:'Jornada e Horas Extras',grupo:'rotinas'},
    {id:'comercio-feriados',nome:'Trabalho no Comércio em Feriados',grupo:'rotinas'},
    {id:'beneficios',nome:'Gestão de Benefícios',grupo:'rotinas'},
    {id:'ferias',nome:'Programação de Férias',grupo:'rotinas'},
    {id:'afastamentos',nome:'Atestados e Afastamentos',grupo:'rotinas'},
    {id:'faltas-justificaveis',nome:'Faltas Justificáveis',grupo:'rotinas'},
    {id:'acidente',nome:'Acidente de Trabalho',grupo:'rotinas'},
    {id:'demissao',nome:'CCT e Rotinas de Demissão',grupo:'rotinas'},
    {id:'mei',nome:'Contratação de MEI/Autônomos',grupo:'rotinas'},
    {id:'cargos',nome:'Plano de Cargos e Salários',grupo:'rotinas'},
    {id:'sst',nome:'Programas e Laudos',grupo:'sst'},
    {id:'sst-cipa',nome:'CIPA',grupo:'sst'},
    {id:'sst-riscos-psicossociais',nome:'Riscos Psicossociais',grupo:'sst'},
    {id:'sst-campanhas',nome:'Campanhas de Saúde',grupo:'sst'},
    {id:'cronograma',nome:'Calendário de Obrigações',grupo:'prazos'},
    {id:'guarda-documentos',nome:'Prazos de Guarda de Documentos',grupo:'prazos'},
    {id:'central-ferramentas',nome:'Central de Ferramentas',grupo:'ferramentas'},
    {id:'modelos',nome:'Modelos de Documentos',grupo:'ferramentas',ferramenta:{categoria:'gestao',titulo:'Modelos de Documentos',descricao:'Modelos para rotinas e comunicações trabalhistas.',icone:'<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 13h6M9 17h6"/>'}},
    {id:'custo-empregado',nome:'Custo do Empregado',grupo:'ferramentas',ferramenta:{categoria:'folha',titulo:'Custo do Empregado',descricao:'Estimativa do custo mensal do vínculo.',icone:'<path d="M4 19h16M6 16l3-4 3 2 5-7 2 2"/>'}},
    {id:'calculadora-ferias',nome:'Calculadora de Férias',grupo:'ferramentas',ferramenta:{categoria:'periodicos',titulo:'Férias',descricao:'Férias, 1/3, médias, INSS e IRRF.',icone:'<path d="M3 21h18M12 21V10M12 10c-3-3-6-3-8 0 3 0 5 1 8 4M12 10c3-3 6-3 8 0-3 0-5 1-8 4"/>'}},
    {id:'calculadora-decimo-terceiro',nome:'Calculadora de 13º Salário',grupo:'ferramentas',ferramenta:{categoria:'periodicos',titulo:'13º Salário',descricao:'13º integral ou proporcional e descontos.',icone:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h6"/>'}},
    {id:'calculadora-horas-extras',nome:'Horas Extras e DSR',grupo:'ferramentas',ferramenta:{categoria:'jornada',titulo:'Horas Extras e DSR',descricao:'Horas extras por faixa e reflexo em DSR.',icone:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2M19 5l1-1"/>'}},
    {id:'calculadora-adicional-noturno',nome:'Adicional Noturno',grupo:'ferramentas',ferramenta:{categoria:'jornada',titulo:'Adicional Noturno',descricao:'Hora noturna, adicional e prorrogação.',icone:'<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8z"/>'}},
    {id:'calculadora-pro-labore',nome:'Calculadora de Pró-labore',grupo:'ferramentas',ferramenta:{categoria:'folha',titulo:'Pró-labore',descricao:'INSS, IRRF e líquido estimado.',icone:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-1 1.2-1.8 3-1.8s3 .8 3 1.8-1 1.7-3 2-3 1-3 2 1.2 1.8 3 1.8 3-.8 3-1.8"/>'}},
    {id:'calculadora-tempo-parcial',nome:'Salário — Tempo Parcial',grupo:'ferramentas',ferramenta:{categoria:'folha',titulo:'Salário — Tempo Parcial',descricao:'Salário proporcional conforme a jornada semanal reduzida.',icone:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/><path d="M7 19h10"/>'}},
    {id:'calculadora-faltas-atrasos',nome:'Faltas, Atrasos e DSR',grupo:'ferramentas',ferramenta:{categoria:'jornada',titulo:'Faltas, Atrasos e DSR',descricao:'Descontos de jornada e perda de DSR.',icone:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5M12 16h.01"/>'}},
    {id:'calculadora-folha',nome:'Simulador de Folha',grupo:'ferramentas',ferramenta:{categoria:'folha',titulo:'Simulador de Folha',descricao:'Folha mensal com verbas, descontos, INSS e IRRF.',icone:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h4M7 16h6"/>',tag:'Principal'}},
    {id:'calculadora-jornada',nome:'Calculadora de Jornada',grupo:'ferramentas',ferramenta:{categoria:'jornada',titulo:'Jornada e Escala',descricao:'Carga diária, semanal, intervalos e interjornada.',icone:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'}},
    {id:'calculadora-aviso-previo',nome:'Contagem de Aviso-Prévio',grupo:'ferramentas',ferramenta:{categoria:'prazos-contratuais',titulo:'Aviso-Prévio',descricao:'Contagem e projeção do aviso proporcional.',icone:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>'}},
    {id:'calculadora-experiencia',nome:'Contagem de Experiência',grupo:'ferramentas',ferramenta:{categoria:'prazos-contratuais',titulo:'Contrato de Experiência',descricao:'Períodos e vencimento final do contrato.',icone:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>'}},
    {id:'tabela-multas',nome:'Tabela de Multas Trabalhistas',grupo:'referencias'},
    {id:'baselegal',nome:'Bibliografia e Base Legal',grupo:'referencias'}
  ];

  const categoriasFerramentas=[
    {id:'folha',titulo:'Folha e Remuneração',sub:'Cálculos de folha, remuneração e custos.'},
    {id:'jornada',titulo:'Jornada e Frequência',sub:'Horários, adicionais, faltas e reflexos.'},
    {id:'periodicos',titulo:'Férias e 13º',sub:'Pagamentos periódicos e memória de cálculo.'},
    {id:'prazos-contratuais',titulo:'Prazos Contratuais',sub:'Contagens de datas importantes do vínculo.'},
    {id:'gestao',titulo:'Apoio à Gestão',sub:'Recursos complementares para o dia a dia.'}
  ];

  function pagina(id){return paginas.find(p=>p.id===id)||null;}
  function paginasDoGrupo(id){return paginas.filter(p=>p.grupo===id);}
  function ferramentas(){return paginas.filter(p=>p.ferramenta);}

  window.CMARegistroManual={paginas,gruposMenu,categoriasFerramentas,pagina,paginasDoGrupo,ferramentas,versao:'1.0'};
})();