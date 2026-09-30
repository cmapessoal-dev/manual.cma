(function(){
  function moeda(v){return (Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function numero(id){const el=document.getElementById(id);if(!el)return 0;const n=parseFloat(String(el.value||'0').replace(',','.'));return isNaN(n)?0:n;}
  function sim(id){const el=document.querySelector(`input[name="${id}"]:checked`);return el&&el.value==='sim';}
  function opcao(id,padrao=''){const el=document.querySelector(`input[name="${id}"]:checked`);return el?el.value:padrao;}

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

    const vtBruto=d.temVT?Math.max(0,Number(d.vtBruto)||0):0;
    const descontoVT=d.temVT?Math.min(vtBruto,salario*0.06):0;
    const custoVT=Math.max(0,vtBruto-descontoVT);
    const alimBruto=d.temAlim?Math.max(0,Number(d.alimBruto)||0):0;
    const descontoAlim=d.temAlim?alimBruto*0.20:0;
    const custoAlim=Math.max(0,alimBruto-descontoAlim);
    const plano=Math.max(0,Number(d.plano)||0);
    const outros=Math.max(0,Number(d.outros)||0);

    const fgtsRemuneracao=remuneracao*0.08;
    const encargosFolha=d.regime==='nao-simples'?remuneracao*0.28:0;
    const desembolso=remuneracao+custoVT+custoAlim+plano+outros+fgtsRemuneracao+encargosFolha;
    const ferias=remuneracao/12;
    const terco=ferias/3;
    const fgtsFerias=(ferias+terco)*0.08;
    const decimo=remuneracao/12;
    const fgtsDecimo=decimo*0.08;
    const aviso=remuneracao/12;
    const fgtsAviso=aviso*0.08;
    const multaFgts=(fgtsRemuneracao+fgtsFerias+fgtsDecimo+fgtsAviso)*0.50;
    const encargosProv=d.regime==='nao-simples'?(ferias+terco+decimo+aviso)*0.28:0;
    const provisoes=ferias+terco+fgtsFerias+decimo+fgtsDecimo+aviso+fgtsAviso+multaFgts+encargosProv;
    return {salario,comissao,diasUteis,diasDsr,dsrComissao,gratificacao,periculosidade,insalubridade,remuneracao,vtBruto,descontoVT,custoVT,alimBruto,descontoAlim,custoAlim,plano,outros,fgtsRemuneracao,encargosFolha,desembolso,ferias,terco,fgtsFerias,decimo,fgtsDecimo,aviso,fgtsAviso,multaFgts,encargosProv,provisoes,total:desembolso+provisoes};
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
    const v=calcularValores({regime,salario,comissao:temComissao?numero('cma-custo-comissao'):0,diasUteis:numero('cma-custo-dias-uteis'),diasDsr:numero('cma-custo-dias-dsr'),gratificacao:temGratificacao?numero('cma-custo-gratificacao'):0,risco,grauInsalubridade:grauEl?grauEl.value:0,baseInsalubridade:numero('cma-custo-insal-base'),temVT,vtBruto:numero('cma-custo-vt'),temAlim,alimBruto:numero('cma-custo-alim'),plano:numero('cma-custo-plano'),outros:numero('cma-custo-outros')});

    const reg=document.getElementById('cma-custo-regime-label');
    if(reg)reg.textContent=regime==='simples'?'Optante pelo Simples Nacional':'Não optante pelo Simples Nacional';

    const caixa=document.getElementById('cma-custo-desembolso');
    if(caixa)caixa.innerHTML=
      linha('Salário base',v.salario)+
      (v.comissao?linha('Comissões',v.comissao):'')+
      (v.comissao?linha('DSR sobre comissões',v.dsrComissao):'')+
      (v.gratificacao?linha('Gratificação mensal',v.gratificacao):'')+
      (v.periculosidade?linha('Adicional de periculosidade (30%)',v.periculosidade):'')+
      (v.insalubridade?linha(`Adicional de insalubridade (${grauEl?grauEl.value:0}%)`,v.insalubridade):'')+
      (v.remuneracao!==v.salario?linha('Base remuneratória estimada',v.remuneracao,'cma-custo-sub'):'')+
      (temAlim?linha('Vale-alimentação / refeição — valor informado',v.alimBruto)+linha('(-) Participação do empregado',-v.descontoAlim,'cma-custo-desconto')+linha('Custo do benefício para a empresa',v.custoAlim,'cma-custo-sub'):'')+
      (temVT?linha('Vale-transporte — valor informado',v.vtBruto)+linha('(-) Desconto do empregado',-v.descontoVT,'cma-custo-desconto')+linha('Custo do VT para a empresa',v.custoVT,'cma-custo-sub'):'')+
      (v.plano?linha('Plano de saúde',v.plano):'')+
      (v.outros?linha('Outros benefícios',v.outros):'')+
      linha('FGTS sobre remuneração',v.fgtsRemuneracao)+
      (regime==='nao-simples'?linha('INSS + SAT + Terceiros sobre remuneração',v.encargosFolha):'')+
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
      linha('Provisão da multa do FGTS',v.multaFgts)+
      (regime==='nao-simples'?linha('INSS + SAT + Terceiros sobre provisões',v.encargosProv):'')+
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
        <p><strong>Não optante pelo Simples:</strong> para esta simulação, são considerados encargos de INSS patronal, SAT e Terceiros conforme a premissa utilizada na calculadora.</p>
      </div>

      <div class="cma-custo-grid">
        <div class="cma-custo-card cma-custo-form">
          <h4>1. Dados para o cálculo</h4>
          <label class="cma-custo-label">Regime da empresa</label>
          <div class="cma-custo-segmentado">
            <label><input type="radio" name="cma-regime" value="simples" checked><span>Optante pelo Simples</span></label>
            <label><input type="radio" name="cma-regime" value="nao-simples"><span>Não optante pelo Simples</span></label>
          </div>

          <label class="cma-custo-label" for="cma-custo-salario">Salário base</label>
          <div class="cma-custo-money"><span>R$</span><input id="cma-custo-salario" type="number" min="0" step="0.01" value="0"></div>

          <div class="cma-custo-pergunta"><div><strong>Recebe comissão?</strong><small>A comissão e o DSR calculado integram a remuneração da estimativa.</small></div><div class="cma-custo-simnao"><label><input type="radio" name="cma-comissao" value="nao" checked><span>Não</span></label><label><input type="radio" name="cma-comissao" value="sim"><span>Sim</span></label></div></div>
          <div id="cma-custo-comissao-wrap" class="hidden cma-custo-subform">
            <label class="cma-custo-label" for="cma-custo-comissao">Comissões do mês</label>
            <div class="cma-custo-money"><span>R$</span><input id="cma-custo-comissao" type="number" min="0" step="0.01" value="0"></div>
            <div class="cma-custo-duas-colunas">
              <div><label class="cma-custo-label" for="cma-custo-dias-uteis">Dias úteis do mês</label><input id="cma-custo-dias-uteis" class="cma-custo-number" type="number" min="0" max="31" step="1" value="26"></div>
              <div><label class="cma-custo-label" for="cma-custo-dias-dsr">Domingos e feriados</label><input id="cma-custo-dias-dsr" class="cma-custo-number" type="number" min="0" max="31" step="1" value="4"></div>
            </div>
            <small class="cma-custo-ajuda">Nos dias úteis, considere também os sábados trabalháveis. DSR = comissões ÷ dias úteis × domingos e feriados.</small>
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
          <div id="cma-custo-vt-wrap" class="hidden"><label class="cma-custo-label" for="cma-custo-vt">Média mensal de vale-transporte</label><div class="cma-custo-money"><span>R$</span><input id="cma-custo-vt" type="number" min="0" step="0.01" value="0"></div></div>

          <div class="cma-custo-pergunta"><div><strong>Vale-alimentação / refeição?</strong><small>Se sim, informe a média mensal depositada.</small></div><div class="cma-custo-simnao"><label><input type="radio" name="cma-alim" value="nao" checked><span>Não</span></label><label><input type="radio" name="cma-alim" value="sim"><span>Sim</span></label></div></div>
          <div id="cma-custo-alim-wrap" class="hidden"><label class="cma-custo-label" for="cma-custo-alim">Média mensal de alimentação</label><div class="cma-custo-money"><span>R$</span><input id="cma-custo-alim" type="number" min="0" step="0.01" value="0"></div></div>

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
              <div><strong>DSR sobre comissão:</strong> comissões ÷ dias úteis × quantidade de domingos e feriados informada.</div>
              <div><strong>Periculosidade:</strong> 30% do salário base, sem acrescentar gratificação ou comissão à base.</div>
              <div><strong>Insalubridade:</strong> base informada × grau selecionado (10%, 20% ou 40%). A base deve ser confirmada conforme a regra aplicável.</div>
              <div><strong>Férias:</strong> base remuneratória estimada ÷ 12. O valor representa uma provisão mensal.</div>
              <div><strong>1/3 de férias:</strong> valor mensal das férias ÷ 3.</div>
              <div><strong>13º salário:</strong> base remuneratória estimada ÷ 12.</div>
              <div><strong>FGTS:</strong> aplicação de 8% sobre as parcelas consideradas na estimativa.</div>
              <div><strong>Aviso-prévio:</strong> base remuneratória estimada ÷ 12, utilizado como provisão mensal.</div>
              <div><strong>Multa do FGTS:</strong> nesta estimativa, é formada pela aplicação de 50% sobre os valores de FGTS considerados pela calculadora.</div>
              <div><strong>Vale-transporte:</strong> do valor médio mensal informado é descontada a participação do empregado, calculada em até 6% do salário base e limitada ao próprio valor do benefício.</div>
              <div><strong>Vale-alimentação / refeição:</strong> do valor médio mensal informado é descontada a participação de 20%, ficando o restante como custo estimado da empresa.</div>
              <div><strong>Empresa não optante pelo Simples:</strong> a simulação considera 28% para INSS patronal, SAT e Terceiros sobre as parcelas previstas no cálculo.</div>
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
      .cma-custo-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:18px}.cma-custo-card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px;box-shadow:0 6px 18px rgba(15,23,42,.05)}.cma-custo-card h4{margin:0 0 16px;color:#172554;font-size:17px;font-weight:800}.cma-custo-card-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.cma-custo-card-head h4{margin:0}.cma-custo-formula-btn{padding:7px 10px;border:1px solid #bfdbfe;border-radius:8px;background:#eff6ff;color:#1e3a8a;font-size:12px;font-weight:800;cursor:pointer;white-space:nowrap}.cma-custo-formula-btn:hover{background:#dbeafe}.cma-custo-formulas{margin:0 0 14px;padding:13px 14px;border-left:4px solid #2563eb;border-radius:0 10px 10px 0;background:#f8fafc;color:#475569;font-size:12.5px;line-height:1.55}.cma-custo-formulas>div+div{margin-top:8px}.cma-custo-formulas strong{color:#172554}.cma-custo-label{display:block;margin:14px 0 6px;color:#334155;font-size:14px;font-weight:700}.cma-custo-label small{font-weight:500;color:#94a3b8}.cma-custo-money{display:flex;align-items:center;border:1px solid #cbd5e1;border-radius:9px;background:#fff;overflow:hidden}.cma-custo-money span{padding:11px 10px;background:#f8fafc;border-right:1px solid #e2e8f0;color:#64748b;font-weight:700}.cma-custo-money input{width:100%;padding:11px 12px;outline:none;color:#0f172a;font-size:16px}.cma-custo-money:focus-within{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.cma-custo-number,.cma-custo-select{width:100%;padding:11px 12px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#0f172a;font-size:15px;outline:none}.cma-custo-number:focus,.cma-custo-select:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.cma-custo-segmentado{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cma-custo-segmentado-tres{grid-template-columns:repeat(3,1fr);margin-top:9px}.cma-custo-segmentado input,.cma-custo-simnao input{position:absolute;opacity:0}.cma-custo-segmentado span,.cma-custo-simnao span{display:flex;align-items:center;justify-content:center;padding:10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#475569;font-size:13px;font-weight:700;cursor:pointer;text-align:center}.cma-custo-segmentado input:checked+span,.cma-custo-simnao input:checked+span{background:#172554;color:#fff;border-color:#172554}.cma-custo-pergunta{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:18px;padding-top:16px;border-top:1px solid #eef2f7;color:#334155}.cma-custo-pergunta-bloco{display:block}.cma-custo-pergunta strong{display:block;font-size:14px}.cma-custo-pergunta small{display:block;margin-top:2px;color:#94a3b8;font-size:12px}.cma-custo-simnao{display:grid;grid-template-columns:58px 58px;gap:6px;flex:0 0 auto}.cma-custo-subform{margin-top:10px;padding:12px 13px;border:1px solid #dbe5f1;border-radius:10px;background:#f8fafc}.cma-custo-subform .cma-custo-label{margin-top:0}.cma-custo-duas-colunas{display:grid;grid-template-columns:1fr 1fr;gap:10px}.cma-custo-ajuda{display:block;margin-top:8px;color:#64748b;font-size:11.5px;line-height:1.45}.cma-custo-resultado-campo{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px;padding:9px 10px;border-radius:8px;background:#eaf2ff;color:#334155;font-size:12px}.cma-custo-resultado-campo strong{color:#172554;text-align:right}.cma-custo-resultados{display:flex;flex-direction:column;gap:14px}.cma-custo-resumo{padding:22px;border-radius:14px;background:linear-gradient(135deg,#061a46,#082f7d);color:#fff;box-shadow:0 10px 28px rgba(8,47,125,.18)}.cma-custo-resumo>span{display:block;color:#bfdbfe;font-size:12px;font-weight:700}.cma-custo-resumo small{display:block;margin-top:11px;color:#dbeafe;font-size:13px}.cma-custo-resumo strong{display:block;margin-top:3px;font-size:34px;line-height:1.15}.cma-custo-resumo em{display:block;margin-top:6px;color:#fbbf24;font-size:12px;font-style:normal;font-weight:700}.cma-custo-linha{display:flex;justify-content:space-between;gap:18px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#475569;font-size:13px}.cma-custo-linha span{max-width:72%}.cma-custo-linha strong{color:#1e293b;white-space:nowrap}.cma-custo-desconto strong{color:#b91c1c}.cma-custo-sub{padding-left:12px;background:#f8fafc}.cma-custo-total-linha{margin-top:4px;padding-top:12px;border-top:2px solid #dbeafe;border-bottom:0;font-weight:800;color:#172554}.cma-custo-total-linha strong{color:#172554;font-size:14px}@media(max-width:800px){.cma-custo-grid{grid-template-columns:1fr}.cma-custo-card{padding:15px}.cma-custo-card-head{align-items:flex-start;flex-direction:column}.cma-custo-formula-btn{width:100%;font-size:13px}.cma-custo-formulas{font-size:14px}.cma-custo-segmentado{grid-template-columns:1fr}.cma-custo-segmentado-tres{grid-template-columns:1fr}.cma-custo-pergunta{align-items:flex-start;flex-direction:column}.cma-custo-simnao{width:100%;grid-template-columns:1fr 1fr}.cma-custo-duas-colunas{grid-template-columns:1fr}.cma-custo-number,.cma-custo-select{font-size:16px}.cma-custo-resultado-campo{align-items:flex-start;flex-direction:column}.cma-custo-resultado-campo strong{text-align:left}.cma-custo-resumo strong{font-size:30px}.cma-custo-linha{font-size:14px;line-height:1.45}.cma-custo-linha span{max-width:68%}}`;
    document.head.appendChild(style);

    section.querySelectorAll('input').forEach(i=>i.addEventListener('input',recalcular));
    section.querySelectorAll('input[type="radio"]').forEach(i=>i.addEventListener('change',recalcular));
    section.querySelectorAll('select').forEach(i=>i.addEventListener('change',recalcular));
    recalcular();
    if(window.location.hash==='#custo-empregado')setTimeout(()=>showSection('custo-empregado',botao),60);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criar);else criar();
})();
