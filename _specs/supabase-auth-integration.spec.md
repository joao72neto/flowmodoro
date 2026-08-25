# Spec: supabase-auth-integration

## 1. Visão Geral

- **Objetivo:** Substituir o login mockado atual do Flowmodoro por autenticação real via Supabase Auth no frontend, com o backend Spring Boot validando os tokens JWT emitidos pelo Supabase para proteger os endpoints da API e associar todo dado persistido ao usuário autenticado.
- **Público/Atores:** Usuário final do Flowmodoro (web e Android via Capacitor), Backend Spring Boot (consumidor/validador de token), Supabase Auth (provedor de identidade externo).

## 2. Requisitos Funcionais (RF)

- **RF-01:** O sistema deve permitir que um usuário se cadastre com nome, email e senha via Supabase Auth.
- **RF-02:** O sistema deve permitir que um usuário faça login com email e senha via Supabase Auth.
- **RF-03:** O frontend deve anexar o access token (JWT) do Supabase em toda requisição autenticada ao backend, via header `Authorization: Bearer <token>`. Isso deve ser feito por meio de um interceptor de requisições usando axios.
- **RF-04:** O backend deve validar a assinatura e a validade do JWT **localmente**, usando as chaves públicas (JWKS) do Supabase — sem fazer uma chamada de rede ao Supabase a cada request.
- **RF-05:** Quando o token for válido, o backend deve extrair o identificador do usuário (`sub`, um UUID do Supabase) e usar isso para identificar — ou criar, no primeiro acesso — o registro correspondente no Postgres do backend.
- **RF-06:** O sistema deve permitir logout, encerrando a sessão local (Supabase client) e limpando o token armazenado no client.
- **RF-07:** O access token deve ser renovado automaticamente via refresh token antes de expirar, de forma transparente pro usuário.
- **RF-08:** O backend deve rejeitar com `401 Unauthorized` qualquer requisição sem token, com token inválido, expirado ou com assinatura incorreta.

## 3. Fluxo do Usuário & Telas / Endpoints (User Journey)

1. **Entrada:** Usuário acessa a tela de login/cadastro do Flowmodoro (web ou Android).
2. **Ação:** Usuário preenche email e senha e envia o formulário (cadastro ou login).
3. **Resposta do Sistema:**
   - Se sucesso: Supabase retorna a sessão (`access_token` + `refresh_token`); o app armazena a sessão via SDK do Supabase e navega para a área autenticada. A partir daí, toda chamada à API do backend carrega o `access_token` no header.
   - Se erro: feedback amigável específico (ex: "email já cadastrado", "credenciais inválidas", "senha muito curta").

**Fluxo complementar — primeiro request autenticado ao backend:**

1. Frontend chama qualquer endpoint da API com o JWT do Supabase.
2. Backend valida o JWT localmente contra o JWKS cacheado.
3. Backend verifica se já existe um usuário local com aquele `supabase_id`.
   - Se não existir, cria o registro (criação "lazy" no primeiro acesso — ver dúvida pendente 1).
   - Se existir, segue o fluxo normal do endpoint.

## 4. Regras de Negócio e Casos de Borda (Edge Cases)

### Regras de Negócio

- **RN-01:** O conjunto de chaves públicas (JWKS) do Supabase deve ser cacheado no backend (não buscado a cada request), mas o backend deve conseguir atualizar o cache caso a chave rotacione (evitar travar validação por chave desatualizada).
- **RN-02:** Cada `supabase_id` (UUID) deve corresponder a exatamente um registro na tabela de usuários do backend. Não deve haver duplicidade.
- **RN-03:** O schema atual de usuário (ligado ao login mockado) será descartado. Os dados de teste existentes serão apagados — não há migração de dados reais nesta spec. O novo schema passa a ter `supabase_id` (UUID) como identificador de referência do usuário.
- **RN-04:** A validação do token no backend não deve depender de o Supabase estar "no ar" no momento do request (é local, via JWKS já cacheado) — isso é intencional para não somar mais um ponto de falha externo ao cold start do Render.
- **RN-05:** A indisponibilidade do JWKS no momento do startup do backend não deve derrubar a aplicação. O processo deve subir normalmente e tentar buscar as chaves em background, mantendo os demais endpoints (não autenticados, health check) funcionando enquanto isso.

### Casos de Borda & Tratamento de Erros

- **Falha de rede / API indisponível:** Se o backend no Render estiver "dormindo" (cold start), o frontend deve tratar o timeout/erro de conexão inicial com retry e/ou estado de loading — isso é independente da validação do token (que continua sendo local quando o backend acorda).
- **Token expirado durante o uso:** Um `401` do backend deve disparar a renovação automática do token pelo Supabase client e reenvio transparente da requisição original; se o refresh também falhar, o usuário é redirecionado para o login.
- **JWKS indisponível na inicialização do backend:** comportamento a definir — ver dúvida pendente 3.
- **Múltiplos dispositivos logados (web + Android) simultaneamente:** cada dispositivo mantém sua própria sessão/token de forma independente; não há invalidação cruzada nesta spec.
- **Concorrência / criação duplicada de usuário:** a criação "lazy" do registro de usuário no primeiro login deve ser idempotente, evitando duplicar o registro caso duas requisições autenticadas cheguem em paralelo logo após o cadastro.
- **Dados inválidos / incompletos no cadastro:** validação de formato de email e senha (regras mínimas do próprio Supabase) com feedback em tempo real no formulário.

## 5. Critérios de Aceite (Definition of Done)

- Cadastro e login funcionam via Supabase Auth com email/senha, tanto na web quanto no Android (Capacitor).
- Requisições autenticadas ao backend são validadas via JWT localmente (JWKS cacheado), sem chamada externa ao Supabase por request.
- Requisição sem token, com token expirado ou inválido retorna `401`.
- No primeiro login de um usuário novo, o registro correspondente é criado automaticamente no backend, vinculado ao `supabase_id`.
- Renovação de token acontece de forma transparente antes da expiração, sem deslogar o usuário no meio do uso normal.
- Logout limpa a sessão local e o token armazenado.
- Dados de teste antigos (schema de auth mockado) foram removidos/substituídos.

## 6. Dúvidas Pendentes / A Propor

- **Criação do usuário no backend:** proponho que seja **lazy** (criado automaticamente no primeiro request autenticado, RF-05), em vez de exigir um endpoint explícito de "completar cadastro". Confirma esse caminho, ou prefere um passo explícito de sincronização logo após o signup? Pode ser lazy mesmo.

- **Dado de perfil:** o backend deve guardar só o `supabase_id`, ou também replicar campos como nome/avatar vindos do Supabase? Isso muda o RN-03 e o schema. Guarde apenas o `supabase_id`.

- **Fallback de indisponibilidade do Supabase:** dado que o app é offline-first (Dexie/IndexedDB), o usuário já logado deve conseguir continuar usando o app localmente mesmo se o Supabase cair (sem conseguir logar/deslogar nesse meio tempo)? Vale registrar essa regra explicitamente ou fica fora de escopo por agora? Deixe de fora por hora.
