(function(){
  if(window.CMAModalidadesRescisao)return;

  function aplicar(){
    const sec=document.getElementById('demissao');
    if(!sec||sec.querySelector('.cma-dem-modalidades'))return false;

    const lista=sec.querySelector('.cma-dem-info-lista');
    if(!lista)return false;

    const bloco=document.createElement('section');
    bloco.className='cma-dem-modalidades';
    bloco.innerHTML=`
      <div class="cma-dem-modalidades-head">
        <span>Consulta rápida</span>
        <h5>O que é devido em cada tipo de desligamento?</h5>
        <p>Use este resumo como orientação inicial. A rescisão deve ser conferida conforme o contrato, a CCT, a existência de estabilidade, a sistemática de saque do FGTS e as particularidades do caso.</p>
      </div>

      <div class="cma-dem-modalidade">
        <h6>Dispensa sem justa causa</h6>
        <p><strong>Devido:</strong> saldo de salário, aviso-prévio trabalhado ou indenizado, férias vencidas e proporcionais + 1/3, 13º proporcional e multa de 40% do FGTS.</p>
        <p><strong>FGTS:</strong> há hipótese de saque na sistemática saque-rescisão. Quem estiver no saque-aniversário deve observar as regras específicas dessa sistemática.</p>
        <p><strong>Seguro-desemprego:</strong> poderá ser devido quando preenchidos os requisitos do programa.</p>
      </div>

      <div class="cma-dem-modalidade">
        <h6>Pedido de demissão</h6>
        <p><strong>Devido:</strong> saldo de salário, férias vencidas e proporcionais + 1/3 e 13º proporcional.</p>
        <p><strong>Aviso-prévio:</strong> se o empregado não cumprir o aviso devido, o empregador poderá descontar os salários correspondentes ao prazo respectivo, observadas as particularidades do caso.</p>
        <p><strong>FGTS e seguro-desemprego:</strong> não há multa rescisória de 40%, saque por motivo rescisório nem seguro-desemprego em razão do pedido de demissão.</p>
      </div>

      <div class="cma-dem-modalidade cma-dem-modalidade-atencao">
        <h6>Dispensa por justa causa</h6>
        <p><strong>Devido:</strong> saldo de salário e férias já adquiridas + 1/3, quando houver.</p>
        <p><strong>Não são devidos, em regra:</strong> aviso-prévio, férias proporcionais, 13º proporcional, multa rescisória do FGTS, saque rescisório do FGTS e seguro-desemprego.</p>
      </div>

      <div class="cma-dem-modalidade">
        <h6>Término normal de contrato por prazo determinado</h6>
        <p><strong>Devido:</strong> saldo de salário, férias proporcionais + 1/3, férias adquiridas + 1/3 quando houver e 13º proporcional.</p>
        <p><strong>Aviso-prévio:</strong> em regra, não há, porque o término já estava previamente definido.</p>
        <p><strong>FGTS:</strong> não há multa de 40%, mas a extinção normal do contrato a termo é hipótese legal de saque do FGTS, observada a sistemática de saque aplicável.</p>
        <p><strong>Seguro-desemprego:</strong> o simples término normal do contrato por prazo determinado não gera o benefício.</p>
      </div>

      <div class="cma-dem-modalidade">
        <h6>Rescisão antecipada do contrato a prazo pelo empregador</h6>
        <p><strong>Devido:</strong> saldo de salário, férias vencidas e proporcionais + 1/3, 13º proporcional e, quando aplicável, indenização prevista no art. 479 da CLT correspondente à metade da remuneração a que o empregado teria direito até o término do contrato.</p>
        <p><strong>FGTS:</strong> a rescisão antecipada sem justa causa por iniciativa do empregador gera multa de 40%, conforme o motivo de desligamento informado ao FGTS Digital.</p>
        <p><strong>Atenção:</strong> se o contrato tiver cláusula assecuratória de rescisão antecipada, podem ser aplicadas as regras dos contratos por prazo indeterminado, nos termos do art. 481 da CLT.</p>
      </div>

      <div class="cma-dem-modalidade">
        <h6>Rescisão antecipada do contrato a prazo pelo empregado</h6>
        <p><strong>Devido ao empregado:</strong> saldo de salário, férias vencidas e proporcionais + 1/3 e 13º proporcional.</p>
        <p><strong>Possível indenização ao empregador:</strong> o art. 480 da CLT prevê indenização pelos prejuízos que a saída antecipada causar ao empregador, limitada ao valor que o empregado receberia em situação inversa. Por isso, não é correto tratar o desconto de 50% do período restante como automático em todos os casos.</p>
      </div>

      <div class="cma-dem-modalidade">
        <h6>Rescisão por acordo entre empregado e empregador</h6>
        <p><strong>Devido integralmente:</strong> saldo de salário, férias vencidas e proporcionais + 1/3 e 13º proporcional.</p>
        <p><strong>Pela metade:</strong> aviso-prévio, somente se indenizado, e indenização compensatória do FGTS, que corresponde a 20%.</p>
        <p><strong>FGTS:</strong> permite movimentação de até 80% do saldo, observadas as regras da sistemática de saque aplicável.</p>
        <p><strong>Seguro-desemprego:</strong> não é devido nessa modalidade.</p>
      </div>

      <div class="cma-dem-modalidades-nota">
        <strong>Importante:</strong> esta comparação resume as hipóteses mais comuns e não substitui a análise da CCT, de garantias provisórias de emprego, de cláusulas do contrato ou de situações especiais.
      </div>`;

    const primeiro=lista.querySelector('.cma-dem-info-item');
    if(primeiro&&primeiro.nextSibling)lista.insertBefore(bloco,primeiro.nextSibling);else lista.appendChild(bloco);
    instalarEstilo();
    return true;
  }

  function instalarEstilo(){
    if(document.getElementById('cma-dem-modalidades-style'))return;
    const st=document.createElement('style');
    st.id='cma-dem-modalidades-style';
    st.textContent=`
      #demissao .cma-dem-modalidades{padding:22px 0;border-bottom:1px solid #e2e8f0}
      #demissao .cma-dem-modalidades-head{margin-bottom:8px}
      #demissao .cma-dem-modalidades-head>span{display:block;margin-bottom:5px;color:#2563eb;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
      #demissao .cma-dem-modalidades-head h5{margin:0 0 6px;color:#172554;font-size:18px;font-weight:900}
      #demissao .cma-dem-modalidades-head p{margin:0 0 8px!important;color:#64748b!important;font-size:15px!important;line-height:1.7!important;text-align:left!important}
      #demissao .cma-dem-modalidade{padding:16px 2px;border-top:1px solid #e2e8f0}
      #demissao .cma-dem-modalidade h6{margin:0 0 7px;color:#172554;font-size:16.5px;font-weight:900}
      #demissao .cma-dem-modalidade p{margin:4px 0!important;color:#475569!important;font-size:15px!important;line-height:1.65!important;text-align:left!important}
      #demissao .cma-dem-modalidade-atencao{margin:0 -12px;padding:16px 14px;border-left:4px solid #f59e0b;background:#fffbeb}
      #demissao .cma-dem-modalidades-nota{margin-top:12px;padding:13px 14px;border-radius:10px;background:#f8fafc;color:#475569;font-size:13.5px;line-height:1.6}
      @media(max-width:700px){#demissao .cma-dem-modalidades-head h5{font-size:19px}#demissao .cma-dem-modalidades-head p,#demissao .cma-dem-modalidade p{font-size:16px!important}#demissao .cma-dem-modalidade h6{font-size:18px}#demissao .cma-dem-modalidade-atencao{margin:0 -8px;padding:15px 12px}}
    `;
    document.head.appendChild(st);
  }

  window.CMAModalidadesRescisao={aplicar};
  let tentativas=0;(function iniciar(){if(aplicar())return;if(++tentativas<60)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
  document.addEventListener('cma:navegacao-atualizada',aplicar);
})();