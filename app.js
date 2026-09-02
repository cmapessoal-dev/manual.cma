function showSection(id,btn){
  document.querySelectorAll('.manual-section').forEach(s=>{s.classList.add('hidden');s.classList.remove('active')});
  const target=document.getElementById(id);
  if(target){target.classList.remove('hidden');target.classList.add('active')}
  document.querySelectorAll('#manual-menu button').forEach(b=>{b.classList.remove('bg-blue-50','text-blue-950','border-l-4','border-blue-950','font-semibold');b.classList.add('text-gray-600','font-medium','border-transparent')});
  if(btn){btn.classList.remove('text-gray-600','font-medium','border-transparent');btn.classList.add('bg-blue-50','text-blue-950','border-l-4','border-blue-950','font-semibold');btn.scrollIntoView({behavior:'smooth',block:'nearest'})}
  updateSectionNavigation(id);
  if(innerWidth<1024){const m=document.querySelector('main');if(m)m.scrollIntoView({behavior:'smooth'})}
}

const manualSections=[{id:'apresentacao',nome:'Apresentação'},{id:'introducao',nome:'Introdução e Alinhamento'}];

function getMenuButton(id){return [...document.querySelectorAll('#manual-menu button')].find(b=>(b.getAttribute('onclick')||'').includes(`'${id}'`))}
function navigateManual(id){const b=getMenuButton(id);if(b){showSection(id,b);document.querySelector('main')?.scrollIntoView({behavior:'smooth',block:'start'})}}
function updateSectionNavigation(id){
  const i=manualSections.findIndex(x=>x.id===id),s=document.getElementById(id);
  if(!s||i<0)return;
  s.querySelector('.cma-page-navigation')?.remove();
  const n=document.createElement('div');n.className='cma-page-navigation';
  if(i>0){const b=document.createElement('button');b.type='button';b.className='cma-nav-btn cma-nav-anterior';b.innerHTML='← Anterior';b.onclick=()=>navigateManual(manualSections[i-1].id);n.appendChild(b)}
  if(i<manualSections.length-1){const b=document.createElement('button');b.type='button';b.className='cma-nav-btn cma-nav-proximo';b.innerHTML='Próximo →';b.onclick=()=>navigateManual(manualSections[i+1].id);n.appendChild(b)}
  s.appendChild(n);
}
function toggleExplainer(id){document.getElementById(id)?.classList.toggle('hidden')}

let cmaCalendarDate=new Date();
const cmaMonthNames=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
function getEasterDate(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),day=(h+l-7*m+114)%31+1;return new Date(y,mo-1,day)}
function addDays(d,n){const r=new Date(d);r.setDate(r.getDate()+n);return r}
function dateKey(y,m,d){return`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
function getCmaHolidays(y){const h={},add=(m,d,n)=>h[dateKey(y,m-1,d)]=n;add(1,1,'Confraternização Universal');add(4,21,'Tiradentes');add(5,1,'Dia do Trabalho');add(9,7,'Independência do Brasil');add(10,12,'Nossa Senhora Aparecida');add(11,2,'Finados');add(11,15,'Proclamação da República');add(11,20,'Consciência Negra');add(12,25,'Natal');const e=getEasterDate(y),f=addDays(e,-2),c=addDays(e,-47),cc=addDays(e,60);h[dateKey(f.getFullYear(),f.getMonth(),f.getDate())]='Paixão de Cristo';add(1,20,'São Sebastião');h[dateKey(c.getFullYear(),c.getMonth(),c.getDate())]='Carnaval';add(4,23,'São Jorge');h[dateKey(cc.getFullYear(),cc.getMonth(),cc.getDate())]='Corpus Christi';return h}
function getFifthBusinessDay(y,m,h){let c=0;for(let d=1;d<=15;d++){const x=new Date(y,m,d);if(x.getDay()!==0&&!h[dateKey(y,m,d)]&&++c===5)return d}return null}
function previousBusinessDay(y,m,d,h){let x=new Date(y,m,d);while(x.getDay()===0||x.getDay()===6||h[dateKey(x.getFullYear(),x.getMonth(),x.getDate())])x.setDate(x.getDate()-1);return x}
function nextBusinessDay(y,m,d,h){let x=new Date(y,m,d);while(x.getDay()===0||x.getDay()===6||h[dateKey(x.getFullYear(),x.getMonth(),x.getDate())])x.setDate(x.getDate()+1);return x}
function getSalaryPaymentDate(y,m,h){const fifth=getFifthBusinessDay(y,m,h);if(fifth===null)return null;const date=new Date(y,m,fifth);if(date.getDay()===6)return previousBusinessDay(y,m,fifth-1,h);return date}
function addCalendarEvent(el,text,type){const e=document.createElement('span');e.className=`cma-calendar-event cma-event-${type}`;e.textContent=text;e.title=text;el.appendChild(e)}
function renderCmaCalendar(){
  const g=document.getElementById('cma-calendar-grid'),t=document.getElementById('calendar-month-title');if(!g||!t)return;
  g.innerHTML='';
  const y=cmaCalendarDate.getFullYear(),m=cmaCalendarDate.getMonth(),first=new Date(y,m,1).getDay(),last=new Date(y,m+1,0).getDate(),h=getCmaHolidays(y),salaryDate=getSalaryPaymentDate(y,m,h),d15=nextBusinessDay(y,m,15,h),d20=previousBusinessDay(y,m,20,h),today=new Date();
  t.textContent=`${cmaMonthNames[m]} ${y}`;
  for(let i=0;i<first;i++){const e=document.createElement('div');e.className='cma-calendar-day cma-calendar-empty';g.appendChild(e)}
  for(let d=1;d<=last;d++){
    const el=document.createElement('div');el.className='cma-calendar-day';
    if(today.getFullYear()===y&&today.getMonth()===m&&today.getDate()===d)el.classList.add('cma-calendar-today');
    const n=document.createElement('div');n.className='cma-calendar-day-number';n.textContent=d;el.appendChild(n);
    const k=dateKey(y,m,d);if(h[k])addCalendarEvent(el,h[k],'feriado');
    if(salaryDate&&salaryDate.getFullYear()===y&&salaryDate.getMonth()===m&&salaryDate.getDate()===d)addCalendarEvent(el,'Pagamento de salários','salario');
    if(d15.getFullYear()===y&&d15.getMonth()===m&&d15.getDate()===d){addCalendarEvent(el,'Fechamento do eSocial','esocial');addCalendarEvent(el,'GPS avulsa','gps')}
    if(d20.getFullYear()===y&&d20.getMonth()===m&&d20.getDate()===d)addCalendarEvent(el,'FGTS / INSS','encargos');
    g.appendChild(el);
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  updateSectionNavigation('apresentacao');
  renderCmaCalendar();
  const p=document.getElementById('calendar-prev'),n=document.getElementById('calendar-next');
  if(p)p.onclick=()=>{cmaCalendarDate.setMonth(cmaCalendarDate.getMonth()-1);renderCmaCalendar()};
  if(n)n.onclick=()=>{cmaCalendarDate.setMonth(cmaCalendarDate.getMonth()+1);renderCmaCalendar()};

  const core=document.createElement('script');
  core.dataset.cmaBootstrap='1';
  core.src='core/bootstrap.js?v=20260902h';
  core.async=false;
  document.body.appendChild(core);

  const ms=document.createElement('script');
  ms.src='modelos/modelos.js?v=20260902h';
  ms.defer=true;
  document.body.appendChild(ms);
});
