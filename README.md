# Manual de Diretrizes Trabalhistas — CMA Assessoria Contábil

Site estático, pronto para publicação no **GitHub Pages**, gerado a partir do manual HTML original — mantendo 100% do conteúdo, layout, cores e estrutura visual.

## Estrutura do projeto

```
/
├── index.html              # Estrutura HTML (conteúdo do manual)
├── style.css               # CSS (Tailwind gerado localmente + estilos customizados)
├── app.js                  # JavaScript (navegação entre seções e blocos explicativos)
├── favicon.ico             # Ícone do site (gerado a partir do logo)
├── README.md
└── assets/
    └── images/
        └── logo.png        # Logo da CMA (extraído do base64 original)
```

## O que foi feito

- **Removidas todas as dependências externas (CDN):**
  - O script do **Tailwind CSS via CDN** (`@tailwindcss/browser`) foi substituído por um `style.css` **gerado localmente** com o Tailwind CLI, contendo apenas as classes realmente usadas na página (bem mais leve que o compilador rodando no navegador).
  - A biblioteca **Lucide Icons**, que estava embutida como um script JS de ~410 KB, foi eliminada: os 30 ícones realmente usados no manual foram convertidos para **SVG estático embutido diretamente no HTML**, sem qualquer JavaScript necessário para exibi-los.
  - A imagem do logotipo, que estava em **base64 embutido no HTML** (~65 KB em texto), foi extraída para um arquivo `assets/images/logo.png` de verdade.
- **100% arquivos locais** — nada é carregado de servidores externos, então o site funciona offline e no GitHub Pages sem restrições de rede.
- **Correção de caminhos relativos** para funcionar em qualquer subpasta/domínio do GitHub Pages.
- **Responsivo**: o layout já era responsivo (Tailwind), preservado integralmente.
- **HTML validado**: tags balanceadas, sem erros de fechamento.
- **Performance**: o peso total caiu de ~546 KB (um único arquivo) para ~177 KB divididos em arquivos com cache independente (HTML, CSS, JS, imagem, favicon).

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `manual-diretrizes-cma`).
2. Envie todos os arquivos desta pasta para a raiz do repositório (mantendo a estrutura de pastas).
3. No GitHub, vá em **Settings → Pages**.
4. Em **Source**, selecione a branch `main` (ou `master`) e a pasta `/ (root)`.
5. Salve. Em alguns instantes o site estará disponível em:
   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

## Testar localmente

Basta abrir `index.html` diretamente no navegador, ou rodar um servidor local simples:

```bash
python3 -m http.server 8000
```

E acessar `http://localhost:8000`.
