(function(){
  const config={
    'admissao':{tipo:'cct'},
    'jornada':{tipo:'cct'},
    'comercio-feriados':{tipo:'cct'},
    'afastamentos':{tipo:'caso'},
    'faltas-justificaveis':{tipo:'caso'},
    'sst':{tipo:'caso'},
    'sst-cipa':{tipo:'caso'},
    'sst-riscos-psicossociais':{tipo:'caso'},
    'sst-campanhas':{tipo:'caso'},
    'ferias':{tipo:'cct'},
    'beneficios':{tipo:'cct'},
    'demissao':{tipo:'cct'},
    'acidente':{tipo:'caso'},
    'mei':{tipo:'caso'},
    'cargos':{tipo:'caso'},
    'guarda-documentos':{tipo:'caso'},
    'tabela-multas':{tipo:'caso'}
  };
  function texto(tipo){if(tipo==='cct')return {titulo:'Aplicação da orientação',corpo:'Este conteúdo apresenta uma orientação geral. Antes da aplicação prática, devem ser verificadas a Convenção ou o Acordo Coletivo de Trabalho vigente, o enquadramento sindical, a atividade da empresa e eventuais condições específicas do vínculo, pois esses elementos podem estabelecer critérios diferentes ou adicionais.'};return {titulo:'Aplicação da orientação',corpo:'Este conteúdo apresenta uma orientação geral e inicial. A aplicação prática pode variar conforme as particularidades do caso, a documentação disponível, a atividade exercida, o enquadramento da empresa e a legislação específica aplicável. Situações excepcionais devem ser analisadas individualmente antes da tomada de decisão.'};}
  function inserir(id,dados){const secao=document.getElementById(id);if(!secao||secao.querySelector('.cma-aviso-legal'))return false;const t=texto(dados.tipo),aviso=document.createElement('div');aviso.className='cma-aviso-legal';aviso.innerHTML=`<div class="cma-aviso-legal-topo"><span class="cma-aviso-legal-info" aria-hidden="true">i</span><strong>${t.titulo}</strong></div><p>${t.corpo}</p>`;const nav=secao.querySelector(':scope > .cma-page-navigation');if(nav)secao.insertBefore(aviso,nav);else secao.appendChild(aviso);return true;}
  function aplicar(){Object.entries(config).forEach(([id,dados])=>inserir(id,dados));}
  function instalarEstilo(){if(document.getElementById('cma-avisos-legais-style'))return;const st=document.createElement('style');st.id='cma-avisos-legais-style';st.textContent='.cma-aviso-legal{margin:22px 0 14px;padding-top:13px;border-top:1px solid #e2e8f0;color:#64748b}.cma-aviso-legal-topo{display:flex;align-items:center;gap:7px;margin-bottom:5px}.cma-aviso-legal-info{display:flex;align-items:center;justify-content:center;width:17px;height:17px;border-radius:50%;background:#e2e8f0;color:#475569;font-size:11px;font-weight:900;font-family:Georgia,serif;flex:0 0 17px}.cma-aviso-legal strong{color:#475569;font-size:12.5px;line-height:1.4}.cma-aviso-legal p{margin:0;color:#64748b;font-size:12.5px;line-height:1.55}@media(max-width:640px){.cma-aviso-legal{margin-top:20px;padding-top:12px}.cma-aviso-legal strong,.cma-aviso-legal p{font-size:14px}}';document.head.appendChild(st);}
  function carregarBuscaAvancada(){if(document.getElementById('cma-busca-avancada-loader'))return;const script=document.createElement('script');script.id='cma-busca-avancada-loader';script.src='busca/busca-avancada.js?v=20260821b';document.body.appendChild(script);}
  function iniciar(){instalarEstilo();aplicar();carregarBuscaAvancada();const alvo=document.getElementById('manual-conteudo')||document.body;const obs=new MutationObserver(()=>aplicar());obs.observe(alvo,{childList:true,subtree:true});setTimeout(aplicar,500);setTimeout(aplicar,1500);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();