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
      titulo:'Atenção à norma coletiva e ao enquadramento',
      corpo:'As informações desta página apresentam a regra geral. A Convenção ou o Acordo Coletivo de Trabalho, o enquadramento sindical, a atividade da empresa e condições específicas do vínculo podem estabelecer critérios diferentes ou adicionais. Antes de aplicar a orientação, confirme a norma coletiva vigente e as particularidades do caso.'
    };
    return {
      titulo:'Atenção às particularidades do caso',
      corpo:'As informações desta página têm caráter de orientação geral e inicial. A aplicação prática pode variar conforme a situação concreta, documentos disponíveis, atividade exercida, enquadramento da empresa e legislação específica aplicável. Situações excepcionais devem ser analisadas individualmente antes da tomada de decisão.'
    };
  }

  function inserir(id,dados){
    const secao=document.getElementById(id);
    if(!secao||secao.querySelector('.cma-aviso-legal'))return false;
    const t=texto(dados.tipo);
    const aviso=document.createElement('div');
    aviso.className='cma-aviso-legal';
    aviso.innerHTML=`<div class="cma-aviso-legal-icone" aria-hidden="true">!</div><div><strong>${t.titulo}</strong><p>${t.corpo}</p></div>`;

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
    st.textContent=`.cma-aviso-legal{display:flex;align-items:flex-start;gap:11px;margin:0 0 16px;padding:12px 14px;border:1px solid #fde68a;border-left:4px solid #d97706;border-radius:0 10px 10px 0;background:#fffbeb;box-shadow:0 2px 7px rgba(15,23,42,.04)}.cma-aviso-legal-icone{display:flex;align-items:center;justify-content:center;flex:0 0 22px;width:22px;height:22px;border-radius:50%;background:#d97706;color:#fff;font-size:13px;font-weight:900;margin-top:1px}.cma-aviso-legal strong{display:block;color:#92400e;font-size:13px;line-height:1.35;margin-bottom:3px}.cma-aviso-legal p{margin:0;color:#78350f;font-size:12.5px;line-height:1.55}@media(max-width:640px){.cma-aviso-legal{padding:12px;gap:9px}.cma-aviso-legal strong{font-size:14px}.cma-aviso-legal p{font-size:14px;line-height:1.55}}`;
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