(function(){
  if(window.CMAAcidenteConteudo)return;

  function instalarEstilo(){
    if(document.getElementById('cma-acidente-conteudo-style'))return;
    const st=document.createElement('style');
    st.id='cma-acidente-conteudo-style';
    st.textContent=`
      #acidente .cma-aci-head{margin-bottom:22px}
      #acidente .cma-aci-head>span{display:block;margin-bottom:5px;color:#2563eb;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
      #acidente .cma-aci-head h4{margin:0;color:#172554;font-size:22px;font-weight:850;line-height:1.3}
      #acidente .cma-aci-head p{max-width:820px;margin:8px 0 0!important;color:#64748b!important;font-size:15px!important;line-height:1.7!important;text-align:left!important}
      #acidente .cma-aci-lista{border-top:1px solid #e2e8f0}
      #acidente .cma-aci-item{padding:19px 2px;border-bottom:1px solid #e2e8f0}
      #acidente .cma-aci-item h5{margin:0 0 6px;color:#172554;font-size:17px;font-weight:850;line-height:1.4}
      #acidente .cma-aci-item p{margin:0!important;color:#475569!important;font-size:15px!important;line-height:1.7!important;text-align:left!important}
      #acidente .cma-aci-item p+p{margin-top:8px!important}
      #acidente .cma-aci-prazo{margin:0 -14px;padding:18px 16px;border-left:4px solid #f59e0b;background:#fffbeb}
      #acidente .cma-aci-prazo>span{display:inline-block;margin-top:7px;color:#92400e;font-size:12px;font-weight:800}
      #acidente .cma-aci-nota{margin-top:20px;padding:14px 15px;border-radius:10px;background:#f8fafc;color:#475569;font-size:13.5px;line-height:1.6}
      @media(max-width:700px){
        #acidente .cma-aci-head h4{font-size:21px}
        #acidente .cma-aci-head p,#acidente .cma-aci-item p{font-size:16px!important}
        #acidente .cma-aci-item h5{font-size:18px}
        #acidente .cma-aci-prazo{margin:0 -8px;padding:17px 12px}
        #acidente .cma-aci-nota{font-size:14px}
      }
    `;
    document.head.appendChild(st);
  }

  function aplicar(){
    const sec=document.getElementById('acidente');
    if(!sec||sec.dataset.cmaAcidenteConteudo==='1')return false;
    sec.dataset.cmaAcidenteConteudo='1';
    sec.innerHTML=`
      <div class="cma-aci-head">
        <span>Saúde e segurança do trabalho</span>
        <h4>Acidente de Trabalho</h4>
        <p>Ocorrências relacionadas ao trabalho exigem atenção imediata à comunicação, ao registro da CAT, ao afastamento previdenciário e aos efeitos trabalhistas que podem decorrer do caso.</p>
      </div>

      <div class="cma-aci-lista">
        <section class="cma-aci-item">
          <h5>O que pode ser caracterizado como acidente de trabalho</h5>
          <p>A legislação abrange o acidente típico e também situações equiparadas, como acidente de trajeto e doença profissional ou do trabalho, quando presentes os requisitos legais.</p>
        </section>

        <section class="cma-aci-item cma-aci-prazo">
          <h5>Comunicação e prazo da CAT</h5>
          <p>Ao tomar conhecimento de acidente de trabalho, acidente de trajeto ou possível doença ocupacional, a empresa deve encaminhar a informação imediatamente para análise e registro. A CAT deve ser comunicada à Previdência Social <strong>até o primeiro dia útil seguinte ao da ocorrência</strong> e, em caso de morte, a comunicação deve ser imediata à autoridade competente.</p>
          <span>Lei nº 8.213/1991, art. 22</span>
        </section>

        <section class="cma-aci-item">
          <h5>Afastamento e benefício previdenciário</h5>
          <p>Quando o acidente ou a doença relacionada ao trabalho resultar em incapacidade para o trabalho, deve ser analisada a necessidade de afastamento e, conforme a duração e o enquadramento previdenciário, o encaminhamento ao INSS.</p>
        </section>

        <section class="cma-aci-item">
          <h5>Estabilidade acidentária</h5>
          <p>Como regra geral, o empregado que permanece afastado por mais de 15 dias e recebe benefício por incapacidade temporária de natureza acidentária tem garantia de emprego por, no mínimo, <strong>12 meses após a cessação do benefício</strong>.</p>
          <p>Também deve ser considerada a hipótese reconhecida pela jurisprudência trabalhista em que a doença profissional é constatada após a dispensa e fica demonstrada a relação de causalidade com o trabalho.</p>
        </section>

        <section class="cma-aci-item">
          <h5>Análise antes do desligamento</h5>
          <p>Antes de qualquer desligamento de empregado que tenha histórico recente de acidente, afastamento ou doença possivelmente relacionada ao trabalho, é importante verificar a existência de garantia provisória de emprego e eventuais particularidades do caso.</p>
        </section>
      </div>

      <div class="cma-aci-nota"><strong>Base principal:</strong> Lei nº 8.213/1991, arts. 19 a 23 e 118, além da jurisprudência aplicável à estabilidade acidentária.</div>`;
    instalarEstilo();
    if(typeof updateSectionNavigation==='function')setTimeout(()=>updateSectionNavigation('acidente'),0);
    return true;
  }

  window.CMAAcidenteConteudo={aplicar};
  let tentativas=0;(function iniciar(){if(aplicar())return;if(++tentativas<60)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',aplicar);
})();