(function(){
  if(window.CMAAdmissaoModalidades)return;

  function criar(){
    const sec=document.getElementById('admissao');
    if(!sec||document.getElementById('cma-admissao-modalidades'))return false;
    const alvo=sec.querySelector('.space-y-4.text-sm.text-gray-700')||sec;

    const bloco=document.createElement('div');
    bloco.id='cma-admissao-modalidades';
    bloco.className='cma-admissao-modalidades';
    bloco.innerHTML=`
      <div class="cma-adm-mod-head">
        <div><span class="cma-adm-mod-kicker">Antes de admitir</span><h4>Modalidades de Contratação</h4><p>A modalidade deve ser definida antes do envio da admissão, porque interfere na jornada, remuneração, contrato e rotina de pagamento.</p></div>
      </div>

      <div class="cma-adm-mod-grid">
        <article class="cma-adm-mod-card">
          <div class="cma-adm-mod-card-top"><span class="cma-adm-mod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span><div><h5>Contrato em Tempo Parcial</h5><span class="cma-adm-mod-ref">CLT, art. 58-A</span></div></div>
          <p>Indicado quando a empresa necessita de uma jornada semanal reduzida, com salário proporcional ao empregado que exerce a mesma função em tempo integral.</p>
          <dl>
            <div><dt>Opção 1</dt><dd>Até <strong>30 horas semanais</strong>, sem horas suplementares semanais.</dd></div>
            <div><dt>Opção 2</dt><dd>Até <strong>26 horas semanais</strong>, com possibilidade de até <strong>6 horas suplementares</strong> por semana.</dd></div>
            <div><dt>Hora suplementar</dt><dd>Adicional mínimo de <strong>50%</strong> sobre o salário-hora normal.</dd></div>
            <div><dt>Salário</dt><dd>Proporcional à jornada em relação aos empregados da mesma função em tempo integral.</dd></div>
            <div><dt>Férias</dt><dd>Seguem as regras gerais do art. 130 da CLT.</dd></div>
          </dl>
          <div class="cma-adm-mod-alerta"><strong>Cuidado:</strong> antes de contratar, confira a CCT/ACT da categoria, pois ela pode estabelecer condições específicas ou mais favoráveis.</div>
        </article>

        <article class="cma-adm-mod-card">
          <div class="cma-adm-mod-card-top"><span class="cma-adm-mod-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4M16 2v4"/><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01"/></svg></span><div><h5>Contrato de Trabalho Intermitente</h5><span class="cma-adm-mod-ref">CLT, arts. 443, §3º, e 452-A</span></div></div>
          <p>Utilizado quando a prestação de serviços não é contínua, alternando períodos de trabalho e inatividade. O empregado permanece contratado, mas trabalha mediante convocação.</p>
          <dl>
            <div><dt>Contrato</dt><dd>Deve ser celebrado <strong>por escrito</strong> e informar o valor da hora de trabalho.</dd></div>
            <div><dt>Valor da hora</dt><dd>Não pode ser inferior ao valor horário do salário mínimo nem ao devido aos empregados do estabelecimento que exerçam a mesma função.</dd></div>
            <div><dt>Convocação</dt><dd>Deve informar a jornada com pelo menos <strong>3 dias corridos</strong> de antecedência.</dd></div>
            <div><dt>Resposta</dt><dd>O empregado tem <strong>1 dia útil</strong> para aceitar ou recusar. O silêncio é considerado recusa e a recusa não descaracteriza o vínculo.</dd></div>
            <div><dt>Pagamento</dt><dd>Ao final de cada período trabalhado: remuneração, férias proporcionais + 1/3, 13º proporcional, DSR e adicionais legais, discriminados no recibo.</dd></div>
            <div><dt>Inatividade</dt><dd>Não é tempo à disposição e o trabalhador pode prestar serviços a outros contratantes.</dd></div>
          </dl>
          <div class="cma-adm-mod-alerta"><strong>Cuidado:</strong> o intermitente não deve ser tratado como empregado de jornada fixa disfarçado. Também é indispensável conferir a norma coletiva antes da contratação.</div>
        </article>
      </div>

      <div class="cma-adm-mod-resumo">
        <strong>Regra prática:</strong><span>se existe uma jornada reduzida, porém habitual e previamente definida, avalie o <b>tempo parcial</b>. Se a necessidade é descontínua e ocorre mediante convocações, avalie o <b>intermitente</b>.</span>
      </div>`;

    alvo.appendChild(bloco);
    instalarEstilo();
    return true;
  }

  function instalarEstilo(){
    if(document.getElementById('cma-admissao-modalidades-style'))return;
    const st=document.createElement('style');st.id='cma-admissao-modalidades-style';st.textContent=`
      .cma-admissao-modalidades{margin-top:20px}.cma-adm-mod-head{margin-bottom:13px}.cma-adm-mod-kicker{display:block;margin-bottom:3px;color:#2563eb;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.cma-adm-mod-head h4{margin:0;color:#172554;font-size:19px;font-weight:850}.cma-adm-mod-head p{margin:5px 0 0!important;color:#64748b!important;font-size:13px!important;line-height:1.55!important;text-align:left!important}.cma-adm-mod-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.cma-adm-mod-card{padding:17px;border:1px solid #e2e8f0;border-radius:13px;background:#fff;box-shadow:0 5px 14px rgba(15,23,42,.04)}.cma-adm-mod-card-top{display:flex;align-items:center;gap:11px}.cma-adm-mod-icon{display:grid;width:38px;height:38px;place-items:center;flex:0 0 38px;border-radius:10px;background:#eff6ff;color:#1e3a8a}.cma-adm-mod-icon svg{width:20px;height:20px}.cma-adm-mod-card h5{margin:0;color:#172554;font-size:15px;font-weight:850;line-height:1.3}.cma-adm-mod-ref{display:block;margin-top:2px;color:#94a3b8;font-size:10.5px;font-weight:700}.cma-adm-mod-card>p{margin:12px 0!important;color:#64748b!important;font-size:12.5px!important;line-height:1.55!important;text-align:left!important}.cma-adm-mod-card dl{margin:0}.cma-adm-mod-card dl>div{display:grid;grid-template-columns:105px minmax(0,1fr);gap:10px;padding:8px 0;border-top:1px solid #f1f5f9}.cma-adm-mod-card dt{color:#475569;font-size:11.5px;font-weight:850}.cma-adm-mod-card dd{margin:0;color:#475569;font-size:12px;line-height:1.5}.cma-adm-mod-card dd strong{color:#172554}.cma-adm-mod-alerta{margin-top:11px;padding:9px 10px;border-radius:8px;background:#fffbeb;color:#78350f;font-size:11.5px;line-height:1.5}.cma-adm-mod-resumo{display:flex;gap:7px;margin-top:12px;padding:12px 13px;border-left:4px solid #2563eb;border-radius:0 9px 9px 0;background:#f8fbff;color:#475569;font-size:12.5px;line-height:1.5}.cma-adm-mod-resumo strong{color:#172554;white-space:nowrap}@media(max-width:760px){.cma-adm-mod-grid{grid-template-columns:1fr}.cma-adm-mod-card{padding:15px}.cma-adm-mod-card dl>div{grid-template-columns:1fr;gap:3px}.cma-adm-mod-card dt{font-size:12px}.cma-adm-mod-card dd{font-size:13px}.cma-adm-mod-card>p{font-size:13px!important}.cma-adm-mod-resumo{display:block}.cma-adm-mod-resumo strong{display:block;margin-bottom:3px}}
    `;document.head.appendChild(st);
  }

  window.CMAAdmissaoModalidades={criar};
  let tentativas=0;(function iniciar(){if(criar())return;if(++tentativas<40)setTimeout(iniciar,180)})();
  document.addEventListener('cma:modulos-prontos',criar);
})();
