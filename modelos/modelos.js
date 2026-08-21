(function(){
  let navegacaoProfundaInstalada=false;
  let showSectionOriginal=null;

  function criarAreaModelos(){
    const menu=document.getElementById('manual-menu');
    const main=document.querySelector('#manual-conteudo main');
    if(!menu||!main)return;

    if(!document.getElementById('modelos')){
      const divisor=Array.from(menu.querySelectorAll('div')).find(d=>d.classList.contains('border-t')&&d.nextElementSibling&&((d.nextElementSibling.getAttribute('onclick')||'').includes("baselegal")));
      const botao=document.createElement('button');
      botao.type='button';
      botao.setAttribute('onclick',"showSection('modelos', this)");
      botao.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';
      botao.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-4 h-4 mr-2.5 shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h6"/></svg> Modelos de Documentos';
      if(divisor)menu.insertBefore(botao,divisor);else menu.appendChild(botao);

      const section=document.createElement('section');
      section.id='modelos';
      section.className='manual-section hidden fade-in';
      section.innerHTML=`
        <div class="cma-modelos-head">
          <div class="cma-modelos-title-row">
            <div class="cma-modelos-title-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>
            </div>
            <div>
              <h2>Modelos de Documentos</h2>
              <p>Central de documentos para apoio às rotinas do Departamento Pessoal.</p>
            </div>
          </div>
        </div>

        <div class="cma-modelos-info">
          <strong>Biblioteca de modelos CMA</strong>
          <span>Os documentos serão disponibilizados nesta área para consulta e download. Sempre confira se o modelo está adequado à situação concreta antes da utilização.</span>
        </div>

        <div class="cma-modelos-grid">
          ${card('admissao','Admissão','Contratos, fichas, declarações e documentos utilizados no início do vínculo.')}
          ${card('jornada','Jornada e Ponto','Banco de horas, alteração de horário, compensação e controles de jornada.')}
          ${card('ferias','Férias','Avisos, recibos, comunicados e documentos relacionados às férias.')}
          ${card('disciplinar','Advertências e Suspensões','Modelos para aplicação de medidas disciplinares e registro de ocorrências.')}
          ${card('rescisao','Rescisão','Comunicados, pedidos de demissão, avisos e documentos de encerramento do vínculo.')}
          ${card('outros','Outros Documentos','Declarações, termos e modelos complementares de Departamento Pessoal.')}
        </div>

        <div class="cma-modelos-empty">
          <div class="cma-modelos-empty-icon">+</div>
          <div><strong>Área pronta para receber os arquivos</strong><p>Os próximos modelos poderão ser adicionados a estas categorias sem alterar a estrutura do manual.</p></div>
        </div>`;

      const base=document.getElementById('baselegal');
      if(base)main.insertBefore(section,base);else main.appendChild(section);

      const pos=manualSections.findIndex(x=>x.id==='baselegal');
      if(!manualSections.some(x=>x.id==='modelos')) manualSections.splice(pos>=0?pos:manualSections.length,0,{id:'modelos',nome:'Modelos de Documentos'});
    }

    if(!document.getElementById('cma-modelos-style')){
      const style=document.createElement('style');style.id='cma-modelos-style';
      style.textContent=`
      .cma-modelos-head{padding-bottom:18px;margin-bottom:20px;border-bottom:1px solid #e5e7eb}.cma-modelos-title-row{display:flex;align-items:center;gap:14px}.cma-modelos-title-icon{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:#eff6ff;color:#172554;flex:0 0 auto}.cma-modelos-title-icon svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.cma-modelos-head h2{margin:0;color:#172554;font-size:24px;font-weight:800;line-height:1.2}.cma-modelos-head p{margin:4px 0 0;color:#64748b;font-size:13px}.cma-modelos-info{display:flex;flex-direction:column;gap:4px;margin-bottom:20px;padding:15px 17px;border-left:4px solid #172554;border-radius:0 10px 10px 0;background:#eff6ff;color:#1e3a8a;font-size:13px;line-height:1.5}.cma-modelos-info strong{font-size:13px;color:#172554}.cma-modelos-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.cma-modelo-card{display:flex;flex-direction:column;min-height:175px;padding:17px;border:1px solid #e2e8f0;border-radius:13px;background:#fff;box-shadow:0 5px 16px rgba(15,23,42,.04);transition:.2s}.cma-modelo-card:hover{transform:translateY(-2px);border-color:#cbd5e1;box-shadow:0 10px 24px rgba(15,23,42,.08)}.cma-modelo-card-top{display:flex;align-items:center;gap:11px;margin-bottom:10px}.cma-modelo-card-icon{width:37px;height:37px;border-radius:10px;display:grid;place-items:center;background:#f8fafc;border:1px solid #e2e8f0;color:#1e3a8a;font-weight:800;font-size:13px}.cma-modelo-card h3{margin:0;color:#172554;font-size:15px;font-weight:800}.cma-modelo-card p{margin:0 0 14px;color:#64748b;font-size:12.5px;line-height:1.5;flex:1}.cma-modelo-card-footer{display:flex;align-items:center;justify-content:space-between;padding-top:11px;border-top:1px solid #f1f5f9}.cma-modelo-count{font-size:11px;font-weight:700;color:#94a3b8}.cma-modelo-status{padding:5px 8px;border-radius:999px;background:#f1f5f9;color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.03em}.cma-modelo-status-disponivel{background:#dcfce7;color:#166534}.cma-modelo-file{display:flex;align-items:center;gap:10px;margin-top:2px;margin-bottom:13px;padding:10px 11px;border:1px solid #dbeafe;border-radius:10px;background:#f8fbff;text-decoration:none}.cma-modelo-file:hover{background:#eff6ff;border-color:#bfdbfe}.cma-modelo-file-icon{width:32px;height:32px;display:grid;place-items:center;border-radius:8px;background:#fee2e2;color:#b91c1c;font-size:10px;font-weight:900;flex:0 0 auto}.cma-modelo-file-text{min-width:0;flex:1}.cma-modelo-file-text strong{display:block;color:#172554;font-size:11.5px;line-height:1.35}.cma-modelo-file-text span{display:block;margin-top:2px;color:#64748b;font-size:10.5px}.cma-modelo-file-action{color:#1e3a8a;font-size:11px;font-weight:800;white-space:nowrap}.cma-modelos-empty{display:flex;align-items:center;gap:13px;margin-top:18px;padding:15px;border:1px dashed #cbd5e1;border-radius:12px;background:#f8fafc}.cma-modelos-empty-icon{width:34px;height:34px;display:grid;place-items:center;border-radius:50%;background:#fff;border:1px solid #dbe3ee;color:#1e3a8a;font-size:22px}.cma-modelos-empty strong{display:block;color:#334155;font-size:12px}.cma-modelos-empty p{margin:2px 0 0;color:#94a3b8;font-size:11px;line-height:1.4}@media(max-width:700px){.cma-modelos-grid{grid-template-columns:1fr}.cma-modelos-head h2{font-size:21px}.cma-modelos-title-row{align-items:flex-start}.cma-modelo-file{align-items:flex-start}.cma-modelo-file-action{display:none}}`;
      document.head.appendChild(style);
    }

    instalarLinksDiretos();
    carregarComplementoJornada();
    carregarComercioFeriados();
  }

  function card(sigla,titulo,texto){
    if(sigla==='admissao'){
      return `<article class="cma-modelo-card" data-categoria="admissao"><div class="cma-modelo-card-top"><div class="cma-modelo-card-icon">AD</div><h3>${titulo}</h3></div><p>${texto}</p><a class="cma-modelo-file" href="modelos/admissao/documentos-e-informacoes-para-admissao-clt.pdf" target="_blank" rel="noopener"><span class="cma-modelo-file-icon">PDF</span><span class="cma-modelo-file-text"><strong>Documentos e Informações para Admissão — Funcionário CLT</strong><span>Formulário de admissão • PDF</span></span><span class="cma-modelo-file-action">Abrir ↗</span></a><div class="cma-modelo-card-footer"><span class="cma-modelo-count">1 modelo disponível</span><span class="cma-modelo-status cma-modelo-status-disponivel">Disponível</span></div></article>`;
    }
    return `<article class="cma-modelo-card" data-categoria="${sigla}"><div class="cma-modelo-card-top"><div class="cma-modelo-card-icon">${sigla.slice(0,2).toUpperCase()}</div><h3>${titulo}</h3></div><p>${texto}</p><div class="cma-modelo-card-footer"><span class="cma-modelo-count">Nenhum arquivo cadastrado</span><span class="cma-modelo-status">Em preparação</span></div></article>`;
  }

  function carregarComplementoJornada(){
    if(document.getElementById('cma-jornada-extra-loader')||document.getElementById('cma-jornada-domingos-feriados'))return;
    const script=document.createElement('script');
    script.id='cma-jornada-extra-loader';
    script.src='jornada/jornada-extra.js?v=20260821';
    document.body.appendChild(script);
  }

  function carregarComercioFeriados(){
    if(document.getElementById('cma-comercio-feriados-loader')||document.getElementById('comercio-feriados'))return;
    const script=document.createElement('script');
    script.id='cma-comercio-feriados-loader';
    script.src='comercio-feriados/comercio-feriados.js?v=20260821';
    document.body.appendChild(script);
  }

  function idDaHash(){
    const valor=decodeURIComponent((window.location.hash||'').replace(/^#/,'') );
    return manualSections.some(item=>item.id===valor)?valor:null;
  }

  function abrirSecaoSemAlterarUrl(id){
    if(!id||!showSectionOriginal)return;
    const botao=getMenuButton(id);
    showSectionOriginal(id,botao||null);
  }

  function instalarLinksDiretos(){
    if(navegacaoProfundaInstalada||typeof window.showSection!=='function')return;
    navegacaoProfundaInstalada=true;
    showSectionOriginal=window.showSection;

    window.showSection=function(id,buttonElement){
      showSectionOriginal(id,buttonElement);
      const novaHash='#'+encodeURIComponent(id);
      if(window.location.hash!==novaHash){
        history.pushState({section:id},'',novaHash);
      }
    };

    const inicial=idDaHash();
    if(inicial){
      abrirSecaoSemAlterarUrl(inicial);
      setTimeout(()=>{
        const main=document.querySelector('#manual-conteudo main');
        if(main)main.scrollIntoView({behavior:'auto',block:'start'});
      },0);
    }

    window.addEventListener('popstate',()=>{
      const id=idDaHash()||'apresentacao';
      abrirSecaoSemAlterarUrl(id);
    });

    window.addEventListener('hashchange',()=>{
      const id=idDaHash();
      if(id)abrirSecaoSemAlterarUrl(id);
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',criarAreaModelos);else criarAreaModelos();
})();