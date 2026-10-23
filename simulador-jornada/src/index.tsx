import {createRoot} from 'react-dom/client';
import ScheduleFive from './schedule-five';
import css from './simulador.css';
import {useState} from 'react';
import TeamCoverage from './team-coverage';
function Simulator(){const [tab,setTab]=useState('individual');return <><div className="coverage-tabs" role="group" aria-label="Modo do simulador"><button aria-pressed={tab==='individual'} onClick={()=>setTab('individual')}>Escala individual</button><button aria-pressed={tab==='team'} onClick={()=>setTab('team')}>Dimensionamento e equipes</button></div><div hidden={tab!=='individual'}><ScheduleFive/></div><div hidden={tab!=='team'}><TeamCoverage/></div></>}

const id='simulador-jornada';
const entry={id,nome:'Simulador de Jornada 5×2',grupo:'ferramentas',ferramenta:{categoria:'jornada',titulo:'Simulador de Jornada 5×2',descricao:'Monte horários e folgas, compare escalas e exporte os PDFs técnico e de apresentação.',icone:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18M8 14h3"/>',tag:'Novo'}};
const w=window as any;
function open(){if(typeof w.navigateManual==='function')w.navigateManual(id);else w.showSection?.(id,document.querySelector('[data-cma-simulador-menu]'));}
function install(){
  const main=document.querySelector('#manual-conteudo main'),menu=document.getElementById('manual-menu');
  if(!main||!menu)return;
  if(w.CMARegistroManual&&!w.CMARegistroManual.pagina(id))w.CMARegistroManual.paginas.push(entry);
  if(!document.getElementById(id)){
    const section=document.createElement('section');section.id=id;section.className='manual-section hidden fade-in';
    const back=document.createElement('button');back.type='button';back.className='cma-voltar-central';back.textContent='← Ferramentas';back.onclick=()=>w.navigateManual?.('central-ferramentas');section.appendChild(back);
    const root=document.createElement('div');root.id='cma-simulador-jornada-root';section.appendChild(root);
    main.insertBefore(section,document.getElementById('baselegal'));
    const style=document.createElement('style');style.textContent=css;style.id='cma-simulador-jornada-style';document.head.appendChild(style);
    createRoot(root).render(<Simulator/>);
  }
  if(![...menu.querySelectorAll('button')].some(b=>b.getAttribute('onclick')?.includes("'"+id+"'"))){
    const button=document.createElement('button');button.type='button';button.dataset.cmaSimuladorMenu='1';button.setAttribute('onclick',"showSection('simulador-jornada', this)");button.className='w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center border-l-4 border-transparent';button.textContent=entry.nome;menu.appendChild(button);
  }
  const central=document.getElementById('central-ferramentas');
  if(central&&!central.querySelector('[data-central-alvo="simulador-jornada"]')){
    const group=[...central.querySelectorAll('.cma-central-grupo')].find(g=>g.querySelector('h4')?.textContent?.includes('Jornada'));
    const cards=group?.querySelector('.cma-central-cards');
    if(cards){const card=document.createElement('button');card.type='button';card.className='cma-central-card';card.dataset.centralAlvo=id;
      card.innerHTML='<span class="cma-central-card-icone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">'+entry.ferramenta.icone+'</svg></span><span class="cma-central-card-conteudo"><span class="cma-central-card-titulo">'+entry.ferramenta.titulo+'<em>Novo</em></span><span class="cma-central-card-texto">'+entry.ferramenta.descricao+'</span></span><span class="cma-central-card-seta">›</span>';card.onclick=open;cards.appendChild(card);}
  }
  if(location.hash==='#'+id)requestAnimationFrame(open);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
document.addEventListener('cma:modulos-prontos',install);
document.addEventListener('cma:central-ferramentas-criada',install);
