# Spec: pull-projects-tags

## 1. Visão Geral

- **Objetivo:** Expandir o fluxo de sincronização offline-first (pull de dados da API) já existente para as entidades de `projects` (projetos) e `tags`. A lógica de sincronização, tanto no login quanto no pull manual, bem como a resolução de conflitos, deve espelhar as mesmas regras adotadas para a entidade `sessions`, assegurando que os relacionamentos de dados permaneçam consistentes.
- **Público/Atores:** Usuário (autenticado ou offline), Frontend (Background Sync/Pull Manual), Backend da API.

## 2. Requisitos Funcionais (RF)

- **RF-01:** O frontend deve realizar o pull dos dados de `projects` e `tags` de forma automática logo após o login, em conjunto com o fluxo já existente de `sessions`.
- **RF-02:** O acionamento do pull manual através do `BackupMenu` deve puxar as atualizações não apenas de sessões, mas também de `projects` e `tags`.
- **RF-03:** O backend deve disponibilizar endpoints dedicados (`/projects/pull` e `/tags/pull`, por exemplo) que retornem as listas das respectivas entidades vinculadas ao usuário logado.
- **RF-04:** Os endpoints de pull para essas entidades também devem suportar a filtragem pela data de última sincronização (`lastSync`), garantindo otimização de banda ao retornar apenas os registros novos ou atualizados.
- **RF-05:** A ordem de sincronização deve ser respeitada: o sistema fará o Pull de `projects` e `tags` com sucesso da API antes de executar a fila de Push (envio de dados criados offline para o servidor).
- **RF-06:** O sistema deve reagir atualizando a interface em tempo real (ex: lista de projetos disponíveis para seleção, painel de tags) após a conclusão bem-sucedida de um pull manual ou pós-login.

## 3. Regras de Negócio e Casos de Borda (Edge Cases)

### Regras de Negócio

- **RN-01:** **Preservação Offline:** Projetos e tags criados em modo offline não devem ser descartados ou sobrescritos no momento do pull. O UUID de cada registro é a chave fundamental para realizar o "merge" dos dados.
- **RN-02:** **Resolução de Conflitos:** Ao encontrar o mesmo registro (mesmo UUID) modificado em dois dispositivos distintos, prevalecerá sempre a versão com o `updatedAt` mais recente.
- **RN-03:** **Exclusão de Registros (Soft Delete):** Se a exclusão de projetos ou tags for implementada, um campo como `deletedAt` ou um status de inativo deverá ser propagado no pull para garantir que registros excluídos num dispositivo A sumam também no dispositivo B após a sincronização, mantendo a consistência offline.
- **RN-04:** **Limpeza Completa no Logout:** As tabelas do Dexie para `projects` e `tags` devem continuar sendo limpas de forma destrutiva no logout para garantir a segurança e troca de contas sem vazamento de dados (já previsto nas regras da aplicação).

### Casos de Borda & Tratamento de Erros

- **EC-01:** **Conflitos de Relacionamento no Frontend:** Se uma sessão local pertencer a um projeto que foi modificado na API, o pull do projeto deverá atualizar os dados daquele projeto sem afetar a integridade da sessão associada.
- **EC-02:** **Falha Parcial de Sincronização:** Caso o pull de `sessions` tenha sucesso, mas o de `projects` falhe por timeout, a aplicação deve lidar com o erro de forma que a UI não quebre e o processo de Push não ocorra em dados potencialmente dessincronizados.
- **EC-03:** **Delay devido a Cold Start (Render):** O frontend deve apresentar _loading states_ apropriados enquanto aguarda as chamadas dos múltiplos pulls (sessions, projects, tags), para não congelar o app enquanto o servidor acorda.

## 4. Critérios de Aceite (Definition of Done)

- [ ] Endpoints `/pull` criados no backend para `projects` e `tags`, suportando filtro de data de última sincronização.
- [ ] Conflitos de projetos e tags tratados no frontend com base no timestamp de atualização mais recente.
- [ ] Pull manual atualizado para sincronizar as três entidades (sessions, projects, tags) simultaneamente.
- [ ] O pull no evento de login sincroniza `projects` e `tags` sem deletar dados criados estritamente em modo offline.
- [ ] A interface reage reativamente na atualização de `projects` e `tags` após um pull, dispensando _refresh_ da página.
- [ ] A exclusão ou modificação de um projeto em outro dispositivo reflete com sucesso no ambiente atual após o pull.

## 5. Perguntas Adicionais / Pontos em Aberto

- Projetos ou tags possuem suporte a exclusão definitiva no sistema? Se sim, como vamos propagar a exclusão física do servidor para o IndexedDB durante o Pull? Recomenda-se a implementação de _soft-delete_ (remoção lógica com `deletedAt`) na API para o dispositivo cliente saber o que precisa ser deletado do cache local.
  R: O soft-delete já estão implementado, tanto para os projetos como para as tags.

- É necessário definir uma ordem estrita de Pull? (ex: puxar `projects` primeiro, depois `tags`, depois `sessions` para garantir que entidades pai já estejam disponíveis localmente).
  R: Sim, acho importante seguir a ordem "projects", "tags" e "sessions" para garantir a integridade dos dados.
