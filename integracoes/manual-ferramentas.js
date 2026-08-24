(function(){
  if(window.CMAIntegracoesManualFerramentas)return;

  const ICONES={
    jornada:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    he:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2M19 5l1-1"/>',
    noturno:'<path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8z"/>',
    faltas:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5M12 16h.01"/>',
    ferias:'<path d="M3 21h18M12 21V10M12 10c-3-3-6-3-8 0 3 0 5 1 8 4M12 10c3-3 6-3 8 0-3 0-5 1-8 4"/>',
    decimo:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h6"/>',
    aviso:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
    experiencia:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    custo:'<path d="M4 19h16M6 16l3-4 3 2 5-7 2 2"/>',
    folha:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h4M7 16h6"/>'
  };

  const INTEGRACOES=[
    {pagina:'admissao',titulo:'Vai contratar um empregado?',texto:'Use as ferramentas para estimar o custo do vínculo e conferir o prazo do contrato de experiência.',itens:[
      {id:'custo-empregado',label:'Calcular custo',icone:ICONES.custo},
      {id:'calculadora-experiencia',label:'Calcular experiência',icone:ICONES.experiencia}
    ]},
    {pagina:'experiencia',titulo:'Quer conferir as datas do contrato?',texto:'Informe a admissão e os períodos para visualizar o término da experiência e eventual prorrogação.',itens:[
      {id:'calculadora-experiencia',label:'Calcular experiência',icone:ICONES.experiencia}
    ]},
    {pagina:'jornada',titulo:'Quer conferir os cálculos na prática?',texto:'Acesse a ferramenta específica conforme a situação que estiver analisando.',itens:[
      {id:'calculadora-jornada',label:'Analisar jornada',icone:ICONES.jornada},
      {id:'calculadora-horas-extras',label:'Calcular horas extras',icone:ICONES.he},
      {id:'calculadora-adicional-noturno',label:'Calcular adicional noturno',icone:ICONES.noturno},
      {id:'calculadora-faltas-atrasos',label:'Calcular faltas e atrasos',icone:ICONES.faltas}
    ]},
    {pagina:'faltas-justificaveis',titulo:'E quando a ocorrência não for justificável?',texto:'Depois de confirmar que a ausência ou atraso é descontável, utilize a calculadora para apurar falta, atraso e eventual DSR.',itens:[
      {id:'calculadora-faltas-atrasos',label:'Calcular descontos',icone:ICONES.faltas}
    ]},
    {pagina:'ferias',titulo:'Quer conferir o valor das férias?',texto:'Simule férias, médias, 1/3 constitucional, INSS e IRRF com os parâmetros atuais da ferramenta.',itens:[
      {id:'calculadora-ferias',label:'Calcular férias',icone:ICONES.ferias}
    ]},
    {pagina:'beneficios',titulo:'Quer enxergar o impacto no custo do vínculo?',texto:'Utilize a estimativa de custo do empregado como apoio na análise dos gastos mensais da contratação.',itens:[
      {id:'custo-empregado',label:'Calcular custo do empregado',icone:ICONES.custo}
    ]},
    {pagina:'demissao',titulo:'Precisa conferir o aviso-prévio?',texto:'Calcule a quantidade de dias e a projeção do aviso-prévio proporcional antes de fechar a análise da rescisão.',itens:[
      {id:'calculadora-aviso-previo',label:'Calcular aviso-prévio',icone:ICONES.aviso}
    ]},
    {pagina:'cronograma',titulo:'Vai conferir o 13º salário?',texto:'Use a calculadora para estimar o 13º integral ou proporcional e os respectivos descontos.',itens:[
      {id:'calculadora-decimo-terceiro',label:'Calcular 13º salário',icone:ICONES.decimo}
    ]}
  ];

  function abrir(id){
    if(typeof navigateManual==='function'){navigateManual(id);return;}
    if(typeof showSection==='function')showSection(id,typeof getMenuButton==='function'?getMenuButton(id):null);
  }

  function svg(path){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;}

  function instalarEstilo(){
    if(document.getElementById('cma-integracao-manual-ferramentas-style'))return;
    const st=document.createElement('style');
    st.id='cma-integracao-manual-ferramentas-style';
    st.textContent=`
      .cma-integracao-ferramenta{margin-top:20px;padding:16px 17px;border:1px solid #dbeafe;border-radius:12px;background:linear-gradient(135deg,#f8fbff,#eff6ff)}
      .cma-integracao-topo{display:flex;align-items:flex-start;gap:12px}.cma-integracao-topo-icone{display:grid;width:38px;height:38px;place-items:center;flex:0 0 38px;border-radius:10px;background:#fff;color:#1e3a8a;border:1px solid #dbeafe}.cma-integracao-topo-icone svg{width:19px;height:19px}
      .cma-integracao-ferramenta h4{margin:0;color:#172554;font-size:15px;font-weight:850;line-height:1.3}.cma-integracao-ferramenta p{margin:4px 0 0!important;color:#64748b!important;font-size:13px!important;line-height:1.5!important;text-align:left!important}
      .cma-integracao-acoes{display:flex;flex-wrap:wrap;gap:8px;margin-top:13px;margin-left:50px}.cma-integracao-ferramenta-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:9px 12px;border:1px solid #bfdbfe;border-radius:8px;background:#fff;color:#172554;font-size:12.5px;font-weight:850;cursor:pointer;transition:.15s ease}.cma-integracao-ferramenta-btn svg{width:16px;height:16px;color:#1e3a8a}.cma-integracao-ferramenta-btn:hover{background:#1e3a8a;border-color:#1e3a8a;color:#fff;transform:translateY(-1px)}.cma-integracao-ferramenta-btn:hover svg{color:#fff}
      @media(max-width:640px){.cma-integracao-ferramenta{padding:15px}.cma-integracao-acoes{margin-left:0;display:grid;grid-template-columns:1fr}.cma-integracao-ferramenta-btn{width:100%;padding:11px 12px;font-size:14px}.cma-integracao-ferramenta h4{font-size:15px}.cma-integracao-ferramenta p{font-size:13.5px!important}}
    `;
    document.head.appendChild(st);
  }

  function criarBloco(cfg){
    const sec=document.getElementById(cfg.pagina);
    if(!sec||sec.querySelector(`[data-cma-integracao-pagina="${cfg.pagina}"]`))return false;
    const alvo=sec.querySelector('.space-y-4.text-sm.text-gray-700')||sec;
    const box=document.createElement('div');
    box.className='cma-integracao-ferramenta';
    box.dataset.cmaIntegracaoPagina=cfg.pagina;
    const iconePrincipal=cfg.itens[0]?.icone||ICONES.folha;
    box.innerHTML=`<div class="cma-integracao-topo"><span class="cma-integracao-topo-icone">${svg(iconePrincipal)}</span><div><h4>${cfg.titulo}</h4><p>${cfg.texto}</p></div></div><div class="cma-integracao-acoes">${cfg.itens.map(i=>`<button type="button" class="cma-integracao-ferramenta-btn" data-cma-ferramenta="${i.id}">${svg(i.icone)}<span>${i.label}</span></button>`).join('')}</div>`;
    box.querySelectorAll('[data-cma-ferramenta]').forEach(btn=>btn.addEventListener('click',()=>abrir(btn.dataset.cmaFerramenta)));
    alvo.appendChild(box);
    return true;
  }

  function aplicar(){
    instalarEstilo();
    let mudou=false;
    INTEGRACOES.forEach(cfg=>{if(criarBloco(cfg))mudou=true;});
    return mudou;
  }

  window.CMAIntegracoesManualFerramentas={aplicar,integracoes:INTEGRACOES};
  let tentativas=0;(function iniciar(){aplicar();if(++tentativas<50)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();
