(function(){
  function criarFaltasJustificaveis(){
    const menu=document.getElementById('manual-menu');
    const main=document.querySelector('#manual-conteudo main');
    if(!menu||!main||document.getElementById('faltas-justificaveis'))return;

    const afastBtn=typeof getMenuButton==='function'?getMenuButton('afastamentos'):null;
    const botao=document.createElement('button');
    botao.type='button';
    botao.setAttribute('onclick',"showSection('faltas-justificaveis', this)");
    botao.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';
    botao.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-4 h-4 mr-2.5 shrink-0"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Faltas Justificáveis';
    if(afastBtn&&afastBtn.nextSibling)menu.insertBefore(botao,afastBtn.nextSibling);else menu.appendChild(botao);

    const section=document.createElement('section');
    section.id='faltas-justificaveis';
    section.className='manual-section hidden fade-in';
    section.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
        <h3 class="text-2xl font-bold text-blue-950 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 text-blue-950 w-7 h-7"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          Faltas Justificáveis
        </h3>
        <button onclick="toggleExplainer('exp-faltas-justificaveis')" class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold hover:bg-slate-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 mr-1"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg> Entenda os Termos
        </button>
      </div>

      <div id="exp-faltas-justificaveis" class="hidden bg-slate-100 border border-slate-300 p-3 rounded mb-4 text-xs text-slate-700 space-y-2">
        <p><strong>Falta Justificada:</strong> ausência amparada por lei, norma coletiva ou aceita pelo empregador, que não deve gerar desconto salarial quando atendidos os requisitos aplicáveis.</p>
        <p><strong>Abono:</strong> reconhecimento da ausência como período sem prejuízo do salário.</p>
        <p><strong>Comprovação:</strong> documento exigido para demonstrar o motivo da ausência, como declaração, atestado, comprovante de comparecimento ou outro documento pertinente.</p>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-900 p-4 rounded-r shadow-sm mb-4">
        <strong class="text-blue-950 block mb-1">Art. 473 da CLT</strong>
        <p class="text-blue-950 leading-relaxed text-sm">A CLT prevê situações em que o empregado pode deixar de comparecer ao serviço <strong>sem prejuízo do salário</strong>. Para o correto abono, a empresa deve observar o motivo, o prazo legal e a documentação comprobatória aplicável.</p>
      </div>

      <div class="space-y-3 text-sm text-gray-700">
        <div class="bg-white p-4 rounded border border-gray-200 shadow-sm"><strong class="text-blue-950">Falecimento</strong><p class="text-gray-600 mt-1">Até <strong>2 dias consecutivos</strong> em caso de falecimento do cônjuge, ascendente, descendente, irmão ou pessoa declarada na CTPS que viva sob dependência econômica do empregado.</p></div>
        <div class="bg-white p-4 rounded border border-gray-200 shadow-sm"><strong class="text-blue-950">Casamento</strong><p class="text-gray-600 mt-1">Até <strong>3 dias consecutivos</strong>.</p></div>
        <div class="bg-white p-4 rounded border border-gray-200 shadow-sm"><strong class="text-blue-950">Nascimento, adoção ou guarda compartilhada</strong><p class="text-gray-600 mt-1"><strong>5 dias consecutivos</strong>, observadas as regras legais específicas aplicáveis ao caso.</p></div>
        <div class="bg-white p-4 rounded border border-gray-200 shadow-sm"><strong class="text-blue-950">Doação voluntária de sangue</strong><p class="text-gray-600 mt-1"><strong>1 dia a cada 12 meses de trabalho</strong>, mediante comprovação.</p></div>
        <div class="bg-white p-4 rounded border border-gray-200 shadow-sm"><strong class="text-blue-950">Alistamento eleitoral</strong><p class="text-gray-600 mt-1">Até <strong>2 dias, consecutivos ou não</strong>, para fins de alistamento eleitoral.</p></div>
        <div class="bg-white p-4 rounded border border-gray-200 shadow-sm"><strong class="text-blue-950">Serviço Militar</strong><p class="text-gray-600 mt-1">Pelo período necessário ao cumprimento das exigências legais do Serviço Militar previstas na legislação específica.</p></div>
        <div class="bg-white p-4 rounded border border-gray-200 shadow-sm"><strong class="text-blue-950">Vestibular</strong><p class="text-gray-600 mt-1">Nos dias em que o empregado estiver comprovadamente realizando provas de exame vestibular para ingresso no ensino superior.</p></div>
        <div class="bg-white p-4 rounded border border-gray-200 shadow-sm"><strong class="text-blue-950">Comparecimento em juízo</strong><p class="text-gray-600 mt-1">Pelo <strong>tempo que se fizer necessário</strong>, mediante comprovação.</p></div>
        <div class="bg-white p-4 rounded border border-gray-200 shadow-sm"><strong class="text-blue-950">Representação sindical internacional</strong><p class="text-gray-600 mt-1">Pelo tempo necessário quando o empregado, como representante de entidade sindical, participar de reunião oficial de organismo internacional do qual o Brasil seja membro.</p></div>
        <div class="bg-white p-4 rounded border border-gray-200 shadow-sm"><strong class="text-blue-950">Acompanhamento de gestante</strong><p class="text-gray-600 mt-1">Pelo tempo necessário para acompanhar esposa ou companheira em até <strong>6 consultas médicas ou exames complementares</strong> durante a gravidez.</p></div>
        <div class="bg-white p-4 rounded border border-gray-200 shadow-sm"><strong class="text-blue-950">Consulta médica de filho</strong><p class="text-gray-600 mt-1"><strong>1 dia por ano</strong> para acompanhar filho de até 6 anos em consulta médica.</p></div>
        <div class="bg-white p-4 rounded border border-gray-200 shadow-sm"><strong class="text-blue-950">Exames preventivos de câncer</strong><p class="text-gray-600 mt-1">Até <strong>3 dias em cada 12 meses de trabalho</strong>, mediante comprovação. A empresa também deve informar os empregados sobre a possibilidade de ausência para realização de exames preventivos de HPV e de câncer, conforme a legislação vigente.</p></div>
      </div>

      <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm mt-4">
        <strong class="text-amber-900 block mb-1">Atenção à CCT e à documentação</strong>
        <p class="text-amber-950 leading-relaxed text-sm">A Convenção Coletiva de Trabalho pode prever outras hipóteses de ausência justificada ou condições mais favoráveis. A empresa deve solicitar a documentação necessária para comprovação do motivo e encaminhar a informação ao Departamento Pessoal para o correto lançamento.</p>
      </div>

      <div class="text-xs text-gray-500 pt-4"><strong>Base legal principal:</strong> art. 473 da CLT e respectivas alterações.</div>`;

    const afast=document.getElementById('afastamentos');
    if(afast&&afast.nextSibling)main.insertBefore(section,afast.nextSibling);else main.appendChild(section);

    if(typeof manualSections!=='undefined'&&!manualSections.some(x=>x.id==='faltas-justificaveis')){
      const pos=manualSections.findIndex(x=>x.id==='afastamentos');
      manualSections.splice(pos>=0?pos+1:manualSections.length,0,{id:'faltas-justificaveis',nome:'Faltas Justificáveis'});
    }

    if(window.location.hash==='#faltas-justificaveis')setTimeout(()=>showSection('faltas-justificaveis',botao),50);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criarFaltasJustificaveis);else criarFaltasJustificaveis();
})();
