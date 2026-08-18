/* ==========================================================================
   Manual de Diretrizes Trabalhistas - CMA Assessoria Contábil
   Script principal: navegação entre seções, blocos explicativos
   e calendário automático de obrigações
   ========================================================================== */


// ==========================================================================
// NAVEGAÇÃO ENTRE AS SEÇÕES
// ==========================================================================

function showSection(sectionId, buttonElement) {

    // Oculta todas as seções
    const sections = document.querySelectorAll('.manual-section');

    sections.forEach(sec => {
        sec.classList.add('hidden');
        sec.classList.remove('active');
    });


    // Exibe a seção selecionada
    const targetSection = document.getElementById(sectionId);

    if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('active');
    }


    // Reseta todos os botões do menu lateral
    const menuButtons = document.querySelectorAll('#manual-menu button');

    menuButtons.forEach(btn => {
        btn.classList.remove(
            'bg-blue-50',
            'text-blue-950',
            'border-l-4',
            'border-blue-950',
            'font-semibold'
        );

        btn.classList.add(
            'text-gray-600',
            'font-medium',
            'border-transparent'
        );
    });


    // Destaca o botão da página atual
    if (buttonElement) {

        buttonElement.classList.remove(
            'text-gray-600',
            'font-medium',
            'border-transparent'
        );

        buttonElement.classList.add(
            'bg-blue-50',
            'text-blue-950',
            'border-l-4',
            'border-blue-950',
            'font-semibold'
        );

        buttonElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }


    // Atualiza botões Anterior / Próximo
    updateSectionNavigation(sectionId);


    // Em telas menores, leva ao conteúdo
    if (window.innerWidth < 1024) {

        const main = document.querySelector('main');

        if (main) {
            main.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
}


// ==========================================================================
// ORDEM DAS PÁGINAS
// ==========================================================================

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
    { id: 'demissao', nome: 'CCT e Rotinas de Demissão' },
    { id: 'acidente', nome: 'Acidente de Trabalho' },
    { id: 'mei', nome: 'Contratação de MEI/Autônomos' },
    { id: 'cargos', nome: 'Plano de Cargos e Salários' },
    { id: 'cronograma', nome: 'Calendário de Obrigações' },
    { id: 'fiscalizacao', nome: 'Situações e Fiscalização' },
    { id: 'baselegal', nome: 'Bibliografia e Base Legal' }

];


// Localiza o botão lateral correspondente à seção
function getMenuButton(sectionId) {

    const buttons =
        document.querySelectorAll('#manual-menu button');

    return Array.from(buttons).find(btn => {

        const action =
            btn.getAttribute('onclick') || '';

        return action.includes(`'${sectionId}'`);
    });
}


