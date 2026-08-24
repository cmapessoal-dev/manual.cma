(function(){
  if(document.getElementById('cma-interface-refinements'))return;
  const st=document.createElement('style');
  st.id='cma-interface-refinements';
  st.textContent=`
    @keyframes cmaFadeInSection {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .manual-section:not(.hidden) {
      animation: cmaFadeInSection .3s ease-in-out;
    }

    @media (prefers-reduced-motion: reduce) {
      .manual-section:not(.hidden) { animation: none !important; }
    }

    @media print {
      @page { margin: 14mm; }

      html, body {
        background: #fff !important;
        color: #111827 !important;
      }

      aside,
      #manual-menu,
      header,
      nav,
      #apresentacao,
      .cma-exportar-calculadora,
      .cma-ferramentas-acoes,
      .section-navigation,
      .section-nav,
      .prev-next-buttons,
      .cma-sumario-grupo,
      button,
      [data-print-hide] {
        display: none !important;
      }

      #manual-conteudo,
      #manual-conteudo main,
      main {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        display: block !important;
      }

      .manual-section {
        display: none !important;
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
        box-shadow: none !important;
      }

      .manual-section:not(.hidden):not(#apresentacao) {
        display: block !important;
      }

      .manual-section:not(.hidden) * {
        box-shadow: none !important;
      }

      .manual-section:not(.hidden) a {
        color: inherit !important;
        text-decoration: none !important;
      }

      .manual-section:not(.hidden) input,
      .manual-section:not(.hidden) select,
      .manual-section:not(.hidden) textarea {
        border: 1px solid #d1d5db !important;
        background: #fff !important;
      }

      .manual-section:not(.hidden) table,
      .manual-section:not(.hidden) img,
      .manual-section:not(.hidden) .cma-prazo-card {
        break-inside: avoid;
      }
    }
  `;
  document.head.appendChild(st);
})();
