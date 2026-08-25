# Plano de Implementação: Integração com Supabase Auth

Este documento detalha o plano técnico para implementar a autenticação real com Supabase Auth no frontend e a validação/autorização local de tokens JWT no backend Spring Boot, em conformidade com a especificação descrita em [supabase-auth-integration.spec.md](file:///home/savior/Documents/flowmodoro/_specs/supabase-auth-integration.md).

---

## 📂 Arquivos Envolvidos

### 1. Frontend (`frontend/src/`)
#### Novos Arquivos:
- **Configuração do Cliente Supabase:** `frontend/src/configs/supabase.configs.ts`
- **Hook / Utilitários de Erros de Auth:** `frontend/src/shared/utils/auth-error.utils.ts`

#### Arquivos a Modificar:
- **Tipos de Autenticação:** `frontend/src/shared/contexts/auth/auth.types.ts`
- **Contexto & Provedor:** `frontend/src/shared/contexts/auth/auth.context.tsx` e `frontend/src/shared/contexts/auth/auth.provider.tsx`
- **Configuração Axios / Interceptors:** `frontend/src/configs/api.configs.ts`
- **Formulários de Login/Cadastro/Reset:**
  - `frontend/src/features/login/components/forms/LoginForm.tsx`
  - `frontend/src/features/login/components/forms/RegisterForm.tsx`
  - `frontend/src/features/login/components/forms/PasswordRecovery.tsx`
  - `frontend/src/features/login/components/forms/ResetPasswordForm.tsx`
- **Variáveis de Ambiente:** `frontend/.env.example` (e `.env`)

---

### 2. Backend (`backend/src/main/java/com/company/flowmodoro/`)
#### Novos Pacotes e Arquivos:
- **Dependência Maven:** `backend/pom.xml` (`spring-boot-starter-oauth2-resource-server` ou `com.auth0:jwks-rsa` + `com.auth0:java-jwt` / Nimbus JOSE)
- **Feature de Usuários (`features/users/`):**
  - `features/users/UserModel.java` (`id`, `supabaseId`, `createdAt`, etc.)
  - `features/users/UserRepository.java`
  - `features/users/UserService.java` (criação lazy idempotente vinculada ao `supabaseId`)
- **Segurança e Validação JWT (`configs/security/`):**
  - `configs/security/SecurityConfig.java` (configuração do Spring Security / Resource Server e liberação de rotas públicas/healthcheck)
  - `configs/security/JwtAuthFilter.java` ou `JwtDecoderConfig.java` (validação local com JWKS cacheado e resiliente a falhas no startup)
  - `configs/security/AuthenticatedUserArgumentResolver.java` ou Context Holder (para injetar o usuário atual nos controllers)
- **Configurações:** `backend/src/main/resources/application.properties` (URL do Supabase / JWKS URI)

---

## 🛠️ Detalhamento Técnico das Etapas

### 🔹 PARTE 1: Frontend (Supabase Auth Client & Interceptor)

#### Passo 1.1: Inicialização do Cliente Supabase (`supabase.configs.ts`)
1. Instanciar o client Supabase usando `@supabase/supabase-js` (já presente no `package.json`):
   ```typescript
   import { createClient } from "@supabase/supabase-js";

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

   export const supabase = createClient(supabaseUrl, supabaseAnonKey);
   ```
2. Adicionar as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env.example`.

#### Passo 1.2: Refatoração do `AuthProvider` (`auth.provider.tsx`)
1. Substituir o estado mockado pelo listener oficial do Supabase `supabase.auth.onAuthStateChange((event, session) => ...)`:
   - Capturar a sessão inicial com `supabase.auth.getSession()`.
   - Mapear `session.user` para a interface `User` contendo `id` (`user.id` - UUID do Supabase), `name` (`user.user_metadata?.name`), e `email`.
2. Implementar as funções reais:
   - `login({ email, password })`: `supabase.auth.signInWithPassword({ email, password })`.
   - `register({ email, password, name })`: `supabase.auth.signUp({ email, password, options: { data: { name } } })`.
   - `logout()`: `supabase.auth.signOut()`.
   - `recoverPassword(email)`: `supabase.auth.resetPasswordForEmail(email, { redirectTo: ... })`.
   - `resetPassword(newPassword)`: `supabase.auth.updateUser({ password: newPassword })`.
3. Tratar erros do Supabase Auth e expor mensagens amigáveis em português (ex: credenciais inválidas, e-mail já em uso, etc.).

#### Passo 1.3: Interceptor do Axios com Bearer Token e Refresh Automático (`api.configs.ts`)
1. **Request Interceptor:**
   - Obter o token atual da sessão do Supabase: `const session = (await supabase.auth.getSession()).data.session;`.
   - Se houver sessão, anexar `config.headers.Authorization = 'Bearer ' + session.access_token`.
2. **Response Interceptor (401 Handling):**
   - Caso receba `401 Unauthorized`, tentar renovar a sessão com `supabase.auth.refreshSession()`.
   - Se renovado com sucesso, atualizar o header da requisição original e reenviar (retry).
   - Se falhar no refresh, deslogar e direcionar para a tela de login.

#### Passo 1.4: Integração dos Formulários (`LoginForm`, `RegisterForm`, `PasswordRecovery`, `ResetPasswordForm`)
1. Conectar as chamadas de formulário às funções assíncronas do `useAuth`.
2. Adicionar estados visuais de loading/desabilitar botões durante as requisições.
3. Exibir mensagens de erro específicas retornadas pelo Supabase.

---

### 🔹 PARTE 2: Backend (Spring Boot JWT Validation & Lazy User Creation)

#### Passo 2.1: Dependências e Configurações de Segurança no `pom.xml`
1. Adicionar o `spring-boot-starter-oauth2-resource-server` ou biblioteca de validação JWT Nimbus/Auth0.
2. Em `application.properties`, configurar a propriedade do emissor Supabase:
   ```properties
   supabase.jwt.issuer-uri=${SUPABASE_JWT_ISSUER_URI:https://<project-ref>.supabase.co/auth/v1}
   supabase.jwt.jwks-uri=${SUPABASE_JWKS_URI:https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json}
   ```

#### Passo 2.2: Configuração de Validação Local JWT com Cache de JWKS
1. Configurar o `JwtDecoder` utilizando o JWKS URI do Supabase com cache local (usando `NimbusJwtDecoder` com `RestOperations` / cache de chaves públicas).
2. **Resiliência de Inicialização (RN-05):** Garantir inicialização assíncrona ou fallback suave para que falha de rede temporária no startup não derrube o processo do Spring Boot.
3. Configurar o `SecurityFilterChain`:
   - Rotas públicas: `/health`, `/actuator/**`, `/swagger-ui/**`.
   - Rotas autenticadas: `/api/**` exigindo autenticação OAuth2 Resource Server (JWT).

#### Passo 2.3: Entidade de Usuário e Criação Lazy Idempotente (`features/users`)
1. Criar `UserModel`:
   - `@Id UUID id` (chave primária interna do backend).
   - `@Column(unique = true, nullable = false) UUID supabaseId` (referência do Supabase `sub`).
   - `@Column LocalDateTime createdAt`.
2. Criar `UserRepository` com `Optional<UserModel> findBySupabaseId(UUID supabaseId)`.
3. Criar `UserService.getOrCreateUser(UUID supabaseId)`:
   - Verificar se o usuário com `supabaseId` existe.
   - Se não existir, persistir o novo registro de forma segura/idempotente (tratando `DataIntegrityViolationException` em caso de concorrência no primeiro request).

#### Passo 2.4: Associação de Dados ao Usuário Autenticado
1. Criar um utilitário ou `HandlerMethodArgumentResolver` / `@AuthenticationPrincipal Jwt jwt` para obter o `supabaseId` do token.
2. Atualizar as features existentes (`projects`, `tags`, `sessions`) para que as consultas e persistências utilizem o ID do usuário autenticado no backend.

---

## 🧪 Estratégia de Teste e Validação

### 1. Testes Automatizados
- **Frontend:** Testes de unidade para o interceptor Axios e utilitários de autenticação.
- **Backend:** Testes de integração com `@SpringBootTest` e `SecurityMockMvcRequestPostProcessors.jwt()` validando:
  - Acesso negado com `401 Unauthorized` para endpoints `/api/**` sem token ou com token inválido.
  - Acesso liberado para rotas com JWT válido.
  - Criação lazy do `UserModel` no primeiro request autenticado.

### 2. Testes Manuais de Ponta a Ponta
1. **Cadastro e Login:** Criar uma nova conta pelo frontend, logar e verificar o token gerado no Supabase.
2. **Sincronização:** Disparar operações locais (criar projetos/tags) e verificar se o `sync-manager` sincroniza com sucesso usando o JWT no header.
3. **Persistência no Postgres:** Inspecionar o banco do backend e validar se o registro de usuário foi criado com o `supabase_id` correto e associado aos projetos/sessões.
4. **Renovação de Sessão:** Simular expiração de token e validar se o interceptor renova sem interromper o fluxo do usuário.
5. **Logout:** Acionar o logout no avatar e confirmar que as sessões e tokens foram devidamente limpos.
