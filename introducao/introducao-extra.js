(function(){
  function incluirAvisoIntroducao(){
    const secao=document.getElementById('introducao');
    if(!secao)return;

    if(!document.getElementById('cma-introducao-alinhamento')){
      const style=document.createElement('style');
      style.id='cma-introducao-alinhamento';
      style.textContent=`
        #introducao .space-y-4.text-sm.text-gray-700.leading-relaxed > p,
        #introducao .bg-blue-50 p,
        #introducao .bg-amber-50 p {
          width:100%;
          max-width:none;
          text-align:justify !important;
          text-justify:inter-word;
          line-height:1.68;
          hyphens:auto;
        }
        @media(max-width:640px){
          #introducao .space-y-4.text-sm.text-gray-700.leading-relaxed > p,
          #introducao .bg-blue-50 p,
          #introducao .bg-amber-50 p {
            text-align:left !important;
            hyphens:none;
          }
        }
      `;
      document.head.appendChild(style);
    }

    if(document.getElementById('cma-introducao-escopo'))return;
    const conteudo=secao.querySelector('.space-y-4.text-sm.text-gray-700.leading-relaxed');
    if(!conteudo)return;

    const bloco=document.createElement('div');
    bloco.id='cma-introducao-escopo';
    bloco.className='bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm';
    bloco.innerHTML=`
      <strong class="text-amber-900 block mb-1">Objetivo e alcance deste Manual</strong>
      <p class="text-amber-950 text-sm leading-relaxed">Os assuntos apresentados neste Manual foram organizados de forma <strong>resumida, prática e objetiva</strong>, com a finalidade de oferecer orientações iniciais sobre as principais rotinas trabalhistas e de Departamento Pessoal. O conteúdo não esgota todas as hipóteses previstas na legislação e não substitui a análise individual de situações específicas. Dependendo do caso, poderão ser necessárias verificações complementares da legislação vigente, da Convenção Coletiva de Trabalho, do enquadramento da empresa e das particularidades de cada vínculo ou procedimento.</p>`;

    const primeiroBloco=conteudo.querySelector('.bg-blue-50');
    if(primeiroBloco)conteudo.insertBefore(bloco,primeiroBloco);
    else conteudo.appendChild(bloco);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',incluirAvisoIntroducao);else incluirAvisoIntroducao();
})();