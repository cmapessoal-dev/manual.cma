(function(){
  const GRUPOS=[
    {
      titulo:'Folha e Remuneração',
      descricao:'Cálculos recorrentes da folha mensal e das principais verbas.',
      itens:[
        {id:'calculadora-folha',titulo:'Simulador de Folha',texto:'Reúna salário, horas extras, adicional noturno, faltas, atrasos, prêmio, INSS e IRRF em uma única simulação.',destaque:true},
        {id:'calculadora-pro-labore',titulo:'Pró-labore',texto:'Calcule INSS, IRRF e líquido estimado do pró-labore.'},
        {id:'custo-empregado',titulo:'Custo do Empregado',texto:'Estime o custo mensal do empregado para planejamento e comparação.'}
      ]
    },
    {
      titulo:'Jornada e Frequência',
      descricao:'Ferramentas para conferência de horários, adicionais e descontos de jornada.',
      itens:[
        {id:'calculadora-jornada',titulo:'Jornada e Escala',texto:'Monte a jornada por dia, confira carga semanal, intervalos e interjornada.'},
        {id:'calculadora-horas-extras',titulo:'Horas Extras e DSR',texto:'Calcule horas extras por faixa e o respectivo reflexo em DSR.'},
        {id:'calculadora-adicional-noturno',titulo:'Adicional Noturno',texto:'Apure o adicional noturno urbano, hora reduzida e prorrogação quando aplicável.'},
        {id:'calculadora-faltas-atrasos',titulo:'Faltas, Atrasos e DSR',texto:'Estime descontos de faltas, atrasos e perda de descanso semanal remunerado.'}
      ]
    },
    {
      titulo:'Férias e 13º',
      descricao:'Cálculos de pagamentos periódicos com memória detalhada.',
      itens:[
        {id:'calculadora-ferias',titulo:'Férias',texto:'Calcule férias, 1/3 constitucional, médias, INSS, IRRF e líquido estimado.'},
        {id:'calculadora-decimo-terceiro',titulo:'13º Salário',texto:'Calcule 13º proporcional ou integral, médias, descontos e segunda parcela.'}
      ]
    },
    {
      titulo:'Prazos Contratuais',
      descricao:'Contagens que ajudam a evitar erros de datas e vencimentos contratuais.',
      itens:[
        {id:'calculadora-aviso-previo',titulo:'Aviso-Prévio',texto:'Conte o aviso-prévio proporcional e identifique o período projetado.'},
        {id:'calculadora-experiencia',titulo:'Contrato de Experiência',texto:'Conte os períodos do contrato e identifique o vencimento final.'}
      ]
    },
    {
      titulo:'Apoio à Gestão',
      descricao:'Recursos complementares para uso no dia a dia do Departamento Pessoal.',
      itens:[
        {id:'modelos',titulo:'Modelos de Documentos',texto:'Acesse os modelos disponíveis para apoiar rotinas e comunicações trabalhistas.'}
      ]
    }
  ];

  const icone='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.9 7.9l-5.7 5.7a2.1 2.1 0 0 1-3-3l5.7-5.7a6 6 0 0 1 7.9-7.9z"/></svg>';

  function abrir(id){
    if(typeof navigateManual==='function'){navigateManual(id);return;}
    if(typeof showSection==='function')showSection(id,typeof getMenuButton==='function'?getMenuButton(id):null);
  }

  function card(item){
    return `<button type="button" class="cma-central-card${item.destaque?' cma-central-card-destaque':''}" data-central-alvo="${item.id}">
      <span class="cma-central-card-topo"><span class="cma-central-card-icone">${icone}</span><span class="cma-central-card-seta">→</span></span>
      <strong>${item.titulo}</strong>
      <span class="cma-central-card-texto">${item.texto}</span>
      ${item.destaque?'<span class="cma-central-card-tag">Mais completa</span>':''}
    </button>`;
  }

  function criar(){
    const menu=document.getElementById('manual-menu'),main=document.querySelector('#manual-conteudo main');
    if(!menu||!main||document.getElementById('central-ferramentas'))return false;

    const botao=document.createElement('button');
    botao.type='button';
    botao.setAttribute('onclick',"showSection('central-ferramentas', this)");
    botao.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';
    botao.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> Central de Ferramentas';
    const antes=typeof getMenuButton==='function'?getMenuButton('modelos'):null;
    if(antes)antes.insertAdjacentElement('beforebegin',botao);else menu.appendChild(botao);

    const sec=document.createElement('section');
    sec.id='central-ferramentas';
    sec.className='manual-section hidden fade-in';
    sec.innerHTML=`
      <div class="cma-central-cabecalho">
        <div><span class="cma-central-kicker">Ferramentas CMA</span><h3>Central de Ferramentas</h3><p>Escolha pela rotina que você precisa resolver. As ferramentas abaixo usam os mesmos critérios e padrões do Manual.</p></div>
      </div>
      <div class="cma-central-atalho"><div><strong>Precisa simular a folha mensal?</strong><span>Use a ferramenta mais completa para reunir as principais verbas e descontos em um único cálculo.</span></div><button type="button" data-central-alvo="calculadora-folha">Abrir Simulador de Folha →</button></div>
      <div class="cma-central-grupos">${GRUPOS.map(g=>`<section class="cma-central-grupo"><div class="cma-central-grupo-titulo"><div><h4>${g.titulo}</h4><p>${g.descricao}</p></div><span>${g.itens.length} ${g.itens.length===1?'recurso':'recursos'}</span></div><div class="cma-central-cards">${g.itens.map(card).join('')}</div></section>`).join('')}</div>`;

    const base=document.getElementById('baselegal');
    if(base)main.insertBefore(sec,base);else main.appendChild(sec);

    sec.querySelectorAll('[data-central-alvo]').forEach(b=>b.addEventListener('click',()=>abrir(b.dataset.centralAlvo)));
    instalarEstilo();
    if(location.hash==='#central-ferramentas')setTimeout(()=>showSection('central-ferramentas',botao),80);
    document.dispatchEvent(new CustomEvent('cma:central-ferramentas-criada'));
    return true;
  }

  function instalarEstilo(){
    if(document.getElementById('cma-central-ferramentas-style'))return;
    const st=document.createElement('style');st.id='cma-central-ferramentas-style';st.textContent=`
      .cma-central-cabecalho{padding:4px 0 20px;border-bottom:1px solid #e2e8f0;margin-bottom:18px}.cma-central-kicker{display:block;margin-bottom:5px;color:#d97706;font-size:11px;font-weight:900;letter-spacing:.09em;text-transform:uppercase}.cma-central-cabecalho h3{margin:0;color:#172554;font-size:27px;font-weight:850;line-height:1.15}.cma-central-cabecalho p{max-width:720px;margin-top:8px;color:#64748b;font-size:14px;line-height:1.6;text-align:left!important}.cma-central-atalho{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:17px 18px;margin-bottom:22px;border:1px solid #bfdbfe;border-left:4px solid #2563eb;border-radius:12px;background:#eff6ff}.cma-central-atalho>div{display:flex;flex-direction:column;gap:3px}.cma-central-atalho strong{color:#172554;font-size:14px}.cma-central-atalho span{color:#475569;font-size:12.5px;line-height:1.45}.cma-central-atalho button{flex:0 0 auto;padding:9px 13px;border:1px solid #1e3a8a;border-radius:8px;background:#172554;color:#fff;font-size:12px;font-weight:800;cursor:pointer}.cma-central-atalho button:hover{background:#082f7d}.cma-central-grupos{display:flex;flex-direction:column;gap:25px}.cma-central-grupo{margin:0}.cma-central-grupo-titulo{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:11px}.cma-central-grupo-titulo h4{margin:0;color:#172554;font-size:17px;font-weight:850}.cma-central-grupo-titulo p{margin:3px 0 0!important;color:#64748b;font-size:12.5px!important;line-height:1.45!important;text-align:left!important}.cma-central-grupo-titulo>span{flex:0 0 auto;padding:4px 8px;border-radius:999px;background:#f1f5f9;color:#64748b;font-size:10.5px;font-weight:800}.cma-central-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.cma-central-card{position:relative;display:flex;min-height:155px;flex-direction:column;align-items:flex-start;padding:15px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;text-align:left;cursor:pointer;box-shadow:0 4px 14px rgba(15,23,42,.035);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}.cma-central-card:hover{transform:translateY(-2px);border-color:#bfdbfe;box-shadow:0 9px 22px rgba(15,23,42,.08)}.cma-central-card-destaque{border-color:#bfdbfe;background:linear-gradient(145deg,#fff,#eff6ff)}.cma-central-card-topo{display:flex;width:100%;align-items:center;justify-content:space-between;margin-bottom:10px}.cma-central-card-icone{display:grid;width:32px;height:32px;place-items:center;border-radius:8px;background:#eff6ff;color:#1e3a8a}.cma-central-card-icone svg{width:16px;height:16px}.cma-central-card-seta{color:#94a3b8;font-size:18px;font-weight:700}.cma-central-card>strong{color:#172554;font-size:14px;font-weight:850}.cma-central-card-texto{display:block;margin-top:5px;color:#64748b;font-size:12px;line-height:1.5}.cma-central-card-tag{display:inline-flex;margin-top:auto;padding-top:10px;color:#1d4ed8;font-size:10.5px;font-weight:850;text-transform:uppercase;letter-spacing:.05em}@media(max-width:760px){.cma-central-cards{grid-template-columns:1fr}.cma-central-card{min-height:0}.cma-central-atalho{align-items:stretch;flex-direction:column}.cma-central-atalho button{width:100%;padding:11px}.cma-central-grupo-titulo{align-items:flex-start}.cma-central-cabecalho h3{font-size:24px}}`;
    document.head.appendChild(st);
  }

  let tentativas=0;(function iniciar(){if(criar())return;if(++tentativas<50)setTimeout(iniciar,160)})();
})();
