(function(){
  if(window.CMAUxOpcionaisCalculadoras)return;

  function disparar(input){
    input.dispatchEvent(new Event('input',{bubbles:true}));
    input.dispatchEvent(new Event('change',{bubbles:true}));
  }

  function zerar(box){
    box.querySelectorAll('input[type="number"]').forEach(input=>{
      input.value=input.dataset.cmaDefault||'0';
      disparar(input);
    });
  }

  function campoCompleto(input){
    if(!input)return null;
    const money=input.closest('[class$="-money"]');
    const alvo=money||input;
    const pai=alvo.parentElement;
    if(!pai)return null;
    const label=money?.previousElementSibling;
    if(label&&label.tagName==='LABEL'){
      const box=document.createElement('div');
      pai.insertBefore(box,label);
      box.append(label,money);
      return box;
    }
    return pai;
  }

  function criarOpcao(secao,titulo,conteudo,id){
    if(!secao||!conteudo||secao.querySelector(`[data-cma-opcional="${id}"]`))return null;
    const wrap=document.createElement('div');
    wrap.className='cma-calc-opcional';
    wrap.dataset.cmaOpcional=id;
    const cab=document.createElement('div');
    cab.className='cma-calc-opcional-cab';
    cab.innerHTML=`<span>${titulo}</span><div class="cma-calc-opcional-escolha" role="group" aria-label="${titulo}"><button type="button" data-v="sim">Sim</button><button type="button" data-v="nao" class="ativo">Não</button></div>`;
    const detalhe=document.createElement('div');
    detalhe.className='cma-calc-opcional-detalhe';
    detalhe.hidden=true;
    conteudo.parentNode.insertBefore(wrap,conteudo);
    detalhe.appendChild(conteudo);
    wrap.append(cab,detalhe);
    const botoes=[...cab.querySelectorAll('button')];
    function definir(sim,{limpar=true}={}){
      botoes.forEach(b=>b.classList.toggle('ativo',b.dataset.v===(sim?'sim':'nao')));
      detalhe.hidden=!sim;
      wrap.classList.toggle('aberto',sim);
      if(!sim&&limpar)zerar(detalhe);
    }
    botoes.forEach(b=>b.addEventListener('click',()=>definir(b.dataset.v==='sim')));
    wrap._cmaDefinir=definir;
    return wrap;
  }

  function aplicarFerias(){
    const sec=document.getElementById('calculadora-ferias');
    if(!sec||sec.dataset.cmaOpcionais==='1')return false;
    const medias=campoCompleto(document.getElementById('cma-ferias-medias'));
    const pensao=campoCompleto(document.getElementById('cma-ferias-pensao'));
    const outras=campoCompleto(document.getElementById('cma-ferias-outras-deducoes'));
    if(!medias||!pensao||!outras)return false;
    sec.dataset.cmaOpcionais='1';
    criarOpcao(sec,'Possui médias salariais?',medias,'ferias-medias');
    criarOpcao(sec,'Possui pensão alimentícia dedutível?',pensao,'ferias-pensao');
    criarOpcao(sec,'Possui outras deduções legais de IRRF?',outras,'ferias-outras-deducoes');
    ligarLimpar(sec);
    return true;
  }

  function aplicar13(){
    const sec=document.getElementById('calculadora-decimo-terceiro');
    if(!sec||sec.dataset.cmaOpcionais==='1')return false;
    const medias=campoCompleto(document.getElementById('cma-13-medias'));
    const primeira=campoCompleto(document.getElementById('cma-13-primeira'));
    const pensao=campoCompleto(document.getElementById('cma-13-pensao'));
    const outras=campoCompleto(document.getElementById('cma-13-outras-deducoes'));
    if(!medias||!primeira||!pensao||!outras)return false;
    sec.dataset.cmaOpcionais='1';
    criarOpcao(sec,'Possui médias salariais?',medias,'13-medias');
    criarOpcao(sec,'Já houve pagamento da 1ª parcela?',primeira,'13-primeira');
    criarOpcao(sec,'Possui pensão alimentícia dedutível?',pensao,'13-pensao');
    criarOpcao(sec,'Possui outras deduções legais?',outras,'13-outras-deducoes');
    ligarLimpar(sec);
    return true;
  }

  function aplicarProLabore(){
    const sec=document.getElementById('calculadora-pro-labore');
    if(!sec||sec.dataset.cmaOpcionais==='1')return false;
    const pensaoInput=document.getElementById('cma-pl-pensao');
    const outrasInput=document.getElementById('cma-pl-outras-deducoes');
    if(!pensaoInput||!outrasInput)return false;
    const linha=pensaoInput.closest('.cma-pl-duplo');
    const dep=document.getElementById('cma-pl-dependentes')?.parentElement;
    const pensao=campoCompleto(pensaoInput);
    if(linha&&dep&&pensao){
      linha.parentNode.insertBefore(dep,linha);
      linha.parentNode.insertBefore(pensao,linha);
      linha.remove();
      dep.classList.add('cma-pl-dependentes-ajuste');
    }
    const outras=campoCompleto(outrasInput);
    sec.dataset.cmaOpcionais='1';
    if(pensao)criarOpcao(sec,'Possui pensão alimentícia dedutível?',pensao,'pl-pensao');
    if(outras)criarOpcao(sec,'Possui outras deduções legais de IRRF?',outras,'pl-outras-deducoes');
    ligarLimpar(sec);
    return true;
  }

  function ligarLimpar(sec){
    if(sec.dataset.cmaOpcionalLimpar==='1')return;
    sec.dataset.cmaOpcionalLimpar='1';
    sec.addEventListener('click',e=>{
      if(!e.target.closest('.cma-ferramenta-limpar'))return;
      setTimeout(()=>sec.querySelectorAll('.cma-calc-opcional').forEach(w=>w._cmaDefinir?.(false,{limpar:false})),0);
    });
  }

  function estilo(){
    if(document.getElementById('cma-ux-opcionais-style'))return;
    const st=document.createElement('style');
    st.id='cma-ux-opcionais-style';
    st.textContent=`
      .cma-calc-opcional{margin-top:12px;border:1px solid #e2e8f0;border-radius:11px;background:#fff;overflow:hidden}
      .cma-calc-opcional.aberto{border-color:#bfdbfe;box-shadow:0 3px 12px rgba(30,64,175,.06)}
      .cma-calc-opcional-cab{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 13px;background:#f8fafc}
      .cma-calc-opcional-cab>span{color:#172554;font-size:13.5px;font-weight:800}
      .cma-calc-opcional-escolha{display:flex;gap:5px;flex:0 0 auto}
      .cma-calc-opcional-escolha button{min-width:48px;padding:6px 10px;border:1px solid #cbd5e1;border-radius:7px;background:#fff;color:#64748b;font-size:12px;font-weight:800;cursor:pointer}
      .cma-calc-opcional-escolha button.ativo[data-v="sim"]{background:#172554;border-color:#172554;color:#fff}
      .cma-calc-opcional-escolha button.ativo[data-v="nao"]{background:#e2e8f0;border-color:#cbd5e1;color:#334155}
      .cma-calc-opcional-detalhe{padding:0 13px 13px;background:#fff}
      .cma-calc-opcional-detalhe>div{margin-top:10px}
      #calculadora-pro-labore .cma-pl-dependentes-ajuste{margin-top:2px}
      #calculadora-pro-labore .cma-pl-form input,#calculadora-pro-labore .cma-pl-money{min-height:42px;box-sizing:border-box}
      #calculadora-pro-labore .cma-pl-money input{min-height:40px}
      @media(max-width:640px){.cma-calc-opcional-cab{align-items:flex-start;flex-direction:column}.cma-calc-opcional-escolha{width:100%}.cma-calc-opcional-escolha button{flex:1;padding:9px}}
    `;
    document.head.appendChild(st);
  }

  function aplicarTudo(){aplicarFerias();aplicar13();aplicarProLabore();}
  window.CMAUxOpcionaisCalculadoras={aplicar:aplicarTudo};
  estilo();
  let n=0;(function tentar(){aplicarTudo();if(++n<50&&(!document.getElementById('calculadora-ferias')||!document.getElementById('calculadora-decimo-terceiro')||!document.getElementById('calculadora-pro-labore')))setTimeout(tentar,150)})();
  document.addEventListener('cma:modulos-prontos',aplicarTudo);
})();