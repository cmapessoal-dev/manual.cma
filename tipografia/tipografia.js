(function(){
  if(document.getElementById('cma-tipografia-global'))return;
  const style=document.createElement('style');
  style.id='cma-tipografia-global';
  style.textContent=`
    /* Aumento global de legibilidade — calendário preservado */
    #manual-conteudo .text-sm:not(.cma-calendar-wrapper *),
    footer .text-sm,
    header .text-sm {
      font-size: 0.94rem !important;
      line-height: 1.62 !important;
    }

    #manual-conteudo .text-xs:not(.cma-calendar-wrapper *),
    footer .text-xs,
    header .text-xs {
      font-size: 0.82rem !important;
      line-height: 1.58 !important;
    }

    #manual-menu button {
      font-size: 0.92rem !important;
      line-height: 1.45 !important;
    }

    #manual-menu > span {
      font-size: 0.78rem !important;
    }

    [id^="exp-"]:not(.cma-calendar-wrapper *) {
      font-size: 0.84rem !important;
      line-height: 1.62 !important;
    }

    button[onclick^="toggleExplainer"] {
      font-size: 0.82rem !important;
    }

    .cma-search-input {
      font-size: 16px !important;
    }

    .cma-search-result-title {
      font-size: 15px !important;
    }

    .cma-search-result-snippet,
    .cma-search-counter,
    .cma-search-empty {
      font-size: 13.5px !important;
      line-height: 1.55 !important;
    }

    .cma-nav-btn {
      font-size: 14px !important;
    }

    .cma-modelos-head p,
    .cma-modelos-info,
    .cma-modelos-info strong,
    .cma-modelo-card p,
    .cma-modelos-empty strong,
    .cma-modelos-empty p {
      font-size: 13.5px !important;
      line-height: 1.6 !important;
    }

    .cma-modelo-card h3 {
      font-size: 16px !important;
    }

    .cma-modelo-file-text strong {
      font-size: 12.5px !important;
    }

    .cma-modelo-file-text span,
    .cma-modelo-file-action,
    .cma-modelo-count,
    .cma-modelo-status {
      font-size: 11.5px !important;
    }

    .cma-hero-text {
      font-size: 16px !important;
    }

    .cma-hero-meta,
    .cma-hero-btn {
      font-size: 14px !important;
    }

    @media (max-width: 640px) {
      #manual-conteudo .text-sm:not(.cma-calendar-wrapper *) {
        font-size: 1rem !important;
        line-height: 1.68 !important;
      }

      #manual-conteudo .text-xs:not(.cma-calendar-wrapper *),
      footer .text-xs,
      header .text-xs {
        font-size: 0.9rem !important;
        line-height: 1.62 !important;
      }

      #manual-menu button {
        font-size: 1rem !important;
        line-height: 1.5 !important;
        padding-top: 0.68rem !important;
        padding-bottom: 0.68rem !important;
      }

      #manual-menu > span {
        font-size: 0.84rem !important;
      }

      [id^="exp-"]:not(.cma-calendar-wrapper *) {
        font-size: 0.94rem !important;
        line-height: 1.68 !important;
      }

      button[onclick^="toggleExplainer"] {
        font-size: 0.9rem !important;
      }

      .cma-search-result-title {
        font-size: 16px !important;
      }

      .cma-search-result-snippet,
      .cma-search-counter,
      .cma-search-empty {
        font-size: 14.5px !important;
      }

      .cma-nav-btn {
        font-size: 15px !important;
      }

      .cma-modelos-head p,
      .cma-modelos-info,
      .cma-modelos-info strong,
      .cma-modelo-card p,
      .cma-modelos-empty strong,
      .cma-modelos-empty p {
        font-size: 15px !important;
        line-height: 1.65 !important;
      }

      .cma-modelo-card h3 {
        font-size: 17px !important;
      }

      .cma-modelo-file-text strong {
        font-size: 14px !important;
      }

      .cma-modelo-file-text span,
      .cma-modelo-file-action,
      .cma-modelo-count,
      .cma-modelo-status {
        font-size: 12.5px !important;
      }

      .cma-hero-text {
        font-size: 17px !important;
        line-height: 1.7 !important;
      }

      .cma-hero-meta,
      .cma-hero-btn {
        font-size: 15px !important;
      }
    }
  `;
  document.head.appendChild(style);
})();
