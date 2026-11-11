(function(){
  function moeda(v){return (Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function numero(id){const el=document.getElementById(id);if(!el)return 0;const n=parseFloat(String(el.value||'0').replace(',','.'));return isNaN(n)?0:n;}
  function sim(id){const el=document.querySelector(`input[name="${id}"]:checked`);return el&&el.value==='sim';}
  function opcao(id,padrao=''){const el=document.querySelector(`input[name="${id}"]:checked`);return el?el.value:padrao;}
  function soDigitos(valor){return String(valor||'').replace(/\D/g,'').slice(0,7);}
  function formatarCnae(valor){const d=soDigitos(valor);return d.length===7?`${d.slice(0,4)}-${d.slice(4,5)}/${d.slice(5)}`:d;}
  function rotuloRegime(regime){return regime==='simples-anexo-iv'?'Simples Nacional — Anexo IV':regime==='nao-simples'?'Não optante pelo Simples Nacional':'Simples Nacional — CPP no DAS';}
  function competenciaAtual(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;}
  function contarCalendario(valor){
    if(!/^\d{4}-\d{2}$/.test(valor||''))return null;
    const [ano,mesTxt]=valor.split('-').map(Number),mes=mesTxt-1,totalDias=new Date(ano,mes+1,0).getDate();
    const feriados=typeof getCmaHolidays==='function'?getCmaHolidays(ano):{};
    let uteis=0,dsr=0,domingos=0;const feriadosDoMes=[];
    for(let dia=1;dia<=totalDias;dia++){
      const data=new Date(ano,mes,dia),semana=data.getDay();
      const chave=typeof dateKey==='function'?dateKey(ano,mes,dia):`${ano}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
      const nomeFeriado=feriados[chave]||'';
      if(semana===0){domingos++;dsr++;}
      else if(nomeFeriado){dsr++;feriadosDoMes.push({dia,nome:nomeFeriado});}
      else uteis++;
    }
    return {uteis,dsr,domingos,feriados:feriadosDoMes};
  }
  window.CMA_CONTAR_CALENDARIO_CUSTO=contarCalendario;

  function calcularValores(d){
    const salario=Math.max(0,Number(d.salario)||0);
    const comissao=Math.max(0,Number(d.comissao)||0);
    const diasUteis=Math.max(0,Number(d.diasUteis)||0);
    const diasDsr=Math.max(0,Number(d.diasDsr)||0);
    const dsrComissao=comissao>0&&diasUteis>0?(comissao/diasUteis)*diasDsr:0;
    const gratificacao=Math.max(0,Number(d.gratificacao)||0);
    const periculosidade=d.risco==='periculosidade'?salario*0.30:0;
    const percentualInsalubridade=d.risco==='insalubridade'?Math.max(0,Number(d.grauInsalubridade)||0)/100:0;
    const insalubridade=d.risco==='insalubridade'?Math.max(0,Number(d.baseInsalubridade)||0)*percentualInsalubridade:0;
    const remuneracao=salario+comissao+dsrComissao+gratificacao+periculosidade+insalubridade;

    const percentualVT=Math.min(6,Math.max(0,Number(d.percentualVT)||0));
    const vtBruto=d.temVT?Math.max(0,Number(d.vtBruto)||0):0;
    const descontoVT=d.temVT?Math.min(vtBruto,salario*(percentualVT/100)):0;
    const custoVT=Math.max(0,vtBruto-descontoVT);
    const percentualAlim=Math.min(20,Math.max(0,Number(d.percentualAlim)||0));
    const alimBruto=d.temAlim?Math.max(0,Number(d.alimBruto)||0):0;
    const descontoAlim=d.temAlim?alimBruto*(percentualAlim/100):0;
    const custoAlim=Math.max(0,alimBruto-descontoAlim);
    const plano=Math.max(0,Number(d.plano)||0);
    const outros=Math.max(0,Number(d.outros)||0);

    const aplicaPatronal=d.regime==='simples-anexo-iv'||d.regime==='nao-simples';
    const cppPct=aplicaPatronal?20:0;
    const ratPct=aplicaPatronal?Math.min(3,Math.max(0,Number(d.rat)||0)):0;
    const fap=aplicaPatronal?Math.min(2,Math.max(0.5,Number(d.fap)||1)):0;
    const ratAjustadoPct=ratPct*fap;
    const terceirosPct=d.regime==='nao-simples'?Math.min(20,Math.max(0,Number(d.terceiros)||0)):0;
    const patronalPct=cppPct+ratAjustadoPct+terceirosPct;
    const fgtsRemuneracao=remuneracao*0.08;
    const cppFolha=remuneracao*(cppPct/100),ratFolha=remuneracao*(ratAjustadoPct/100),terceirosFolha=remuneracao*(terceirosPct/100);
    const encargosFolha=cppFolha+ratFolha+terceirosFolha;
    const desembolso=remuneracao+custoVT+custoAlim+plano+outros+fgtsRemuneracao+encargosFolha;
    const ferias=remuneracao/12;
    const terco=ferias/3;
    const fgtsFerias=(ferias+terco)*0.08;
    const decimo=remuneracao/12;
    const fgtsDecimo=decimo*0.08;
    const aviso=remuneracao/12;
    const fgtsAviso=aviso*0.08;
    const multaFgtsPct=Math.min(40,Math.max(0,Number(d.multaFgtsPct)||0));
    const multaFgts=(fgtsRemuneracao+fgtsFerias+fgtsDecimo+fgtsAviso)*(multaFgtsPct/100);
    const baseEncargosProv=ferias+terco+decimo;
    const cppProv=baseEncargosProv*(cppPct/100),ratProv=baseEncargosProv*(ratAjustadoPct/100),terceirosProv=baseEncargosProv*(terceirosPct/100);
    const encargosProv=cppProv+ratProv+terceirosProv;
    const provisoes=ferias+terco+fgtsFerias+decimo+fgtsDecimo+aviso+fgtsAviso+multaFgts+encargosProv;
    return {salario,comissao,diasUteis,diasDsr,dsrComissao,gratificacao,periculosidade,insalubridade,remuneracao,percentualVT,vtBruto,descontoVT,custoVT,percentualAlim,alimBruto,descontoAlim,custoAlim,plano,outros,cppPct,ratPct,fap,ratAjustadoPct,terceirosPct,patronalPct,fgtsRemuneracao,cppFolha,ratFolha,terceirosFolha,encargosFolha,desembolso,ferias,terco,fgtsFerias,decimo,fgtsDecimo,aviso,fgtsAviso,multaFgtsPct,multaFgts,baseEncargosProv,cppProv,ratProv,terceirosProv,encargosProv,provisoes,total:desembolso+provisoes};
  }
  window.CMA_CALCULAR_CUSTO=calcularValores;

  function linha(label,valor,classe=''){
    return `<div class="cma-custo-linha ${classe}"><span>${label}</span><strong>${moeda(valor)}</strong></div>`;
  }

  function recalcular(){
    const regime=(document.querySelector('input[name="cma-regime"]:checked')||{}).value||'simples';
    const salario=numero('cma-custo-salario');
    const temVT=sim('cma-vt');
    const temAlim=sim('cma-alim');
    const temComissao=sim('cma-comissao');
    const temGratificacao=sim('cma-gratificacao');
    const risco=opcao('cma-risco','nenhum');
    const grauEl=document.getElementById('cma-custo-insal-grau');
    const cnaeEl=document.getElementById('cma-custo-cnae'),cnae=soDigitos(cnaeEl?cnaeEl.value:'');
    const rat=Number((window.CMA_CNAE_RAT||{})[cnae])||0;
    const v=calcularValores({regime,salario,rat,fap:numero('cma-custo-fap'),terceiros:numero('cma-custo-terceiros'),multaFgtsPct:numero('cma-custo-multa-fgts'),comissao:temComissao?numero('cma-custo-comissao'):0,diasUteis:numero('cma-custo-dias-uteis'),diasDsr:numero('cma-custo-dias-dsr'),gratificacao:temGratificacao?numero('cma-custo-gratificacao'):0,risco,grauInsalubridade:grauEl?grauEl.value:0,baseInsalubridade:numero('cma-custo-insal-base'),temVT,vtBruto:numero('cma-custo-vt'),percentualVT:numero('cma-custo-vt-percentual'),temAlim,alimBruto:numero('cma-custo-alim'),percentualAlim:numero('cma-custo-alim-percentual'),plano:numero('cma-custo-plano'),outros:numero('cma-custo-outros')});

    const reg=document.getElementById('cma-custo-regime-label');
    if(reg)reg.textContent=rotuloRegime(regime);
    const patronalWrap=document.getElementById('cma-custo-patronal-wrap');if(patronalWrap)patronalWrap.classList.toggle('hidden',regime==='simples');
    const terceirosWrap=document.getElementById('cma-custo-terceiros-wrap');if(terceirosWrap)terceirosWrap.classList.toggle('hidden',regime!=='nao-simples');
    const cnaeStatus=document.getElementById('cma-custo-cnae-status');
    if(cnaeStatus)cnaeStatus.textContent=regime==='simples'?'A CPP está incluída no DAS nesta opção.':cnae.length<7?'Informe os 7 dígitos do CNAE preponderante para localizar o RAT.':rat?`CNAE localizado na tabela oficial — RAT ${rat}%.`:'CNAE não localizado na tabela oficial utilizada. Confira o código informado.';
    const patronalResumo=document.getElementById('cma-custo-patronal-resumo');if(patronalResumo)patronalResumo.innerHTML=`<span>Percentual patronal desta estimativa</span><strong>${v.patronalPct.toFixed(2).replace('.',',')}%</strong>`;

    const caixa=document.getElementById('cma-custo-desembolso');
    if(caixa)caixa.innerHTML=
      linha('Salário base',v.salario)+
      (v.comissao?linha('Comissões',v.comissao):'')+
      (v.comissao?linha('DSR sobre comissões',v.dsrComissao):'')+
      (v.gratificacao?linha('Gratificação mensal',v.gratificacao):'')+
      (v.periculosidade?linha('Adicional de periculosidade (30%)',v.periculosidade):'')+
      (v.insalubridade?linha(`Adicional de insalubridade (${grauEl?grauEl.value:0}%)`,v.insalubridade):'')+
      (v.remuneracao!==v.salario?linha('Base remuneratória estimada',v.remuneracao,'cma-custo-sub'):'')+
      (temAlim?linha('Vale-alimentação / refeição — valor informado',v.alimBruto)+linha(`(-) Participação do empregado (${v.percentualAlim}%)`,-v.descontoAlim,'cma-custo-desconto')+linha('Custo do benefício para a empresa',v.custoAlim,'cma-custo-sub'):'')+
      (temVT?linha('Vale-transporte — valor informado',v.vtBruto)+linha(`(-) Desconto do empregado (${v.percentualVT}%)`,-v.descontoVT,'cma-custo-desconto')+linha('Custo do VT para a empresa',v.custoVT,'cma-custo-sub'):'')+
      (v.plano?linha('Plano de saúde',v.plano):'')+
      (v.outros?linha('Outros benefícios',v.outros):'')+
      linha('FGTS sobre remuneração',v.fgtsRemuneracao)+
      (v.cppFolha?linha(`CPP sobre remuneração (${v.cppPct}%)`,v.cppFolha):'')+
      (v.ratFolha?linha(`RAT ajustado pelo FAP (${v.ratAjustadoPct.toFixed(2).replace('.',',')}%)`,v.ratFolha):'')+
      (v.terceirosFolha?linha(`Terceiros (${v.terceirosPct.toFixed(2).replace('.',',')}%)`,v.terceirosFolha):'')+
      linha('Subtotal mensal',v.desembolso,'cma-custo-total-linha');

    const prov=document.getElementById('cma-custo-provisoes');
    if(prov)prov.innerHTML=
      linha('Férias sobre a remuneração',v.ferias)+
      linha('1/3 de férias',v.terco)+
      linha('FGTS sobre férias + 1/3',v.fgtsFerias)+
      linha('13º salário sobre a remuneração',v.decimo)+
      linha('FGTS sobre 13º',v.fgtsDecimo)+
      linha('Aviso-prévio sobre a remuneração',v.aviso)+
      linha('FGTS sobre aviso-prévio',v.fgtsAviso)+
      (v.multaFgtsPct?linha(`Provisão da multa do FGTS (${v.multaFgtsPct}%)`,v.multaFgts):'')+
      (v.cppProv?linha(`CPP sobre férias, 1/3 e 13º (${v.cppPct}%)`,v.cppProv):'')+
      (v.ratProv?linha(`RAT ajustado sobre férias, 1/3 e 13º (${v.ratAjustadoPct.toFixed(2).replace('.',',')}%)`,v.ratProv):'')+
      (v.terceirosProv?linha(`Terceiros sobre férias, 1/3 e 13º (${v.terceirosPct.toFixed(2).replace('.',',')}%)`,v.terceirosProv):'')+
      linha('Subtotal de provisões',v.provisoes,'cma-custo-total-linha');

    const t=document.getElementById('cma-custo-total');if(t)t.textContent=moeda(v.total);
    const pct=document.getElementById('cma-custo-percentual');if(pct)pct.textContent=salario>0?`${((v.total/salario-1)*100).toFixed(1).replace('.',',')}% acima do salário base`:'Informe o salário para calcular';

    const vtCampo=document.getElementById('cma-custo-vt-wrap');if(vtCampo)vtCampo.classList.toggle('hidden',!temVT);
    const aCampo=document.getElementById('cma-custo-alim-wrap');if(aCampo)aCampo.classList.toggle('hidden',!temAlim);
    const cCampo=document.getElementById('cma-custo-comissao-wrap');if(cCampo)cCampo.classList.toggle('hidden',!temComissao);
    const gCampo=document.getElementById('cma-custo-gratificacao-wrap');if(gCampo)gCampo.classList.toggle('hidden',!temGratificacao);
    const pCampo=document.getElementById('cma-custo-periculosidade-wrap');if(pCampo)pCampo.classList.toggle('hidden',risco!=='periculosidade');
    const iCampo=document.getElementById('cma-custo-insalubridade-wrap');if(iCampo)iCampo.classList.toggle('hidden',risco!=='insalubridade');
    const dsrResultado=document.getElementById('cma-custo-dsr-resultado');if(dsrResultado)dsrResultado.innerHTML=`<span>DSR calculado sobre as comissões</span><strong>${moeda(v.dsrComissao)}</strong>`;
    const insalAviso=document.getElementById('cma-custo-insal-aviso');if(insalAviso)insalAviso.textContent=risco==='insalubridade'&&numero('cma-custo-insal-base')<=0?'Informe a base de cálculo aplicável para apurar o adicional.':'A base pode variar conforme a regra aplicável ao caso e a norma coletiva.';
  }

  function preencherCalendario(){
    const competencia=document.getElementById('cma-custo-competencia');if(!competencia)return;
    const c=contarCalendario(competencia.value);if(!c)return;
    const uteis=document.getElementById('cma-custo-dias-uteis'),dsr=document.getElementById('cma-custo-dias-dsr'),resumo=document.getElementById('cma-custo-calendario-resumo');
    if(uteis)uteis.value=c.uteis;if(dsr)dsr.value=c.dsr;
    if(resumo){const detalheFeriados=c.feriados.length?` + ${c.feriados.length} ${c.feriados.length===1?'feriado':'feriados'} (${c.feriados.map(f=>`${String(f.dia).padStart(2,'0')} — ${f.nome}`).join(', ')})`:'';resumo.textContent=`${c.uteis} dias úteis • ${c.dsr} DSR (${c.domingos} domingos${detalheFeriados})`;}
    recalcular();
  }

  function criar(){
    const menu=document.getElementById('manual-menu');
    const main=document.querySelector('#manual-conteudo main');
    if(!menu||!main||document.getElementById('custo-empregado'))return;

    const botao=document.createElement('button');
    botao.type='button';
    botao.setAttribute('onclick',"showSection('custo-empregado', this)");
    botao.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';
    botao.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><path d="M6 15h2"/></svg> Custo do Empregado';
    const cronogramaBtn=typeof getMenuButton==='function'?getMenuButton('cronograma'):null;
    if(cronogramaBtn)menu.insertBefore(botao,cronogramaBtn);else menu.appendChild(botao);

    const section=document.createElement('section');
    section.id='custo-empregado';
    section.className='manual-section hidden fade-in';
    section.innerHTML=`
      <div class="flex items-start justify-between gap-4 border-b border-gray-200 pb-4 mb-4">
        <h3 class="text-2xl font-bold text-blue-950 flex items-center">Calculadora de Custo do Empregado</h3>
        <button onclick="toggleExplainer('exp-custo-empregado')" class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold hover:bg-slate-300 flex items-center shrink-0">Entenda os Termos</button>
      </div>
      <div id="exp-custo-empregado" class="hidden bg-slate-100 border border-slate-300 p-3 rounded mb-4 text-xs text-slate-700 space-y-2">
        <p><strong>Desembolso mensal:</strong> valores que normalmente representam saída de caixa no mês, como salário, benefícios e encargos correntes.</p>
        <p><strong>Provisões:</strong> valores mensais estimados para obrigações que serão pagas em períodos futuros, como férias, 13º salário, aviso-prévio e multa do FGTS.</p>
        <p><strong>Encargos patronais:</strong> a calculadora separa CPP, RAT ajustado pelo FAP e contribuições a terceiros. O CNAE preponderante localiza o RAT; o FAP e a alíquota de terceiros devem ser confirmados nos dados da empresa.</p>
      </div>

      <div class="cma-custo-grid">
        <div class="cma-custo-card cma-custo-form">
          <h4>1. Dados para o cálculo</h4>
          <label class="cma-custo-label">Regime da empresa</label>
          <div class="cma-custo-segmentado cma-custo-segmentado-tres">
            <label><input type="radio" name="cma-regime" value="simples" checked><span>Simples — CPP no DAS</span></label>
            <label><input type="radio" name="cma-regime" value="simples-anexo-iv"><span>Simples — Anexo IV</span></label>
            <label><input type="radio" name="cma-regime" value="nao-simples"><span>Não optante pelo Simples</span></label>
          </div>

          <div id="cma-custo-patronal-wrap" class="hidden cma-custo-subform cma-custo-patronal">
            <label class="cma-custo-label" for="cma-custo-cnae">CNAE preponderante</label>
            <input id="cma-custo-cnae" class="cma-custo-number" type="text" inputmode="numeric" maxlength="10" placeholder="Ex.: 6920-6/01">
            <small id="cma-custo-cnae-status" class="cma-custo-ajuda">Informe os 7 dígitos do CNAE preponderante para localizar o RAT.</small>
            <div class="cma-custo-duas-colunas">
              <div><label class="cma-custo-label" for="cma-custo-fap">FAP da empresa</label><input id="cma-custo-fap" class="cma-custo-number" type="number" min="0.5" max="2" step="0.0001" value="1"></div>
              <div id="cma-custo-terceiros-wrap" class="hidden"><label class="cma-custo-label" for="cma-custo-terceiros">Terceiros</label><div class="cma-custo-percentual"><input id="cma-custo-terceiros" type="number" min="0" max="20" step="0.01" value="0"><span>%</span></div></div>
            </div>
            <div id="cma-custo-patronal-resumo" class="cma-custo-resultado-campo"><span>Percentual patronal desta estimativa</span><strong>0,00%</strong></div>
            <small class="cma-custo-ajuda">O CNAE define o RAT básico. O FAP é específico da empresa. Para empresas fora do Simples, confirme também a alíquota de terceiros conforme o FPAS. No Anexo IV, a estimativa não inclui terceiros.</small>
          </div>

          <label class="cma-custo-label" for="cma-custo-salario">Salário base</label>
          <div class="cma-custo-money"><span>R$</span><input id="cma-custo-salario" type="number" min="0" step="0.01" value="0"></div>

          <label class="cma-custo-label" for="cma-custo-multa-fgts">Provisão da multa do FGTS</label>
          <select id="cma-custo-multa-fgts" class="cma-custo-select"><option value="40">40% — dispensa sem justa causa</option><option value="20">20% — acordo entre as partes</option><option value="0">Sem provisão de multa</option></select>

          <div class="cma-custo-pergunta"><div><strong>Recebe comissão?</strong><small>A comissão e o DSR calculado integram a remuneração da estimativa.</small></div><div class="cma-custo-simnao"><label><input type="radio" name="cma-comissao" value="nao" checked><span>Não</span></label><label><input type="radio" name="cma-comissao" value="sim"><span>Sim</span></label></div></div>
          <div id="cma-custo-comissao-wrap" class="hidden cma-custo-subform">
            <label class="cma-custo-label" for="cma-custo-comissao">Comissões do mês</label>
            <div class="cma-custo-money"><span>R$</span><input id="cma-custo-comissao" type="number" min="0" step="0.01" value="0"></div>
            <label class="cma-custo-label" for="cma-custo-competencia">Competência do DSR</label>
            <input id="cma-custo-competencia" class="cma-custo-number" type="month">
            <div class="cma-custo-duas-colunas">
              <div><label class="cma-custo-label" for="cma-custo-dias-uteis">Dias úteis <small>(automático)</small></label><input id="cma-custo-dias-uteis" class="cma-custo-number" type="number" min="0" max="31" step="1" value="0" readonly></div>
              <div><label class="cma-custo-label" for="cma-custo-dias-dsr">Domingos e feriados <small>(automático)</small></label><input id="cma-custo-dias-dsr" class="cma-custo-number" type="number" min="0" max="31" step="1" value="0" readonly></div>
            </div>
            <small id="cma-custo-calendario-resumo" class="cma-custo-ajuda"></small>
            <small class="cma-custo-ajuda">A ferramenta considera segunda a sábado como dias úteis, exclui os feriados do calendário do Manual e não duplica feriado que caia no domingo.</small>
            <div id="cma-custo-dsr-resultado" class="cma-custo-resultado-campo"><span>DSR calculado sobre as comissões</span><strong>R$ 0,00</strong></div>
          </div>

          <div class="cma-custo-pergunta"><div><strong>Recebe gratificação mensal?</strong><small>Informe a gratificação de natureza salarial usada na estimativa.</small></div><div class="cma-custo-simnao"><label><input type="radio" name="cma-gratificacao" value="nao" checked><span>Não</span></label><label><input type="radio" name="cma-gratificacao" value="sim"><span>Sim</span></label></div></div>
          <div id="cma-custo-gratificacao-wrap" class="hidden cma-custo-subform"><label class="cma-custo-label" for="cma-custo-gratificacao">Gratificação mensal</label><div class="cma-custo-money"><span>R$</span><input id="cma-custo-gratificacao" type="number" min="0" step="0.01" value="0"></div></div>

          <div class="cma-custo-pergunta cma-custo-pergunta-bloco"><div><strong>Adicional ocupacional</strong><small>Selecione somente o adicional aplicável. A caracterização depende das condições de trabalho e da avaliação técnica.</small></div></div>
          <div class="cma-custo-segmentado cma-custo-segmentado-tres">
            <label><input type="radio" name="cma-risco" value="nenhum" checked><span>Nenhum</span></label>
            <label><input type="radio" name="cma-risco" value="periculosidade"><span>Periculosidade</span></label>
            <label><input type="radio" name="cma-risco" value="insalubridade"><span>Insalubridade</span></label>
          </div>
          <div id="cma-custo-periculosidade-wrap" class="hidden cma-custo-subform"><div class="cma-custo-resultado-campo"><span>30% sobre o salário base</span><strong>Calculado automaticamente</strong></div><small class="cma-custo-ajuda">A calculadora não soma periculosidade e insalubridade.</small></div>
          <div id="cma-custo-insalubridade-wrap" class="hidden cma-custo-subform">
            <div class="cma-custo-duas-colunas">
              <div><label class="cma-custo-label" for="cma-custo-insal-grau">Grau</label><select id="cma-custo-insal-grau" class="cma-custo-select"><option value="10">Mínimo — 10%</option><option value="20">Médio — 20%</option><option value="40">Máximo — 40%</option></select></div>
              <div><label class="cma-custo-label" for="cma-custo-insal-base">Base de cálculo aplicável</label><div class="cma-custo-money"><span>R$</span><input id="cma-custo-insal-base" type="number" min="0" step="0.01" value="0"></div></div>
            </div>
            <small id="cma-custo-insal-aviso" class="cma-custo-ajuda">Informe a base de cálculo aplicável para apurar o adicional.</small>
          </div>

          <div class="cma-custo-pergunta"><div><strong>Vale-transporte?</strong><small>Se sim, informe a média mensal concedida.</small></div><div class="cma-custo-simnao"><label><input type="radio" name="cma-vt" value="nao" checked><span>Não</span></label><label><input type="radio" name="cma-vt" value="sim"><span>Sim</span></label></div></div>
          <div id="cma-custo-vt-wrap" class="hidden cma-custo-subform"><div class="cma-custo-duas-colunas"><div><label class="cma-custo-label" for="cma-custo-vt">Média mensal de vale-transporte</label><div class="cma-custo-money"><span>R$</span><input id="cma-custo-vt" type="number" min="0" step="0.01" value="0"></div></div><div><label class="cma-custo-label" for="cma-custo-vt-percentual">Desconto do empregado</label><div class="cma-custo-percentual"><input id="cma-custo-vt-percentual" type="number" min="0" max="6" step="0.01" value="6"><span>%</span></div></div></div><small class="cma-custo-ajuda">O percentual pode ser reduzido, mas não pode ultrapassar 6% do salário base nem o valor concedido.</small></div>

          <div class="cma-custo-pergunta"><div><strong>Vale-alimentação / refeição?</strong><small>Se sim, informe a média mensal depositada.</small></div><div class="cma-custo-simnao"><label><input type="radio" name="cma-alim" value="nao" checked><span>Não</span></label><label><input type="radio" name="cma-alim" value="sim"><span>Sim</span></label></div></div>
          <div id="cma-custo-alim-wrap" class="hidden cma-custo-subform"><div class="cma-custo-duas-colunas"><div><label class="cma-custo-label" for="cma-custo-alim">Média mensal de alimentação</label><div class="cma-custo-money"><span>R$</span><input id="cma-custo-alim" type="number" min="0" step="0.01" value="0"></div></div><div><label class="cma-custo-label" for="cma-custo-alim-percentual">Participação do empregado</label><div class="cma-custo-percentual"><input id="cma-custo-alim-percentual" type="number" min="0" max="20" step="0.01" value="20"><span>%</span></div></div></div><small class="cma-custo-ajuda">Informe o percentual praticado pela empresa, limitado a 20% nesta estimativa.</small></div>

          <label class="cma-custo-label" for="cma-custo-plano">Plano de saúde mensal <small>(opcional)</small></label>
          <div class="cma-custo-money"><span>R$</span><input id="cma-custo-plano" type="number" min="0" step="0.01" value="0"></div>
          <label class="cma-custo-label" for="cma-custo-outros">Outros benefícios mensais <small>(opcional)</small></label>
          <div class="cma-custo-money"><span>R$</span><input id="cma-custo-outros" type="number" min="0" step="0.01" value="0"></div>
        </div>

        <div class="cma-custo-resultados">
          <div class="cma-custo-resumo"><span id="cma-custo-regime-label">Optante pelo Simples Nacional</span><small>Custo efetivo mensal estimado</small><strong id="cma-custo-total">R$ 0,00</strong><em id="cma-custo-percentual">Informe o salário para calcular</em></div>
          <div class="cma-custo-card"><h4>2. Desembolso mensal</h4><div id="cma-custo-desembolso"></div></div>
          <div class="cma-custo-card">
            <div class="cma-custo-card-head"><h4>3. Provisões mensais</h4><button type="button" class="cma-custo-formula-btn" onclick="toggleExplainer('exp-custo-calculo')">Como é feito o cálculo?</button></div>
            <div id="exp-custo-calculo" class="hidden cma-custo-formulas">
              <div><strong>Base remuneratória:</strong> salário + comissão + DSR da comissão + gratificação salarial + adicional ocupacional informado. Essa base é utilizada no FGTS, nos encargos da estimativa e nas provisões.</div>
              <div><strong>DSR sobre comissão:</strong> comissões ÷ dias úteis × domingos e feriados. As quantidades são preenchidas automaticamente conforme a competência e o calendário do Manual.</div>
              <div><strong>Periculosidade:</strong> 30% do salário base, sem acrescentar gratificação ou comissão à base.</div>
              <div><strong>Insalubridade:</strong> base informada × grau selecionado (10%, 20% ou 40%). A base deve ser confirmada conforme a regra aplicável.</div>
              <div><strong>Férias:</strong> base remuneratória estimada ÷ 12. O valor representa uma provisão mensal.</div>
              <div><strong>1/3 de férias:</strong> valor mensal das férias ÷ 3.</div>
              <div><strong>13º salário:</strong> base remuneratória estimada ÷ 12.</div>
              <div><strong>FGTS:</strong> aplicação de 8% sobre as parcelas consideradas na estimativa.</div>
              <div><strong>Aviso-prévio:</strong> base remuneratória estimada ÷ 12, utilizado como provisão mensal.</div>
              <div><strong>Multa do FGTS:</strong> aplica a opção selecionada (40%, 20% ou sem provisão) sobre os valores de FGTS considerados pela calculadora.</div>
              <div><strong>Vale-transporte:</strong> do valor médio mensal informado é descontado o percentual escolhido, limitado a 6% do salário base e ao próprio valor do benefício.</div>
              <div><strong>Vale-alimentação / refeição:</strong> do valor médio mensal informado é descontado o percentual escolhido, limitado a 20% nesta estimativa, ficando o restante como custo da empresa.</div>
              <div><strong>Encargos patronais:</strong> CPP de 20% quando aplicável + RAT do CNAE ajustado pelo FAP + terceiros informados. O aviso-prévio indenizado não compõe essa base patronal.</div>
            </div>
            <div id="cma-custo-provisoes"></div>
          </div>
        </div>
      </div>
      <div class="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm mt-4"><strong class="text-amber-900 block mb-1">Importante</strong><p class="text-amber-950 text-sm leading-relaxed">Os valores apresentados são apenas uma <strong>estimativa para planejamento</strong>. O custo efetivo do empregado pode variar conforme o enquadramento tributário da empresa, atividade exercida, alíquotas aplicáveis, benefícios concedidos, normas coletivas, condições contratuais e demais particularidades de cada caso. Para decisões definitivas, os valores devem ser analisados conforme a realidade da empresa e do empregado.</p></div>`;

    const cronogramaSec=document.getElementById('cronograma');
    if(cronogramaSec)main.insertBefore(section,cronogramaSec);else main.appendChild(section);
    if(typeof manualSections!=='undefined'&&!manualSections.some(x=>x.id==='custo-empregado')){
      const pos=manualSections.findIndex(x=>x.id==='cronograma');
      manualSections.splice(pos>=0?pos:manualSections.length,0,{id:'custo-empregado',nome:'Custo do Empregado'});
    }

    const style=document.createElement('style');style.id='cma-custo-style';style.textContent=`
      .cma-custo-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:18px}.cma-custo-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 6px 18px rgba(15,23,42,.05)}.cma-custo-card h4{margin:0 0 16px;color:#172554;font-size:17px;font-weight:800}.cma-custo-card-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.cma-custo-card-head h4{margin:0}.cma-custo-formula-btn{padding:7px 10px;border:1px solid #bfdbfe;border-radius:8px;background:#eff6ff;color:#1e3a8a;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap}.cma-custo-formula-btn:hover{background:#dbeafe}.cma-custo-formulas{margin:0 0 14px;padding:13px 14px;border-left:4px solid #2563eb;border-radius:0 10px 10px 0;background:#f8fafc;color:#475569;font-size:12.5px;line-height:1.55}.cma-custo-formulas>div+div{margin-top:8px}.cma-custo-formulas strong{color:#172554}.cma-custo-label{display:block;margin:14px 0 6px;color:#334155;font-size:14px;font-weight:700}.cma-custo-label small{font-weight:500;color:#94a3b8}.cma-custo-money,.cma-custo-percentual{display:flex;align-items:center;border:1px solid #cbd5e1;border-radius:9px;background:#fff;overflow:hidden}.cma-custo-money span,.cma-custo-percentual span{padding:11px 10px;background:#f8fafc;border-right:1px solid #e2e8f0;color:#64748b;font-weight:700}.cma-custo-money input,.cma-custo-percentual input{width:100%;padding:11px 12px;outline:none;color:#0f172a;font-size:16px}.cma-custo-money:focus-within,.cma-custo-percentual:focus-within{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.cma-custo-number,.cma-custo-select{width:100%;padding:11px 12px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#0f172a;font-size:15px;outline:none}.cma-custo-number[readonly]{background:#eef2f7;color:#475569;font-weight:800;cursor:default}.cma-custo-number:focus,.cma-custo-select:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.cma-custo-segmentado{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cma-custo-segmentado-tres{grid-template-columns:repeat(3,1fr);margin-top:9px}.cma-custo-segmentado input,.cma-custo-simnao input{position:absolute;opacity:0}.cma-custo-segmentado span,.cma-custo-simnao span{display:flex;align-items:center;justify-content:center;padding:10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#475569;font-size:13px;font-weight:700;cursor:pointer;text-align:center}.cma-custo-segmentado input:checked+span,.cma-custo-simnao input:checked+span{background:#172554;color:#fff;border-color:#172554}.cma-custo-pergunta{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px;padding-top:16px;border-top:1px solid #eef2f7;color:#334155}.cma-custo-pergunta-bloco{display:block}.cma-custo-pergunta strong{display:block;font-size:14px}.cma-custo-pergunta small{display:block;margin-top:2px;color:#94a3b8;font-size:12px}.cma-custo-simnao{display:grid;grid-template-columns:58px 58px;gap:6px;flex:0 0 auto}.cma-custo-subform{margin-top:10px;padding:12px 13px;border:1px solid #dbe5f1;border-radius:10px;background:#f8fafc}.cma-custo-subform .cma-custo-label{margin-top:0}.cma-custo-duas-colunas{display:grid;grid-template-columns:1fr 1fr;gap:10px}.cma-custo-duas-colunas>div{display:flex;flex-direction:column}.cma-custo-duas-colunas>div>.cma-custo-money,.cma-custo-duas-colunas>div>.cma-custo-percentual{margin-top:auto}.cma-custo-ajuda{display:block;margin-top:8px;color:#64748b;font-size:11.5px;line-height:1.45}.cma-custo-resultado-campo{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px;padding:9px 10px;border-radius:8px;background:#eaf2ff;color:#334155;font-size:12px}.cma-custo-resultado-campo strong{color:#172554;text-align:right}.cma-custo-resultados{display:flex;flex-direction:column;gap:14px}.cma-custo-resumo{padding:22px;border-radius:14px;background:linear-gradient(135deg,#061a46,#082f7d);color:#fff;box-shadow:0 10px 28px rgba(8,47,125,.18)}.cma-custo-resumo>span{display:block;color:#bfdbfe;font-size:12px;font-weight:700}.cma-custo-resumo small{display:block;margin-top:11px;color:#dbeafe;font-size:13px}.cma-custo-resumo strong{display:block;margin-top:3px;font-size:34px;line-height:1.15}.cma-custo-resumo em{display:block;margin-top:6px;color:#fbbf24;font-size:12px;font-style:normal;font-weight:700}.cma-custo-linha{display:flex;justify-content:space-between;gap:18px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#475569;font-size:13px}.cma-custo-linha span{max-width:72%}.cma-custo-linha strong{color:#1e293b;white-space:nowrap}.cma-custo-desconto strong{color:#b91c1c}.cma-custo-sub{padding-left:12px;background:#f8fafc}.cma-custo-total-linha{margin-top:4px;padding-top:12px;border-top:2px solid #dbeafe;border-bottom:0;font-weight:800;color:#172554}.cma-custo-total-linha strong{color:#172554;font-size:14px}@media(max-width:800px){.cma-custo-grid{grid-template-columns:1fr}.cma-custo-card{padding:15px}.cma-custo-card-head{align-items:flex-start;flex-direction:column}.cma-custo-formula-btn{width:100%;font-size:13px}.cma-custo-formulas{font-size:14px}.cma-custo-segmentado{grid-template-columns:1fr}.cma-custo-segmentado-tres{grid-template-columns:1fr}.cma-custo-pergunta{align-items:flex-start;flex-direction:column}.cma-custo-simnao{width:100%;grid-template-columns:1fr 1fr}.cma-custo-duas-colunas{grid-template-columns:1fr}.cma-custo-number,.cma-custo-select,.cma-custo-percentual input{font-size:16px}.cma-custo-resultado-campo{align-items:flex-start;flex-direction:column}.cma-custo-resultado-campo strong{text-align:left}.cma-custo-resumo strong{font-size:30px}.cma-custo-linha{font-size:14px;line-height:1.45}.cma-custo-linha span{max-width:68%}}`;
    document.head.appendChild(style);

    section.querySelectorAll('input:not(#cma-custo-competencia)').forEach(i=>i.addEventListener('input',()=>{if(i.id==='cma-custo-cnae'){i.value=formatarCnae(i.value);}recalcular();}));
    section.querySelectorAll('input[type="radio"]').forEach(i=>i.addEventListener('change',recalcular));
    section.querySelectorAll('select').forEach(i=>i.addEventListener('change',recalcular));
    const competencia=section.querySelector('#cma-custo-competencia');
    if(competencia){competencia.value=competenciaAtual();competencia.addEventListener('change',preencherCalendario);preencherCalendario();}else recalcular();
    if(window.location.hash==='#custo-empregado')setTimeout(()=>showSection('custo-empregado',botao),60);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criar);else criar();
})();
