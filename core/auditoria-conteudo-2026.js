(function(){
  function corrigirFaltas(){
    const sec=document.getElementById('faltas-justificaveis');if(!sec)return;
    const card=[...sec.querySelectorAll('div')].find(d=>d.querySelector&&d.querySelector('strong')?.textContent.trim()==='Nascimento, adoção ou guarda compartilhada');
    if(card){const p=card.querySelector('p');if(p)p.innerHTML='<strong>5 dias consecutivos até 31/12/2026.</strong> A partir de 01/01/2027, a Lei nº 15.371/2026 prevê licença-paternidade de 10 dias, com ampliação prevista para 15 dias em 2028 e 20 dias em 2029, esta última condicionada à regra fiscal prevista na própria lei.';}
    if(!sec.querySelector('.cma-aud-paternidade')){const box=document.createElement('div');box.className='cma-aud-paternidade';box.innerHTML='<strong>Proteção no período da licença-paternidade</strong><p>A Lei nº 15.371/2026 veda a dispensa arbitrária ou sem justa causa entre o início da licença-paternidade e 1 mês após o seu término.</p>';const alvo=sec.querySelector('.space-y-3');if(alvo)alvo.insertAdjacentElement('afterend',box);}
  }
  function corrigirAfastamentos(){
    const sec=document.getElementById('afastamentos');if(!sec)return;
    const validade=sec.querySelector('.cma-af-validade-atestado h5');if(validade)validade.textContent='Requisitos mínimos do documento médico';
    const itens=[...sec.querySelectorAll('.cma-af-info-item')];
    const s60=itens.find(x=>x.querySelector('h5')?.textContent.includes('60 dias'));if(s60){const p=s60.querySelector('p');if(p)p.textContent='Quando novos afastamentos ocorrerem dentro de 60 dias pelo mesmo motivo que gerou a incapacidade ou benefício anterior, pode haver aplicação das regras previdenciárias de continuidade ou soma dos períodos. A análise deve considerar a sequência dos afastamentos e o motivo informado.';}
    const mat=itens.find(x=>x.querySelector('h5')?.textContent==='Licença-maternidade');if(mat){const p=mat.querySelector('p');if(p)p.innerHTML='A licença-maternidade é, em regra, de 120 dias. Nos casos de internação hospitalar da mãe ou do recém-nascido por período superior a 2 semanas e relacionada ao parto, a Lei nº 15.222/2025 prevê extensão do período, observadas as condições legais.';}
  }
  function corrigirDemissao(){
    const lista=document.querySelector('#demissao .cma-dem-info-lista');if(!lista)return;
    if(!lista.querySelector('.cma-aud-data-base')){const s=document.createElement('section');s.className='cma-dem-info-item cma-aud-data-base';s.innerHTML='<h5>Data-base e indenização adicional</h5><p>Na dispensa sem justa causa ocorrida nos 30 dias que antecedem a data da correção salarial da categoria, pode ser devida a indenização adicional prevista no art. 9º da Lei nº 7.238/1984. Essa regra não é uma estabilidade que proíba a dispensa: trata-se de indenização específica, e a projeção do aviso-prévio deve ser considerada na análise.</p>';lista.appendChild(s);}
    if(!lista.querySelector('.cma-aud-paternidade-dem')){const s=document.createElement('section');s.className='cma-dem-info-item cma-aud-paternidade-dem';s.innerHTML='<h5>Licença-paternidade e proteção contra dispensa</h5><p>Desde 2026, deve ser verificada também a proteção prevista na Lei nº 15.371/2026, que veda a dispensa arbitrária ou sem justa causa desde o início da licença-paternidade até 1 mês após o seu término.</p>';lista.appendChild(s);}
  }
  function limparLegado(){document.getElementById('fiscalizacao')?.remove();}
  function referencias(){const sec=document.getElementById('baselegal');if(!sec||sec.querySelector('.cma-aud-referencias'))return;const d=document.createElement('div');d.className='cma-aud-referencias';d.innerHTML='<strong>Atualizações relevantes de 2025/2026:</strong> Lei nº 15.222/2025 (licença-maternidade em internação), Lei nº 15.371/2026 (licença-paternidade), Resolução CFM nº 2.381/2024 (documentos médicos) e Portaria MTE nº 1.316/2026 (trabalho em feriados no comércio).';sec.appendChild(d);}
  function estilo(){if(document.getElementById('cma-auditoria-style'))return;const st=document.createElement('style');st.id='cma-auditoria-style';st.textContent='.cma-aud-paternidade{margin-top:16px;padding:16px;border-left:4px solid #2563eb;background:#f8fbff}.cma-aud-paternidade strong{color:#172554;font-size:16px}.cma-aud-paternidade p,.cma-aud-referencias{margin-top:6px;color:#475569;font-size:15px;line-height:1.7}.cma-aud-referencias{margin-top:18px;padding:14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc}@media(max-width:700px){.cma-aud-paternidade p,.cma-aud-referencias{font-size:16px}}';document.head.appendChild(st);}
  function aplicar(){limparLegado();corrigirFaltas();corrigirAfastamentos();corrigirDemissao();referencias();estilo();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(aplicar,700));else setTimeout(aplicar,700);
  document.addEventListener('cma:modulos-prontos',()=>setTimeout(aplicar,100));
  document.addEventListener('cma:navegacao-atualizada',()=>setTimeout(aplicar,100));
})();