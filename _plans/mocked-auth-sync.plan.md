# Plano de Implementação: Autenticação Mockada e Controle de Sincronização

Este documento detalha o plano técnico para implementar o gerenciamento de autenticação mockada no frontend e o controle reativo da sincronização de dados, em conformidade com as especificações descritas em [mocked-auth-sync.spec.md](file:///home/savior/Documents/flowmodoro/_specs/mocked-auth-sync.spec.md).

---

## 📂 Arquivos Envolvidos

### 1. Novos Arquivos
- **Tipos de Autenticação:** `frontend/src/shared/contexts/auth/auth.types.ts`
- **Contexto & Hook:** `frontend/src/shared/contexts/auth/auth.context.tsx`
- **Provedor de Autenticação:** `frontend/src/shared/contexts/auth/auth.provider.tsx`
- **Utilitário de Iniciais do Avatar:** `frontend/src/shared/utils/avatar.utils.ts`
- **Componente de Avatar com Dropdown:** `frontend/src/shared/components/UserAvatarMenu.tsx`

### 2. Arquivos a Modificar
- **Provedores Globais:** [frontend/src/app/Providers.tsx](file:///home/savior/Documents/flowmodoro/frontend/src/app/Providers.tsx)
- **Esquema de Validação:** [frontend/src/features/login/auth.schema.ts](file:///home/savior/Documents/flowmodoro/frontend/src/features/login/auth.schema.ts)
- **Formulário de Cadastro:** [frontend/src/features/login/components/forms/RegisterForm.tsx](file:///home/savior/Documents/flowmodoro/frontend/src/features/login/components/forms/RegisterForm.tsx)
- **Formulário de Login:** [frontend/src/features/login/components/forms/LoginForm.tsx](file:///home/savior/Documents/flowmodoro/frontend/src/features/login/components/forms/LoginForm.tsx)
- **Layout Principal:** [frontend/src/app/MainLayout/MainLayout.tsx](file:///home/savior/Documents/flowmodoro/frontend/src/app/MainLayout/MainLayout.tsx)
- **Status do Sync:** [frontend/src/app/MainLayout/SyncStatus.tsx](file:///home/savior/Documents/flowmodoro/frontend/src/app/MainLayout/SyncStatus.tsx)
- **Gerenciador de Sync:** [frontend/src/local/sync/sync-manager.ts](file:///home/savior/Documents/flowmodoro/frontend/src/local/sync/sync-manager.ts)

---

## 🛠️ Detalhamento Técnico das Etapas

### Passo 1: Contexto e Tipagens de Autenticação (`auth.types.ts`, `auth.context.tsx`, `auth.provider.tsx`)
1. **`auth.types.ts`**:
   - Definir a interface `User` contendo `{ id: string; name: string; email: string }`.
   - Definir a interface `AuthContextType` contendo:
     - `user: User | null`
     - `isAuthenticated: boolean`
     - `login: (data: { email: string; name?: string }) => void`
     - `logout: () => void`
2. **`auth.context.tsx`**:
   - Criar `AuthContext = createContext<AuthContextType | undefined>(undefined)`.
   - Exportar o hook `useAuth()` com verificação de provedor.
3. **`auth.provider.tsx`**:
   - Manter estado do `user` inicializado a partir do `localStorage` (chave: `flowmodoro:auth:user`).
   - Implementar `login()` que gera/armazena o usuário no storage e atualiza o estado.
   - Implementar `logout()` que limpa o storage e reseta o estado para `null`.
   - Disparar um evento customizado de logout/login para sincronizar listeners externos (como o `sync-manager`).
4. **`Providers.tsx`**:
   - Envolver a árvore de componentes com `<AuthProvider>`.

### Passo 2: Atualização do Schema e Formulários de Autenticação
1. **`auth.schema.ts`**:
   - Adicionar o campo `name` obrigatório no `RegisterSchema` (`yup.string().required("O nome é obrigatório").min(2, "O nome deve ter pelo menos 2 caracteres")`).
2. **`RegisterForm.tsx`**:
   - Adicionar o campo de input "Nome" (`<InputGroup register={register("name")} error={errors.name} label="Nome" placeholder="Seu nome completo" />`).
   - Ao submeter com sucesso, passar os dados cadastrados ou salvar na sessão.
3. **`LoginForm.tsx`**:
   - Obter a função `login` de `useAuth()`.
   - No `onValid`, chamar `login({ email: data.email })` antes de redirecionar para `/`.

### Passo 3: Utilitário de Iniciais e Componente `UserAvatarMenu`
1. **`avatar.utils.ts`**:
   - Criar `getInitials(nameOrEmail: string): string` para extrair até 2 letras maiúsculas (ex: "João Neto" -> "JN", "maria@email.com" -> "M").
2. **`UserAvatarMenu.tsx`**:
   - Renderizar botão circular com Tailwind estilizado (`bg-primary text-text-contrast` ou gradiente) exibindo as iniciais do `user.name` ou `user.email`.
   - Gerenciar estado aberto/fechado com dropdown flutuante posicionado no canto superior direito.
   - Utilizar `useClickOutside` para fechar o menu ao clicar fora.
   - Adicionar item de menu "Sair" com ícone (`IoLogOutOutline` ou similar) que dispara `logout()`.

### Passo 4: Integração de Layout em `MainLayout.tsx`
1. Consumir `const { isAuthenticated, user } = useAuth()`.
2. No canto superior direito:
   - Se `!isAuthenticated`: exibir o botão de login (`<Link to="/login"><IoLogInOutline size={30} /></Link>`).
   - Se `isAuthenticated`: exibir o `<UserAvatarMenu />`.

### Passo 5: Bloqueio Visual no `SyncStatus.tsx`
1. Consumir `const { isAuthenticated } = useAuth()`.
2. Se `!isAuthenticated`:
   - Exibir ícone de cadeado (`IoLockClosedOutline` ou `MdOutlineLock`) com cor neutra/desabilitada (`text-neutral-40`).
   - Exibir tooltip explicativo em hover: *"Faça login para sincronizar seus dados"*.
   - Impedir abertura do painel de falhas/erros de sincronização.
3. Se `isAuthenticated`:
   - Manter o comportamento existente de renderização dos ícones normais de sincronização.

### Passo 6: Bloqueio no Gerenciador de Sincronização (`sync-manager.ts`)
1. Criar helper para checar se existe usuário logado no storage ou consultar o estado de autenticação antes de executar `syncQueue.processQueue()`.
2. Se `!isAuthenticated`, ignorar chamadas de sincronização automática e temporizada (`setInterval`, `visibilitychange`, `networkStatusChange`).
3. Adicionar listener para escutar evento de login e disparar sincronização imediata assim que o login for realizado.

---

## 🧪 Estratégia de Teste e Validação (Manual)

### 1. Teste de Estado Deslogado (Offline-First)
1. Abrir a aplicação em uma aba anônima (sem sessão salva).
2. **Resultado esperado:**
   - O canto superior direito exibe o ícone de Login.
   - O indicador de Sync na tela Home exibe um ícone de cadeado.
   - O usuário consegue criar projetos, tags e rodar timers normalmente.
   - Nenhuma chamada ou tentativa de sync em background é disparada.

### 2. Teste de Cadastro com Nome
1. Acessar `/login` e clicar em "Cadastre-se".
2. Tentar submeter sem preencher o nome.
3. **Resultado esperado:** Erro de validação "O nome é obrigatório".
4. Preencher nome, e-mail e senha válida.

### 3. Teste de Login Mockado
1. Acessar a tela de login e informar credenciais válidas.
2. Clicar em "Entrar".
3. **Resultado esperado:**
   - Redirecionamento para a Home.
   - O botão de login dá lugar ao avatar circular com as iniciais do usuário.
   - O Sync passa a ficar disponível e funcional (ícones de status ativo sem cadeado).

### 4. Teste de Logout Reativo
1. Com usuário autenticado, clicar no avatar no canto superior direito.
2. **Resultado esperado:** Submenu abre com a opção "Sair".
3. Clicar em "Sair".
4. **Resultado esperado:**
   - A interface reage imediatamente sem recarregar a página.
   - O avatar volta a ser o botão de login.
   - O Sync volta a exibir o cadeado bloqueado.
