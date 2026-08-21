(function(){
  function valorNumero(id){const el=document.getElementById(id);if(!el)return 0;const n=parseFloat(String(el.value||'0').replace(',','.'));return isNaN(n)?0:n;}
  function opcao(nome){const el=document.querySelector(`input[name="${nome}"]:checked`);return el?el.value:'';}
  function limparTexto(t){return (t||'').replace(/\s+/g,' ').trim();}
  function linhasDaCaixa(id){const box=document.getElementById(id);if(!box)return [];return Array.from(box.querySelectorAll('.cma-custo-linha')).map(l=>({label:limparTexto((l.querySelector('span')||{}).textContent),valor:limparTexto((l.querySelector('strong')||{}).textContent),total:l.classList.contains('cma-custo-total-linha'),desconto:l.classList.contains('cma-custo-desconto')}));}
  function moeda(v){return (Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function carregarJsPdf(){
    if(window.jspdf&&window.jspdf.jsPDF)return Promise.resolve(window.jspdf.jsPDF);
    return new Promise((resolve,reject)=>{
      const antigo=document.getElementById('cma-jspdf-lib');
      if(antigo){antigo.addEventListener('load',()=>resolve(window.jspdf.jsPDF),{once:true});antigo.addEventListener('error',reject,{once:true});return;}
      const s=document.createElement('script');s.id='cma-jspdf-lib';s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';s.onload=()=>resolve(window.jspdf.jsPDF);s.onerror=reject;document.head.appendChild(s);
    });
  }
  async function carregarLogoCMA(){
    try{
      const url=new URL('logo.png',document.baseURI).href;
      const resposta=await fetch(url,{cache:'force-cache'});
      if(!resposta.ok)throw new Error('Logo não encontrada');
      const blob=await resposta.blob();
      const dataUrl=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(blob);});
      const dimensoes=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve({w:img.naturalWidth||327,h:img.naturalHeight||160});img.onerror=reject;img.src=dataUrl;});
      return {dataUrl,w:dimensoes.w,h:dimensoes.h};
    }catch(e){console.warn('Não foi possível carregar a logo oficial da CMA no PDF.',e);return null;}
  }
  function dados(){
    const salario=valorNumero('cma-custo-salario');
    return {
      salario,
      regime:limparTexto((document.getElementById('cma-custo-regime-label')||{}).textContent)||'Não informado',
      total:limparTexto((document.getElementById('cma-custo-total')||{}).textContent)||'R$ 0,00',
      percentual:limparTexto((document.getElementById('cma-custo-percentual')||{}).textContent)||'',
      data:new Date().toLocaleDateString('pt-BR'),
      beneficios:[
        ['Salário base',moeda(salario)],
        ['Vale-transporte',opcao('cma-vt')==='sim'?moeda(valorNumero('cma-custo-vt')):'Não'],
        ['Vale-alimentação / refeição',opcao('cma-alim')==='sim'?moeda(valorNumero('cma-custo-alim')):'Não'],
        ['Plano de saúde',valorNumero('cma-custo-plano')>0?moeda(valorNumero('cma-custo-plano')):'Não informado'],
        ['Outros benefícios',valorNumero('cma-custo-outros')>0?moeda(valorNumero('cma-custo-outros')):'Não informado']
      ],
      desembolso:linhasDaCaixa('cma-custo-desembolso'),
      provisoes:linhasDaCaixa('cma-custo-provisoes')
    };
  }
  function rgb(doc,c){doc.setTextColor(c[0],c[1],c[2]);}
  function fill(doc,c){doc.setFillColor(c[0],c[1],c[2]);}
  function stroke(doc,c){doc.setDrawColor(c[0],c[1],c[2]);}
  function desenharTabela(doc,x,y,w,titulo,linhas){
    const azul=[23,37,84],cinza=[71,85,105],borda=[226,232,240],fundo=[248,250,252],vermelho=[185,28,28];
    const rowH=7.2,headH=10,h=headH+(linhas.length*rowH)+4;
    fill(doc,[255,255,255]);stroke(doc,borda);doc.roundedRect(x,y,w,h,3,3,'FD');
    fill(doc,fundo);doc.roundedRect(x,y,w,headH,3,3,'F');doc.rect(x,y+headH-3,w,3,'F');
    doc.setFont('helvetica','bold');doc.setFontSize(9.5);rgb(doc,azul);doc.text(titulo,x+4,y+6.5);
    let cy=y+headH;
    linhas.forEach((l,i)=>{
      if(i>0){stroke(doc,[241,245,249]);doc.line(x+4,cy,x+w-4,cy);}
      doc.setFont('helvetica',l.total?'bold':'normal');doc.setFontSize(7.3);rgb(doc,l.desconto?vermelho:cinza);
      const label=doc.splitTextToSize(l.label,w-37);doc.text(label,x+4,cy+4.8);
      doc.setFont('helvetica','bold');rgb(doc,l.desconto?vermelho:azul);doc.text(l.valor,x+w-4,cy+4.8,{align:'right'});
      cy+=rowH;
    });
    return h;
  }
  function gerar(doc,d,logo){
    const azul=[8,47,125],azulEscuro=[23,37,84],amarelo=[245,181,27],cinza=[100,116,139],borda=[226,232,240],claro=[248,250,252];
    const m=14,pw=210,usable=pw-(m*2);
    let textoX=39;
    if(logo&&logo.dataUrl){
      const maxW=27,maxH=13,ratio=logo.w/logo.h;let logoW=maxW,logoH=logoW/ratio;if(logoH>maxH){logoH=maxH;logoW=logoH*ratio;}
      doc.addImage(logo.dataUrl,'PNG',m,14,logoW,logoH,undefined,'FAST');
      textoX=m+logoW+5;
    }else{
      fill(doc,azul);doc.roundedRect(m,14,20,13,2.5,2.5,'F');doc.setFont('helvetica','bold');doc.setFontSize(10);rgb(doc,[255,255,255]);doc.text('CMA',m+10,22.2,{align:'center'});
    }
    doc.setFont('helvetica','bold');doc.setFontSize(13);rgb(doc,azulEscuro);doc.text('CMA Assessoria Contábil',textoX,19.5);doc.setFont('helvetica','normal');doc.setFontSize(8);rgb(doc,cinza);doc.text('Departamento Pessoal',textoX,24);
    doc.setFontSize(8);doc.text('Simulação em '+d.data,pw-m,21,{align:'right'});fill(doc,amarelo);doc.rect(m,31,usable,1.1,'F');
    doc.setFont('helvetica','bold');doc.setFontSize(8);rgb(doc,cinza);doc.text('RELATÓRIO DE ESTIMATIVA',m,40);
    doc.setFontSize(22);rgb(doc,azulEscuro);doc.text('Custo do Empregado',m,49);doc.setFont('helvetica','normal');doc.setFontSize(9);rgb(doc,cinza);doc.text(d.regime,m,55);
    fill(doc,azul);doc.roundedRect(m,61,usable,27,3,3,'F');doc.setFont('helvetica','normal');doc.setFontSize(8.5);rgb(doc,[191,219,254]);doc.text('Custo efetivo mensal estimado',m+7,69);doc.setFont('helvetica','bold');doc.setFontSize(22);rgb(doc,[255,255,255]);doc.text(d.total,m+7,79);doc.setFontSize(8.5);rgb(doc,amarelo);doc.text(d.percentual,m+7,85);
    let y=95;doc.setFont('helvetica','bold');doc.setFontSize(10);rgb(doc,azulEscuro);doc.text('Dados informados',m,y);
    y+=4;const colW=(usable-6)/2;
    d.beneficios.forEach((item,i)=>{const col=i%2,row=Math.floor(i/2),x=m+(col*(colW+6)),cy=y+(row*13);fill(doc,claro);stroke(doc,borda);doc.roundedRect(x,cy,colW,10,2,2,'FD');doc.setFont('helvetica','normal');doc.setFontSize(6.8);rgb(doc,cinza);doc.text(item[0],x+3,cy+3.8);doc.setFont('helvetica','bold');doc.setFontSize(8.2);rgb(doc,azulEscuro);doc.text(item[1],x+3,cy+8);});
    y+=43;const gap=6,tw=(usable-gap)/2;
    const h1=desenharTabela(doc,m,y,tw,'Desembolso mensal',d.desembolso);const h2=desenharTabela(doc,m+tw+gap,y,tw,'Provisões mensais',d.provisoes);y+=Math.max(h1,h2)+8;
    const aviso='Os valores apresentados são apenas uma estimativa para planejamento. O custo efetivo do empregado pode variar conforme o enquadramento tributário da empresa, atividade exercida, alíquotas aplicáveis, benefícios concedidos, normas coletivas, condições contratuais e demais particularidades de cada caso.';
    const linhas=doc.splitTextToSize(aviso,usable-10),nh=12+(linhas.length*3.5);fill(doc,[255,251,235]);stroke(doc,[245,158,11]);doc.roundedRect(m,y,usable,nh,2,2,'FD');fill(doc,[217,119,6]);doc.rect(m,y,1.4,nh,'F');doc.setFont('helvetica','bold');doc.setFontSize(8);rgb(doc,[146,64,14]);doc.text('Importante',m+5,y+6);doc.setFont('helvetica','normal');doc.setFontSize(6.8);rgb(doc,[120,53,15]);doc.text(linhas,m+5,y+10);
    doc.setFontSize(6.5);rgb(doc,[148,163,184]);doc.text('CMA Assessoria Contábil • Manual de Diretrizes Trabalhistas & Boas Práticas',105,288,{align:'center'});
  }
  async function exportar(){
    const d=dados();if(d.salario<=0){alert('Informe o salário base antes de exportar o relatório.');return;}
    const btn=document.getElementById('cma-exportar-custo-pdf'),original=btn?btn.innerHTML:'';if(btn){btn.disabled=true;btn.textContent='Gerando PDF...';}
    try{
      const [JsPDF,logo]=await Promise.all([carregarJsPdf(),carregarLogoCMA()]);const doc=new JsPDF({orientation:'portrait',unit:'mm',format:'a4',compress:true});doc.setProperties({title:'Custo do Empregado - CMA',subject:'Estimativa de custo mensal do empregado',author:'CMA Assessoria Contábil'});gerar(doc,d,logo);doc.save(`Custo-do-Empregado-CMA-${new Date().toISOString().slice(0,10)}.pdf`);
    }catch(e){console.error(e);alert('Não foi possível gerar o PDF neste navegador. Tente novamente ou atualize a página.');}finally{if(btn){btn.disabled=false;btn.innerHTML=original;}}
  }
  function instalar(){
    const secao=document.getElementById('custo-empregado');if(!secao)return false;if(document.getElementById('cma-exportar-custo-pdf'))return true;const resumo=secao.querySelector('.cma-custo-resumo');if(!resumo)return false;
    const btn=document.createElement('button');btn.type='button';btn.id='cma-exportar-custo-pdf';btn.className='cma-exportar-custo-pdf';btn.innerHTML='<span aria-hidden="true">⇩</span> Exportar em PDF';btn.addEventListener('click',exportar);resumo.appendChild(btn);
    if(!document.getElementById('cma-exportar-pdf-style')){const st=document.createElement('style');st.id='cma-exportar-pdf-style';st.textContent='.cma-exportar-custo-pdf{display:inline-flex;align-items:center;justify-content:center;gap:7px;margin-top:14px;padding:9px 13px;border:1px solid rgba(255,255,255,.28);border-radius:8px;background:#fff;color:#082f7d;font-size:12.5px;font-weight:800;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.12);transition:.2s}.cma-exportar-custo-pdf:hover{background:#f8fafc;transform:translateY(-1px)}.cma-exportar-custo-pdf:disabled{opacity:.65;cursor:wait;transform:none}@media(max-width:800px){.cma-exportar-custo-pdf{width:100%;font-size:14px;padding:11px 14px}}';document.head.appendChild(st);}return true;
  }
  let tentativas=0;function iniciar(){if(instalar())return;if(++tentativas<40)setTimeout(iniciar,250);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();