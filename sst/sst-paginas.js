(function(){
  function botaoClasse(){return 'w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 hover:translate-x-0.5 transition-all flex items-center border-l-4 border-transparent';}
  function icone(){return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 mr-2.5 shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';}
  function acharCard(wrapper,termo){const h=[...wrapper.querySelectorAll('h4')].find(x=>(x.textContent||'').includes(termo));return h?h.closest('.bg-white'):null;}
  function criarBotao(id,titulo,ref){let b=typeof getMenuButton==='function'?getMenuButton(id):null;if(b)return b;b=document.createElement('button');b.type='button';b.setAttribute('onclick',`showSection('${id}', this)`);b.className=botaoClasse();b.innerHTML=icone()+titulo;if(ref)ref.insertAdjacentElement('afterend',b);else document.getElementById('manual-menu').appendChild(b);return b;}
  function criarSecao(id,titulo,subtitulo,nos,ref){let s=document.getElementById(id);if(s)return s;s=document.createElement('section');s.id=id;s.className='manual-section hidden fade-in';s.innerHTML=`<div class="border-b border-gray-200 pb-4 mb-4"><h3 class="text-2xl font-bold text-blue-950">${titulo}</h3><p class="text-sm text-gray-500 mt-1">${subtitulo}</p></div><div class="space-y-4 text-sm text-gray-700"></div>`;const box=s.querySelector('.space-y-4');nos.filter(Boolean).forEach(n=>box.appendChild(n));ref.insertAdjacentElement('afterend',s);return s;}
  function instalar(){
    const sst=document.getElementById('sst'),wrapper=document.getElementById('cma-sst-atualizacoes');if(!sst||!wrapper)return false;
    if(document.getElementById('sst-cipa'))return true;
    const h=sst.querySelector('h3');if(h)h.textContent='Programas e Laudos de SST';
    const botaoSST=typeof getMenuButton==='function'?getMenuButton('sst'):null;if(botaoSST)botaoSST.innerHTML=icone()+'Programas e Laudos';

    const riscos=acharCard(wrapper,'Riscos Psicossociais');
    const orientacao=[...wrapper.children].find(x=>(x.textContent||'').includes('Orientação CMA — atualização do PGR'));
    const cipa=acharCard(wrapper,'CIPA —');
    const campanhas=acharCard(wrapper,'Campanhas de Vacinação');

    let refSec=sst,refBtn=botaoSST;
    const defs=[
      ['sst-cipa','CIPA','Comissão Interna de Prevenção de Acidentes e de Assédio',[cipa]],
      ['sst-riscos-psicossociais','Riscos Psicossociais','Gerenciamento dos fatores psicossociais relacionados ao trabalho',[riscos,orientacao]],
      ['sst-campanhas','Campanhas de Saúde','Vacinação, prevenção e conscientização em saúde',[campanhas]]
    ];
    defs.forEach(([id,titulo,sub,nos])=>{const sec=criarSecao(id,titulo,sub,nos,refSec);refSec=sec;refBtn=criarBotao(id,titulo,refBtn);});

    if(typeof manualSections!=='undefined'){
      const i=manualSections.findIndex(x=>x.id==='sst');
      if(i>=0){manualSections[i].nome='Programas e Laudos';const novos=[{id:'sst-cipa',nome:'CIPA'},{id:'sst-riscos-psicossociais',nome:'Riscos Psicossociais'},{id:'sst-campanhas',nome:'Campanhas de Saúde'}];novos.forEach((n,k)=>{if(!manualSections.some(x=>x.id===n.id))manualSections.splice(i+1+k,0,n);});}
      if(typeof updateSectionNavigation==='function')['sst','sst-cipa','sst-riscos-psicossociais','sst-campanhas'].forEach(updateSectionNavigation);
    }
    const hash=(location.hash||'').replace(/^#/,'');if(['sst-cipa','sst-riscos-psicossociais','sst-campanhas'].includes(hash))setTimeout(()=>{if(typeof showSection==='function')showSection(hash,typeof getMenuButton==='function'?getMenuButton(hash):null);},100);
    return true;
  }
  let n=0;(function tentar(){if(instalar())return;if(++n<50)setTimeout(tentar,200)})();
})();