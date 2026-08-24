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
    const box=input.closest('.cma-folha-money')||input;
    return box.parentElement||null;
  }

  function criarGrupo(titulo,subtitulo,classe){
    const grupo=document.createElement('div');
    grupo.className=`cma-folha-grupo ${classe}`;
    grupo.innerHTML=`<div class="cma-folha-grupo-titulo"><strong>${titulo}</strong><span>${subtitulo}</span></div><div class="cma-folha-grupo-conteudo"></div>`;
    return grupo;
  }

  function organizarGrupos(form){
    const proventos=criarGrupo('Proventos','Valores que aumentam a remuneração','cma-folha-grupo-proventos');
    const descontos=criarGrupo('Descontos','Valores que reduzem a folha','cma-folha-grupo-descontos');
    const pConteudo=proventos.querySelector('.cma-folha-grupo-conteudo');
    const dConteudo=descontos.querySelector('.cma-folha-grupo-conteudo');
    ['outros-proventos','horas-extras','adicional-noturno','premio'].forEach(id=>{
      const el=form.querySelector(`[data-cma-folha-opcao="${id}"]`);if(el)pConteudo.appendChild(el);
    });
    ['faltas-atrasos','pensao','outros-descontos'].forEach(id=>{
      const el=form.querySelector(`[data-cma-folha-opcao="${id}"]`);if(el)dConteudo.appendChild(el);
    });
    form.append(proventos,descontos);
  }

  function organizarComoCalculamos(sec){
    const memoria=sec.querySelector('.cma-folha-memoria');
    if(!memoria)return;
    const resultados=memoria.parentElement;
    const detalhe=document.createElement('details');
    detalhe.className='cma-folha-como-calculamos';
    detalhe.innerHTML='<summary><span>Como calculamos?</span><small>Ver memória de cálculo e critérios tributários</small></summary><div class="cma-folha-como-conteudo"></div>';
    const conteudo=detalhe.querySelector('.cma-folha-como-conteudo');
    const explicacao=document.getElementById('exp-calculadora-folha');
    if(explicacao){
      explicacao.classList.remove('hidden','bg-slate-100','border','border-slate-300','p-3','rounded','mb-4');
      explicacao.classList.add('cma-folha-explicacao-interna');
      conteudo.appendChild(explicacao);
    }
    memoria.querySelector('h4')?.remove();
    conteudo.appendChild(memoria);
    resultados.appendChild(detalhe);
    const topo=sec.querySelector('button[onclick*="exp-calculadora-folha"]');
    if(topo)topo.remove();
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
      criarPergunta('Recebe prêmio sem incidência previdenciária?',blocoPremio,'premio');
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

    organizarGrupos(form);
    organizarComoCalculamos(sec);

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
      #calculadora-folha .cma-folha-grupo{margin-top:16px;border:1px solid #dbe3ef;border-radius:13px;overflow:hidden;background:#fff}
      #calculadora-folha .cma-folha-grupo-titulo{padding:12px 14px;border-bottom:1px solid #e2e8f0;background:#f8fafc}
      #calculadora-folha .cma-folha-grupo-titulo strong{display:block;color:#172554;font-size:15px;font-weight:900}
      #calculadora-folha .cma-folha-grupo-titulo span{display:block;margin-top:2px;color:#64748b;font-size:11.5px}
      #calculadora-folha .cma-folha-grupo-proventos .cma-folha-grupo-titulo{border-left:4px solid #2563eb}
      #calculadora-folha .cma-folha-grupo-descontos .cma-folha-grupo-titulo{border-left:4px solid #dc2626}
      #calculadora-folha .cma-folha-grupo-conteudo{padding:2px 12px 12px}
      #calculadora-folha .cma-folha-opcao{margin-top:10px;border:1px solid #e2e8f0;border-radius:11px;background:#fff;overflow:hidden;transition:.18s}
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
      #calculadora-folha .cma-folha-como-calculamos{border:1px solid #dbe3ef;border-radius:14px;background:#fff;overflow:hidden;box-shadow:0 6px 18px rgba(15,23,42,.04)}
      #calculadora-folha .cma-folha-como-calculamos summary{display:flex;flex-direction:column;gap:2px;padding:15px 17px;cursor:pointer;background:#f8fafc;color:#172554;list-style:none}
      #calculadora-folha .cma-folha-como-calculamos summary::-webkit-details-marker{display:none}
      #calculadora-folha .cma-folha-como-calculamos summary span{font-size:15px;font-weight:900}
      #calculadora-folha .cma-folha-como-calculamos summary small{color:#64748b;font-size:11.5px;font-weight:600}
      #calculadora-folha .cma-folha-como-conteudo{padding:14px}
      #calculadora-folha .cma-folha-explicacao-interna{margin-bottom:12px;padding:12px;border-radius:10px;background:#f8fafc;color:#475569;font-size:12px;line-height:1.5}
      #calculadora-folha .cma-folha-como-conteudo .cma-folha-memoria{box-shadow:none;border-radius:10px;margin:0}
      @media(max-width:640px){#calculadora-folha .cma-folha-opcao-cab{align-items:flex-start;flex-direction:column}#calculadora-folha .cma-folha-escolha{width:100%}#calculadora-folha .cma-folha-escolha button{flex:1;padding:9px}#calculadora-folha .cma-folha-avancado-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(st);
  }

  window.CMAFolhaUxOpcoes={aplicar};
  estilo();
  let tentativas=0;(function tentar(){if(aplicar())return;if(++tentativas<60)setTimeout(tentar,150)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();