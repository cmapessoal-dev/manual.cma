(function(){
  if(window.CMAExportadorCalculadoras)return;
  const configs={
    'calculadora-ferias':{titulo:'Cálculo de Férias',empresa:'cma-ferias-empresa',empregado:'cma-ferias-empregado',resumo:'cma-ferias-total',sub:'cma-ferias-bruto-resumo',blocos:[['Proventos','cma-ferias-proventos'],['Descontos','cma-ferias-descontos']],memoria:'.cma-ferias-memoria'},
    'calculadora-decimo-terceiro':{titulo:'Cálculo de 13º Salário',empresa:'cma-13-empresa',empregado:'cma-13-empregado',resumo:'cma-13-total',sub:'cma-13-resumo-sub',blocos:[['Composição do 13º','cma-13-proventos'],['Descontos e saldo','cma-13-descontos']],memoria:'.cma-13-memoria'},
    'calculadora-horas-extras':{titulo:'Cálculo de Horas Extras e DSR',empresa:'cma-he-empresa',empregado:'cma-he-empregado',resumo:'cma-he-total',sub:'cma-he-resumo-sub',blocos:[['Horas extras','cma-he-composicao'],['DSR e total','cma-he-dsr']],memoria:'.cma-he-memoria'},
    'calculadora-adicional-noturno':{titulo:'Cálculo de Adicional Noturno',empresa:'cma-an-empresa',empregado:'cma-an-empregado',resumo:'cma-an-total',sub:'cma-an-resumo-sub',blocos:[['Apuração das horas','cma-an-composicao'],['Valor do adicional','cma-an-valores']],memoria:'.cma-an-memoria'},
    'calculadora-pro-labore':{titulo:'Cálculo de Pró-labore',empresa:'cma-pl-empresa',empregado:'cma-pl-empregado',resumo:'cma-pl-total',sub:'cma-pl-resumo-sub',blocos:[['Composição','cma-pl-composicao']],memoria:'.cma-pl-memoria'},
    'calculadora-faltas-atrasos':{titulo:'Cálculo de Faltas, Atrasos e DSR',empresa:'cma-fa-empresa',empregado:'cma-fa-empregado',resumo:'cma-fa-total',sub:'cma-fa-resumo-sub',blocos:[['Composição dos descontos','cma-fa-descontos']],memoria:'.cma-fa-memoria'},
    'calculadora-folha':{titulo:'Simulação de Folha de Pagamento',empresa:'cma-folha-empresa',empregado:'cma-folha-empregado',resumo:'cma-folha-liquido',sub:'cma-folha-resumo-sub',blocos:[['Proventos','cma-folha-proventos'],['Descontos e líquido','cma-folha-descontos']],memoria:'.cma-folha-memoria'},
    'calculadora-rescisao':{titulo:'Simulação de Rescisão',empresa:'cma-res-empresa',empregado:'cma-res-empregado',resumo:'cma-res-total',sub:'cma-res-resumo-sub',blocos:[['Composição das verbas','cma-res-verbas'],['Descontos','cma-res-descontos']],memoria:'.cma-res-memoria'},
    'calculadora-jornada':{titulo:'Análise de Jornada e Escala',empresa:'cma-jd-empresa',empregado:'cma-jd-empregado',resumo:'cma-jd-total',sub:'cma-jd-resumo-sub',blocos:[['Apuração da jornada','cma-jd-apuracao']],memoria:'.cma-jd-memoria'},
    'calculadora-aviso-previo':{titulo:'Contagem de Aviso-Prévio',empresa:'cma-av-empresa',empregado:'cma-av-empregado',resumo:'cma-av-total',sub:'cma-av-resumo-sub',blocos:[['Composição do aviso','cma-av-composicao']],memoria:'.cma-av-memoria'},
    'calculadora-experiencia':{titulo:'Contagem de Contrato de Experiência',empresa:'cma-exp-empresa',empregado:'cma-exp-empregado',resumo:'cma-exp-total',sub:'cma-exp-resumo-sub',blocos:[['Composição do contrato','cma-exp-composicao']],memoria:'.cma-exp-memoria'}
  };
  function texto(id){const e=document.getElementById(id);return e?(e.value||e.textContent||'').trim():'';}
  function carregarJsPdf(){if(window.jspdf&&window.jspdf.jsPDF)return Promise.resolve(window.jspdf.jsPDF);return new Promise((resolve,reject)=>{let s=document.getElementById('cma-jspdf-lib');if(s){if(window.jspdf?.jsPDF)return resolve(window.jspdf.jsPDF);s.addEventListener('load',()=>resolve(window.jspdf.jsPDF),{once:true});s.addEventListener('error',reject,{once:true});return;}s=document.createElement('script');s.id='cma-jspdf-lib';s.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';s.onload=()=>resolve(window.jspdf.jsPDF);s.onerror=reject;document.head.appendChild(s);});}
  async function carregarLogo(){try{const r=await fetch(new URL('logo.png',document.baseURI).href,{cache:'force-cache'});if(!r.ok)return null;const blob=await r.blob();return await new Promise((ok,no)=>{const fr=new FileReader();fr.onload=()=>ok(fr.result);fr.onerror=no;fr.readAsDataURL(blob);});}catch(e){return null;}}
  function linhas(id){const box=document.getElementById(id);if(!box)return [];return [...box.children].map(el=>{const s=el.querySelector('span'),v=el.querySelector('strong');return [s?s.textContent.trim():'',v?v.textContent.trim():''];}).filter(x=>x[0]||x[1]);}
  function memoria(sel,sec){const box=sec.querySelector(sel);if(!box)return [];return [...box.children].map(el=>{const s=el.querySelector('span'),v=el.querySelector('strong');return [s?s.textContent.trim():'',v?v.textContent.trim():''];}).filter(x=>x[0]||x[1]);}
  function tituloTabela(doc,x,y,w,titulo){
    doc.setFont('helvetica','bold');doc.setFontSize(10.5);doc.setTextColor(23,37,84);doc.text(titulo,x,y);
    const largura=Math.min(w-8,doc.getTextWidth(titulo)+5);doc.setDrawColor(203,213,225);doc.setLineWidth(.25);doc.line(x+largura,y-1,x+w,y-1);
    return y+5;
  }
  function tabela(doc,x,y,w,titulo,itens,novaPagina){
    if(!itens.length)return y;
    if(y+12>266)y=novaPagina();
    y=tituloTabela(doc,x,y,w,titulo);
    itens.forEach(([rotulo,valor],indice)=>{
      const linhasRotulo=doc.splitTextToSize(rotulo,w-55),altura=Math.max(8,linhasRotulo.length*3.6+3),destaque=/total|líquido|subtotal/i.test(rotulo);
      if(y+altura>268){y=novaPagina();y=tituloTabela(doc,x,y,w,`${titulo} - continuação`);}
      doc.setFillColor(...(destaque?[239,246,255]:indice%2?[255,255,255]:[248,250,252]));doc.setDrawColor(226,232,240);doc.roundedRect(x,y-1,w,altura,1.4,1.4,'FD');
      doc.setFont('helvetica',destaque?'bold':'normal');doc.setFontSize(8.2);doc.setTextColor(71,85,105);doc.text(linhasRotulo,x+3,y+4);
      doc.setFont('helvetica','bold');doc.setTextColor(30,41,59);doc.text(valor,x+w-3,y+4,{align:'right'});y+=altura+1.2;
    });
    return y+4;
  }
  async function gerar(secaoId){
    const c=configs[secaoId],sec=document.getElementById(secaoId);if(!c||!sec)return;const btn=sec.querySelector('.cma-exportar-calculadora'),old=btn?.innerHTML;
    if(btn){btn.disabled=true;btn.textContent='Gerando PDF...';}
    try{
      const [JsPDF,logo]=await Promise.all([carregarJsPdf(),carregarLogo()]),doc=new JsPDF({unit:'mm',format:'a4',orientation:'portrait',compress:true});
      const m=16,w=178,dataEmissao=new Date().toLocaleDateString('pt-BR');doc.setCharSpace?.(0);doc.setProperties({title:`${c.titulo} - CMA`,subject:'Relatório de cálculo para conferência',author:'CMA Assessoria Contábil',creator:'Manual CMA'});
      function cabecalho(continuacao=false){
        let y=14;if(logo)doc.addImage(logo,'PNG',m,y,24,12,undefined,'FAST');
        doc.setFont('helvetica','bold');doc.setFontSize(12.5);doc.setTextColor(23,37,84);doc.text('CMA Assessoria Contábil',44,y+5);
        doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(100,116,139);doc.text('Departamento Pessoal',44,y+10);
        doc.setFontSize(7.5);doc.text(`Emitido em ${dataEmissao}`,m+w,y+5,{align:'right'});if(continuacao)doc.text('Continuação do relatório',m+w,y+10,{align:'right'});
        doc.setDrawColor(245,181,27);doc.setLineWidth(.8);doc.line(m,32,m+w,32);return 41;
      }
      const novaPagina=()=>{doc.addPage();return cabecalho(true);};
      let y=cabecalho();
      doc.setFont('helvetica','bold');doc.setFontSize(7.5);doc.setTextColor(100,116,139);doc.text('RELATÓRIO DE CÁLCULO',m,y);y+=8;
      doc.setFontSize(17);doc.setTextColor(23,37,84);doc.text(c.titulo,m,y);y+=7;
      doc.setFillColor(248,250,252);doc.setDrawColor(226,232,240);doc.roundedRect(m,y,w,20,2,2,'FD');
      const metade=w/2;doc.setFont('helvetica','bold');doc.setFontSize(6.8);doc.setTextColor(100,116,139);doc.text('EMPRESA',m+5,y+6);doc.text('EMPREGADO',m+metade+3,y+6);
      doc.setFont('helvetica','normal');doc.setFontSize(8.7);doc.setTextColor(30,41,59);doc.text(doc.splitTextToSize(texto(c.empresa)||'Não informada',metade-10),m+5,y+12);doc.text(doc.splitTextToSize(texto(c.empregado)||'Não informado',metade-10),m+metade+3,y+12);y+=27;
      const subLinhas=doc.splitTextToSize(texto(c.sub)||'',w-14),alturaResumo=Math.max(27,23+Math.max(0,subLinhas.length-1)*3.5);
      doc.setFillColor(8,47,125);doc.roundedRect(m,y,w,alturaResumo,3,3,'F');doc.setTextColor(191,219,254);doc.setFont('helvetica','normal');doc.setFontSize(8.2);doc.text('Resultado principal',m+7,y+7);
      doc.setTextColor(255,255,255);doc.setFont('helvetica','bold');doc.setFontSize(20);doc.text(texto(c.resumo)||'—',m+7,y+17);
      doc.setTextColor(245,181,27);doc.setFontSize(7.6);doc.text(subLinhas,m+7,y+23);y+=alturaResumo+10;
      for(const [titulo,id] of c.blocos)y=tabela(doc,m,y,w,titulo,linhas(id),novaPagina);
      const mem=memoria(c.memoria,sec);if(mem.length)y=tabela(doc,m,y,w,'Memória do cálculo',mem,novaPagina);
      const aviso='Documento de estimativa para conferência e planejamento. O resultado pode variar conforme os dados do vínculo, as normas coletivas e as particularidades do caso.';
      const avisoLinhas=doc.splitTextToSize(aviso,w-18),alturaAviso=14+avisoLinhas.length*3.4;if(y+alturaAviso>270)y=novaPagina();
      doc.setFillColor(255,251,235);doc.setDrawColor(245,158,11);doc.roundedRect(m,y,w,alturaAviso,2,2,'FD');doc.setFillColor(245,158,11);doc.rect(m,y,1.4,alturaAviso,'F');
      doc.setFont('helvetica','bold');doc.setFontSize(7.8);doc.setTextColor(146,64,14);doc.text('Observação',m+5,y+6);
      doc.setFont('helvetica','normal');doc.setFontSize(7.2);doc.setTextColor(120,53,15);doc.text(avisoLinhas,m+5,y+11);
      const paginas=doc.getNumberOfPages();for(let pagina=1;pagina<=paginas;pagina++){doc.setPage(pagina);doc.setDrawColor(226,232,240);doc.setLineWidth(.25);doc.line(m,282,m+w,282);doc.setFont('helvetica','normal');doc.setFontSize(6.8);doc.setTextColor(148,163,184);doc.text('CMA Assessoria Contábil | Departamento Pessoal',m,288);doc.text(`Página ${pagina} de ${paginas}`,m+w,288,{align:'right'});}
      doc.save(`${c.titulo.replace(/[^a-zA-ZÀ-ÿ0-9]+/g,'-')}-CMA.pdf`);
    }catch(e){console.error(e);alert('Não foi possível gerar o PDF neste navegador.');}finally{if(btn){btn.disabled=false;btn.innerHTML=old;}}
  }
  function anexar(id){const c=configs[id],sec=document.getElementById(id);if(!c||!sec||sec.querySelector('.cma-exportar-calculadora'))return false;const resumo=sec.querySelector('[class*="-resumo"]');if(!resumo)return false;const b=document.createElement('button');b.type='button';b.className='cma-exportar-calculadora';b.innerHTML='<span aria-hidden="true">⇩</span> Exportar em PDF';b.addEventListener('click',()=>gerar(id));resumo.appendChild(b);return true;}
  function estilo(){if(document.getElementById('cma-exportador-calculadoras-style'))return;const s=document.createElement('style');s.id='cma-exportador-calculadoras-style';s.textContent='.cma-exportar-calculadora{display:inline-flex;align-items:center;justify-content:center;gap:7px;margin-top:13px;padding:9px 13px;border:1px solid rgba(255,255,255,.3);border-radius:8px;background:#fff;color:#082f7d;font-size:12.5px;font-weight:800;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.12)}.cma-exportar-calculadora:hover{background:#f8fafc;transform:translateY(-1px)}.cma-exportar-calculadora:disabled{opacity:.65;cursor:wait;transform:none}@media(max-width:700px){.cma-exportar-calculadora{width:100%;font-size:14px;padding:11px}}';document.head.appendChild(s);}
  function aplicar(){estilo();Object.keys(configs).forEach(anexar);}
  window.CMAExportadorCalculadoras={gerar,aplicar};
  aplicar();document.addEventListener('cma:modulos-prontos',aplicar);new MutationObserver(aplicar).observe(document.body,{childList:true,subtree:true});
})();
