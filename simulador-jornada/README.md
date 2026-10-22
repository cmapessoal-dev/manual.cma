# Simulador de Jornada 5×2

Versão independente do simulador do Gestor CMA, integrada à Central de Ferramentas do manual. Os dados são mantidos apenas durante a visita. Não usa banco, login nem APIs do gestor.

O arquivo `simulador.js` é o pacote pronto para publicação no GitHub Pages. Não exige Node no navegador. O exportador PDF usa a logo do manual e a mesma biblioteca jsPDF das demais ferramentas.

Para manutenção: `npm install` e `npm run build` nesta pasta, com Node instalado apenas no ambiente de desenvolvimento. Publique o novo pacote e atualize o parâmetro de versão do script no index principal.

Origem dos componentes e modelos: projeto CMA Tarefas do DP, versão de código 98d6e7c73064fbcc184c3b4fb270b527f8b8353a. Cálculos e parâmetros foram mantidos nesta integração.
