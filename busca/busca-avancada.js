(function(){
  function norm(t){return (t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
  function esc(t){return String(t??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
  function escapeRegExp(t){return String(t).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
  function destacarHtml(t,q){
    const safe=esc(t);
    try{return safe.replace(new RegExp('('+escapeRegExp(esc(q))+')','ig'),'<mark class="cma-search-result-mark">$1</mark>');}catch(e){return safe;}
  }
  function tituloSecao(secao,id){
    try{
      if(typeof manualSections!=='undefined'){
        const x=manualSections.find(s=>s.id===id);if(x)return x.nome;
      }
    }catch(e){}
    const h=secao.querySelector('h2,h3');return h?(h.textContent||'').trim():id;
  }
  function candidatos(secao){
    return Array.from(secao.querySelectorAll('h2,h3,h4,p,li,tr')).filter(el=>{
      if(el.closest('.cma-page-navigation,.cma-search-wrapper,.cma-aviso-legal,script,style'))return false;
      const t=(el.innerText||el.textContent||'').replace(/\s+/g,' ').trim();
      if(t.length<3)return false;
      if(el.matches('tr')&&el.querySelectorAll('td,th').length===0)return false;
      return true;
    });
  }
  function contexto(el){
    if(el.matches('h2,h3,h4'))return '';
    let p=el.previousElementSibling;
    while(p){if(p.matches('h2,h3,h4'))return (p.textContent||'').replace(/\s+/g,' ').trim();p=p.previousElementSibling;}
    const parent=el.parentElement&&el.parentElement.closest('section,article,div');
    const h=parent&&parent.querySelector(':scope > h2,:scope > h3,:scope > h4');
    return h?(h.textContent||'').replace(/\s+/g,' ').trim():'';
  }
  function construirResultados(q){
    const nq=norm(q),resultados=[];
    document.querySelectorAll('.manual-section').forEach(secao=>{
      const id=secao.id;if(!id)return;
      const nome=tituloSecao(secao,id);
      const vistos=new Set();
      candidatos(secao).forEach((el,i)=>{
        const texto=(el.innerText||el.textContent||'').replace(/\s+/g,' ').trim();
        if(!norm(texto).includes(nq))return;
        const chave=norm(texto).slice(0,220);if(vistos.has(chave))return;vistos.add(chave);
        const alvo=`cma-busca-${id}-${i}`;el.dataset.cmaBuscaAlvo=alvo;
        resultados.push({id,nome,texto,contexto:contexto(el),alvo,tipo:el.tagName.toLowerCase()});
      });
      if(norm(nome).includes(nq)&&!resultados.some(r=>r.id===id))resultados.push({id,nome,texto:nome,contexto:'Título da seção',alvo:'',tipo:'titulo'});
    });
    return resultados.slice(0,24);
  }
  function limparDestaques(){document.querySelectorAll('.cma-search-target-highlight').forEach(m=>m.replaceWith(document.createTextNode(m.textContent)));}
  function destacarNoAlvo(el,q){
    limparDestaques();if(!el)return null;const nq=norm(q);
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement;if(!p||p.closest('script,style'))return NodeFilter.FILTER_REJECT;return norm(n.nodeValue).includes(nq)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
    const nodes=[];let n;while(n=walker.nextNode())nodes.push(n);let first=null;
    nodes.forEach(node=>{const original=node.nodeValue;const idx=norm(original).indexOf(nq);if(idx<0)return;const frag=document.createDocumentFragment();frag.append(original.slice(0,idx));const mark=document.createElement('mark');mark.className='cma-search-target-highlight';mark.textContent=original.slice(idx,idx+q.length);frag.append(mark,original.slice(idx+q.length));node.replaceWith(frag);if(!first)first=mark;});
    return first;
  }
  function abrirResultado(btn){
    const id=btn.dataset.id,q=btn.dataset.q,alvo=btn.dataset.alvo;
    if(typeof showSection==='function')showSection(id,typeof getMenuButton==='function'?getMenuButton(id):null);
    const input=document.getElementById('cma-manual-search'),box=document.getElementById('cma-search-results');if(input)input.value=q;if(box)box.classList.add('cma-search-results-hidden');
    setTimeout(()=>{
      const secao=document.getElementById(id);let target=alvo?secao&&secao.querySelector(`[data-cma-busca-alvo="${CSS.escape(alvo)}"]`):secao;
      if(!target)target=secao;
      const mark=destacarNoAlvo(target,q);
      (mark||target)?.scrollIntoView({behavior:'smooth',block:'center'});
    },100);
  }
  function pesquisar(q){
    const box=document.getElementById('cma-search-results'),count=document.getElementById('cma-search-counter');if(!box||!count)return;
    q=(q||'').trim();limparDestaques();
    if(q.length<2){box.innerHTML='';box.classList.add('cma-search-results-hidden');count.textContent='';return;}
    const r=construirResultados(q);
    const paginas=new Set(r.map(x=>x.id)).size;
    count.textContent=r.length?`${r.length} trecho${r.length===1?'':'s'} encontrado${r.length===1?'':'s'} em ${paginas} página${paginas===1?'':'s'}`:'Nenhum resultado encontrado';
    box.innerHTML=r.length?r.map((x,i)=>`<button type="button" class="cma-search-result-item cma-search-result-item-advanced" data-id="${esc(x.id)}" data-q="${esc(q)}" data-alvo="${esc(x.alvo)}"><span class="cma-search-result-top"><span class="cma-search-result-title">${esc(x.nome)}</span><span class="cma-search-result-index">${i+1}</span></span>${x.contexto?`<span class="cma-search-result-context">${esc(x.contexto)}</span>`:''}<span class="cma-search-result-snippet">${destacarHtml(x.texto,q)}</span></button>`).join(''):`<div class="cma-search-empty">Nenhum conteúdo encontrado para <strong>“${esc(q)}”</strong>.</div>`;
    box.querySelectorAll('.cma-search-result-item').forEach(b=>b.addEventListener('click',()=>abrirResultado(b)));
    box.classList.remove('cma-search-results-hidden');
  }
  function instalar(){
    const input=document.getElementById('cma-manual-search'),box=document.getElementById('cma-search-results'),clear=document.getElementById('cma-search-clear');
    if(!input||!box||!clear||input.dataset.cmaBuscaAvancada==='1')return false;
    input.dataset.cmaBuscaAvancada='1';input.placeholder='Pesquisar assunto, palavra ou expressão...';
    let timer;
    input.oninput=e=>{clearTimeout(timer);timer=setTimeout(()=>pesquisar(e.target.value),100)};
    input.onkeydown=e=>{if(e.key==='Escape'){input.value='';pesquisar('');input.blur();}if(e.key==='Enter'){const first=box.querySelector('.cma-search-result-item');if(first){e.preventDefault();first.click();}}};
    clear.onclick=()=>{input.value='';pesquisar('');input.focus();};
    input.onfocus=()=>{if(input.value.trim().length>=2)pesquisar(input.value);};
    if(!document.getElementById('cma-busca-avancada-style')){const st=document.createElement('style');st.id='cma-busca-avancada-style';st.textContent=`.cma-search-results{max-height:min(62vh,560px);overflow-y:auto}.cma-search-result-item-advanced{padding:13px 15px}.cma-search-result-top{display:flex;align-items:center;justify-content:space-between;gap:12px}.cma-search-result-index{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;padding:0 6px;border-radius:999px;background:#f1f5f9;color:#64748b;font-size:10px;font-weight:800}.cma-search-result-context{display:block;margin:2px 0 4px;color:#1e3a8a;font-size:11px;font-weight:700}.cma-search-result-snippet{line-height:1.5}.cma-search-result-mark{padding:0 2px;border-radius:3px;background:#fef3c7;color:#92400e;font-weight:800}.cma-search-target-highlight{padding:1px 3px;border-radius:4px;background:#fef08a;color:#713f12;box-shadow:0 0 0 2px rgba(250,204,21,.18)}@media(max-width:640px){.cma-search-result-context{font-size:12px}.cma-search-results{max-height:60vh}}`;document.head.appendChild(st);}
    return true;
  }
  let tentativas=0;function iniciar(){if(instalar())return;if(++tentativas<50)setTimeout(iniciar,200);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();