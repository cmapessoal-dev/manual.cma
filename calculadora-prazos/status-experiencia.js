(function(){
  function hoje(){const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate(),12,0,0,0);}
  function dataValor(id){const e=document.getElementById(id);if(!e||!e.value)return null;const [y,m,d]=e.value.split('-').map(Number);return new Date(y,m-1,d,12,0,0,0);}
  function inteiro(id,padrao=0){const e=document.getElementById(id);const n=parseInt(e?.value,10);return Number.isFinite(n)?n:padrao;}
  function addDias(d,n){const r=new Date(d);r.setDate(r.getDate()+n);return r;}
  function fmt(d){return d.toLocaleDateString('pt-BR');}
  function atualizar(){
    const sec=document.getElementById('calculadora-experiencia');if(!sec)return;
    let status=document.getElementById('cma-exp-vigencia');
    if(!status){
      status=document.createElement('div');status.id='cma-exp-vigencia';status.className='cma-prazo-vigencia neutro';
      const alerta=document.getElementById('cma-exp-alerta');if(alerta)alerta.insertAdjacentElement('afterend',status);
    }
    const adm=dataValor('cma-exp-admissao'),p1=Math.max(1,inteiro('cma-exp-p1',45)),p2=Math.max(0,inteiro('cma-exp-p2',45)),total=p1+p2;
    if(!adm){status.className='cma-prazo-vigencia neutro';status.innerHTML='<strong>Status do contrato:</strong> informe a data de admissão.';return;}
    const final=addDias(adm,total-1),agora=hoje();
    status.classList.remove('vigente','hoje','vencido','erro','neutro');
    if(total>90){status.classList.add('erro');status.innerHTML=`<strong>Prazo inválido:</strong> o contrato ultrapassa 90 dias. Término projetado em ${fmt(final)}.`;return;}
    if(final.getTime()<agora.getTime()){status.classList.add('vencido');status.innerHTML=`<strong>Contrato encerrado:</strong> o término ocorreu em ${fmt(final)}.`;}
    else if(final.getTime()===agora.getTime()){status.classList.add('hoje');status.innerHTML=`<strong>Termina hoje:</strong> ${fmt(final)}.`;}
    else{status.classList.add('vigente');status.innerHTML=`<strong>Contrato vigente:</strong> término previsto para ${fmt(final)}.`;}
  }
  function estilo(){if(document.getElementById('cma-exp-vigencia-style'))return;const s=document.createElement('style');s.id='cma-exp-vigencia-style';s.textContent='.cma-prazo-vigencia{margin-top:10px;padding:12px 14px;border-radius:10px;font-size:13px}.cma-prazo-vigencia.vigente{background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46}.cma-prazo-vigencia.hoje{background:#fffbeb;border:1px solid #fde68a;color:#92400e}.cma-prazo-vigencia.vencido,.cma-prazo-vigencia.erro{background:#fef2f2;border:1px solid #fecaca;color:#991b1b}.cma-prazo-vigencia.neutro{background:#f8fafc;border:1px solid #e2e8f0;color:#475569}';document.head.appendChild(s);}
  function iniciar(){estilo();let n=0;(function tentar(){const sec=document.getElementById('calculadora-experiencia');if(sec){['cma-exp-admissao','cma-exp-p1','cma-exp-p2'].forEach(id=>document.getElementById(id)?.addEventListener('input',atualizar));atualizar();return;}if(++n<60)setTimeout(tentar,150);})();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
