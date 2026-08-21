(function(){
  const config={
    'admissao':{tipo:'cct'},
    'jornada':{tipo:'cct'},
    'comercio-feriados':{tipo:'cct'},
    'afastamentos':{tipo:'caso'},
    'faltas-justificaveis':{tipo:'caso'},
    'sst':{tipo:'caso'},
    'ferias':{tipo:'cct'},
    'beneficios':{tipo:'cct'},
    'demissao':{tipo:'cct'},
    'acidente':{tipo:'caso'},
    'mei':{tipo:'caso'},
    'cargos':{tipo:'caso'},
    'guarda-documentos':{tipo:'caso'},
    'tabela-multas':{tipo:'caso'}
  };

  function texto(tipo){
    if(tipo==='cct')return {
      botao:'Observações sobre CCT e enquadramento',
      titulo:'Norma coletiva e enquadramento podem alterar a regra geral',
      corpo:'As informações desta página apresentam a regra geral. A Convenção ou o Acordo Coletivo de Trabalho, o enquadramento sindical, a atividade da empresa e condições específicas do vínculo podem estabelecer critérios diferentes ou adicionais. Antes de aplicar a orientação, confirme a norma coletiva vigente e as particularidades do caso.'
    };
    return {
      botao:'Observações importantes',
      titulo:'A aplicação pode depender das particularidades do caso',
      corpo:'As informações desta página têm caráter de orientação geral e inicial. A aplicação prática pode variar conforme a situação concreta, documentos disponíveis, atividade exercida, enquadramento da empresa e legislação específica aplicável. Situações excepcionais devem ser analisadas individualmente antes da tomada de decisão.'
    };
  }

  function inserir(id,dados){
    const secao=document.getElementById(id);
    if(!secao||secao.querySelector('.cma-aviso-legal'))return false;
    const t=texto(dados.tipo);
    const aviso=document.createElement('div');
    aviso.className='cma-aviso-legal';
    aviso.innerHTML=`
      <button type="button" class="cma-aviso-legal-btn" aria-expanded="false">
        <span class="cma-aviso-legal-info" aria-hidden="true">i</span>
        <span>${t.botao}</span>
        <span class="cma-aviso-legal-seta" aria-hidden="true">⌄</span>
      </button>
      <div class="cma-aviso-legal-conteudo" hidden>
        <strong>${t.titulo}</strong>
        <p>${t.corpo}</p>
      </div>`;

    const btn=aviso.querySelector('.cma-aviso-legal-btn');
    const conteudo=aviso.querySelector('.cma-aviso-legal-conteudo');
    btn.addEventListener('click',()=>{
      const aberto=btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded',String(!aberto));
      conteudo.hidden=aberto;
      aviso.classList.toggle('is-open',!aberto);
    });

    const cabecalho=secao.querySelector(':scope > .flex.border-b, :scope > .flex.items-start, :scope > h3');
    if(cabecalho&&cabecalho.nextSibling)secao.insertBefore(aviso,cabecalho.nextSibling);
    else secao.insertBefore(aviso,secao.firstChild);
    return true;
  }

  function aplicar(){Object.entries(config).forEach(([id,dados])=>inserir(id,dados));}

  function instalarEstilo(){
    if(document.getElementById('cma-avisos-legais-style'))return;
    const st=document.createElement('style');
    st.id='cma-avisos-legais-style';
    st.textContent=`
      .cma-aviso-legal{margin:0 0 16px}
      .cma-aviso-legal-btn{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#475569;font-size:12px;font-weight:700;cursor:pointer;transition:.2s;box-shadow:0 1px 3px rgba(15,23,42,.04)}
      .cma-aviso-legal-btn:hover{background:#f8fafc;border-color:#94a3b8;color:#1e3a8a}
      .cma-aviso-legal-info{display:flex;align-items:center;justify-content:center;width:17px;height:17px;border-radius:50%;background:#e0e7ff;color:#1e3a8a;font-size:11px;font-weight:900;font-family:Georgia,serif}
      .cma-aviso-legal-seta{font-size:14px;line-height:1;transition:transform .2s}
      .cma-aviso-legal.is-open .cma-aviso-legal-seta{transform:rotate(180deg)}
      .cma-aviso-legal-conteudo{margin-top:8px;padding:11px 13px;border:1px solid #dbe3ef;border-left:3px solid #64748b;border-radius:0 9px 9px 0;background:#f8fafc;color:#475569;box-shadow:0 2px 7px rgba(15,23,42,.03)}
      .cma-aviso-legal-conteudo strong{display:block;color:#334155;font-size:12.5px;line-height:1.4;margin-bottom:4px}
      .cma-aviso-legal-conteudo p{margin:0;color:#64748b;font-size:12.5px;line-height:1.55}
      @media(max-width:640px){.cma-aviso-legal-btn{width:100%;justify-content:flex-start;font-size:14px;padding:9px 11px}.cma-aviso-legal-seta{margin-left:auto}.cma-aviso-legal-conteudo strong,.cma-aviso-legal-conteudo p{font-size:14px}}
    `;
    document.head.appendChild(st);
  }

  function iniciar(){
    instalarEstilo();
    aplicar();
    const alvo=document.getElementById('manual-conteudo')||document.body;
    const obs=new MutationObserver(()=>aplicar());
    obs.observe(alvo,{childList:true,subtree:true});
    setTimeout(aplicar,500);
    setTimeout(aplicar,1500);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();