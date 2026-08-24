# Plano de Implementação: Alteração de Senha (Password Reset)

Este documento detalha o plano técnico para implementar a funcionalidade de alteração de senha no frontend, em conformidade com as especificações descritas em [password-reset.spec.md](file:///home/savior/Documents/flowmodoro/_specs/password-reset.spec.md).

---

## 📂 Arquivos Envolvidos

### 1. Novos Arquivos
- **Formulário:** `frontend/src/features/login/components/forms/ResetPasswordForm.tsx`
- **Página:** `frontend/src/features/login/ResetPasswordPage.tsx`

### 2. Arquivos a Modificar
- **Esquema de Validação:** [auth.schema.ts](file:///home/savior/Documents/flowmodoro/frontend/src/features/login/auth.schema.ts)
- **Rotas:** [App.tsx](file:///home/savior/Documents/flowmodoro/frontend/src/app/App.tsx)
- **Feedback de Alertas:** [LoginForm.tsx](file:///home/savior/Documents/flowmodoro/frontend/src/features/login/components/forms/LoginForm.tsx)

---

## 🛠️ Detalhamento Técnico das Etapas

### Passo 1: Atualização e Compartilhamento de Esquemas em `auth.schema.ts`
1. Criar uma constante de validação reutilizável de senha forte (`passwordValidation`):
   - Mínimo de 8 caracteres (`.min(8, "...")`).
   - Pelo menos uma letra maiúscula (`.matches(/[A-Z]/, "...")`).
   - Pelo menos uma letra minúscula (`.matches(/[a-z]/, "...")`).
   - Pelo menos um número (`.matches(/\d/, "...")`).
   - Pelo menos um caractere especial (`.matches(/[@$!%*?&#]/, "...")`).
2. Atualizar o `RegisterSchema` para utilizar `passwordValidation` no campo `password`.
3. Criar e exportar o novo esquema `ResetPasswordSchema` e seu tipo associado `IResetPasswordSchema` usando `passwordValidation` para a nova senha e validação de igualdade (`oneOf([yup.ref("password")], "...")`) no campo `confirmPassword`.

### Passo 2: Implementação do Formulário `ResetPasswordForm.tsx`
1. Estruturar o componente utilizando as mesmas bibliotecas e convenções de formulário do projeto (`react-hook-form` com `yupResolver`).
2. Componentes visuais a utilizar:
   - `<FormContainer>` com `direction={1}`.
   - `<ReturnTitle>` apontando ou redirecionando para `/login`.
   - `<InputGroupWrapper>` envolvendo dois inputs do tipo `password`.
   - `<InputGroup>` para "Nova Senha" (registrando `password`).
   - `<InputGroup>` para "Confirmar Nova Senha" (registrando `confirmPassword`).
   - `<Stack align="left">` contendo o `<Button>` para submeter o formulário (ex: utilizando ícone apropriado como `IoMdSend` ou similar).
3. Na função `onValid` (sucesso da validação), disparar a navegação de redirecionamento para o login passando um estado de sucesso (ex: `/login?alert=reset_success` ou via state).

### Passo 3: Criação da Página `ResetPasswordPage.tsx`
1. Replicar a mesma estrutura visual dividida presente no [AuthPage.tsx](file:///home/savior/Documents/flowmodoro/frontend/src/features/login/AuthPage.tsx):
   - Layout flexível contendo `AuthContainer` à esquerda e div de gradiente estético à direita.
2. Usar o hook `useSearchParams` do `react-router-dom` para buscar o parâmetro `code` na URL:
   - Se o código não estiver presente na inicialização da página (`useEffect`), executar o redirecionamento imediato (`navigate("/login?alert=missing_code")`).
3. Renderizar o `ResetPasswordForm` dentro do `AuthContainer` passando o `code` obtido se ele for válido.

### Passo 4: Integração de Rotas no `App.tsx`
1. Importar a nova página `ResetPasswordPage`.
2. Adicionar a nova rota na árvore de rotas:
   ```tsx
   <Route path="/reset-password" element={<ResetPasswordPage />} />
   ```

### Passo 5: Suporte a Alertas e Mensagens de Feedback no `LoginForm.tsx`
1. Ler os parâmetros da URL no `LoginForm` usando `useSearchParams` ou `useLocation`.
2. Detectar se existe o parâmetro `alert`:
   - Se `alert === "missing_code"`, exibir uma mensagem/callout de erro acima dos inputs com texto estilizado de erro (ex: *"Código de recuperação inválido ou ausente. Solicite uma nova recuperação."*).
   - Se `alert === "reset_success"`, exibir uma mensagem/callout de sucesso (ex: *"Senha alterada com sucesso! Faça login com suas novas credenciais."*).
3. Utilizar o `<AnimatedCollapse>` se apropriado para exibir os alertas de forma suave.

---

## 🧪 Estratégia de Teste e Validação (Manual)

### Teste de Acesso Sem Token (Segurança / Regra de Negócio)
1. Abrir o navegador na URL `/reset-password` diretamente (sem parâmetros).
2. **Resultado esperado:** O app redireciona instantaneamente para `/login?alert=missing_code` e renderiza um alerta vermelho explicando o problema.

### Teste de Validação de Complexidade de Senha
1. Acessar `/reset-password?code=qualquer_token_teste`.
2. Digitar senhas fracas no input "Nova Senha" (ex: `123`, `abcde`, `SemEspecial1`).
3. **Resultado esperado:** As mensagens informando qual critério de complexidade está faltando devem ser exibidas em tempo real abaixo do input.
4. Digitar senhas corretas, porém não coincidentes.
5. **Resultado esperado:** Mensagem de erro "As senhas não coincidem" exibida sob o campo de confirmação.

### Teste de Cadastro (Regressão / Alinhamento de Regra)
1. Acessar `/login` e clicar em "Cadastre-se".
2. Testar se a senha forte é exigida e se as mesmas validações de complexidade são exibidas de forma idêntica à tela de alteração.

### Teste de Fluxo de Sucesso
1. Acessar `/reset-password?code=12345`.
2. Preencher ambos os campos com a mesma senha forte (ex: `SenhaForte123!`).
3. Clicar em "Alterar Senha".
4. **Resultado esperado:** A tela redireciona para `/login?alert=reset_success` e exibe o alerta verde de sucesso.
