(function(){
  if(document.getElementById('cma-folha-alinhamento-style'))return;
  const st=document.createElement('style');
  st.id='cma-folha-alinhamento-style';
  st.textContent=`
    #calculadora-folha .cma-folha-opcao-detalhe .cma-folha-quatro,
    #calculadora-folha .cma-folha-opcao-detalhe .cma-folha-duplo,
    #calculadora-folha .cma-folha-opcao-detalhe .cma-folha-triplo{
      align-items:end;
    }
    #calculadora-folha .cma-folha-opcao-detalhe .cma-folha-quatro>div,
    #calculadora-folha .cma-folha-opcao-detalhe .cma-folha-duplo>div,
    #calculadora-folha .cma-folha-opcao-detalhe .cma-folha-triplo>div{
      display:flex;
      flex-direction:column;
      min-width:0;
      height:100%;
    }
    #calculadora-folha .cma-folha-opcao-detalhe label{
      display:flex;
      align-items:flex-end;
      min-height:38px;
      margin:10px 0 6px;
      line-height:1.25;
    }
    #calculadora-folha .cma-folha-opcao-detalhe input[type="number"],
    #calculadora-folha .cma-folha-opcao-detalhe input[type="text"],
    #calculadora-folha .cma-folha-opcao-detalhe input[type="month"]{
      box-sizing:border-box;
      min-height:46px;
      height:46px;
    }
    #calculadora-folha .cma-folha-opcao-detalhe .cma-folha-duplo{
      margin-top:4px;
    }
    @media(max-width:640px){
      #calculadora-folha .cma-folha-opcao-detalhe label{min-height:0}
      #calculadora-folha .cma-folha-opcao-detalhe .cma-folha-quatro,
      #calculadora-folha .cma-folha-opcao-detalhe .cma-folha-duplo,
      #calculadora-folha .cma-folha-opcao-detalhe .cma-folha-triplo{align-items:stretch}
    }
  `;
  document.head.appendChild(st);
})();