// Navega para outra página
function navigateManual(sectionId) {

    const menuButton =
        getMenuButton(sectionId);

    if (menuButton) {

        showSection(
            sectionId,
            menuButton
        );

        const main =
            document.querySelector('main');

        if (main) {

            main.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}


// ==========================================================================
// BOTÕES ANTERIOR / PRÓXIMO
// ==========================================================================

function updateSectionNavigation(sectionId) {

    const currentIndex =
        manualSections.findIndex(
            item => item.id === sectionId
        );

    const currentSection =
        document.getElementById(sectionId);


    if (
        !currentSection ||
        currentIndex === -1
    ) {
        return;
    }


    // Remove navegação anterior
    const oldNavigation =
        currentSection.querySelector(
            '.cma-page-navigation'
        );

    if (oldNavigation) {
        oldNavigation.remove();
    }


    const navigation =
        document.createElement('div');

    navigation.className =
        'cma-page-navigation';


    // ANTERIOR
    if (currentIndex > 0) {

        const previous =
            manualSections[currentIndex - 1];

        const previousButton =
            document.createElement('button');

        previousButton.type =
            'button';

        previousButton.className =
            'cma-nav-btn cma-nav-anterior';

        previousButton.innerHTML =
            '← Anterior';

        previousButton.onclick =
            () => navigateManual(previous.id);

        navigation.appendChild(
            previousButton
        );
    }


    // PRÓXIMO
    if (
        currentIndex <
        manualSections.length - 1
    ) {

        const next =
            manualSections[currentIndex + 1];

        const nextButton =
            document.createElement('button');

        nextButton.type =
            'button';

        nextButton.className =
            'cma-nav-btn cma-nav-proximo';

        nextButton.innerHTML =
            'Próximo →';

        nextButton.onclick =
            () => navigateManual(next.id);

        navigation.appendChild(
            nextButton
        );
    }


    currentSection.appendChild(
        navigation
    );
}


// ==========================================================================
// ENTENDA OS TERMOS
// ==========================================================================

function toggleExplainer(explainerId) {

    const expBlock =
        document.getElementById(explainerId);

    if (expBlock) {

        expBlock.classList.toggle(
            'hidden'
        );
    }
}


// ==========================================================================
// CALENDÁRIO AUTOMÁTICO
// ==========================================================================

let cmaCalendarDate =
    new Date();


const cmaMonthNames = [

    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'

];


// Calcula a data da Páscoa
function getEasterDate(year) {

    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);

    const h =
        (19 * a + b - d - g + 15) % 30;

    const i =
        Math.floor(c / 4);

    const k =
        c % 4;

    const l =
        (32 + 2 * e + 2 * i - h - k) % 7;

    const m =
        Math.floor(
            (a + 11 * h + 22 * l) / 451
        );

    const month =
        Math.floor(
            (h + l - 7 * m + 114) / 31
        );

    const day =
        ((h + l - 7 * m + 114) % 31) + 1;


    return new Date(
        year,
        month - 1,
        day
    );
}


// Soma ou subtrai dias
function addDays(date, days) {

    const result =
        new Date(date);

    result.setDate(
        result.getDate() + days
    );

    return result;
}


// Cria chave YYYY-MM-DD
function dateKey(
    year,
    month,
    day
) {

    return (
        `${year}-` +
        `${String(month + 1).padStart(2, '0')}-` +
        `${String(day).padStart(2, '0')}`
    );
}


// ==========================================================================
// FERIADOS NACIONAIS + RIO DE JANEIRO
// ==========================================================================

function getCmaHolidays(year) {

    const holidays = {};


    function add(
        month,
        day,
        name
    ) {

        holidays[
            dateKey(
                year,
                month - 1,
                day
            )
        ] = name;
    }


    // Feriados nacionais
    add(1, 1, 'Confraternização Universal');
    add(4, 21, 'Tiradentes');
    add(5, 1, 'Dia do Trabalho');
    add(9, 7, 'Independência do Brasil');
    add(10, 12, 'Nossa Senhora Aparecida');
    add(11, 2, 'Finados');
    add(11, 15, 'Proclamação da República');
    add(11, 20, 'Consciência Negra');
    add(12, 25, 'Natal');


    // Páscoa
    const easter =
        getEasterDate(year);


    // Paixão de Cristo
    const goodFriday =
        addDays(easter, -2);

    holidays[
        dateKey(
            goodFriday.getFullYear(),
            goodFriday.getMonth(),
            goodFriday.getDate()
        )
    ] = 'Paixão de Cristo';


    // ------------------------------------------------------
    // Rio de Janeiro
    // ------------------------------------------------------

    // São Sebastião
    add(
        1,
        20,
        'São Sebastião'
    );


    // Terça-feira de Carnaval
    const carnivalTuesday =
        addDays(easter, -47);

    holidays[
        dateKey(
            carnivalTuesday.getFullYear(),
            carnivalTuesday.getMonth(),
            carnivalTuesday.getDate()
        )
    ] = 'Carnaval';


    // São Jorge
    add(
        4,
        23,
        'São Jorge'
    );


    // Corpus Christi
    const corpusChristi =
        addDays(easter, 60);

    holidays[
        dateKey(
            corpusChristi.getFullYear(),
            corpusChristi.getMonth(),
            corpusChristi.getDate()
        )
    ] = 'Corpus Christi';


    return holidays;
}


// ==========================================================================
// 5º DIA ÚTIL — PAGAMENTO DOS SALÁRIOS
// ==========================================================================

// Para salário, sábado é considerado dia útil.
// Domingo e feriado não entram na contagem.

function getFifthBusinessDay(
    year,
    month,
    holidays
) {

    let count = 0;


    for (
        let day = 1;
        day <= 15;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );

        const weekday =
            date.getDay();

        const key =
            dateKey(
                year,
                month,
                day
            );

        const isSunday =
            weekday === 0;

        const isHoliday =
            Boolean(
                holidays[key]
            );


        if (
            !isSunday &&
            !isHoliday
        ) {

            count++;

            if (count === 5) {
                return day;
            }
        }
    }


    return null;
}


// ==========================================================================
// DIA ÚTIL ANTERIOR
// ==========================================================================

function previousBusinessDay(
    year,
    month,
    day,
    holidays
) {

    let date =
        new Date(
            year,
            month,
            day
        );


    while (

        date.getDay() === 0 ||

        date.getDay() === 6 ||

        holidays[
            dateKey(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            )
        ]

    ) {

        date.setDate(
            date.getDate() - 1
        );
    }


    return date;
}


