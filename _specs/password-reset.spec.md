# Spec: Alteração de Senha (Password Reset)

## 1. Visão Geral
- **Objetivo:** Permitir que o usuário redefina sua senha de acesso ao sistema de forma segura após solicitar a recuperação de senha por e-mail. A tela será acessada a partir de um link de redirecionamento contendo um token de autorização.
- **Público/Atores:** Usuários não autenticados que iniciaram o fluxo de recuperação de senha e receberam o link com o código de autorização por e-mail.

---

## 2. Requisitos Funcionais (RF)
- [ ] **RF-01:** O sistema deve capturar o código de autorização enviado via query parameter `code` na URL (ex: `/reset-password?code=xyz`).
- [ ] **RF-02:** O sistema deve exibir um formulário com os campos "Nova Senha" e "Confirmar Nova Senha".
- [ ] **RF-03:** O sistema deve validar os campos do formulário em tempo real utilizando as regras de complexidade de senha definidas.
- [ ] **RF-04:** O sistema deve redirecionar o usuário para a página de login (`/login`) caso o parâmetro `code` esteja ausente na URL, exibindo uma mensagem de alerta explicativa.
- [ ] **RF-05:** O sistema deve permitir a alteração da senha ao submeter o formulário com dados válidos, simulando a operação com sucesso (sem integração por enquanto) e redirecionando o usuário para `/login`.
- [ ] **RF-06:** O sistema deve aplicar as mesmas regras de complexidade de senha no formulário de Cadastro de Usuário (`RegisterForm.tsx`).
- [ ] **RF-07:**  O sistema também deve simular a operação de sucesso para o cadastro de usuário, exibindo uma mensagem de sucesso e redirecionando o usuário para `/login`.

---

## 3. Fluxo do Usuário & Telas (User Journey)
1. **Entrada:** O usuário clica no link recebido no e-mail de recuperação de senha e acessa `/reset-password?code=<token_de_autorizacao>`.
   - Se o código não estiver presente na URL, o usuário é redirecionado para `/login` com um alerta ("Código de autorização inválido ou ausente").
2. **Ação:** O usuário visualiza o formulário de alteração de senha (dentro do mesmo layout estrutural da página de login) e preenche os campos "Nova Senha" e "Confirmar Nova Senha".
3. **Validação:** O sistema valida se a senha cumpre os requisitos mínimos de segurança e se os dois campos coincidem.
4. **Submissão:** O usuário clica no botão "Alterar Senha".
5. **Resposta do Sistema:**
   - **Sucesso (Mockado):** O formulário é limpo, e o usuário é redirecionado para a página de login (`/login`), idealmente com uma mensagem de sucesso visual.
   - **Erro de Validação:** Mensagens de erro correspondentes aparecem abaixo dos respectivos inputs e o botão de submissão não executa a ação de sucesso.

---

## 4. Regras de Negócio e Casos de Borda (Edge Cases)

### Regras de Negócio
- **RN-01 (Complexidade da Senha):** A nova senha deve atender obrigatoriamente aos seguintes critérios de segurança:
  - Mínimo de 8 caracteres.
  - Pelo menos uma letra maiúscula.
  - Pelo menos uma letra minúscula.
  - Pelo menos um número.
  - Pelo menos um caractere especial (ex: `@`, `$`, `!`, `%`, `*`, `?`, `&`, `#`).
- **RN-02 (Coincidência de Senhas):** O campo "Confirmar Nova Senha" deve ser idêntico ao campo "Nova Senha".
- **RN-03 (Alinhamento de Regras):** O formulário de cadastro existente (`RegisterForm`) deve ser atualizado para adotar exatamente a mesma regra de complexidade de senha (`RN-01`).
- **RN-04 (Consistência Visual):** A página de redefinição de senha deve compartilhar do mesmo layout dividido de tela (`AuthContainer` e gradiente lateral) presente na página de login.
- **RN-05 (Simulação de Sucesso):** Todas as operações de simulação de sucesso devem usar o modal do contexto `modal.context` para exibir mensagens de sucesso ou erro. 

### Casos de Borda & Tratamento de Erros
- **Acesso Direto / Sem Código na URL:** Bloquear a renderização da tela de alteração de senha e redirecionar imediatamente o usuário para `/login` exibindo um alerta ("Acesso inválido. Código de recuperação ausente.").
- **Dados Inválidos ou Fracos:** Exibição de mensagens de validação em tempo real abaixo dos campos de input (`yupResolver` com `mode: "onChange"`).
- **Submissão Dupla:** O botão de envio deve ser desabilitado ou exibir um estado de carregamento durante o envio do formulário para evitar múltiplos cliques/requisições concorrentes.

---

## 5. Critérios de Aceite (Definition of Done)
- [ ] Rota `/reset-password` criada e mapeada no arquivo de rotas do React Router.
- [ ] Validação do parâmetro de consulta `code` implementada no carregamento da página, redirecionando com alerta apropriado em caso de ausência.
- [ ] Novo formulário criado seguindo o padrão de design dos demais formulários de autenticação (uso de `FormContainer`, `ReturnTitle`, `InputGroup`, `InputGroupWrapper` e `Button`).
- [ ] Validação Yup atualizada no `auth.schema.ts` para implementar regras de complexidade tanto no esquema de alteração quanto no esquema de cadastro (`RegisterSchema`).
- [ ] Formulário integrado com `react-hook-form` e `yupResolver` exibindo mensagens de erro corretas em tempo real.
- [ ] Comportamento de sucesso mockado com redirecionamento funcional para `/login`.
- [ ] Design totalmente responsivo (Mobile e Desktop) em conformidade com o Tailwind CSS 4 do restante da aplicação.

---

## 6. Dúvidas Pendentes / A Propor
- **Feedback Visual de Sucesso:** É recomendado utilizar o modal do contexto `modal.context` ou para exibir "Senha alterada com sucesso!" logo após o redirecionamento para o login, para que o usuário saiba por que foi redirecionado.
- **Exibição dos Requisitos:** Para melhorar a experiência do usuário (UX), propõe-se exibir de forma dinâmica quais requisitos da senha (letra maiúscula, número, caractere especial, etc.) foram atendidos enquanto o usuário digita a senha.
