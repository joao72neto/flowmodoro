# Spec: supabase-auth-integration

## 1. Visão Geral

- **Objetivo:** Implementar a camada de autenticação e autorização na API Spring Boot para decodificar e validar tokens JWT emitidos pelo Supabase Auth. A API deve extrair a identidade do usuário (`sub`) diretamente do token criptograficamente validado e utilizá-la para isolar o acesso e persistência dos dados (projetos, sessões, tags), substituindo cabeçalhos manuais/inseguros e rejeitando requisições não autorizadas.
- **Público/Atores:** Clientes da API (Frontend Web e App Mobile), API Backend Spring Boot (Resource Server), Supabase Auth (Provedor de Identidade / Emissor de Token e JWKS).

## 2. Requisitos Funcionais (RF)

- **RF-01:** A API deve interceptar e validar o token JWT enviado no cabeçalho `Authorization: Bearer <token>` em todos os endpoints protegidos (`/api/**`).
- **RF-02:** O backend deve validar a assinatura, emissor (`iss`), audiência (`aud`) e tempo de expiração (`exp`) do JWT localmente através do conjunto de chaves públicas (JWKS) disponibilizado pelo Supabase.
- **RF-03:** A API deve permitir acesso anônimo/público apenas a endpoints explicitamente liberados (ex: `/api/health`, documentação pública, se houver).
- **RF-04:** Quando o JWT for válido, o backend deve extrair o UUID do usuário (claim `sub`) e disponibilizá-lo para a camada de serviço/controladores sem depender de cabeçalhos manuais externos (como `X-User-Id`).
- **RF-05:** Toda operação de consulta, criação, atualização e exclusão em recursos protegidos (sessões, projetos, tags) deve operar estritamente sob o escopo do UUID do usuário autenticado no token.
- **RF-06:** O backend deve retornar código HTTP `401 Unauthorized` com payload de erro padronizado para requisições sem token, com token malformado, expirado ou com assinatura inválida.
- **RF-07:** O backend deve retornar código HTTP `403 Forbidden` caso um usuário tente acessar ou manipular recursos que não pertencem ao seu identificador.

## 3. Fluxo do Usuário & Telas / Endpoints (User Journey)

1. **Entrada:** O cliente HTTP (Frontend Web ou Mobile) envia uma requisição para qualquer endpoint protegido da API (ex: `GET /api/sessions`, `POST /api/projects`) contendo o header `Authorization: Bearer <jwt_token>`.
2. **Ação:** O filtro de segurança da API intercepta a requisição e executa a validação do JWT contra o JWKS do Supabase.
3. **Resposta do Sistema:**
   - **Se sucesso (Token Válido):** O contexto de segurança é populado com o UUID do usuário (`sub`). O controlador processa a requisição garantindo que os dados acessados/persistidos pertençam a esse usuário e retorna `200 OK`, `201 Created` ou `204 No Content`.
   - **Se erro (Token Ausente ou Inválido):** A requisição é interrompida imediatamente na camada de segurança, retornando `401 Unauthorized` com corpo explicativo no padrão JSON da API.
   - **Se erro (Acesso Negado a Recurso de Outro Usuário):** A aplicação interrompe o processamento e retorna `403 Forbidden` ou `404 Not Found` (evitando vazamento de existência de recursos de terceiros).

## 4. Regras de Negócio e Casos de Borda (Edge Cases)

### Regras de Negócio

- **RN-01 (Validação Local com Cache de JWKS):** A API não deve fazer chamadas de rede ao Supabase a cada requisição. O JWKS (chaves públicas) do Supabase deve ser cacheado pelo backend, com suporte à atualização automática periódica ou sob demanda em caso de rotação de chaves.
- **RN-02 (Eliminação de Spoofing de Usuário):** O backend não deve mais confiar no cabeçalho `X-User-Id` enviado pelo cliente. O `userId` deve ser obtido exclusivamente a partir das claims do JWT validado.
- **RN-03 (Isolamento Multi-tenant por Usuário):** Nenhum usuário pode listar, editar, vincular ou excluir tags, projetos ou sessões pertencentes a outro `userId`.
- **RN-04 (Compatibilidade de CORS com Headers de Auth):** A configuração de CORS da API deve continuar permitindo o envio do cabeçalho `Authorization` a partir das origens configuradas (Web/Mobile).
- **RN-05 (Resiliência na Inicialização):** A indisponibilidade momentânea da rede ou do endpoint de JWKS do Supabase no startup da API não deve travar a subida da aplicação, operando com retentativas ou carregamento lazy.

### Casos de Borda & Tratamento de Erros

- **Token Expirado durante a Sessão:** A API deve retornar `401 Unauthorized` indicando explicitamente a expiração (para que o frontend possa efetuar o refresh do token transparente).
- **Token Malformado ou Chave Incorreta:** Se o header `Authorization` contiver uma string inválida ou assinatura corrompida, rejeitar com `401 Unauthorized`.
- **Requisição sem Header Authorization em Endpoint Protegido:** Rejeitar imediatamente com `401 Unauthorized`.
- **Rotação de Chaves no Supabase:** Se uma requisição chegar com um token assinado por um novo `kid` (Key ID) não presente no cache local, a API deve atualizar o JWKS antes de rejeitar o token.
- **Cold Start do Backend:** O processamento da validação de token deve ser otimizado em memória para não introduzir latência adicional perceptível no cold start.

## 5. Critérios de Aceite (Definition of Done)

- [x] Todos os endpoints de negócio sob `/api/**` rejeitam requisições sem header `Authorization` válido retornando `401 Unauthorized`.
- [x] Requisições com JWT válido emitido pelo Supabase têm sua assinatura e claims validadas com sucesso localmente.
- [x] O `userId` é extraído do `sub` do token autenticado e utilizado automaticamente pelos Services/Repositories.
- [x] O header `X-User-Id` foi removido de todos os `@RequestHeader` dos Controllers.
- [x] Endpoints públicos (como `/api/health`) continuam acessíveis sem autenticação.
- [x] Requisições autenticadas só retornam e manipulam dados pertencentes ao usuário dono do token.
- [x] Testes automatizados (unitários e de integração) cobrem cenários com token válido, token expirado, token inválido e requisição sem token.

## 6. Dúvidas Pendentes / A Propor

- **Estratégia de Injeção do Usuário:** Propõe-se utilizar a anotação padrão do Spring Security `@AuthenticationPrincipal Jwt jwt` (ou um `@CurrentUser` customizado) nos controllers, ou obter o usuário diretamente no Service via `SecurityContextHolder`. Confirma essa abordagem?
R: Pode utilizar a anotação padrão do Spring Security.

- **Formato de Erro 401/403:** A API deve seguir o formato padrão existente de exceções da aplicação (ex: `GlobalExceptionHandler` / `ProblemDetail` / DTO customizado) para respostas de erro de autenticação emitidas pelo Spring Security.
R: Pode seguir o formato padrão existente.
