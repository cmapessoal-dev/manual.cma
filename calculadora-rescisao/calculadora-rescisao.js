(function(){
  if(window.CMACalculadoraRescisao)return;

  function arredondar(valor){return Math.round((Number(valor)||0)*100)/100;}
  function limitar(valor,min,max){return Math.min(max,Math.max(min,Number(valor)||0));}
  function moeda(valor){return (Number(valor)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function numero(id){const el=document.getElementById(id),n=parseFloat(String(el?.value||'0').replace(',','.'));return Number.isFinite(n)?n:0;}
  function data(valor){if(!/^\d{4}-\d{2}-\d{2}$/.test(valor||''))return null;const [a,m,d]=valor.split('-').map(Number),r=new Date(a,m-1,d);return r.getFullYear()===a&&r.getMonth()===m-1&&r.getDate()===d?r:null;}
  function diasInclusivos(inicio,fim){return Math.floor((Date.UTC(fim.getFullYear(),fim.getMonth(),fim.getDate())-Date.UTC(inicio.getFullYear(),inicio.getMonth(),inicio.getDate()))/86400000)+1;}
  function maiorData(a,b){return a>b?a:b;}
  function menorData(a,b){return a<b?a:b;}
  function somarMesAncorado(inicio,quantidade){const alvo=new Date(inicio.getFullYear(),inicio.getMonth()+quantidade,1),ultimo=new Date(alvo.getFullYear(),alvo.getMonth()+1,0).getDate();alvo.setDate(Math.min(inicio.getDate(),ultimo));return alvo;}
  function anosCompletos(admissao,desligamento){
    const adm=data(admissao),des=data(desligamento);if(!adm||!des||adm>des)return 0;
    let anos=des.getFullYear()-adm.getFullYear();
    if(des.getMonth()<adm.getMonth()||(des.getMonth()===adm.getMonth()&&des.getDate()<adm.getDate()))anos--;
    return Math.max(0,anos);
  }
  function diasAvisoAutomaticos(admissao,desligamento,modalidade){
    if(modalidade==='pedido')return 30;
    if(!['sem_justa','acordo'].includes(modalidade))return 0;
    return Math.min(90,30+3*anosCompletos(admissao,desligamento));
  }
  function contarAvosDecimo(admissao,desligamento){
    const adm=data(admissao),des=data(desligamento);if(!adm||!des||adm>des)return 0;let avos=0;
    for(let mes=0;mes<12;mes++){const inicio=maiorData(adm,new Date(des.getFullYear(),mes,1)),fim=menorData(des,new Date(des.getFullYear(),mes+1,0));if(inicio<=fim&&diasInclusivos(inicio,fim)>=15)avos++;}
    return avos;
  }
  function contarAvosFerias(inicioPeriodo,desligamento){
    const inicio=data(inicioPeriodo),des=data(desligamento);if(!inicio||!des||inicio>des)return 0;let avos=0,proximo=inicio;
    while(avos<12){const fimMes=new Date(somarMesAncorado(inicio,avos+1));fimMes.setDate(fimMes.getDate()-1);if(des<fimMes)break;avos++;proximo=somarMesAncorado(inicio,avos);}
    if(avos<12&&proximo<=des&&diasInclusivos(proximo,des)>=15)avos++;
    return avos;
  }
  function calcularAutomaticos({admissao='',desligamento='',inicioFerias=''}={}){
    const adm=data(admissao),des=data(desligamento);let diasSaldo=0;
    if(adm&&des&&adm<=des){const inicioMes=maiorData(adm,new Date(des.getFullYear(),des.getMonth(),1));diasSaldo=Math.min(30,diasInclusivos(inicioMes,des));}
    return {diasSaldo,avosDecimo:contarAvosDecimo(admissao,desligamento),avosFerias:contarAvosFerias(inicioFerias,desligamento)};
  }
  function calcularBase({salario=0,medias=0,diasSaldo=0,avosFerias=0,periodosVencidos=0,avosDecimo=0,diasAviso=0}={}){
    const remuneracao=arredondar(Math.max(0,Number(salario)||0)+Math.max(0,Number(medias)||0));
    const saldoSalario=arredondar(Math.max(0,Number(salario)||0)/30*limitar(diasSaldo,0,30));
    const feriasProporcionais=arredondar(remuneracao/12*limitar(avosFerias,0,12));
    const feriasVencidas=arredondar(remuneracao*Math.floor(limitar(periodosVencidos,0,10)));
    const tercoFerias=arredondar((feriasProporcionais+feriasVencidas)/3);
    const decimoTerceiro=arredondar(remuneracao/12*limitar(avosDecimo,0,12));
    const avisoPrevio=arredondar(remuneracao/30*limitar(diasAviso,0,90));
    const totalBruto=arredondar(saldoSalario+feriasProporcionais+feriasVencidas+tercoFerias+decimoTerceiro+avisoPrevio);
    return {remuneracao,saldoSalario,feriasProporcionais,feriasVencidas,tercoFerias,decimoTerceiro,avisoPrevio,totalBruto};
  }
  function calcularPorModalidade({modalidade='sem_justa',formaAviso='indenizado',salario=0,medias=0,diasSaldo=0,avosFerias=0,periodosVencidos=0,avosDecimo=0,diasAviso=0,desligamento='',fimContrato=''}={}){
    const incluiProporcionais=modalidade!=='justa_causa';
    const base=calcularBase({salario,medias,diasSaldo,avosFerias:incluiProporcionais?avosFerias:0,periodosVencidos,avosDecimo:incluiProporcionais?avosDecimo:0,diasAviso:0});
    let avisoPrevio=0,descontoAviso=0,indenizacao479=0,diasRestantes=0;
    const valorAviso=arredondar(base.remuneracao/30*limitar(diasAviso,0,90));
    if(modalidade==='sem_justa'&&formaAviso==='indenizado')avisoPrevio=valorAviso;
    if(modalidade==='acordo'&&formaAviso==='indenizado')avisoPrevio=arredondar(valorAviso/2);
    if(modalidade==='pedido'&&formaAviso==='nao_cumprido')descontoAviso=arredondar(base.remuneracao);
    const des=data(desligamento),fim=data(fimContrato);
    if(modalidade==='antecipada_empregador'&&des&&fim&&fim>des){
      diasRestantes=diasInclusivos(new Date(des.getFullYear(),des.getMonth(),des.getDate()+1),fim);
      indenizacao479=arredondar(base.remuneracao/30*diasRestantes/2);
    }
    const totalProventos=arredondar(base.totalBruto+avisoPrevio+indenizacao479);
    const totalBruto=arredondar(totalProventos-descontoAviso);
    return {...base,avisoPrevio,indenizacao479,descontoAviso,diasRestantes,totalProventos,totalBruto};
  }
  const MODALIDADES={
    sem_justa:{titulo:'Dispensa sem justa causa',texto:'Inclui saldo, férias vencidas e proporcionais com 1/3, 13º proporcional e aviso-prévio conforme a forma escolhida.'},
    pedido:{titulo:'Pedido de demissão',texto:'Inclui saldo, férias vencidas e proporcionais com 1/3 e 13º proporcional. Se o aviso não for cumprido, o simulador apresenta o desconto de 30 dias.'},
    justa_causa:{titulo:'Dispensa por justa causa',texto:'Nesta modalidade, o cálculo inclui saldo de salário e férias vencidas com 1/3. Férias proporcionais, 13º proporcional e aviso-prévio não entram.'},
    termino_prazo:{titulo:'Término normal de contrato a prazo',texto:'Inclui saldo, férias vencidas e proporcionais com 1/3 e 13º proporcional. Não há aviso-prévio nem indenização do art. 479.'},
    antecipada_empregador:{titulo:'Rescisão antecipada pelo empregador',texto:'Além das verbas proporcionais, calcula metade da remuneração correspondente aos dias que faltavam até o fim do contrato, conforme o art. 479 da CLT.'},
    antecipada_empregado:{titulo:'Rescisão antecipada pelo empregado',texto:'Apura as verbas proporcionais. Eventual indenização do art. 480 não é descontada automaticamente, pois depende da comprovação de prejuízo pelo empregador.'},
    acordo:{titulo:'Rescisão por mútuo acordo',texto:'Inclui as verbas gerais e, quando o aviso for indenizado, calcula metade do valor do aviso-prévio.'}
  };
  function linha(rotulo,valor,classe=''){return `<div class="cma-res-linha ${classe}"><span>${rotulo}</span><strong>${moeda(valor)}</strong></div>`;}
  function recalcular(){
    const modalidade=document.getElementById('cma-res-modalidade')?.value||'sem_justa';
    atualizarCamposModalidade(modalidade);
    const formaAviso=document.getElementById('cma-res-forma-aviso')?.value||'indenizado';
    const automaticos=calcularAutomaticos({admissao:document.getElementById('cma-res-admissao')?.value||'',desligamento:document.getElementById('cma-res-desligamento')?.value||'',inicioFerias:document.getElementById('cma-res-inicio-ferias')?.value||''});
    const diasAviso=diasAvisoAutomaticos(document.getElementById('cma-res-admissao')?.value||'',document.getElementById('cma-res-desligamento')?.value||'',modalidade);
    [['cma-res-dias-saldo',automaticos.diasSaldo],['cma-res-avos-ferias',automaticos.avosFerias],['cma-res-avos-decimo',automaticos.avosDecimo],['cma-res-dias-aviso',diasAviso]].forEach(([id,valor])=>{const el=document.getElementById(id);if(el)el.value=String(valor);});
    const resultado=calcularPorModalidade({modalidade,formaAviso,salario:numero('cma-res-salario'),medias:numero('cma-res-medias'),diasSaldo:numero('cma-res-dias-saldo'),avosFerias:numero('cma-res-avos-ferias'),periodosVencidos:numero('cma-res-ferias-vencidas'),avosDecimo:numero('cma-res-avos-decimo'),diasAviso,desligamento:document.getElementById('cma-res-desligamento')?.value||'',fimContrato:document.getElementById('cma-res-fim-contrato')?.value||''});
    const total=document.getElementById('cma-res-total'),sub=document.getElementById('cma-res-resumo-sub'),verbas=document.getElementById('cma-res-verbas');
    if(total)total.textContent=moeda(resultado.totalBruto);
    if(sub)sub.textContent=`${MODALIDADES[modalidade].titulo} • remuneração-base: ${moeda(resultado.remuneracao)}`;
    if(verbas)verbas.innerHTML=linha('Saldo de salário',resultado.saldoSalario)+linha('Férias proporcionais',resultado.feriasProporcionais)+linha('Férias vencidas',resultado.feriasVencidas)+linha('Adicional de 1/3 sobre férias',resultado.tercoFerias)+linha('13º salário proporcional',resultado.decimoTerceiro)+linha('Aviso-prévio indenizado',resultado.avisoPrevio)+(modalidade==='antecipada_empregador'?linha('Indenização do art. 479',resultado.indenizacao479):'')+(resultado.descontoAviso?linha('(-) Aviso-prévio não cumprido',-resultado.descontoAviso,'cma-res-desconto'):'')+linha('Total estimado',resultado.totalBruto,'cma-res-total-linha');
    const memoria={remuneracao:resultado.remuneracao,diasSaldo:limitar(numero('cma-res-dias-saldo'),0,30),avosFerias:modalidade==='justa_causa'?0:limitar(numero('cma-res-avos-ferias'),0,12),periodos:Math.floor(limitar(numero('cma-res-ferias-vencidas'),0,10)),avosDecimo:modalidade==='justa_causa'?0:limitar(numero('cma-res-avos-decimo'),0,12),diasAviso, diasRestantes:resultado.diasRestantes};
    Object.entries(memoria).forEach(([chave,valor])=>{const el=document.getElementById(`cma-res-mem-${chave}`);if(el)el.textContent=chave==='remuneracao'?moeda(valor):String(valor);});
  }
  function atualizarCamposModalidade(modalidade){
    const aviso=document.getElementById('cma-res-bloco-aviso'),fim=document.getElementById('cma-res-bloco-fim'),select=document.getElementById('cma-res-forma-aviso'),explicacao=document.getElementById('cma-res-explicacao');
    if(aviso)aviso.hidden=!['sem_justa','pedido','acordo'].includes(modalidade);
    if(fim)fim.hidden=!['antecipada_empregador','antecipada_empregado'].includes(modalidade);
    if(select){
      const atual=select.value;
      if(modalidade==='pedido')select.innerHTML='<option value="trabalhado">Aviso trabalhado</option><option value="nao_cumprido">Aviso não cumprido</option>';
      else if(modalidade==='acordo')select.innerHTML='<option value="indenizado">Aviso indenizado pela metade</option><option value="trabalhado">Aviso trabalhado</option>';
      else select.innerHTML='<option value="indenizado">Aviso indenizado</option><option value="trabalhado">Aviso trabalhado</option>';
      if([...select.options].some(o=>o.value===atual))select.value=atual;
    }
    if(explicacao)explicacao.innerHTML=`<strong>${MODALIDADES[modalidade].titulo}</strong><p>${MODALIDADES[modalidade].texto}</p>`;
  }
  function criar(){
    const menu=document.getElementById('manual-menu'),main=document.querySelector('#manual-conteudo main');if(!menu||!main||document.getElementById('calculadora-rescisao'))return;
    const botao=document.createElement('button');botao.type='button';botao.setAttribute('onclick',"showSection('calculadora-rescisao', this)");botao.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';botao.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 mr-2.5 shrink-0"><path d="M6 2h9l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/></svg> Simulador de Rescisão';
    const anterior=typeof getMenuButton==='function'?getMenuButton('calculadora-folha'):null;if(anterior)anterior.insertAdjacentElement('afterend',botao);else menu.appendChild(botao);
    const secao=document.createElement('section');secao.id='calculadora-rescisao';secao.className='manual-section hidden fade-in cma-calculadora-padrao';secao.innerHTML=`
      <div class="cma-res-cab"><div><h3>Simulador de Rescisão</h3><p>Conferência das verbas conforme a modalidade de desligamento.</p></div></div>
      <div class="cma-res-intro"><strong>Cálculo orientado pela modalidade</strong><p>Informe o tipo de rescisão e as datas. O simulador calcula o saldo, os avos e o aviso-prévio, e inclui somente as verbas previstas para a modalidade escolhida.</p></div>
      <div class="cma-res-grid"><div class="cma-res-card cma-res-form"><h4>1. Dados para o cálculo</h4>
        <div class="cma-res-duplo"><div><label>Empresa</label><input id="cma-res-empresa" type="text" placeholder="Nome da empresa"></div><div><label>Empregado</label><input id="cma-res-empregado" type="text" placeholder="Nome do empregado"></div></div>
        <div><label>Modalidade da rescisão</label><select id="cma-res-modalidade"><option value="sem_justa">Dispensa sem justa causa</option><option value="pedido">Pedido de demissão</option><option value="justa_causa">Dispensa por justa causa</option><option value="termino_prazo">Término normal de contrato a prazo</option><option value="antecipada_empregador">Rescisão antecipada pelo empregador</option><option value="antecipada_empregado">Rescisão antecipada pelo empregado</option><option value="acordo">Rescisão por mútuo acordo</option></select></div>
        <div id="cma-res-explicacao" class="cma-res-explicacao"></div>
        <div class="cma-res-triplo"><div><label>Data de admissão</label><input id="cma-res-admissao" type="date"></div><div><label>Data do desligamento</label><input id="cma-res-desligamento" type="date"></div><div><label>Início do período aquisitivo atual</label><input id="cma-res-inicio-ferias" type="date"></div></div>
        <div class="cma-res-duplo cma-res-condicionais"><div id="cma-res-bloco-aviso"><label>Forma do aviso-prévio</label><select id="cma-res-forma-aviso"><option value="indenizado">Aviso indenizado</option><option value="trabalhado">Aviso trabalhado</option></select></div><div id="cma-res-bloco-fim" hidden><label>Data prevista para o fim do contrato</label><input id="cma-res-fim-contrato" type="date"></div></div>
        <div class="cma-res-duplo"><div><label>Salário mensal</label><div class="cma-res-money"><span>R$</span><input id="cma-res-salario" type="number" min="0" step="0.01" value="0"></div></div><div><label>Médias remuneratórias</label><div class="cma-res-money"><span>R$</span><input id="cma-res-medias" type="number" min="0" step="0.01" value="0"></div></div></div>
        <h5>Quantidades apuradas</h5>
        <div class="cma-res-triplo"><div><label>Dias de saldo de salário</label><input id="cma-res-dias-saldo" class="cma-res-calculado" type="number" value="0" readonly></div><div><label>Avos de férias proporcionais</label><input id="cma-res-avos-ferias" class="cma-res-calculado" type="number" value="0" readonly></div><div><label>Avos de 13º salário</label><input id="cma-res-avos-decimo" class="cma-res-calculado" type="number" value="0" readonly></div></div>
        <div class="cma-res-duplo"><div><label>Períodos de férias vencidas</label><input id="cma-res-ferias-vencidas" type="number" min="0" max="10" step="1" value="0"></div><div><label>Dias de aviso-prévio apurados</label><input id="cma-res-dias-aviso" class="cma-res-calculado" type="number" value="30" readonly></div></div>
      </div>
      <div class="cma-res-resultados"><div class="cma-res-resumo"><span>Total estimado antes dos encargos</span><strong id="cma-res-total">R$ 0,00</strong><em id="cma-res-resumo-sub">Dispensa sem justa causa • remuneração-base: R$ 0,00</em></div><div class="cma-res-card"><h4>2. Composição das verbas</h4><div id="cma-res-verbas"></div></div><div class="cma-res-card cma-res-memoria"><h4>3. Memória da apuração</h4><div><span>Remuneração-base</span><strong id="cma-res-mem-remuneracao">R$ 0,00</strong></div><div><span>Dias de saldo</span><strong id="cma-res-mem-diasSaldo">0</strong></div><div><span>Avos de férias</span><strong id="cma-res-mem-avosFerias">0</strong></div><div><span>Períodos vencidos</span><strong id="cma-res-mem-periodos">0</strong></div><div><span>Avos de 13º</span><strong id="cma-res-mem-avosDecimo">0</strong></div><div><span>Dias de aviso</span><strong id="cma-res-mem-diasAviso">30</strong></div><div><span>Dias restantes do contrato</span><strong id="cma-res-mem-diasRestantes">0</strong></div></div></div></div>
      <div class="cma-res-alerta"><strong>Importante</strong><p>O resultado ainda não projeta o aviso indenizado nos avos, nem calcula férias em dobro, afastamentos que alterem avos, FGTS, multa rescisória, INSS, IRRF ou regras coletivas. No término antecipado, o art. 479 considera contrato sem cláusula assecuratória; eventual desconto do art. 480 exige análise e comprovação de prejuízo. Não utilize o resultado como TRCT definitivo.</p></div>`;
    const base=document.getElementById('baselegal');if(base)main.insertBefore(secao,base);else main.appendChild(secao);
    const estilo=document.createElement('style');estilo.id='cma-res-style';estilo.textContent=`#calculadora-rescisao{--res-azul:#172554;--res-borda:#dbe3ee}.cma-res-cab{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:14px;padding-bottom:16px;border-bottom:1px solid #e2e8f0}.cma-res-cab h3{margin:0;color:var(--res-azul);font-size:26px;font-weight:850}.cma-res-cab p{margin:5px 0 0!important;color:#64748b!important;font-size:15px!important;text-align:left!important}.cma-res-intro{margin-bottom:16px;padding:13px 15px;border:1px solid #dbeafe;border-radius:10px;background:#f8fbff;color:#334155}.cma-res-intro strong{color:var(--res-azul)}.cma-res-intro p{margin:4px 0 0!important;color:#64748b!important;font-size:13px!important;text-align:left!important}.cma-res-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(360px,.95fr);gap:18px}.cma-res-card{padding:18px;border:1px solid var(--res-borda);border-radius:14px;background:#fff;box-shadow:0 6px 18px rgba(15,23,42,.05)}.cma-res-card h4{margin:0 0 14px;color:var(--res-azul);font-size:17px;font-weight:850}.cma-res-form h5{margin:19px 0 2px;padding-top:15px;border-top:1px solid #e2e8f0;color:var(--res-azul);font-size:14px}.cma-res-form label{display:block;margin:12px 0 6px;color:#334155;font-size:13px;font-weight:750}.cma-res-form input,.cma-res-form select{width:100%;min-height:43px;padding:9px 10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;box-sizing:border-box;color:#1e293b}.cma-res-form input.cma-res-calculado{background:#f1f5f9;color:#172554;font-weight:850}.cma-res-duplo,.cma-res-triplo{display:grid;gap:10px}.cma-res-duplo{grid-template-columns:1fr 1fr}.cma-res-triplo{grid-template-columns:repeat(3,1fr)}.cma-res-condicionais:has(>[hidden]){grid-template-columns:1fr}.cma-res-explicacao{margin-top:10px;padding:11px 13px;border-radius:9px;background:#f1f5f9;color:#475569}.cma-res-explicacao strong{display:block;color:var(--res-azul);font-size:13px}.cma-res-explicacao p{margin:3px 0 0!important;color:#64748b!important;font-size:12.5px!important;line-height:1.45!important;text-align:left!important}.cma-res-money{display:flex;border:1px solid #cbd5e1;border-radius:9px;overflow:hidden}.cma-res-money:focus-within{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1)}.cma-res-money span{padding:10px;background:#f8fafc;border-right:1px solid #e2e8f0;color:#64748b;font-weight:750}.cma-res-money input{min-width:0;border:0;border-radius:0;box-shadow:none!important}.cma-res-resultados{display:flex;flex-direction:column;gap:14px}.cma-res-resumo{padding:22px;border-radius:14px;background:linear-gradient(135deg,#061a46,#082f7d);color:#fff}.cma-res-resumo span{display:block;color:#bfdbfe;font-size:13px}.cma-res-resumo strong{display:block;margin-top:5px;font-size:34px;font-variant-numeric:tabular-nums}.cma-res-resumo em{display:block;margin-top:7px;color:#fbbf24;font-size:12px;font-style:normal;font-weight:750}.cma-res-linha{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#475569;font-size:13px}.cma-res-linha strong{color:#1e293b;white-space:nowrap;font-variant-numeric:tabular-nums}.cma-res-desconto strong{color:#b91c1c}.cma-res-total-linha{margin-top:5px;padding-top:12px;border-top:2px solid #dbeafe;border-bottom:0;font-weight:850}.cma-res-memoria>div{display:flex;justify-content:space-between;gap:15px;padding:8px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:12.5px}.cma-res-memoria>div:last-child{border-bottom:0}.cma-res-memoria strong{color:var(--res-azul);text-align:right}.cma-res-alerta{margin-top:16px;padding:14px 16px;border-left:4px solid #d97706;border-radius:0 9px 9px 0;background:#fffbeb;color:#78350f}.cma-res-alerta strong{display:block;margin-bottom:3px}.cma-res-alerta p{margin:0!important;color:#78350f!important;font-size:13px!important;line-height:1.55!important;text-align:left!important}@media(max-width:900px){.cma-res-grid{grid-template-columns:1fr}.cma-res-triplo{grid-template-columns:1fr 1fr}}@media(max-width:640px){.cma-res-cab h3{font-size:24px}.cma-res-duplo,.cma-res-triplo{grid-template-columns:1fr}.cma-res-form input,.cma-res-form select{font-size:16px}.cma-res-resumo strong{font-size:29px}.cma-res-linha{font-size:14px}}`;document.head.appendChild(estilo);
    secao.querySelectorAll('input,select').forEach(el=>{el.addEventListener('input',recalcular);el.addEventListener('change',recalcular);});
    if(window.CMAFerramentas)CMAFerramentas.adicionarAcoes('calculadora-rescisao',{onLimpar:()=>{['cma-res-admissao','cma-res-desligamento','cma-res-inicio-ferias','cma-res-fim-contrato'].forEach(id=>document.getElementById(id).value='');document.getElementById('cma-res-modalidade').value='sem_justa';document.getElementById('cma-res-forma-aviso').value='indenizado';recalcular();}});
    recalcular();if(window.CMAExportadorCalculadoras)CMAExportadorCalculadoras.aplicar();if(location.hash==='#calculadora-rescisao')setTimeout(()=>showSection('calculadora-rescisao',botao),80);
  }
  window.CMACalculadoraRescisao={calcularBase,calcularPorModalidade,calcularAutomaticos,contarAvosDecimo,contarAvosFerias,diasAvisoAutomaticos,recalcular,criar,versao:'0.3'};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criar);else criar();
})();
