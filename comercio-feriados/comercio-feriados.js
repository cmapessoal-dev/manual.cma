(function(){
  function criarSecaoComercioFeriados(){
    const menu=document.getElementById('manual-menu');
    const main=document.querySelector('#manual-conteudo main');
    if(!menu||!main||document.getElementById('comercio-feriados'))return;

    const jornadaBtn=typeof getMenuButton==='function'?getMenuButton('jornada'):null;
    const botao=document.createElement('button');
    botao.type='button';
    botao.setAttribute('onclick',"showSection('comercio-feriados', this)");
    botao.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';
    botao.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-4 h-4 mr-2.5 shrink-0"><path d="M3 3h18v4H3z"/><path d="M5 7v14h14V7"/><path d="M9 11h6"/><path d="M9 15h6"/></svg> Trabalho no Comércio em Feriados';
    if(jornadaBtn&&jornadaBtn.nextSibling)menu.insertBefore(botao,jornadaBtn.nextSibling);else menu.appendChild(botao);

    const section=document.createElement('section');
    section.id='comercio-feriados';
    section.className='manual-section hidden fade-in';
    section.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
        <h3 class="text-2xl font-bold text-blue-950 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 text-blue-950 w-7 h-7"><path d="M3 3h18v4H3z"/><path d="M5 7v14h14V7"/><path d="M9 11h6"/><path d="M9 15h6"/></svg>
          Trabalho no Comércio em Feriados
        </h3>
        <button onclick="toggleExplainer('exp-comercio-feriados')" class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold hover:bg-slate-300 flex items-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-help-circle w-3.5 h-3.5 mr-1"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          Entenda os Termos
        </button>
      </div>

      <div id="exp-comercio-feriados" class="hidden bg-slate-100 border border-slate-300 p-3 rounded mb-4 text-xs text-slate-700 space-y-2">
        <p><strong>Autorização Permanente:</strong> permissão prevista em norma para determinadas atividades funcionarem em domingos e/ou feriados sem depender, para esse ponto específico, de nova autorização coletiva a cada ocasião.</p>
        <p><strong>CCT — Convenção Coletiva de Trabalho:</strong> instrumento firmado entre o sindicato dos trabalhadores e o sindicato patronal que estabelece regras aplicáveis à categoria, podendo prever autorização e condições para o trabalho em feriados.</p>
        <p><strong>Feriado:</strong> dia reconhecido por lei como feriado nacional, estadual ou municipal. Para fins trabalhistas, o trabalho nesses dias pode estar sujeito a regras próprias de autorização, compensação e remuneração.</p>
        <p><strong>Legislação Municipal:</strong> normas do município que podem disciplinar o funcionamento do comércio, inclusive quanto à abertura de estabelecimentos em domingos e feriados.</p>
      </div>

      <div class="space-y-4 text-sm text-gray-700">
        <div class="bg-blue-50 border-l-4 border-blue-900 p-4 rounded-r shadow-sm">
          <strong class="text-blue-950 block mb-1">Regra geral</strong>
          <p class="text-blue-950 leading-relaxed">Para as empresas do comércio em geral que <strong>não estejam enquadradas nas atividades com autorização permanente</strong>, a utilização de empregados em feriados depende de <strong>autorização prevista em Convenção Coletiva de Trabalho (CCT)</strong>, além da observância da legislação municipal aplicável.</p>
        </div>

        <div class="bg-white p-4 rounded border border-gray-200 shadow-sm">
          <strong class="text-blue-950 block mb-2">1. Atividades com autorização permanente</strong>
          <p class="text-gray-600 leading-relaxed mb-3">A Portaria MTE nº 1.316/2026 preserva exceções para determinadas atividades que podem funcionar em feriados sem depender de negociação coletiva específica para essa autorização. Entre os exemplos previstos estão:</p>
          <ul class="list-disc list-inside space-y-2 text-gray-600">
            <li><strong>Alimentação e saúde:</strong> padarias, farmácias e postos de combustíveis;</li>
            <li><strong>Hospedagem, alimentação e lazer:</strong> hotéis, restaurantes, bares e similares, casas de diversões, barbearias e salões de beleza;</li>
            <li><strong>Comércio e utilidades:</strong> comércio varejista de GLP, floristas, feiras livres, lavanderias e serviços funerários;</li>
            <li><strong>Turismo e mobilidade:</strong> locadoras de veículos e outras atividades expressamente previstas na norma.</li>
          </ul>
          <p class="text-xs text-gray-500 mt-3">A lista acima é resumida. O enquadramento deve ser confirmado conforme a atividade efetivamente exercida pela empresa e as disposições da norma aplicável.</p>
        </div>

        <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm">
          <strong class="text-amber-900 block mb-2">2. Comércio em geral — atenção</strong>
          <p class="text-amber-950 leading-relaxed">Para as demais atividades comerciais que não estejam abrangidas pelas exceções — como lojas de vestuário, calçados, eletrodomésticos e outros estabelecimentos do comércio em geral — o trabalho de empregados em feriados deverá estar autorizado pela <strong>Convenção Coletiva de Trabalho da categoria</strong>. A CCT também poderá estabelecer condições adicionais, como jornada, gratificação, folga compensatória, fornecimento de alimentação ou procedimentos prévios para funcionamento.</p>
        </div>

        <div class="bg-white p-4 rounded border border-gray-200 shadow-sm">
          <strong class="text-blue-950 block mb-2">3. Feriados e domingos possuem regras distintas</strong>
          <p class="text-gray-600 leading-relaxed mb-2">A Portaria MTE nº 1.316/2026 trata especificamente do <strong>trabalho em feriados</strong>. Ela não criou uma nova restrição geral para os domingos comuns.</p>
          <p class="text-gray-600 leading-relaxed">O funcionamento do comércio aos <strong>domingos</strong> continua disciplinado pela Lei nº 10.101/2000 e pela legislação municipal, devendo ainda ser observadas as regras de repouso semanal e eventuais condições previstas em negociação coletiva.</p>
        </div>

        <div class="bg-red-50 border-l-4 border-red-600 p-4 rounded-r shadow-sm">
          <strong class="text-red-800 block mb-1">Orientação CMA</strong>
          <p class="text-red-950 leading-relaxed">Antes de programar o funcionamento em feriado, confirme se a atividade está entre as autorizações permanentes e, quando não estiver, verifique se a CCT da categoria autoriza expressamente o trabalho nesse dia e quais condições devem ser cumpridas. Em caso de dúvida sobre o enquadramento, consulte o Departamento Pessoal da CMA antes de definir a escala.</p>
        </div>

        <div class="text-xs text-gray-500 pt-1">
          <strong>Base normativa:</strong> Lei nº 10.101/2000, especialmente arts. 6º e 6º-A, e Portaria MTE nº 1.316/2026.
        </div>
      </div>`;

    const jornada=document.getElementById('jornada');
    if(jornada&&jornada.nextSibling)main.insertBefore(section,jornada.nextSibling);else main.appendChild(section);

    if(typeof manualSections!=='undefined'&&!manualSections.some(x=>x.id==='comercio-feriados')){
      const pos=manualSections.findIndex(x=>x.id==='jornada');
      manualSections.splice(pos>=0?pos+1:manualSections.length,0,{id:'comercio-feriados',nome:'Trabalho no Comércio em Feriados'});
    }

    if(window.location.hash==='#comercio-feriados'){
      setTimeout(()=>showSection('comercio-feriados',botao),50);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criarSecaoComercioFeriados);else criarSecaoComercioFeriados();
})();