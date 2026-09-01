(function(){
  if(window.CMAPadraoCalculadoras)return;

  const IDS=[
    'calculadora-ferias','calculadora-decimo-terceiro','calculadora-horas-extras',
    'calculadora-adicional-noturno','calculadora-pro-labore','calculadora-faltas-atrasos',
    'calculadora-folha','calculadora-jornada','apurador-ponto','calculadora-aviso-previo','calculadora-experiencia',
    'custo-empregado'
  ];

  function aplicarClasses(){
    IDS.forEach(id=>{
      const sec=document.getElementById(id);
      if(!sec)return;
      sec.classList.add('cma-calculadora-padrao');
      sec.querySelectorAll('.cma-calc-opcional,.cma-ux-pergunta').forEach(el=>el.classList.add('cma-calc-pergunta-padrao'));
      sec.querySelectorAll('.cma-calc-opcional-escolha,.cma-ux-escolha').forEach(el=>el.classList.add('cma-calc-escolha-padrao'));
      sec.querySelectorAll('.cma-calc-opcional-detalhe,.cma-ux-pergunta-detalhe').forEach(el=>el.classList.add('cma-calc-detalhe-padrao'));
      sec.querySelectorAll('.cma-calc-escolha-padrao button').forEach(btn=>{
        btn.setAttribute('aria-pressed',btn.classList.contains('ativo')?'true':'false');
        if(btn.dataset.cmaPadraoLigado==='1')return;
        btn.dataset.cmaPadraoLigado='1';
        btn.addEventListener('click',()=>requestAnimationFrame(()=>{
          const grupo=btn.closest('.cma-calc-escolha-padrao');
          grupo?.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.classList.contains('ativo')?'true':'false'));
        }));
      });
    });
  }

  function estilo(){
    if(document.getElementById('cma-padrao-calculadoras-style'))return;
    const st=document.createElement('style');
    st.id='cma-padrao-calculadoras-style';
    st.textContent=`
      .cma-calculadora-padrao{--cma-calc-azul:#172554;--cma-calc-azul2:#1e3a8a;--cma-calc-borda:#dbe3ee;--cma-calc-suave:#f8fafc;--cma-calc-texto:#334155;--cma-calc-muted:#64748b}
      .cma-calculadora-padrao>div:first-of-type{align-items:flex-start}
      .cma-calculadora-padrao>div:first-of-type h3{letter-spacing:-.015em}
      .cma-calculadora-padrao>div:first-of-type p{line-height:1.5!important;text-align:left!important}
      .cma-calculadora-padrao label{color:var(--cma-calc-texto);font-weight:700}
      .cma-calculadora-padrao input:not([type="checkbox"]):not([type="radio"]),
      .cma-calculadora-padrao select,
      .cma-calculadora-padrao textarea{min-height:43px;box-sizing:border-box;border-radius:9px}
      .cma-calculadora-padrao input:focus,
      .cma-calculadora-padrao select:focus,
      .cma-calculadora-padrao textarea:focus{outline:none;border-color:#2563eb!important;box-shadow:0 0 0 3px rgba(37,99,235,.1)!important}
      .cma-calculadora-padrao button[onclick^="toggleExplainer"]{min-height:34px;padding:7px 11px!important;border-radius:8px!important;white-space:nowrap}
      .cma-calculadora-padrao .cma-ferramenta-limpar{min-height:34px;padding:7px 11px;font-size:12.5px}

      .cma-calculadora-padrao .cma-calc-pergunta-padrao{margin-top:12px;border:1px solid var(--cma-calc-borda);border-radius:11px;background:#fff;overflow:hidden;box-shadow:none;transition:border-color .16s ease,box-shadow .16s ease}
      .cma-calculadora-padrao .cma-calc-pergunta-padrao.aberto{border-color:#bfdbfe;box-shadow:0 4px 14px rgba(30,64,175,.06)}
      .cma-calculadora-padrao .cma-calc-opcional-cab,
      .cma-calculadora-padrao .cma-ux-pergunta-cab{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:52px;padding:11px 13px;background:var(--cma-calc-suave)}
      .cma-calculadora-padrao .cma-calc-opcional-cab>span,
      .cma-calculadora-padrao .cma-ux-pergunta-cab>span{color:var(--cma-calc-azul);font-size:14px;font-weight:800;line-height:1.35}
      .cma-calculadora-padrao .cma-calc-escolha-padrao{display:grid;grid-template-columns:1fr 1fr;gap:4px;flex:0 0 auto;padding:3px;border:1px solid #d7dee9;border-radius:9px;background:#eef2f7}
      .cma-calculadora-padrao .cma-calc-escolha-padrao button{min-width:52px;min-height:31px;padding:5px 10px;border:0!important;border-radius:6px!important;background:transparent!important;color:#64748b!important;font-size:12.5px!important;font-weight:800!important;box-shadow:none!important;cursor:pointer}
      .cma-calculadora-padrao .cma-calc-escolha-padrao button.ativo[data-v="sim"]{background:var(--cma-calc-azul)!important;color:#fff!important}
      .cma-calculadora-padrao .cma-calc-escolha-padrao button.ativo[data-v="nao"]{background:#fff!important;color:#334155!important;box-shadow:0 1px 3px rgba(15,23,42,.08)!important}
      .cma-calculadora-padrao .cma-calc-detalhe-padrao{padding:2px 13px 13px;background:#fff}
      .cma-calculadora-padrao .cma-calc-detalhe-padrao>div{margin-top:10px}

      .cma-calculadora-padrao .cma-ux-avancado{margin-top:12px;border:1px dashed #cbd5e1;border-radius:10px;background:#fbfdff;overflow:hidden}
      .cma-calculadora-padrao .cma-ux-avancado summary{padding:10px 12px;color:#64748b;font-size:12.5px;font-weight:800;cursor:pointer;list-style-position:inside}
      .cma-calculadora-padrao .cma-ux-avancado[open] summary{border-bottom:1px solid #e2e8f0;background:#f8fafc;color:#334155}

      .cma-calculadora-padrao [class$="-card"]{box-sizing:border-box}
      .cma-calculadora-padrao [class$="-card"] h4{letter-spacing:-.01em}
      .cma-calculadora-padrao [class$="-linha"]{align-items:center}
      .cma-calculadora-padrao [class$="-linha"] strong{font-variant-numeric:tabular-nums}

      @media(max-width:640px){
        .cma-calculadora-padrao .cma-calc-opcional-cab,
        .cma-calculadora-padrao .cma-ux-pergunta-cab{align-items:flex-start;flex-direction:column;min-height:0}
        .cma-calculadora-padrao .cma-calc-escolha-padrao{width:100%}
        .cma-calculadora-padrao .cma-calc-escolha-padrao button{min-height:38px;font-size:14px!important}
        .cma-calculadora-padrao input:not([type="checkbox"]):not([type="radio"]),
        .cma-calculadora-padrao select,.cma-calculadora-padrao textarea{font-size:16px}
        .cma-calculadora-padrao>div:first-of-type{flex-direction:column}
        .cma-calculadora-padrao .cma-ferramenta-acoes{width:100%;margin-left:0}
      }
    `;
    document.head.appendChild(st);
  }

  function aplicar(){estilo();aplicarClasses();}
  window.CMAPadraoCalculadoras={aplicar,versao:'1.0'};
  aplicar();
  document.addEventListener('cma:modulos-prontos',aplicar);
  document.addEventListener('cma:central-ferramentas-criada',aplicar);
  const alvo=document.getElementById('manual-conteudo')||document.body;
  if(alvo)new MutationObserver(()=>requestAnimationFrame(aplicarClasses)).observe(alvo,{childList:true,subtree:true});
})();
