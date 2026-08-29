# Spec: Cores nos Projetos

## 1. Visão Geral

- **Objetivo:** Adicionar cores aos projetos da aplicação para facilitar a leitura do histórico de atividades e tornar a experiência menos confusa quando muitas sessões e projetos se acumulam.
- **Público/Atores:** Usuário final gerenciando seus projetos e sessões de foco/descanso.

## 2. Requisitos Funcionais (RF)

- **RF-01:** O sistema deve permitir que o usuário escolha entre várias cores pré-definidas no próprio modal de criação do projeto.
- **RF-02:** O sistema deve permitir que o usuário atualize a cor de um projeto já existente, caso seja necessário.

## 3. Regras de Negócio e Casos de Borda (Edge Cases)

### Regras de Negócio

- **RN-01:** Quando uma sessão for associada a um projeto, a cor desse projeto deve ser utilizada (ex: na borda esquerda) no lugar da cor do perfil de descanso (leve - verde, padrão - amarelo ou intenso - vermelho).
- **RN-02:** No momento da criação de um novo projeto (abertura do modal), uma cor deve ser pré-selecionada de forma aleatória para evitar a criação sequencial de projetos sempre com a mesma cor.
- **RN-03:** A cor primária (primary) do sistema não deve mais ser utilizada para os projetos; apenas as cores do novo conjunto pré-definido poderão ser utilizadas.

### Casos de Borda & Tratamento de Erros

- **EC-01:** Quando um projeto/sessão não for associado a nenhum projeto específico, a borda esquerda da sessão deverá usar a cor padrão `border-neutral-70/50`.
- **EC-02:** O que acontece com os projetos legados que não possuem uma das novas cores pré-definidas? (Sugestão: Atribuir uma cor aleatória ou padrão ao carregá-los). Sim, atribuir uma cor aleatória ou padrão ao carregá-los.

## 4. Critérios de Aceite (Definition of Done)

- **CA-01:** O usuário é capaz de criar projetos selecionando a partir de uma paleta de cores pré-definidas.
- **CA-02:** O usuário é capaz de atualizar/editar as cores de projetos já existentes.
- **CA-03:** As sessões que possuem um projeto associado utilizam a cor deste projeto em sua borda esquerda, em substituição à cor original do perfil de descanso.
- **CA-04:** Sessões sem projeto associado exibem corretamente a cor padrão `border-neutral-70/50`.
- **CA-05:** Nenhum projeto recém-criado ou editado permite ou utiliza a cor `primary` do sistema.

## 5. Perguntas Adicionais / Pontos em Aberto

- **Migração de Dados:** Como lidaremos com os projetos já existentes no banco local (Dexie/IndexedDB) e no backend (PostgreSQL) que não têm cor definida ou usavam a cor primária? Deveremos criar um script de migração (no backend e/ou frontend) para designar uma cor padrão/aleatória a eles?
R: Pode só dar um update mesmo, sem precisar de um script de migração. Eu tenho poucos dados ainda, então acho que não tem muita necessidade disso.

- **Definição das Cores:** Quais são exatamente as cores pré-definidas (valores hexadecimais ou classes do Tailwind)? Elas precisam de tratativas específicas para os temas claro (light) e escuro (dark)?
R: Não vai precisar de tratativas específicas para tema claro e escuro. As cores podem ser vermlho, verde, amarelo, etc.

Estava pensando em ter uma constante que guarda toda a paleta de cores em hexadecimal mesmo. Conforme o usuário escolhe e cor, ela á aplicada ao projeto.

- **Acessibilidade:** As cores pré-definidas garantem contraste suficiente com o fundo e com o texto para atender aos requisitos de acessibilidade?
R: Os projetos geralmente possuem apenas uma cor (texto, backgroud e borda), o que muda é a intensidade. O background é mais opaco e trasparente enquanto o texto e a borda possuem um contraste maior com a mesma core, porém mais forte, sem opacity.
