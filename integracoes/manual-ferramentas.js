(function(){
  if(window.CMAIntegracoesManualFerramentas)return;

  const INTEGRACOES=[
    {
      pagina:'jornada',
      ferramenta:'calculadora-jornada',
      titulo:'Quer conferir uma jornada na prática?',
      texto:'Informe os horários e analise carga diária, carga semanal, intervalos e possíveis excessos.',
      botao:'Analisar uma jornada',
      icone:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
    }
  ];

  function abrir(id){
    if(typeof navigateManual==='function'){navigateManual(id);return;}
    if(typeof showSection==='function')showSection(id,typeof getMenuButton==='function'?getMenuButton(id):null);
  }

  function instalarEstilo(){
    if(document.getElementById('cma-integracao-manual-ferramentas-style'))return;
    const st=document.createElement('style');
    st.id='cma-integracao-manual-ferramentas-style';
    st.textContent=`
      .cma-integracao-ferramenta{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:20px;padding:16px 17px;border:1px solid #dbeafe;border-radius:12px;background:linear-gradient(135deg,#f8fbff,#eff6ff)}
      .cma-integracao-ferramenta-conteudo{display:flex;align-items:flex-start;gap:12px;min-width:0}
      .cma-integracao-ferramenta-icone{display:grid;width:38px;height:38px;place-items:center;flex:0 0 38px;border-radius:10px;background:#fff;color:#1e3a8a;border:1px solid #dbeafe}
      .cma-integracao-ferramenta-icone svg{width:19px;height:19px}
      .cma-integracao-ferramenta h4{margin:0;color:#172554;font-size:15px;font-weight:850;line-height:1.3}
      .cma-integracao-ferramenta p{margin:4px 0 0!important;color:#64748b!important;font-size:13px!important;line-height:1.5!important;text-align:left!important}
      .cma-integracao-ferramenta-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;flex:0 0 auto;padding:9px 13px;border:1px solid #1e3a8a;border-radius:8px;background:#1e3a8a;color:#fff;font-size:12.5px;font-weight:850;cursor:pointer;transition:.15s ease}
      .cma-integracao-ferramenta-btn:hover{background:#082f7d;border-color:#082f7d;transform:translateY(-1px)}
      .cma-integracao-ferramenta-btn span{font-size:16px;line-height:1}
      @media(max-width:640px){.cma-integracao-ferramenta{align-items:stretch;flex-direction:column}.cma-integracao-ferramenta-btn{width:100%;padding:11px 13px;font-size:14px}.cma-integracao-ferramenta h4{font-size:15px}.cma-integracao-ferramenta p{font-size:13.5px!important}}
    `;
    document.head.appendChild(st);
  }

  function criarBloco(cfg){
    const sec=document.getElementById(cfg.pagina);
    if(!sec||sec.querySelector(`[data-cma-integracao="${cfg.ferramenta}"]`))return false;
    const alvo=sec.querySelector('.space-y-4.text-sm.text-gray-700')||sec;
    const box=document.createElement('div');
    box.className='cma-integracao-ferramenta';
    box.dataset.cmaIntegracao=cfg.ferramenta;
    box.innerHTML=`<div class="cma-integracao-ferramenta-conteudo"><span class="cma-integracao-ferramenta-icone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${cfg.icone}</svg></span><div><h4>${cfg.titulo}</h4><p>${cfg.texto}</p></div></div><button type="button" class="cma-integracao-ferramenta-btn"><span aria-hidden="true">↗</span>${cfg.botao}</button>`;
    box.querySelector('button').addEventListener('click',()=>abrir(cfg.ferramenta));
    alvo.appendChild(box);
    return true;
  }

  function aplicar(){
    instalarEstilo();
    let ok=false;
    INTEGRACOES.forEach(cfg=>{if(criarBloco(cfg))ok=true;});
    return ok;
  }

  window.CMAIntegracoesManualFerramentas={aplicar,integracoes:INTEGRACOES};
  let tentativas=0;(function iniciar(){aplicar();if(++tentativas<40&&!document.getElementById('jornada'))setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();
