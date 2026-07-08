/* ==========================================================================
   Manual de Diretrizes Trabalhistas - CMA Assessoria Contábil
   Script principal: navegação entre seções e blocos explicativos
   ========================================================================== */

// Controla a exibição das seções e altera os estilos do menu lateral
function showSection(sectionId, buttonElement) {
    // Oculta todas as seções
    const sections = document.querySelectorAll('.manual-section');
    sections.forEach(sec => sec.classList.add('hidden'));
    sections.forEach(sec => sec.classList.remove('active'));

    // Exibe a seção selecionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('active');
    }

    // Reseta estilos de todos os botões do menu
    const menuButtons = document.querySelectorAll('#manual-menu button');
    menuButtons.forEach(btn => {
        btn.classList.remove('bg-blue-50', 'text-blue-950', 'border-l-4', 'border-blue-950', 'font-semibold');
        btn.classList.add('text-gray-600', 'font-medium', 'border-transparent');
    });

    // Aplica estilo ativo ao botão clicado
    buttonElement.classList.remove('text-gray-600', 'font-medium', 'border-transparent');
    buttonElement.classList.add('bg-blue-50', 'text-blue-950', 'border-l-4', 'border-blue-950', 'font-semibold');

    // Força a rolagem para o topo do conteúdo em telas menores
    if (window.innerWidth < 1024) {
        document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
    }
}

// Alterna a visibilidade dos blocos explicativos de termos jurídicos/técnicos
function toggleExplainer(explainerId) {
    const expBlock = document.getElementById(explainerId);
    if (expBlock) {
        expBlock.classList.toggle('hidden');
    }
}