// ==========================================================================
// PRÓXIMO DIA ÚTIL
// ==========================================================================

function nextBusinessDay(
    year,
    month,
    day,
    holidays
) {

    let date =
        new Date(
            year,
            month,
            day
        );


    while (

        date.getDay() === 0 ||

        date.getDay() === 6 ||

        holidays[
            dateKey(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            )
        ]

    ) {

        date.setDate(
            date.getDate() + 1
        );
    }


    return date;
}


// ==========================================================================
// CRIA EVENTOS VISUAIS
// ==========================================================================

function addCalendarEvent(
    dayElement,
    text,
    type
) {

    const event =
        document.createElement('span');

    event.className =
        `cma-calendar-event cma-event-${type}`;

    event.textContent =
        text;

    event.title =
        text;

    dayElement.appendChild(
        event
    );
}


// ==========================================================================
// RENDERIZA O CALENDÁRIO
// ==========================================================================

function renderCmaCalendar() {

    const grid =
        document.getElementById(
            'cma-calendar-grid'
        );

    const title =
        document.getElementById(
            'calendar-month-title'
        );


    if (
        !grid ||
        !title
    ) {
        return;
    }


    grid.innerHTML = '';


    const year =
        cmaCalendarDate.getFullYear();

    const month =
        cmaCalendarDate.getMonth();


    title.textContent =
        `${cmaMonthNames[month]} ${year}`;


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const lastDate =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const holidays =
        getCmaHolidays(year);


    const fifthBusinessDay =
        getFifthBusinessDay(
            year,
            month,
            holidays
        );


    // eSocial — dia 15 ou próximo útil
    const due15 =
        nextBusinessDay(
            year,
            month,
            15,
            holidays
        );


    // FGTS / INSS — dia 20 ou útil anterior
    const due20 =
        previousBusinessDay(
            year,
            month,
            20,
            holidays
        );


    // Dias vazios antes do início do mês
    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement('div');

        empty.className =
            'cma-calendar-day cma-calendar-empty';

        grid.appendChild(empty);
    }


    const today =
        new Date();


    // Criação dos dias
    for (
        let day = 1;
        day <= lastDate;
        day++
    ) {

        const dayElement =
            document.createElement('div');

        dayElement.className =
            'cma-calendar-day';


        // Dia atual
        if (
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day
        ) {

            dayElement.classList.add(
                'cma-calendar-today'
            );
        }


        const number =
            document.createElement('div');

        number.className =
            'cma-calendar-day-number';

        number.textContent =
            day;

        dayElement.appendChild(
            number
        );


        const key =
            dateKey(
                year,
                month,
                day
            );


        // Feriados
        if (holidays[key]) {

            addCalendarEvent(
                dayElement,
                holidays[key],
                'feriado'
            );
        }


        // Salários
        if (
            day === fifthBusinessDay
        ) {

            addCalendarEvent(
                dayElement,
                'Pagamento de salários',
                'salario'
            );
        }


        // eSocial
        if (
            due15.getFullYear() === year &&
            due15.getMonth() === month &&
            due15.getDate() === day
        ) {

            addCalendarEvent(
                dayElement,
                'Fechamento do eSocial',
                'esocial'
            );
        }
        
        // GPS avulsa
if (
    due15.getFullYear() === year &&
    due15.getMonth() === month &&
    due15.getDate() === day
) {
    addCalendarEvent(
        dayElement,
        'GPS avulsa',
        'gps'
    );
}

        // FGTS / INSS
        if (
            due20.getFullYear() === year &&
            due20.getMonth() === month &&
            due20.getDate() === day
        ) {

            addCalendarEvent(
                dayElement,
                'FGTS / INSS',
                'encargos'
            );
        }


        grid.appendChild(
            dayElement
        );
    }
}


// ==========================================================================
// INICIALIZAÇÃO
// ==========================================================================

document.addEventListener(
    'DOMContentLoaded',
    function () {

        // Navegação inicial
        updateSectionNavigation(
            'apresentacao'
        );


        // Calendário
        renderCmaCalendar();


        const prev =
            document.getElementById(
                'calendar-prev'
            );

        const next =
            document.getElementById(
                'calendar-next'
            );


        if (prev) {

            prev.addEventListener(
                'click',
                function () {

                    cmaCalendarDate.setMonth(
                        cmaCalendarDate.getMonth() - 1
                    );

                    renderCmaCalendar();
                }
            );
        }


        if (next) {

            next.addEventListener(
                'click',
                function () {

                    cmaCalendarDate.setMonth(
                        cmaCalendarDate.getMonth() + 1
                    );

                    renderCmaCalendar();
                }
            );
        }

    }
);
