(function(){
  if(window.CMAUxCalculadorasVariaveis)return;

  function disparar(el){
    if(!el)return;
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
  }

  function limpar(container){
    container.querySelectorAll('input').forEach(el=>{
      if(el.type==='checkbox')el.checked=false;
      else if(el.type==='time')el.value='';
      else if(el.type==='number')el.value=el.dataset.cmaDefault||'0';
      disparar(el);
    });
  }

  function pergunta(titulo,conteudo,classe,{limparAoFechar=true,onChange=null}={}){
    if(!conteudo||conteudo.closest('.cma-ux-pergunta'))return null;
    const wrap=document.createElement('div');
    wrap.className=`cma-ux-pergunta ${classe||''}`;
    const cab=document.createElement('div');
    cab.className='cma-ux-pergunta-cab';
    cab.innerHTML=`<span>${titulo}</span><div class="cma-ux-escolha"><button type="button" data-v="sim">Sim</button><button type="button" data-v="nao" class="ativo">Não</button></div>`;
    const detalhe=document.createElement('div');
    detalhe.className='cma-ux-pergunta-detalhe';
    detalhe.hidden=true;
    conteudo.parentNode.insertBefore(wrap,conteudo);
    detalhe.appendChild(conteudo);
    wrap.append(cab,detalhe);
    const botoes=[...cab.querySelectorAll('button')];
    function definir(sim,{limparCampos=limparAoFechar}={}){
      botoes.forEach(b=>b.classList.toggle('ativo',b.dataset.v===(sim?'sim':'nao')));
      detalhe.hidden=!sim;
      wrap.classList.toggle('aberto',sim);
      if(!sim&&limparCampos)limpar(detalhe);
      if(onChange)onChange(sim,detalhe);
    }
    botoes.forEach(b=>b.addEventListener('click',()=>definir(b.dataset.v==='sim')));
    wrap._cmaDefinir=definir;
    return wrap;
  }

  function blocoCampo(input){
    if(!input)return null;
    const money=input.closest('[class$="-money"]');
    const campo=money||input;
    const label=campo.previousElementSibling;
    if(!label||label.tagName!=='LABEL')return campo.parentElement;
    const box=document.createElement('div');
    label.parentNode.insertBefore(box,label);
    box.append(label,campo);
    return box;
  }

  function resetAoLimpar(sec){
    sec.addEventListener('click',e=>{
      if(!e.target.closest('.cma-ferramenta-limpar'))return;
      setTimeout(()=>sec.querySelectorAll('.cma-ux-pergunta').forEach(w=>w._cmaDefinir?.(false,{limparCampos:false})),0);
    });
  }

  function aplicarFaltas(){
    const sec=document.getElementById('calculadora-faltas-atrasos');
    if(!sec||sec.dataset.cmaUxVariaveis==='1')return false;
    sec.dataset.cmaUxVariaveis='1';

    const divisor=document.getElementById('cma-fa-divisor');
    const faltas=document.getElementById('cma-fa-faltas');
    const linha=divisor?.closest('.cma-fa-duplo');
    if(linha&&faltas){
      const itemDiv=divisor.parentElement,itemFalta=faltas.parentElement;
      linha.parentNode.insertBefore(itemFalta,linha);
      pergunta('Teve faltas injustificadas?',itemFalta,'cma-ux-fa-faltas');
      const adv=document.createElement('details');
      adv.className='cma-ux-avancado';
      adv.innerHTML='<summary>Configurações avançadas</summary><div class="cma-ux-avancado-grid"></div>';
      adv.querySelector('div').appendChild(itemDiv);
      linha.parentNode.insertBefore(adv,linha);
      linha.remove();
    }

    const atraso=document.getElementById('cma-fa-horas')?.closest('.cma-fa-bloco');
    if(atraso)pergunta('Teve atrasos descontáveis?',atraso,'cma-ux-fa-atrasos');

    const dsr=document.getElementById('cma-fa-dsrs');
    if(dsr){
      const label=dsr.previousElementSibling;
      const ajuda=dsr.nextElementSibling?.classList.contains('cma-fa-ajuda')?dsr.nextElementSibling:null;
      if(label?.tagName==='LABEL'){
        const box=document.createElement('div');
        label.parentNode.insertBefore(box,label);
        box.append(label,dsr);if(ajuda)box.appendChild(ajuda);
        pergunta('Houve perda de DSR?',box,'cma-ux-fa-dsr');
      }
    }
    resetAoLimpar(sec);return true;
  }

  function aplicarHorasExtras(){
    const sec=document.getElementById('calculadora-horas-extras');
    if(!sec||sec.dataset.cmaUxVariaveis==='1')return false;
    sec.dataset.cmaUxVariaveis='1';

    const outras=document.getElementById('cma-he-outras');
    const outrasBox=blocoCampo(outras);
    if(outrasBox)pergunta('Há outras parcelas que integram a hora?',outrasBox,'cma-ux-he-outras');

    const faixa2=document.getElementById('cma-he-h2')?.closest('.cma-he-bloco');
    if(faixa2)pergunta('Há uma segunda faixa de horas extras?',faixa2,'cma-ux-he-faixa2');

    const divisor=document.getElementById('cma-he-divisor');
    const competencia=document.getElementById('cma-he-competencia');
    const linha=divisor?.closest('.cma-he-duplo');
    if(linha&&competencia){
      const itemDiv=divisor.parentElement,itemComp=competencia.parentElement;
      linha.parentNode.insertBefore(itemComp,linha);
      const adv=document.createElement('details');adv.className='cma-ux-avancado';adv.innerHTML='<summary>Configurações avançadas</summary><div class="cma-ux-avancado-grid"></div>';adv.querySelector('div').appendChild(itemDiv);linha.parentNode.insertBefore(adv,linha);linha.remove();
    }
    resetAoLimpar(sec);return true;
  }

  function aplicarNoturno(){
    const sec=document.getElementById('calculadora-adicional-noturno');
    if(!sec||sec.dataset.cmaUxVariaveis==='1')return false;
    sec.dataset.cmaUxVariaveis='1';

    const outras=document.getElementById('cma-an-outras');
    const outrasBox=blocoCampo(outras);
    if(outrasBox)pergunta('Há outras parcelas que integram a hora?',outrasBox,'cma-ux-an-outras');

    const intervalo=document.getElementById('cma-an-int-inicio')?.closest('.cma-an-bloco');
    if(intervalo)pergunta('Houve intervalo na jornada?',intervalo,'cma-ux-an-intervalo');

    const pror=document.getElementById('cma-an-prorrogacao');
    const label=pror?.closest('.cma-an-check');
    if(pror&&label){
      const holder=document.createElement('div');
      label.parentNode.insertBefore(holder,label);holder.appendChild(label);
      const q=pergunta('Considerar prorrogação após as 5h?',holder,'cma-ux-an-prorrogacao',{limparAoFechar:false,onChange:(sim)=>{pror.checked=sim;disparar(pror);}});
      q?._cmaDefinir(false,{limparCampos:false});
    }

    const divisor=document.getElementById('cma-an-divisor');
    const perc=document.getElementById('cma-an-percentual');
    const linha=divisor?.closest('.cma-an-duplo');
    if(linha&&perc){
      const adv=document.createElement('details');adv.className='cma-ux-avancado';adv.innerHTML='<summary>Configurações avançadas</summary><div class="cma-ux-avancado-grid"></div>';
      const grid=adv.querySelector('div');grid.append(divisor.parentElement,perc.parentElement);linha.parentNode.insertBefore(adv,linha);linha.remove();
    }
    resetAoLimpar(sec);return true;
  }

  function estilo(){
    if(document.getElementById('cma-ux-calculadoras-variaveis-style'))return;
    const st=document.createElement('style');st.id='cma-ux-calculadoras-variaveis-style';st.textContent=`
      .cma-ux-pergunta{margin-top:12px;border:1px solid #e2e8f0;border-radius:11px;background:#fff;overflow:hidden}.cma-ux-pergunta.aberto{border-color:#bfdbfe;box-shadow:0 3px 12px rgba(30,64,175,.06)}
      .cma-ux-pergunta-cab{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 13px;background:#f8fafc}.cma-ux-pergunta-cab>span{color:#172554;font-size:13.5px;font-weight:800}.cma-ux-escolha{display:flex;gap:5px;flex:0 0 auto}.cma-ux-escolha button{min-width:48px;padding:6px 10px;border:1px solid #cbd5e1;border-radius:7px;background:#fff;color:#64748b;font-size:12px;font-weight:800;cursor:pointer}.cma-ux-escolha button.ativo[data-v="sim"]{background:#172554;border-color:#172554;color:#fff}.cma-ux-escolha button.ativo[data-v="nao"]{background:#e2e8f0;border-color:#cbd5e1;color:#334155}
      .cma-ux-pergunta-detalhe{padding:0 13px 13px}.cma-ux-pergunta-detalhe>[class$="-bloco"]{margin-top:12px;border:0;padding:0;background:transparent}.cma-ux-pergunta-detalhe>[class$="-bloco"]>strong{display:none}
      .cma-ux-avancado{margin-top:12px;border:1px dashed #cbd5e1;border-radius:9px;background:#f8fafc}.cma-ux-avancado summary{padding:10px 12px;cursor:pointer;color:#64748b;font-size:12.5px;font-weight:800}.cma-ux-avancado-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 12px 12px}
      #calculadora-faltas-atrasos .cma-ux-pergunta-detalhe .cma-fa-duplo,#calculadora-horas-extras .cma-ux-pergunta-detalhe .cma-he-triplo,#calculadora-adicional-noturno .cma-ux-pergunta-detalhe .cma-an-duplo{align-items:end}
      #calculadora-faltas-atrasos .cma-ux-pergunta-detalhe input,#calculadora-horas-extras .cma-ux-pergunta-detalhe input,#calculadora-adicional-noturno .cma-ux-pergunta-detalhe input{min-height:43px}
      @media(max-width:640px){.cma-ux-pergunta-cab{align-items:flex-start;flex-direction:column}.cma-ux-escolha{width:100%}.cma-ux-escolha button{flex:1;padding:9px}.cma-ux-avancado-grid{grid-template-columns:1fr}}
    `;document.head.appendChild(st);
  }

  function aplicarTudo(){aplicarFaltas();aplicarHorasExtras();aplicarNoturno();}
  window.CMAUxCalculadorasVariaveis={aplicar:aplicarTudo};
  estilo();
  let n=0;(function tentar(){aplicarTudo();if(++n<50&&(!document.getElementById('calculadora-faltas-atrasos')||!document.getElementById('calculadora-horas-extras')||!document.getElementById('calculadora-adicional-noturno')))setTimeout(tentar,160)})();
  document.addEventListener('cma:modulos-prontos',aplicarTudo);
})();