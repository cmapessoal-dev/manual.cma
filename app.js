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
   updateSectionNavigation(sectionId);
    if (window.innerWidth < 1024) {
        document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
    }
}
const manualSections = [
    { id: 'apresentacao', nome: 'Apresentação' },
    { id: 'introducao', nome: 'Introdução e Alinhamento' },
    { id: 'admissao', nome: 'Admissão de Funcionários' },
    { id: 'experiencia', nome: 'Contrato de Experiência' },
    { id: 'jornada', nome: 'Jornada e Horas Extras' },
    { id: 'afastamentos', nome: 'Atestados e Afastamentos' },
    { id: 'sst', nome: 'SST e CIPA' },
    { id: 'ferias', nome: 'Programação de Férias' },
    { id: 'beneficios', nome: 'Gestão de Benefícios' },
    { id: 'demissao', nome: 'CCT e Rotinas de Demissão' }
   { id: 'acidente', nome: 'Acidente de Trabalho' },
{ id: 'mei', nome: 'Contratação de MEI/Autônomos' },
{ id: 'cargos', nome: 'Plano de Cargos e Salários' },
{ id: 'cronograma', nome: 'Cronograma e Encargos' },
{ id: 'fiscalizacao', nome: 'Situações e Fiscalização' },
{ id: 'baselegal', nome: 'Bibliografia e Base Legal' }
];

function getMenuButton(sectionId) {
    const buttons = document.querySelectorAll('#manual-menu button');

    return Array.from(buttons).find(btn => {
        const action = btn.getAttribute('onclick') || '';
        return action.includes(`'${sectionId}'`);
    });
}
function navigateManual(sectionId) {
    const menuButton = getMenuButton(sectionId);

    if (menuButton) {
        showSection(sectionId, menuButton);

        document.querySelector('main').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
function updateSectionNavigation(sectionId) {
    const currentIndex = manualSections.findIndex(item => item.id === sectionId);
    const currentSection = document.getElementById(sectionId);

    if (!currentSection || currentIndex === -1) return;

    const oldNavigation = currentSection.querySelector('.cma-page-navigation');
    if (oldNavigation) oldNavigation.remove();

    const navigation = document.createElement('div');
    navigation.className = 'cma-page-navigation';

    if (currentIndex > 0) {
        const previous = manualSections[currentIndex - 1];

        const previousButton = document.createElement('button');
        previousButton.type = 'button';
        previousButton.className = 'cma-nav-btn cma-nav-anterior';
        previousButton.innerHTML = `← Anterior`;
        previousButton.onclick = () => navigateManual(previous.id);

        navigation.appendChild(previousButton);
    }

    if (currentIndex < manualSections.length - 1) {
        const next = manualSections[currentIndex + 1];

        const nextButton = document.createElement('button');
        nextButton.type = 'button';
        nextButton.className = 'cma-nav-btn cma-nav-proximo';
        nextButton.innerHTML = `Próximo →`;
        nextButton.onclick = () => navigateManual(next.id);

        navigation.appendChild(nextButton);
    }

    currentSection.appendChild(navigation);
}
// Alterna a visibilidade dos blocos explicativos de termos jurídicos/técnicos
function toggleExplainer(explainerId) {
    const expBlock = document.getElementById(explainerId);
    if (expBlock) {
        expBlock.classList.toggle('hidden');
    }
}
document.addEventListener('DOMContentLoaded', function () {
    updateSectionNavigation('apresentacao');
});
