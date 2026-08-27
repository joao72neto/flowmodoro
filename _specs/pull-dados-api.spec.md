# Spec: pull-dados-api

## 1. Visão Geral

- **Objetivo:** Implementar o fluxo de pull de dados da API hospedada no Render para a interface offline-first baseada em IndexedDB (Dexie). O foco é garantir a sincronização em duas frentes (automática no login e manual sob demanda), tratar conflitos de dados de forma segura utilizando os UUIDs locais, suportar cold start do backend e garantir o isolamento e titularidade da conta (token de acesso) limpando dados locais quando houver logout.
- **Público/Atores:** Usuário (autenticado ou offline), Frontend (Background Sync/Pull Manual), Backend da API.

## 2. Requisitos Funcionais (RF)

- **RF-01:** O frontend deve executar um pull inicial dos dados da API no momento em que o login é efetuado na aplicação.
- **RF-02:** O frontend deve disponibilizar uma opção de pull manual através de um botão no componente `BackupMenu`. O usuário poderá acionar essa opção sempre que quiser puxar os dados mais recentes da API.
- **RF-03:** O backend deve expor um endpoint que retorne os dados das sessões em formato bruto (um array de `SessionDTO` sem agrupamento de dias), visto que a lógica de ordenação e agrupamento (via `group-sessions.ts`) é de responsabilidade exclusiva do frontend.
- **RF-04:** O endpoint de pull deve suportar um filtro (ex: por data da última sincronização ou timestamp) para que o frontend não precise puxar o payload completo do histórico de sessões a cada requisição.
- **RF-05:** A importação e gestão de dados da API no frontend deve utilizar o token de autenticação atual, migrando para um modelo mais seguro.
- **RF-06:** O sistema deve suportar importação/exportação de dados locais. Dados gerados offline podem ser importados; porém, dados já registrados com um token de outra conta não podem ser importados/registrados na conta atual.
- **RF-07:** O sistema de requisições ao backend deve ser resiliente a cold starts do Render, lidando com o tempo de espera sem travar a interface do usuário.
- **RF-08:** Sempre que uma carga de novos dados (pull manual ou pós-login) retornar com sucesso, a interface deve reagir de forma reativa e refazer as renderizações necessárias sem recarregar a página (reload).
- **RF-09:** O fluxo de sincronização pós-login deve seguir uma ordem estrita: primeiro realiza o "Pull" (baixar dados da API); apenas após a sua conclusão bem-sucedida, o sistema deve iniciar o "Push" (enviar dados locais não sincronizados para o Render).

## 3. Regras de Negócio e Casos de Borda (Edge Cases)

### Regras de Negócio

- **RN-01:** **Preservação de Dados Offline:** O pull (tanto o de login quanto o manual) não deve substituir de forma destrutiva os dados locais do IndexedDB. Sessões criadas offline antes do login não podem ser apagadas pelo pull da API.
- **RN-02:** **Resolução de Conflitos Multi-Dispositivo:** Ao gerenciar conflitos da mesma sessão operando em dispositivos diferentes (identificada pelo mesmo UUID local), o sistema sempre deve manter os dados com o registro/timestamp mais recente e descartar/sobrescrever o mais antigo.
- **RN-03:** **Limpeza Completa no Logout:** Ao realizar o logout, a aplicação deve fazer um "wipe" completo, apagando totalmente a base do Dexie. Isso previne o vazamento de dados offline de um usuário para a conta de outro usuário subsequente.
- **RN-04:** **Segurança na Importação:** A funcionalidade de importação de arquivos deve verificar o token/ownership, recusando a integração de sessões previamente associadas a outra conta.

### Casos de Borda & Tratamento de Erros (Edge Cases)

- **EC-01:** **Delay devido a Cold Start (Render):** Requisições que enfrentarem cold start não devem travar a aplicação. O sistema deve sinalizar visualmente (ex: loading no botão de backup) e aguardar a resolução assíncrona.
- **EC-02:** **Dados não autorizados via Importação:** Caso seja submetido um arquivo JSON com dados de outra conta, a aplicação deve rejeitar a parcela de dados que não lhe pertence e exibir um alerta amigável.
- **EC-03:** **Sem conectividade no Pull Manual:** Se o usuário acionar o botão de pull manual sem internet, o sistema deve abortar a tentativa e exibir um aviso imediato ("Sem conexão para sincronizar" ou similar).

## 4. Critérios de Aceite (Definition of Done)

- [ ] Pull disparado no sucesso do login mesclando os dados (Dexie/API) sem deletar registros gerados em modo offline.
- [ ] Botão de pull manual disponível no componente `BackupMenu` acionando a sincronização sob demanda.
- [ ] O fluxo de login garante que o push de dados locais só ocorre **após** a conclusão do pull da API.
- [ ] Endpoint do backend retorna array linear de `SessionDTO` filtráveis por data da última sincronização.
- [ ] O frontend atualiza a UI de forma reativa no retorno bem-sucedido de um pull manual, sem *refresh*.
- [ ] Resolução de conflitos atua na junção dos dados (baseada no UUID), mantendo a versão mais recente em caso de choque.
- [ ] Logout realiza wipe total no IndexedDB local, garantindo que não haja resíduos para o próximo login.
- [ ] Importação de arquivos barra dados atrelados a contas de terceiros.
