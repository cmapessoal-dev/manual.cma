(function(){
  const GRUPOS=[
    {titulo:'Folha e Remuneração',sub:'Cálculos de folha, remuneração e custos.',itens:[
      {id:'calculadora-folha',titulo:'Simulador de Folha',texto:'Folha mensal com verbas, descontos, INSS e IRRF.',tag:'Principal'},
      {id:'calculadora-pro-labore',titulo:'Pró-labore',texto:'INSS, IRRF e líquido estimado.'},
      {id:'custo-empregado',titulo:'Custo do Empregado',texto:'Estimativa do custo mensal do vínculo.'}
    ]},
    {titulo:'Jornada e Frequência',sub:'Horários, adicionais, faltas e reflexos.',itens:[
      {id:'calculadora-jornada',titulo:'Jornada e Escala',texto:'Carga diária, semanal, intervalos e interjornada.'},
      {id:'calculadora-horas-extras',titulo:'Horas Extras e DSR',texto:'Horas extras por faixa e reflexo em DSR.'},
      {id:'calculadora-adicional-noturno',titulo:'Adicional Noturno',texto:'Hora noturna, adicional e prorrogação.'},
      {id:'calculadora-faltas-atrasos',titulo:'Faltas, Atrasos e DSR',texto:'Descontos de jornada e perda de DSR.'}
    ]},
    {titulo:'Férias e 13º',sub:'Pagamentos periódicos e memória de cálculo.',itens:[
      {id:'calculadora-ferias',titulo:'Férias',texto:'Férias, 1/3, médias, INSS e IRRF.'},
      {id:'calculadora-decimo-terceiro',titulo:'13º Salário',texto:'13º integral ou proporcional e descontos.'}
    ]},
    {titulo:'Prazos Contratuais',sub:'Contagens de datas importantes do vínculo.',itens:[
      {id:'calculadora-aviso-previo',titulo:'Aviso-Prévio',texto:'Contagem e projeção do aviso proporcional.'},
      {id:'calculadora-experiencia',titulo:'Contrato de Experiência',texto:'Períodos e vencimento final do contrato.'}
    ]},
    {titulo:'Apoio à Gestão',sub:'Recursos complementares para o dia a dia.',itens:[
      {id:'modelos',titulo:'Modelos de Documentos',texto:'Modelos para rotinas e comunicações trabalhistas.'}
    ]}
  ];
  const FERRAMENTAS=[...new Set(GRUPOS.flatMap(g=>g.itens.map(i=>i.id)))];
  const ICONES={
    'calculadora-folha':'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h4M7 16h6"/>',
    'calculadora-pro-labore':'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5c0-1 1.2-1.8 3-1.8s3 .8 3 1.8-1 1.7-3 2-3 1-3 2 1.2 1.8 3 1.8 3-.8 3-1.8"/>',
    'custo-empregado':'<path d="M4 19h16M6 16l3-4 3 2 5-7 2 2"/>',
    'calculadora-jornada':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'calculadora-horas-extras':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2M19 5l1-1"/>',
    'calculadora-adicional-noturno':'<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8z"/>',
    'calculadora-faltas-atrasos':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5M12 16h.01"/>',
    'calculadora-ferias':'<path d="M3 21h18M12 21V10M12 10c-3-3-6-3-8 0 3 0 5 1 8 4M12 10c3-3 6-3 8 0-3 0-5 1-8 4"/>',
    'calculadora-decimo-terceiro':'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h6"/>',
    'calculadora-aviso-previo':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    'calculadora-experiencia':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    'modelos':'<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 13h6M9 17h6"/>'
  };
  function svg(id){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[id]||'<circle cx="12" cy="12" r="9"/>'}</svg>`;}
  function abrir(id){if(typeof navigateManual==='function'){navigateManual(id);return;}if(typeof showSection==='function')showSection(id,typeof getMenuButton==='function'?getMenuButton(id):null);}
  function card(item){return `<button type="button" class="cma-central-card" data-central-alvo="${item.id}"><span class="cma-central-card-icone">${svg(item.id)}</span><span class="cma-central-card-conteudo"><span class="cma-central-card-titulo">${item.titulo}${item.tag?`<em>${item.tag}</em>`:''}</span><span class="cma-central-card-texto">${item.texto}</span></span><span class="cma-central-card-seta">›</span></button>`;}
  function adicionarRetornos(){FERRAMENTAS.forEach(id=>{const sec=document.getElementById(id);if(!sec||sec.querySelector(':scope > .cma-voltar-central'))return;const voltar=document.createElement('button');voltar.type='button';voltar.className='cma-voltar-central';voltar.innerHTML='<span aria-hidden="true">←</span> Ferramentas';voltar.addEventListener('click',()=>abrir('central-ferramentas'));sec.insertBefore(voltar,sec.firstChild);});}
  function criar(){
    const menu=document.getElementById('manual-menu'),main=document.querySelector('#manual-conteudo main');
    if(!menu||!main||document.getElementById('central-ferramentas'))return false;
    const botao=document.createElement('button');botao.type='button';botao.setAttribute('onclick',"showSection('central-ferramentas', this)");botao.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';botao.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.1-3.1a6 6 0 0 1-7.9 7.9l-5.7 5.7a2.1 2.1 0 0 1-3-3l5.7-5.7a6 6 0 0 1 7.9-7.9z"/></svg> Ferramentas';
    const antes=typeof getMenuButton==='function'?getMenuButton('modelos'):null;if(antes)antes.insertAdjacentElement('beforebegin',botao);else menu.appendChild(botao);
    const sec=document.createElement('section');sec.id='central-ferramentas';sec.className='manual-section hidden fade-in';
    sec.innerHTML=`<div class="cma-central-hero"><div><span>Central CMA</span><h3>Ferramentas</h3><p>Acesse rapidamente os cálculos e recursos mais usados no Departamento Pessoal.</p></div><div class="cma-central-hero-marca">${svg('calculadora-folha')}</div></div><div class="cma-central-grupos">${GRUPOS.map(g=>`<section class="cma-central-grupo"><div class="cma-central-grupo-titulo"><div><h4>${g.titulo}</h4><p>${g.sub}</p></div></div><div class="cma-central-cards">${g.itens.map(card).join('')}</div></section>`).join('')}</div>`;
    const base=document.getElementById('baselegal');if(base)main.insertBefore(sec,base);else main.appendChild(sec);
    sec.querySelectorAll('[data-central-alvo]').forEach(b=>b.addEventListener('click',()=>abrir(b.dataset.centralAlvo)));
    instalarEstilo();adicionarRetornos();
    if(location.hash==='#central-ferramentas')setTimeout(()=>showSection('central-ferramentas',botao),80);
    document.dispatchEvent(new CustomEvent('cma:central-ferramentas-criada'));return true;
  }
  function instalarEstilo(){
    if(document.getElementById('cma-central-ferramentas-style'))return;
    const st=document.createElement('style');st.id='cma-central-ferramentas-style';st.textContent=`
      .cma-voltar-central{display:inline-flex;align-items:center;gap:6px;margin:0 0 14px;padding:8px 11px;border:0;border-radius:8px;background:#f1f5f9;color:#475569;font-size:13px;font-weight:800;cursor:pointer}.cma-voltar-central:hover{background:#e2e8f0;color:#172554}
      .cma-central-hero{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:28px;padding:24px 26px;border-radius:18px;background:linear-gradient(135deg,#061a46,#0b347f);color:#fff;box-shadow:0 14px 30px rgba(15,23,42,.14)}.cma-central-hero>div:first-child{max-width:650px}.cma-central-hero span{display:block;margin-bottom:5px;color:#fbbf24;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.cma-central-hero h3{margin:0;font-size:30px;font-weight:850;line-height:1.1;color:#fff}.cma-central-hero p{margin:8px 0 0!important;color:#dbeafe!important;font-size:15px!important;line-height:1.6!important;text-align:left!important}.cma-central-hero-marca{display:grid;width:58px;height:58px;place-items:center;border:1px solid rgba(255,255,255,.18);border-radius:16px;background:rgba(255,255,255,.08);color:#fff;flex:0 0 58px}.cma-central-hero-marca svg{width:28px;height:28px}
      .cma-central-grupos{display:flex;flex-direction:column;gap:25px}.cma-central-grupo{margin:0}.cma-central-grupo-titulo{margin-bottom:11px;padding-bottom:9px;border-bottom:1px solid #e2e8f0}.cma-central-grupo-titulo h4{margin:0;color:#172554;font-size:18px;font-weight:850}.cma-central-grupo-titulo p{margin:3px 0 0!important;color:#7c8ba1!important;font-size:13px!important;line-height:1.45!important;text-align:left!important}
      .cma-central-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.cma-central-card{display:grid;grid-template-columns:40px minmax(0,1fr) 18px;align-items:center;gap:11px;min-height:96px;padding:14px 13px;border:1px solid #e5eaf1;border-radius:11px;background:#fff;text-align:left;cursor:pointer;transition:.16s ease}.cma-central-card:hover{border-color:#bfdbfe;background:#f8fbff;box-shadow:0 6px 16px rgba(15,23,42,.055);transform:translateY(-1px)}.cma-central-card-icone{display:grid;width:38px;height:38px;place-items:center;border-radius:9px;background:#eff6ff;color:#1e3a8a}.cma-central-card-icone svg{width:19px;height:19px}.cma-central-card-conteudo{min-width:0}.cma-central-card-titulo{display:flex;align-items:center;gap:6px;color:#172554;font-size:14px;font-weight:850;line-height:1.3}.cma-central-card-titulo em{padding:2px 6px;border-radius:999px;background:#fef3c7;color:#92400e;font-size:9.5px;font-style:normal;font-weight:900;text-transform:uppercase;letter-spacing:.04em}.cma-central-card-texto{display:block;margin-top:5px;color:#64748b;font-size:12.5px;line-height:1.45}.cma-central-card-seta{color:#94a3b8;font-size:21px;line-height:1;text-align:right}.cma-central-card:hover .cma-central-card-seta{color:#1d4ed8}
      @media(max-width:1050px){.cma-central-cards{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:640px){.cma-central-hero{padding:20px;border-radius:14px}.cma-central-hero-marca{display:none}.cma-central-hero h3{font-size:26px}.cma-central-hero p{font-size:15px!important}.cma-central-cards{grid-template-columns:1fr}.cma-central-card{min-height:84px}.cma-central-grupos{gap:21px}.cma-central-card-titulo{font-size:15px}.cma-central-card-texto{font-size:13px}.cma-central-grupo-titulo h4{font-size:18px}.cma-central-grupo-titulo p{font-size:13px!important}}
    `;document.head.appendChild(st);
  }
  let tentativas=0;(function iniciar(){if(criar())return;if(++tentativas<50)setTimeout(iniciar,160)})();
})();