(function(){
  function incluirRegrasDomingosFeriados(){
    const secao=document.getElementById('jornada');
    if(!secao||document.getElementById('cma-jornada-domingos-feriados'))return;

    const conteudo=secao.querySelector('.space-y-4.text-sm.text-gray-700');
    if(!conteudo)return;

    const bloco=document.createElement('div');
    bloco.id='cma-jornada-domingos-feriados';
    bloco.className='bg-white p-4 rounded border border-gray-200 shadow-sm';
    bloco.innerHTML=`
      <strong class="text-blue-950 block mb-3">Trabalho aos Domingos, Feriados e Escalas de Revezamento:</strong>
      <div class="space-y-3 text-gray-600 text-sm leading-relaxed">
        <p><strong>1. Funcionamento aos domingos e feriados:</strong> As empresas que funcionam nesses dias devem organizar escala de revezamento, assegurando o descanso semanal remunerado dos colaboradores e observando a legislação aplicável à atividade, a legislação municipal e a Convenção Coletiva de Trabalho (CCT). Nos serviços que exigem trabalho aos domingos, a escala deve ser previamente organizada, garantindo a alternância dos descansos.</p>

        <p><strong>2. Folga compensatória:</strong> O trabalho realizado em domingos ou feriados deverá ser compensado com folga, respeitando-se o período legal de descanso semanal. Caso não haja a devida compensação, o dia trabalhado deverá ser pago em dobro, sem prejuízo da remuneração correspondente ao repouso semanal.</p>

        <p><strong>3. Repouso dominical das funcionárias mulheres:</strong> Havendo trabalho aos domingos, deve ser observada a escala de revezamento quinzenal prevista na CLT, de forma a favorecer o repouso dominical das trabalhadoras, sem prejuízo de eventual regra mais específica estabelecida em norma coletiva.</p>

        <p><strong>4. Repouso dominical dos funcionários homens:</strong> Nas atividades do comércio em geral, o repouso semanal remunerado deve coincidir com o domingo pelo menos uma vez no período máximo de três semanas, sem prejuízo de condição mais favorável prevista em Convenção Coletiva de Trabalho.</p>

        <p><strong>5. Escala de trabalho 6×1:</strong> Sempre que compatível com a atividade e com a norma coletiva aplicável, a jornada poderá ser organizada no formato 6×1, no qual o colaborador trabalha por seis dias e usufrui um dia de descanso. O repouso semanal deve ser concedido dentro do período legal, não sendo adequado manter o empregado trabalhando por sete dias consecutivos para somente então conceder a folga.</p>

        <p><strong>6. Observações importantes:</strong> A escala de revezamento pode ser ajustada às necessidades operacionais da empresa, desde que sejam preservados o descanso semanal obrigatório, os intervalos legais e as regras específicas previstas em lei ou em norma coletiva. Antes da implantação ou alteração de escalas com trabalho aos domingos e feriados, recomenda-se a conferência da CCT aplicável à categoria.</p>
      </div>`;

    conteudo.appendChild(bloco);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',incluirRegrasDomingosFeriados);
  }else{
    incluirRegrasDomingosFeriados();
  }
})();
