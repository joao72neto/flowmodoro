# Spec: importacao-backup-via-api

## 1. Visão Geral

- **Objetivo:** Substituir o fluxo atual de importação de backup do Flowmodoro — que grava os dados diretamente no IndexedDB local e enfileira cada entidade individualmente na fila de sincronização (processada quase sequencialmente, gerando lentidão em backups grandes) — por um fluxo que delega a importação a um novo endpoint no backend Spring Boot, responsável por persistir o payload completo de uma só vez, e usa o `pull-manager` já existente para atualizar o estado local a partir do servidor logo em seguida.
- **Público/Atores:** Usuário autenticado do Flowmodoro (dono do backup); API Spring Boot (novo endpoint de importação); Cliente Web (frontend responsável por validar o arquivo, chamar a API, exibir status via `BackupMenu` e disparar o pull).

## 2. Requisitos Funcionais (RF)

- **RF-01:** O sistema deve permitir que o usuário autenticado selecione um arquivo de backup (`.json`) e inicie o processo de importação.
- **RF-02:** O sistema deve validar a estrutura do arquivo (schema) e a titularidade (`userId`) no cliente, exatamente como hoje, antes de enviar qualquer dado ao servidor.
- **RF-03:** Quando o arquivo for válido, o sistema deve enviar o payload completo (`projects`, `tags`, `sessions`) para um novo endpoint de importação da API.
- **RF-04:** O endpoint deve persistir os dados recebidos em uma única operação no lado do servidor, associando-os ao usuário autenticado via token — sem depender do cliente para orquestrar entidade por entidade.
- **RF-05:** Após a confirmação de sucesso da API, o sistema deve disparar o `executePull` para sincronizar o IndexedDB local com o estado atual do servidor.
- **RF-06:** O sistema deve informar ao usuário o resultado da importação (sucesso, falha, ou sucesso parcial) ao final do fluxo completo (envio + pull).
- **RF-07:** O fluxo de importação não deve mais escrever diretamente no IndexedDB local (`db.projects.bulkPut`, etc.) nem enfileirar itens individualmente na `syncQueue` — essas responsabilidades saem do método `importData`.
- **RF-08:** As funcionalidades de importação e exportação de dados devem estar disponíveis exclusivamente para usuários autenticados.
- **RF-09:** O processo de importação deve ser não-bloqueante: consiste em uma única chamada HTTP síncrona ao endpoint de importação (sem job em background nem endpoint de status/polling), mas a interface não deve travar enquanto essa chamada está em andamento — o usuário continua podendo usar o restante da aplicação normalmente.
- **RF-10:** O `BackupMenu` deve exibir um estado de carregamento enquanto a chamada de importação está em andamento, e refletir sucesso ou falha ao final — seguindo o mesmo padrão já usado pelo `SyncStatus` para a fila de sincronização.
- **RF-11:** Ao concluir a importação com sucesso, o sistema deve resetar o `lastSync` armazenado, forçando um pull completo (não incremental) na sequência.
- **RF-12:** Outras ações do usuário que dependem da rota normal de sincronização (`syncQueue`/pull) podem ocorrer normalmente em paralelo à chamada de importação, sem esperar essa chamada terminar.

## 3. Regras de Negócio e Casos de Borda (Edge Cases)

### Regras de Negócio

- **RN-01:** O `userId` presente no backup deve corresponder ao usuário logado; a validação continua ocorrendo no cliente, antes de qualquer chamada de rede.
- **RN-02:** A importação no servidor deve ser atômica — falha ao persistir qualquer parte do payload não pode deixar dados parciais gravados.
- **RN-03:** Itens do backup que já existem no servidor devem ser resolvidos via upsert por `id`/`updatedAt` (mesma lógica de "mais recente vence" usada no pull), evitando duplicação.
- **RN-04:** O arquivo de backup deve respeitar o tamanho máximo de **5MB**.
- **RN-05:** Usuários não autenticados não podem acessar importação nem exportação: o `BackupMenu` deve ficar oculto no frontend para esse caso, e a rota de importação na API deve exigir token válido, rejeitando qualquer chamada sem autenticação.
- **RN-06:** Registros do backup com `deletedAt` preenchido representam soft-deletes e devem ser replicados como tal no servidor (marcação lógica de exclusão), nunca ignorados nem removidos fisicamente.
- **RN-07:** Proteção contra múltiplas importações simultâneas / abuso da rota já é coberta pelo mecanismo de buckets existente na API — não é escopo desta feature.

