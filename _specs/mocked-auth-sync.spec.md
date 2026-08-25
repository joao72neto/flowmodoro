# Spec: Autenticação Mockada e Controle de Sincronização (Mocked Auth & Sync Control)

## 1. Visão Geral
- **Objetivo:** Implementar o gerenciamento global do estado de autenticação no frontend de forma mockada, permitindo que a aplicação opere com recursos offline-first no estado deslogado e controle o acesso à sincronização de dados (Sync) e personalizações de interface apenas para usuários logados.
- **Público/Atores:** Usuários não autenticados (modo local/offline), Usuários autenticados (modo sincronizado) e o gerenciador de sincronização (`sync-manager.ts`).

---

## 2. Requisitos Funcionais (RF)
- [ ] **RF-01:** O sistema deve fornecer um contexto de autenticação com o hook `useAuth`, expondo o estado de autenticação (`isAuthenticated`), os dados do usuário autenticado (`user`) e funções para login e logout.
- [ ] **RF-02:** O hook `useAuth` deve permitir autenticação mockada com sucesso para qualquer combinação de credenciais preenchidas no formulário de login.
- [ ] **RF-03:** O formulário de cadastro (`RegisterForm`) deve incluir o campo de preenchimento do Nome do Usuário, garantindo que o nome cadastrado possa ser capturado e utilizado na sessão.
- [ ] **RF-04:** Quando deslogado, a tela Home deve apresentar o botão/indicador de sincronização (Sync) visualmente bloqueado (com ícone de cadeado) e exibir o botão de Login no canto superior direito do cabeçalho.
- [ ] **RF-05:** O serviço `sync-manager.ts` deve validar o estado de autenticação e impedir estritamente qualquer execução de sincronização em segundo plano enquanto o usuário não estiver logado.
- [ ] **RF-06:** O aplicativo deve permanecer 100% funcional no modo deslogado para todas as operações offline-first locais (criação e edição de tarefas, pomodoro, projetos, tags, etc. salvos no Dexie/IndexedDB).
- [ ] **RF-07:** Quando autenticado, o botão/indicador de sincronização (Sync) deve ficar desbloqueado e ativo, e o botão de login no cabeçalho deve ser substituído por um avatar circular exibindo as iniciais do usuário logado.
- [ ] **RF-08:** Ao clicar no avatar do usuário, um submenu dropdown deve ser exibido contendo a opção "Sair", com um ícone de saída antes do texto "Sair" (Logout).
- [ ] **RF-09:** Ao acionar a opção "Sair", o sistema deve encerrar a sessão imediatamente e reverter os componentes visuais para o estado deslogado de forma reativa, sem a necessidade de recarregar a página (refresh).

---

## 3. Fluxo do Usuário & Telas (User Journey)

### Fluxo 1: Usuário Não Autenticado (Offline First)
1. **Entrada:** O usuário acessa a aplicação sem sessão ativa.
2. **Visualização:**
   - No topo/cabeçalho: Ícone/botão para acessar a tela de Login.
   - No componente `MainLayout`: O componente de Sync é exibido bloqueado com ícone de cadeado.
3. **Uso Geral:** O usuário pode criar projetos, rodar timers Pomodoro/Flowmodoro e registrar atividades normalmente salvando tudo no banco local (IndexedDB via Dexie).
4. **Sincronização em Background:** O `sync-manager.ts` não inicia rotinas de envio/recebimento com o backend.

### Fluxo 2: Cadastro com Nome & Login Mockado
1. **Entrada:** O usuário clica no botão de Login e navega até o formulário de Cadastro ou Login.
2. **Cadastro:** O usuário preenche Nome, E-mail, Senha, Confirmação de Senha e submete o formulário. O nome informado fica registrado para a sessão.
3. **Login:** O usuário informa e-mail e senha no formulário de login e submete.
4. **Resposta do Sistema:** 
   - A sessão é iniciada imediatamente no contexto `useAuth`.
   - O usuário é redirecionado para a Home com o estado autenticado ativo.

### Fluxo 3: Usuário Autenticado & Logout Reativo
1. **Visualização:**
   - No topo/cabeçalho: O botão de login dá lugar ao avatar circular com as iniciais do nome do usuário (ex: "JN" para "João Neto").
   - Na tela Home: O Sync fica liberado e funcional.
