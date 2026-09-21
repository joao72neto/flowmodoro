# Spec: Auto-complete de Sessões Anteriores no SessionCreation

## 1. Visão Geral

- **Objetivo:** Facilitar a criação e configuração de novas sessões no componente `SessionCreation`, exibindo uma lista de sugestões (select/dropdown) baseada no histórico de sessões armazenadas localmente à medida que o usuário digita. Ao selecionar uma opção da lista, o nome da sessão, o projeto e a tag correspondentes são preenchidos automaticamente.
- **Público/Atores:** Usuários interagindo com a interface de gerenciamento de tempo e sessões (`SessionCreation`).

## 2. Requisitos Funcionais (RF)

- **RF-01:** O sistema deve consultar as sessões registradas no banco de dados local (IndexedDB via Dexie) e exibir uma lista suspensa (select/dropdown) com até no máximo 10 sugestões que correspondam ao texto digitado no campo de nome da sessão (busca parcial e _case-insensitive_).
- **RF-02:** As sugestões buscadas devem ser ordenadas por data em ordem decrescente (da sessão mais recente para a mais antiga).
- **RF-03:** A lista de sugestões deve ser exibida apenas quando o input de nome de sessão no `SessionCreation` estiver em foco (_focused_) E possuir algum conteúdo digitado (não vazio).
- **RF-04:** A lista de sugestões NÃO pode ser exibida sob nenhuma circunstância caso o timer esteja em execução (rodando) ou caso o modo (`mode`) do timer seja "break".
- **RF-05:** Ao clicar em um item da lista de sugestões, o componente `SessionCreation` deve ser preenchido automaticamente com:
  - O nome da sessão correspondente (`sessionName`).
  - O projeto associado (`project`), caso a sessão selecionada possua projeto.
  - A tag associada (`tag`), caso a sessão selecionada possua tag.
- **RF-06:** Ao selecionar uma sugestão, a lista suspensa deve ser fechada/ocultada imediatamente.
- **RF-07:** Caso o input perca o foco (_blur_) ou o texto seja completamente limpo, a lista de sugestões deve ser ocultada.
- **RF-08:** O componente dropdown deve ter largura responsiva que acompanhe dinamicamente a largura do container do `SessionCreation` em qualquer tamanho de tela (mobile e desktop).

## 3. Regras de Negócio e Casos de Borda (Edge Cases)

### Regras de Negócio

- **RN-01 (Armazenamento e Consulta Local):** Sendo uma aplicação _offline-first_, a busca de autocompletar deve consultar diretamente o repositório local de sessões (Dexie/IndexedDB) em vez de realizar requisições HTTP externas.
- **RN-02 (Ordenação por Data):** As sugestões retornadas pelo repositório local devem vir ordenadas rigorosamente da sessão mais recente para a mais antiga.
- **RN-03 (Limite Máximo de 10 Itens):** A lista exibida deve conter no máximo 10 opções após a filtragem e ordenação.
- **RN-04 (Deduplicação de Combinações Únicas):**
  - Variações do mesmo nome de sessão associadas a projetos ou tags diferentes devem ser exibidas como itens distintos na lista (ex: "Estudar React" com Projeto A + Tag X é diferente de "Estudar React" com Projeto B + Tag Y).
  - Se existirem múltiplas sessões com a exata mesma combinação de `sessionName` + `project` + `tag`, apenas a ocorrência mais recente dessa combinação única deve ser exibida.
- **RN-05 (Bloqueio em Timer Ativo / Break):** Durante os estados em que o timer está rodando (modo `focus` ativo ou modo `break`), o select de sugestões deve permanecer estritamente oculto e desabilitado.
- **RN-06 (Sincronização de Projeto e Tag):** Ao selecionar uma sessão anterior:
  - Se a sessão possuía projeto e tag, ambos devem ser selecionados nos respectivos seletores do `SessionCreation`.
  - Se a sessão possuía apenas projeto (ou apenas tag), o seletor ausente deve ter sua seleção removida/limpa no `SessionCreation`.
  - Se a sessão não possuía nem projeto nem tag, ambos os seletores no `SessionCreation` devem ser limpos.
- **RN-07 (Largura Adaptativa):** O dropdown de sugestões deve sempre respeitar a largura exata do container do `SessionCreation`, evitando quebras de layout ou estouro de tela (_overflow_) em telas menores/mobile.

### Casos de Borda & Tratamento de Erros

- **EC-01 (Nenhuma correspondência encontrada):** Se o usuário digitar um termo que não corresponda a nenhuma sessão registrada localmente, o dropdown não deve ser exibido.
- **EC-02 (Usuário sem histórico de sessões):** Para novos usuários ou bancos locais sem sessões gravadas, a lista não será exibida durante a digitação.
- **EC-03 (Navegação via teclado e submissão):** Pressionar `Enter` no input para iniciar uma sessão deve focar na ação primária do timer, sem que o dropdown cause efeitos colaterais indesejados.
- **EC-04 (Perda de Foco / Clique Fora):** Quando o usuário clica fora do campo ou do dropdown (evento `blur` / `click outside`), o select deve ser ocultado.
- **EC-05 (Edição posterior ao autocompletar):** Se o usuário selecionar uma sugestão e em seguida alterar o nome da sessão ou alterar projeto/tag manualmente, as alterações manuais devem ser mantidas livremente.

## 4. Critérios de Aceite (Definition of Done)

- [ ] **CA-01:** Ao focar no input do `SessionCreation` e digitar um termo, um select com até 10 sugestões de sessões locais correspondentes (ordenadas da mais recente para a mais antiga) é exibido.
- [ ] **CA-02:** Sessões com o mesmo nome, porém com combinações distintas de projeto/tag, são exibidas como opções diferentes na lista de sugestões.
- [ ] **CA-03:** Sessões com a exata mesma combinação de nome, projeto e tag são deduplicadas, exibindo apenas a ocorrência mais recente.
- [ ] **CA-04:** Ao clicar em uma sugestão, o `SessionCreation` é atualizado com o nome, projeto e tag da sessão escolhida e a lista suspensa é fechada.
- [ ] **CA-05:** A lista não é exibida se o timer estiver rodando ou se o modo do timer for "break".
- [ ] **CA-06:** A lista não é exibida se o input estiver desprovido de foco ou sem texto digitado.
- [ ] **CA-07:** O dropdown acompanha a largura do container do `SessionCreation` de forma responsiva em dispositivos móveis e desktop.

## 5. Decisões de Arquitetura e UX (Respondidas)

- **Fonte de Dados:** Busca local via método dedicado no repositório de sessões (Dexie / IndexedDB).
- **Ordenação:** Por data de realização (mais recente -> mais antiga).
- **Consolidação:** Deduplicação baseada no conjunto único `(nome + projeto + tag)`, preservando variações.
- **Layout Mobile:** Largura do dropdown acompanhando 100% a largura do container do `SessionCreation`.
