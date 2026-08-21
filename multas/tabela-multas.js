(function(){
  function criarTabelaMultas(){
    const menu=document.getElementById('manual-menu');
    const main=document.querySelector('#manual-conteudo main');
    if(!menu||!main||document.getElementById('tabela-multas'))return;

    const fiscalBtn=typeof getMenuButton==='function'?getMenuButton('fiscalizacao'):null;
    const botao=document.createElement('button');
    botao.type='button';
    botao.setAttribute('onclick',"showSection('tabela-multas', this)");
    botao.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';
    botao.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-4 h-4 mr-2.5 shrink-0"><path d="M4 3h16v18H4z"/><path d="M8 7h8"/><path d="M8 11h3"/><path d="M13 11h3"/><path d="M8 15h3"/><path d="M13 15h3"/></svg> Tabela de Multas Trabalhistas';
    if(fiscalBtn&&fiscalBtn.nextSibling)menu.insertBefore(botao,fiscalBtn.nextSibling);else menu.appendChild(botao);

    const fixas=[
      ['Obrigatoriedade da CTPS','CLT, art. 13','CLT, art. 55','R$ 416,18',''],
      ['Anotação de CTPS — demais empregadores','CLT, art. 29','CLT, art. 29-A','R$ 3.058,28','Por empregado sem anotação no prazo; acrescido de igual valor em cada reincidência.'],
      ['Anotação de CTPS — ME ou EPP','CLT, art. 29','CLT, art. 29-A, §1º','R$ 815,54','Por empregado sem anotação no prazo; acrescido de igual valor em cada reincidência.'],
      ['Anotações previstas no §2º do art. 29 da CLT','CLT, art. 29, §2º','CLT, art. 29-B','R$ 611,66','Por empregado prejudicado.'],
      ['Anotação desabonadora na CTPS','CLT, art. 29, §4º','CLT, art. 29, §5º c/c art. 52','R$ 208,09',''],
      ['Registro de empregado','CLT, art. 41','CLT, art. 47','R$ 3.101,73','Por empregado não registrado; acrescido de igual valor em cada reincidência.'],
      ['Registro de empregado — ME/EPP','CLT, art. 41','CLT, art. 47, §1º','R$ 827,13','Por empregado não registrado; acrescido de igual valor em cada reincidência.'],
      ['Falta de atualização ou preenchimento incompleto do LRE/FRE','CLT, art. 41, parágrafo único','CLT, art. 47-A','R$ 620,35','Por empregado prejudicado.'],
      ['Venda de CTPS igual ou semelhante','CLT, art. 51','CLT, art. 51','R$ 1.248,55',''],
      ['Extravio ou inutilização de CTPS','CLT, art. 52','CLT, art. 52','R$ 208,09',''],
      ['Férias','CLT, arts. 129 a 152','CLT, art. 153','R$ 176,03','Por empregado em situação irregular; dobrado em reincidência, embaraço ou resistência à fiscalização, artifício ou simulação para fraudar a lei.'],
      ['Trabalho do menor (criança, adolescente e aprendiz)','CLT, arts. 402 a 441','CLT, art. 434','R$ 416,18','Por menor irregular, até R$ 2.080,90; na reincidência, o total poderá ser elevado ao dobro.'],
      ['Anotação indevida na CTPS do menor','CLT, art. 435','CLT, art. 435','R$ 416,18',''],
      ['Contrato individual de trabalho','CLT, arts. 442 a 508','CLT, art. 510','R$ 416,18','Dobrado na reincidência.'],
      ['Atraso no pagamento de salário','CLT, art. 459, §1º','Lei nº 7.855/1989, art. 4º','R$ 176,03','Por trabalhador prejudicado.'],
      ['Não pagamento de verbas rescisórias no prazo','CLT, art. 477, §6º','CLT, art. 477, §8º','R$ 176,03','Por empregado prejudicado.'],
      ['13º salário','Leis nº 4.090/1962 e nº 4.749/1965','Lei nº 7.855/1989, art. 3º','R$ 176,03','Por trabalhador prejudicado; dobrado na reincidência.'],
      ['CAGED — atraso até 30 dias','Lei nº 4.923/1965','Lei nº 4.923/1965, art. 10','R$ 4,62','Por empregado.'],
      ['CAGED — atraso de 31 a 60 dias','Lei nº 4.923/1965','Lei nº 4.923/1965, art. 10','R$ 6,94','Por empregado.'],
      ['CAGED — atraso acima de 60 dias','Lei nº 4.923/1965','Lei nº 4.923/1965, art. 10','R$ 13,88','Por empregado.'],
      ['Atividade petrolífera','Lei nº 5.811/1972','Lei nº 7.855/1989, art. 3º','R$ 176,03','Por trabalhador prejudicado; dobrado na reincidência.'],
      ['Trabalhador rural','Lei nº 5.889/1973','Lei nº 5.889/1973, art. 18','R$ 392,89','Por empregado em situação irregular.'],
      ['Trabalhador temporário','Lei nº 6.019/1974','Lei nº 7.855/1989, art. 3º','R$ 176,03','Por trabalhador prejudicado; dobrado na reincidência.'],
      ['Propagandista/vendedor de produtos farmacêuticos — menor','Lei nº 6.224/1975, art. 3º','Lei nº 6.224/1975, art. 4º c/c CLT, art. 434','R$ 416,18','Por menor irregular até R$ 2.080,90; na reincidência, o total poderá ser elevado ao dobro.'],
      ['Propagandista/vendedor de produtos farmacêuticos','Lei nº 6.224/1975, art. 2º','Lei nº 6.224/1975, art. 4º c/c CLT, art. 510','R$ 416,18','Dobrado na reincidência.'],
      ['Vale-transporte','Lei nº 7.418/1985','Lei nº 7.855/1989, art. 3º','R$ 176,03','Por trabalhador prejudicado; dobrado na reincidência.'],
      ['RAIS/eSocial — omissão, incorreção ou atraso','Lei nº 7.998/1990, art. 24 c/c Portaria MTP nº 671/2021, art. 145','Lei nº 7.998/1990, art. 25 c/c art. 81 da Portaria MTP nº 667/2021','R$ 443,97','Acrescido de R$ 104,31 por trabalhador; máximo de R$ 44.396,84; dobrado em reincidência, oposição à fiscalização ou desacato.'],
      ['Contrato de trabalho por prazo determinado','Lei nº 9.601/1998, arts. 3º e 4º','Lei nº 9.601/1998, art. 7º','R$ 550,09',''],
      ['Trabalhador avulso','Lei nº 12.023/2009','Lei nº 12.023/2009, art. 10','R$ 516,95','Por trabalhador avulso prejudicado.'],
      ['Cooperativa de trabalho','Lei nº 12.690/2012','Lei nº 12.690/2012, art. 17, §1º','R$ 516,95','Por trabalhador prejudicado; dobrada na reincidência.'],
      ['Programa Seguro-Emprego','Lei nº 13.189/2015','Lei nº 13.189/2015, art. 8º, §1º','100%','Incide sobre os recursos recebidos do FAT; aplicada em dobro em caso de fraude.'],
      ['Prática discriminatória','Lei nº 9.029/1995','Lei nº 9.029/1995, art. 3º, I','10 vezes o maior salário pago pelo empregador',''],
      ['FGTS Digital — falta de depósito','Lei nº 8.036/1990, art. 23, §1º, I','Lei nº 8.036/1990, art. 23, §2º, b','30%','Percentual sobre o débito do FGTS; dobrado em reincidência, fraude, simulação, artifício, ardil, resistência, embaraço ou desacato.'],
      ['FGTS Digital — não computar parcela de remuneração','Lei nº 8.036/1990, art. 23, §1º, IV','Lei nº 8.036/1990, art. 23, §2º, b','30%','Percentual sobre o débito do FGTS; dobrado nas hipóteses previstas na norma.'],
      ['FGTS Digital — não efetuar depósito de débito já notificado','Lei nº 8.036/1990, art. 23, §1º, V','Lei nº 8.036/1990, art. 23, §2º, b','30%','Percentual sobre o débito do FGTS; dobrado nas hipóteses previstas na norma.']
    ];

    const variaveis=[
      ['Segurança do Trabalho','CLT, arts. 154 a 200','CLT, art. 201','R$ 693,11','R$ 6.935,56','Máximo em reincidência, embaraço ou resistência à fiscalização, artifício ou simulação para fraudar a lei.'],
      ['Medicina do Trabalho','CLT, arts. 154 a 200','CLT, art. 201','R$ 415,87','R$ 4.160,89','Mesma regra de agravamento prevista na Portaria.'],
      ['Radialista','Lei nº 6.615/1978','Lei nº 6.615/1978, art. 27','R$ 117,91','R$ 1.179,11','R$ 58,96 por empregado; máximo nas hipóteses de agravamento.'],
      ['Artista','Lei nº 6.533/1978','Lei nº 6.533/1978, art. 33','R$ 117,91','R$ 1.179,11','R$ 58,96 por empregado; máximo nas hipóteses de agravamento.'],
      ['RAIS — não entregar declaração no prazo legal','Lei nº 7.998/1990, art. 24','Lei nº 7.998/1990, art. 25','R$ 440,07','R$ 44.007,30','Dobrado em reincidência, oposição à fiscalização ou desacato à autoridade.'],
      ['RAIS — omitir informação ou prestar declaração falsa/inexata','Lei nº 7.998/1990, art. 24','Lei nº 7.998/1990, art. 25','R$ 440,07','R$ 44.007,30','Dobrado em reincidência, oposição à fiscalização ou desacato à autoridade.'],
      ['Seguro-desemprego — não entregar guias na dispensa sem justa causa','Lei nº 7.998/1990, art. 24','Lei nº 7.998/1990, art. 25','R$ 440,07','R$ 44.007,30','Dobrado em reincidência, oposição à fiscalização ou desacato à autoridade.'],
      ['Segurança do Trabalho Portuário','Lei nº 9.719/1998, art. 9º','Lei nº 9.719/1998, art. 10, II','R$ 594,50','R$ 5.944,98','Dobrada em reincidência, oposição à fiscalização e desacato à autoridade.'],
      ['Medicina do Trabalho Portuário','Lei nº 9.719/1998, art. 9º','Lei nº 9.719/1998, art. 10, II','R$ 356,70','R$ 3.566,99','Dobrada em reincidência, oposição à fiscalização e desacato à autoridade.'],
      ['Pessoa com Deficiência — PCD','Lei nº 8.213/1991, art. 93','Lei nº 8.213/1991, art. 133','Conforme ato de atualização','Conforme ato de atualização','Os valores mínimo e máximo do art. 133 são atualizados por ato do Poder Executivo.']
    ];

    const trFixas=fixas.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===0?'font-semibold text-slate-800':''}">${c||'—'}</td>`).join('')}</tr>`).join('');
    const trVariaveis=variaveis.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===0?'font-semibold text-slate-800':''}">${c||'—'}</td>`).join('')}</tr>`).join('');

    const section=document.createElement('section');
    section.id='tabela-multas';
    section.className='manual-section hidden fade-in';
    section.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
        <h3 class="text-2xl font-bold text-blue-950 flex items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 text-blue-950 w-7 h-7"><path d="M4 3h16v18H4z"/><path d="M8 7h8"/><path d="M8 11h3"/><path d="M13 11h3"/></svg>Tabela de Multas Trabalhistas</h3>
        <button onclick="toggleExplainer('exp-multas')" class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold hover:bg-slate-300 flex items-center">Entenda os Termos</button>
      </div>

      <div id="exp-multas" class="hidden bg-slate-100 border border-slate-300 p-3 rounded mb-4 text-xs text-slate-700 space-y-2">
        <p><strong>Critério fixo:</strong> a própria norma estabelece um valor ou percentual específico para a infração.</p>
        <p><strong>Critério variável:</strong> a multa é graduada entre valor mínimo e máximo conforme os parâmetros legais e as circunstâncias da infração.</p>
        <p><strong>Reincidência:</strong> repetição de infração que pode elevar ou dobrar a penalidade, conforme a regra aplicável.</p>
      </div>

      <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm mb-4">
        <strong class="text-amber-900 block mb-1">Importante</strong>
        <p class="text-amber-950 text-sm leading-relaxed">Os valores abaixo reproduzem a tabela publicada pela <strong>Portaria MTE nº 1.131, de 3 de julho de 2025</strong>. O valor efetivamente aplicado pode depender do número de empregados atingidos, reincidência, resistência à fiscalização, fraude e outros critérios previstos na legislação.</p>
      </div>

      <div class="bg-white p-4 rounded border border-gray-200 shadow-sm mb-5">
        <h4 class="font-bold text-blue-950 mb-3">Multas administrativas com critérios fixos de cálculo</h4>
        <div class="cma-multas-scroll"><table class="cma-multas-table"><thead><tr><th>Natureza da infração</th><th>Capitulação</th><th>Base legal</th><th>Valor</th><th>Observações</th></tr></thead><tbody>${trFixas}</tbody></table></div>
      </div>

      <div class="bg-white p-4 rounded border border-gray-200 shadow-sm">
        <h4 class="font-bold text-blue-950 mb-3">Multas administrativas com critérios variáveis de cálculo</h4>
        <div class="cma-multas-scroll"><table class="cma-multas-table"><thead><tr><th>Natureza</th><th>Capitulação</th><th>Base legal</th><th>Valor mínimo</th><th>Valor máximo</th><th>Observações</th></tr></thead><tbody>${trVariaveis}</tbody></table></div>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-900 p-4 rounded-r shadow-sm mt-4">
        <strong class="text-blue-950 block mb-1">eSocial — regra específica da Portaria</strong>
        <p class="text-blue-950 text-sm leading-relaxed">A falta de informações, atraso, omissões ou incorreções no eSocial sujeitam o responsável à multa mínima de <strong>R$ 443,97</strong>, acrescida de <strong>R$ 104,31 por trabalhador</strong>, observado o máximo de <strong>R$ 44.396,84</strong>, conforme os critérios da Portaria.</p>
      </div>

      <div class="text-xs text-gray-500 mt-4"><strong>Base normativa:</strong> Portaria MTE nº 1.131/2025, que alterou a Portaria MTP nº 667/2021.</div>`;

    const base=document.getElementById('baselegal');
    if(base)main.insertBefore(section,base);else main.appendChild(section);

    if(!document.getElementById('cma-multas-style')){
      const style=document.createElement('style');style.id='cma-multas-style';style.textContent=`.cma-multas-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}.cma-multas-table{width:100%;min-width:960px;border-collapse:collapse;font-size:12px;line-height:1.4}.cma-multas-table th{background:#172554;color:#fff;text-align:left;padding:10px;border:1px solid #27386f;vertical-align:top}.cma-multas-table td{padding:9px 10px;border:1px solid #e2e8f0;vertical-align:top;color:#475569}.cma-multas-table tbody tr:nth-child(even){background:#f8fafc}@media(max-width:700px){.cma-multas-table{font-size:11px;min-width:880px}}`;document.head.appendChild(style);
    }

    if(typeof manualSections!=='undefined'&&!manualSections.some(x=>x.id==='tabela-multas')){
      const pos=manualSections.findIndex(x=>x.id==='fiscalizacao');
      manualSections.splice(pos>=0?pos+1:manualSections.length,0,{id:'tabela-multas',nome:'Tabela de Multas Trabalhistas'});
    }

    if(window.location.hash==='#tabela-multas')setTimeout(()=>showSection('tabela-multas',botao),60);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criarTabelaMultas);else criarTabelaMultas();
})();