### Casos de Borda & Tratamento de Erros

- **EC-01:** JSON malformado → erro "Arquivo inválido: não é um JSON válido." exibido antes de qualquer chamada de rede.
- **EC-02:** Falha de schema → mensagem indicando o campo e o motivo, sem chamar a API.
- **EC-03:** `userId` do backup diferente do usuário logado → erro amigável, sem chamar a API.
- **EC-04:** Usuário não autenticado tenta acionar a rota de importação diretamente (fora da UI) → API responde com erro de autenticação (401/403), sem processar qualquer dado.
- **EC-05:** Arquivo maior que 5MB → rejeitado no cliente antes do envio, com mensagem amigável.
- **EC-06:** Erro de rede/timeout ao chamar o endpoint de importação → mensagem amigável; como nada foi escrito localmente até esse ponto, o usuário pode tentar novamente sem risco de estado inconsistente.
- **EC-07:** API retorna erro (400/422/500) → `BackupMenu` exibe estado de falha com mensagem baseada na resposta do servidor; o `executePull` não deve ser disparado nesse caso.
- **EC-08:** Importação confirmada pela API, mas o `executePull` disparado em seguida falha → o `BackupMenu` deve deixar claro que os dados **foram salvos no servidor**, mas a atualização local falhou, oferecendo uma ação de "tentar sincronizar novamente" sem reenviar o arquivo.
- **EC-09:** Backup contém itens órfãos (ex.: uma `session`/`tag` referenciando um `project` inexistente) → a importação inteira deve ser rejeitada (nada é persistido, respeitando RN-02); a mensagem de erro deve indicar especificamente quais itens estão inconsistentes (não apenas um erro genérico de "backup corrompido").
- **EC-10:** Conflito entre um registro já existente no servidor e o correspondente no backup (mesmo `id`, `updatedAt` diferente) → resolvido pela mesma regra de "mais recente vence" já usada no pull incremental.
- **EC-11:** Usuário navega para longe do `BackupMenu` ou fecha a aba enquanto a chamada de importação ainda está em andamento → como não existe job em background no servidor, esse comportamento depende de a chamada seguir em voo mesmo com o componente desmontado (ex.: chamada feita fora do ciclo de vida do componente); se a aba for fechada, a requisição é abortada pelo navegador e a importação não se completa — o usuário precisa reabrir o app e tentar novamente.

## 4. Critérios de Aceite (Definition of Done)

- **CA-01:** Um backup válido é enviado à API, ela confirma sucesso, e ao final do fluxo o IndexedDB local reflete o estado do servidor — sem que o cliente tenha escrito diretamente nas tabelas locais durante a importação.
- **CA-02:** Nenhuma entidade do backup importado passa pela `syncQueue` local.
- **CA-03:** Erros de validação (JSON inválido, schema, `userId`, tamanho do arquivo) continuam sendo detectados inteiramente no cliente, sem round-trip ao servidor.
- **CA-04:** Em caso de falha da API, nenhum dado é escrito localmente e o `BackupMenu` exibe uma mensagem de erro clara.
- **CA-05:** Em caso de sucesso da API seguido de falha do pull, o usuário é informado do estado real (salvo no servidor, pendente localmente) e consegue reexecutar o pull sem reenviar o arquivo.
- **CA-06:** Importações com muitos `projects`/`tags`/`sessions` deixam de sofrer o gargalo "um por vez" que existia via fila de sincronização.
- **CA-07:** A aplicação permanece utilizável (offline-first) durante todo o tempo em que uma importação está em andamento.
- **CA-08:** Usuários deslogados não conseguem ver a opção de importar/exportar nem acionar a rota da API com sucesso.
- **CA-09:** Após uma importação bem-sucedida, o `lastSync` é resetado e o pull seguinte é completo, não incremental.
- **CA-10:** Registros soft-deletados (`deletedAt`) presentes no backup aparecem como excluídos após a importação e o pull subsequente.
- **CA-11:** Um backup com itens órfãos é rejeitado por completo e a mensagem de erro exibida identifica quais itens específicos causaram a rejeição.
- **CA-12:** O usuário consegue realizar outras ações no app normalmente enquanto a chamada de importação está em andamento, sem qualquer bloqueio artificial.
