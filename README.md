# Manual de Diretrizes Trabalhistas — CMA Assessoria Contábil

Manual interno/publicável em GitHub Pages para consulta de rotinas trabalhistas, SST, prazos, referências e ferramentas operacionais do Departamento Pessoal.

**Site:** https://cmapessoal-dev.github.io/manual.cma/

## Arquitetura atual

O projeto utiliza `index.html`, `style.css` e `app.js` como base. As funcionalidades adicionadas ao longo da evolução do Manual são organizadas em módulos JavaScript separados.

O carregamento dos módulos complementares é centralizado em:

```text
core/bootstrap.js
```

A versão de cache dos módulos também é controlada nesse arquivo por `CMA_MANUAL_VERSION`. Ao publicar uma alteração estrutural, altere a versão do bootstrap para que os navegadores busquem os arquivos atualizados.

A ordem oficial das páginas é centralizada em:

```text
core/navegacao.js
```

Esse arquivo é a fonte canônica para os botões **Anterior / Próximo**, a ordem lógica do Manual e a integração com o sumário e a busca.

## Estrutura principal

```text
/
├── index.html
├── style.css
├── app.js
├── logo.png
├── favicon.ico
│
├── core/
│   ├── bootstrap.js          # Carregamento central dos módulos e versão de cache
│   └── navegacao.js          # Ordem canônica das páginas
│
├── busca/
│   └── busca-avancada.js
├── avisos/
│   └── avisos-legais.js
├── ferramentas/
│   ├── ferramentas-menu.js   # Sumário agrupado/expansível
│   └── ferramentas-base.js   # Padrão comum para calculadoras
├── calculadora-custo/
│   ├── calculadora-custo.js
│   └── exportar-pdf.js
├── sst/
│   ├── sst-extra.js
│   └── sst-paginas.js
├── jornada/
├── comercio-feriados/
├── faltas-justificaveis/
├── guarda-documentos/
├── multas/
├── introducao/
├── bibliografia/
├── tipografia/
├── capa/
└── modelos/
```

## Organização do sumário

A navegação lateral é agrupada em blocos expansíveis:

- **Rotinas Trabalhistas**
- **SST**
- **Prazos e Calendários**
- **Ferramentas**
- **Referências**

As páginas de SST são independentes e participam normalmente da navegação:

1. Programas e Laudos
2. CIPA
3. Riscos Psicossociais
4. Campanhas de Saúde

A seção antiga **Situações e Fiscalização** é mantida apenas como conteúdo legado no HTML e não integra mais o sumário, a busca ou a sequência Anterior/Próximo.

## Ferramentas

As ferramentas devem seguir o padrão definido em `ferramentas/ferramentas-base.js`.

O padrão inclui:

- identificação de empresa e empregado quando aplicável;
- botão para limpar campos;
- apresentação padronizada dos resultados;
- metodologia/explicação do cálculo;
- aviso de que o resultado é uma estimativa quando aplicável;
- exportação em PDF quando necessária.

Ferramenta existente:

- **Custo do Empregado** — simulação de custo mensal com benefícios, FGTS, provisões e encargos conforme as premissas apresentadas na própria ferramenta.

Próximas ferramentas planejadas devem reutilizar essa base em vez de criar componentes independentes.

## Modelos de Documentos

A área `modelos/` está preparada para receber documentos oficiais por categoria.

**Regra:** um arquivo só deve aparecer como **Disponível** no Manual depois que a versão definitiva tiver sido validada. Arquivos fragmentados ou temporários usados durante migrações não devem permanecer no repositório.

No momento, o modelo de admissão aguarda a inclusão da versão definitiva validada.

## Guarda de documentos

A tabela foi revisada para separar obrigações **vigentes** de documentos **legados**. Entre os pontos tratados estão:

- revogação da NR-2;
- prescrição quinquenal do FGTS e regras de transição para períodos antigos;
- substituição do Livro de Inspeção impresso pelo eLIT;
- arquivos legados de CAGED e RAIS;
- PPP eletrônico;
- prazos mínimos de documentação de PGR, PCMSO e CIPA.

A tabela é uma referência operacional. Antes do descarte definitivo de documentos, devem ser considerados também processos em curso, fiscalizações, normas específicas, obrigações previdenciárias/fiscais e proteção de dados.

## Regras de manutenção

Ao incluir ou alterar uma página:

1. criar/alterar o módulo correspondente;
2. incluir a página na ordem canônica de `core/navegacao.js`, quando for uma nova página navegável;
3. incluir o item no grupo adequado de `ferramentas/ferramentas-menu.js`;
4. incluir aviso legal em `avisos/avisos-legais.js`, se aplicável;
5. verificar a busca interna;
6. atualizar as referências legais quando houver conteúdo normativo novo;
7. alterar `CMA_MANUAL_VERSION` em `core/bootstrap.js` quando a publicação precisar invalidar o cache dos módulos;
8. testar desktop e celular.

## Checklist antes de publicar uma alteração relevante

- Sumário abre e fecha corretamente.
- Página ativa abre o grupo correspondente.
- Links com `#hash` abrem a página correta.
- Anterior/Próximo respeitam a ordem canônica.
- Busca não retorna páginas legadas/ocultas.
- Calendário permanece responsivo.
- Ferramentas recalculam após limpar campos.
- PDF, quando existente, contém identificação e valores corretos.
- Conteúdo jurídico sensível foi conferido em fonte oficial atualizada.

## Publicação

O projeto é publicado pelo GitHub Pages a partir da branch `main`.

Após uma alteração, aguarde a atualização do Pages. Se o navegador ainda exibir uma versão anterior, faça uma recarga forçada (`Ctrl + Shift + R`).