2. **Abertura do Menu:** O usuário clica no avatar circular; um menu dropdown flutuante se abre com a opção "Sair".
3. **Logout:** O usuário clica em "Sair".
4. **Resposta do Sistema:**
   - O estado global de autenticação é limpo.
   - O avatar volta a ser o botão de login.
   - O Sync é bloqueado com o cadeado e o `sync-manager.ts` interrompe execuções ativas.
   - A interface reage instantaneamente sem disparar `window.location.reload()`.

---

## 4. Regras de Negócio e Casos de Borda (Edge Cases)

### Regras de Negócio
- **RN-01 (Natureza Mockada do Login):** A autenticação não deve depender de requisições HTTP para backends ou serviços externos. Qualquer e-mail e senha válidos segundo o schema de validação devem autenticar com sucesso.
- **RN-02 (Cálculo das Iniciais):** O avatar do usuário logado deve extrair até 2 letras maiúsculas das iniciais do nome fornecido (ex: "Maria Silva" -> "MS", "Alex" -> "A"). Se o nome não estiver disponível, utilizar o início do e-mail ou caractere padrão.
- **RN-03 (Papel da Autenticação):** A autenticação serve exclusivamente como mecanismo para habilitar a sincronização multi-dispositivo; a aplicação jamais deve bloquear navegação ou criação de dados locais por ausência de login.
- **RN-04 (Bloqueio Duplo do Sync):** O bloqueio do Sync deve ser garantido em duas camadas:
  1. *Camada Visual:* Bloqueio de cliques na UI e renderização do indicador de cadeado.
  2. *Camada de Serviço:* `sync-manager.ts` deve abortar/pausar a execução de sincronização se `isAuthenticated` for falso.
- **RN-05 (Persistência da Sessão):** O estado mockado de autenticação pode ser mantido no storage do navegador (`localStorage`) para persistir o login entre aberturas de abas/recarregamentos da página.

### Casos de Borda & Tratamento de Erros
- **Tentativa de Sincronização sem Login:** Se por qualquer evento ou atalho a sincronização for disparada no modo deslogado, a operação deve ser rejeitada silenciosamente pelo gerenciador ou exibir tooltip convidando o usuário a fazer login para sincronizar.
- **Fechamento do Menu do Usuário:** O menu suspenso do avatar deve fechar automaticamente ao clicar fora dele (*click outside*) ou ao pressionar a tecla `Escape`.
- **Nome com Múltiplos Espaços ou Acentos:** O extrator de iniciais deve sanitizar espaços em branco extras e manipular adequadamente caracteres acentuados.

---

## 5. Critérios de Aceite (Definition of Done)
- [ ] Contexto `AuthContext` e hook customizado `useAuth` criados e disponibilizados globalmente.
- [ ] O hook `useAuth` fornece `isAuthenticated`, `user` (com nome, e-mail, etc.), `login()` e `logout()`.
- [ ] Formulário de cadastro atualizado com o campo "Nome" e integrado ao schema de validação (`auth.schema.ts`).
- [ ] Login mockado funcional para qualquer credencial submetida com sucesso.
- [ ] Componente/Layout de Sync na Home exibe cadeado e fica desabilitado no estado deslogado.
- [ ] Botão de login visível no cabeçalho no estado deslogado.
- [ ] Componente de Avatar com iniciais exibido no cabeçalho quando o usuário estiver logado.
- [ ] Submenu do Avatar implementado contendo a ação "Sair".
- [ ] Logout atualiza reativamente toda a UI (Sync bloqueia, botão de login retorna) sem refresh da página.
- [ ] `sync-manager.ts` atualizado com trava de execução condicionada ao estado autenticado.
- [ ] Todas as funcionalidades offline continuam operando normalmente sem login.

---

## 6. Dúvidas Pendentes / A Propor
- **Persistência do Mock:** Por padrão, foi definido salvar a sessão mockada no `localStorage` para que o usuário não seja deslogado caso recarregue a página manualmente.
- **Tooltip de Orientação no Cadeado:** Propor exibir uma mensagem/tooltip explicativa ao passar o mouse sobre o Sync bloqueado: *"Faça login para sincronizar seus dados com outros dispositivos"*.
