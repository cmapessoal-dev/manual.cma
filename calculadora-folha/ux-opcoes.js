(function(){
  if(window.CMAFolhaUxOpcoes)return;

  function disparar(input){
    input.dispatchEvent(new Event('input',{bubbles:true}));
    input.dispatchEvent(new Event('change',{bubbles:true}));
  }

  function zerar(container){
    container.querySelectorAll('input[type="number"]').forEach(input=>{
      input.value=input.dataset.cmaDefault||'0';
      disparar(input);
    });
  }

  function criarPergunta(titulo,conteudo,id){
    const wrap=document.createElement('div');
    wrap.className='cma-folha-opcao';
    wrap.dataset.cmaFolhaOpcao=id;
    const cab=document.createElement('div');
    cab.className='cma-folha-opcao-cab';
    cab.innerHTML=`<span>${titulo}</span><div class="cma-folha-escolha" role="group" aria-label="${titulo}"><button type="button" data-valor="sim">Sim</button><button type="button" data-valor="nao" class="ativo">Não</button></div>`;
    const detalhe=document.createElement('div');
    detalhe.className='cma-folha-opcao-detalhe';
    detalhe.hidden=true;
    conteudo.parentNode.insertBefore(wrap,conteudo);
    detalhe.appendChild(conteudo);
    wrap.append(cab,detalhe);

    const botoes=[...cab.querySelectorAll('button')];
    function definir(sim,{limpar=true}={}){
      botoes.forEach(b=>b.classList.toggle('ativo',b.dataset.valor===(sim?'sim':'nao')));
      detalhe.hidden=!sim;
      wrap.classList.toggle('aberto',sim);
      if(!sim&&limpar)zerar(detalhe);
    }
    botoes.forEach(b=>b.addEventListener('click',()=>definir(b.dataset.valor==='sim')));
    wrap._cmaDefinir=definir;
    return wrap;
  }

  function campoComLabel(input){
    if(!input)return null;
    let box=input.closest('.cma-folha-money')||input;
    const pai=box.parentElement;
    if(!pai)return null;
    return pai;
  }

  function aplicar(){
    const sec=document.getElementById('calculadora-folha');
    if(!sec||sec.dataset.cmaUxOpcoes==='1')return false;
    const form=sec.querySelector('.cma-folha-form');
    if(!form)return false;
    sec.dataset.cmaUxOpcoes='1';

    const he=document.getElementById('cma-folha-he50-h')?.closest('.cma-folha-bloco');
    const noturno=document.getElementById('cma-folha-not-h')?.closest('.cma-folha-bloco');
    const faltas=document.getElementById('cma-folha-faltas')?.closest('.cma-folha-bloco');
    if(he)criarPergunta('Teve horas extras?',he,'horas-extras');
    if(noturno)criarPergunta('Teve adicional noturno?',noturno,'adicional-noturno');
    if(faltas)criarPergunta('Teve faltas, atrasos ou perda de DSR?',faltas,'faltas-atrasos');

    const fixas=document.getElementById('cma-folha-fixas');
    const proventosRow=fixas?.closest('.cma-folha-duplo');
    if(proventosRow)criarPergunta('Tem outros proventos além do salário?',proventosRow,'outros-proventos');

    const premio=document.getElementById('cma-folha-premio');
    const pensao=document.getElementById('cma-folha-pensao');
    const premioBox=campoComLabel(premio),pensaoBox=campoComLabel(pensao);
    const linhaPremio=premio?.closest('.cma-folha-duplo');
    if(linhaPremio&&premioBox&&pensaoBox){
      const ancora=linhaPremio;
      const blocoPremio=document.createElement('div');blocoPremio.appendChild(premioBox);
      const blocoPensao=document.createElement('div');blocoPensao.appendChild(pensaoBox);
      ancora.parentNode.insertBefore(blocoPremio,ancora);
      ancora.parentNode.insertBefore(blocoPensao,ancora);
      ancora.remove();
      criarPergunta('Recebe prêmio sem incidência?',blocoPremio,'premio');
      criarPergunta('Tem pensão alimentícia?',blocoPensao,'pensao');
    }

    const outrosDesc=document.getElementById('cma-folha-outros-desc');
    if(outrosDesc){
      const money=outrosDesc.closest('.cma-folha-money');
      const label=money?.previousElementSibling;
      if(money&&label){
        const box=document.createElement('div');
        money.parentNode.insertBefore(box,label);
        box.append(label,money);
        criarPergunta('Tem outros descontos na folha?',box,'outros-descontos');
      }
    }

    const divisor=document.getElementById('cma-folha-divisor');
    const divisorDia=document.getElementById('cma-folha-divisor-dia');
    const dependentes=document.getElementById('cma-folha-dependentes');
    const linhaCfg=divisor?.closest('.cma-folha-triplo');
    if(linhaCfg&&divisorDia&&dependentes){
      const itemDiv=divisor.parentElement,itemDia=divisorDia.parentElement,itemDep=dependentes.parentElement;
      linhaCfg.parentNode.insertBefore(itemDep,linhaCfg);
      itemDep.classList.add('cma-folha-dependentes-visivel');
      const detalhes=document.createElement('details');
      detalhes.className='cma-folha-avancado';
      detalhes.innerHTML='<summary>Configurações avançadas</summary><div class="cma-folha-avancado-grid"></div>';
      const grid=detalhes.querySelector('.cma-folha-avancado-grid');
      grid.append(itemDiv,itemDia);
      linhaCfg.parentNode.insertBefore(detalhes,linhaCfg);
      linhaCfg.remove();
    }

    sec.addEventListener('click',e=>{
      if(!e.target.closest('.cma-ferramenta-limpar'))return;
      setTimeout(()=>sec.querySelectorAll('.cma-folha-opcao').forEach(w=>w._cmaDefinir?.(false,{limpar:false})),0);
    });

    return true;
  }

  function estilo(){
    if(document.getElementById('cma-folha-ux-opcoes-style'))return;
    const st=document.createElement('style');
    st.id='cma-folha-ux-opcoes-style';
    st.textContent=`
      #calculadora-folha .cma-folha-opcao{margin-top:11px;border:1px solid #e2e8f0;border-radius:11px;background:#fff;overflow:hidden;transition:.18s}
      #calculadora-folha .cma-folha-opcao.aberto{border-color:#bfdbfe;box-shadow:0 3px 12px rgba(30,64,175,.06)}
      #calculadora-folha .cma-folha-opcao-cab{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 13px;background:#f8fafc}
      #calculadora-folha .cma-folha-opcao-cab>span{color:#172554;font-size:13.5px;font-weight:800}
      #calculadora-folha .cma-folha-escolha{display:flex;gap:5px;flex:0 0 auto}
      #calculadora-folha .cma-folha-escolha button{min-width:48px;padding:6px 10px;border:1px solid #cbd5e1;border-radius:7px;background:#fff;color:#64748b;font-size:12px;font-weight:800;cursor:pointer}
      #calculadora-folha .cma-folha-escolha button.ativo[data-valor="sim"]{background:#172554;border-color:#172554;color:#fff}
      #calculadora-folha .cma-folha-escolha button.ativo[data-valor="nao"]{background:#e2e8f0;border-color:#cbd5e1;color:#334155}
      #calculadora-folha .cma-folha-opcao-detalhe{padding:0 13px 13px;background:#fff}
      #calculadora-folha .cma-folha-opcao-detalhe>.cma-folha-bloco{margin-top:12px;border:0;padding:0;background:transparent}
      #calculadora-folha .cma-folha-opcao-detalhe>.cma-folha-bloco>strong{display:none}
      #calculadora-folha .cma-folha-dependentes-visivel{margin-top:5px}
      #calculadora-folha .cma-folha-avancado{margin-top:12px;border:1px dashed #cbd5e1;border-radius:9px;background:#f8fafc}
      #calculadora-folha .cma-folha-avancado summary{padding:10px 12px;cursor:pointer;color:#64748b;font-size:12.5px;font-weight:800}
      #calculadora-folha .cma-folha-avancado-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 12px 12px}
      @media(max-width:640px){#calculadora-folha .cma-folha-opcao-cab{align-items:flex-start;flex-direction:column}#calculadora-folha .cma-folha-escolha{width:100%}#calculadora-folha .cma-folha-escolha button{flex:1;padding:9px}#calculadora-folha .cma-folha-avancado-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(st);
  }

  window.CMAFolhaUxOpcoes={aplicar};
  estilo();
  let tentativas=0;(function tentar(){if(aplicar())return;if(++tentativas<60)setTimeout(tentar,150)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();