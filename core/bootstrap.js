(function(){
  const VERSAO='20260823';
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
    ['calculadora-custo','calculadora-custo/calculadora-custo.js'],
    ['exportar-custo-pdf','calculadora-custo/exportar-pdf.js'],
    ['ferramentas-base','ferramentas/ferramentas-base.js'],
    ['multas','multas/tabela-multas.js'],
    ['bibliografia-extra','bibliografia/bibliografia-extra.js'],
    ['avisos-legais','avisos/avisos-legais.js'],
    ['busca-avancada','busca/busca-avancada.js'],
    ['ferramentas-menu','ferramentas/ferramentas-menu.js']
  ];

  function carregar(id,caminho){
    return new Promise(resolve=>{
      const existente=document.querySelector(`script[data-cma-modulo="${id}"]`);
      if(existente){resolve();return;}
      const s=document.createElement('script');
      s.dataset.cmaModulo=id;
      s.src=`${caminho}?v=${VERSAO}`;
      s.async=false;
      s.onload=resolve;
      s.onerror=()=>{console.error('CMA Manual: falha ao carregar',caminho);resolve();};
      document.body.appendChild(s);
    });
  }

  async function iniciar(){
    for(const [id,caminho] of modulos)await carregar(id,caminho);
    document.dispatchEvent(new CustomEvent('cma:modulos-prontos',{detail:{versao:VERSAO}}));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar,{once:true});else iniciar();
})();
