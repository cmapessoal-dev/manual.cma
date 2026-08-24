(function(){
  const VERSAO='20260824u';
  window.CMA_MANUAL_VERSION=VERSAO;
  const modulos=[
    ['jornada-extra','jornada/jornada-extra.js'],
    ['comercio-feriados','comercio-feriados/comercio-feriados.js'],
    ['sst-extra','sst/sst-extra.js'],
    ['sst-paginas','sst/sst-paginas.js'],
    ['faltas-justificaveis','faltas-justificaveis/faltas-justificaveis.js'],
    ['guarda-documentos','guarda-documentos/guarda-documentos.js'],
    ['introducao-extra','introducao/introducao-extra.js'],
    ['tipografia','tipografia/tipografia.js'],
    ['capa-url','capa/capa-url.js'],
    ['interface-refinements','core/interface-refinements.js'],
    ['revisao-editorial','core/revisao-editorial.js'],
    ['calculadora-custo','calculadora-custo/calculadora-custo.js'],
    ['ferramentas-base','ferramentas/ferramentas-base.js'],
    ['base-tributaria-2026','ferramentas/base-tributaria-2026.js'],
    ['calculadora-ferias','calculadora-ferias/calculadora-ferias.js'],
    ['calculadora-decimo-terceiro','calculadora-decimo-terceiro/calculadora-decimo-terceiro.js'],
    ['calculadora-horas-extras','calculadora-horas-extras/calculadora-horas-extras.js'],
    ['calculadora-adicional-noturno','calculadora-adicional-noturno/calculadora-adicional-noturno.js'],
    ['calculadora-pro-labore','calculadora-pro-labore/calculadora-pro-labore.js'],
    ['ux-opcionais-calculadoras','ferramentas/ux-opcionais-calculadoras.js'],
    ['calculadora-faltas-atrasos','calculadora-faltas-atrasos/calculadora-faltas-atrasos.js'],
    ['ux-calculadoras-variaveis','ferramentas/ux-calculadoras-variaveis.js'],
    ['calculadora-folha','calculadora-folha/calculadora-folha.js'],
    ['calculadora-folha-opcoes','calculadora-folha/ux-opcoes.js'],
    ['calculadora-folha-alinhamento','calculadora-folha/alinhamento.js'],
    ['calculadora-jornada','calculadora-jornada/calculadora-jornada.js'],
    ['calculadora-prazos','calculadora-prazos/calculadora-prazos.js'],
    ['status-experiencia','calculadora-prazos/status-experiencia.js'],
    ['exportador-calculadoras','ferramentas/exportador-calculadoras.js'],
    ['exportar-custo-pdf','calculadora-custo/exportar-pdf.js'],
    ['central-ferramentas','ferramentas/central-ferramentas.js'],
    ['multas','multas/tabela-multas.js'],
    ['bibliografia-extra','bibliografia/bibliografia-extra.js'],
    ['navegacao','core/navegacao.js'],
    ['avisos-legais','avisos/avisos-legais.js'],
    ['busca-avancada','busca/busca-avancada.js'],
    ['ferramentas-menu','ferramentas/ferramentas-menu.js']
  ];
  function jaExiste(caminho){return [...document.scripts].some(s=>{try{return new URL(s.src,location.href).pathname.endsWith('/'+caminho);}catch(e){return false;}});}
  function carregar(id,caminho){return new Promise(resolve=>{if(jaExiste(caminho)||document.querySelector(`script[data-cma-modulo="${id}"]`)){resolve();return;}const s=document.createElement('script');s.dataset.cmaModulo=id;s.src=`${caminho}?v=${VERSAO}`;s.async=false;s.onload=resolve;s.onerror=()=>{console.error('CMA Manual: falha ao carregar',caminho);resolve();};document.body.appendChild(s);});}
  async function iniciar(){for(const [id,caminho] of modulos)await carregar(id,caminho);document.dispatchEvent(new CustomEvent('cma:modulos-prontos',{detail:{versao:VERSAO}}));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});else iniciar();
})();