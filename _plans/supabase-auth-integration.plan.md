# Plano de Implementação: Backend Supabase Auth Integration

Este documento detalha o plano técnico de implementação para decodificação e validação de tokens JWT do Supabase Auth na API Spring Boot, em conformidade com a especificação em [_specs/supabase-auth-integration.spec.md](file:///home/savior/Documents/flowmodoro/_specs/supabase-auth-integration.spec.md) e as diretrizes arquiteturais em [.agents/rules.md](file:///home/savior/Documents/flowmodoro/.agents/rules.md).

---

## 🎯 Objetivos Técnicos

1. Transformar a API Spring Boot em um **OAuth2 Resource Server** capaz de validar tokens JWT emitidos pelo Supabase Auth de forma local (via JWKS cacheado).
2. Substituir o uso vulnerável de cabeçalhos manuais (`X-User-Id`) pela extração segura do UUID do usuário autenticado (`sub` claim do JWT validado).
3. Proteger todos os endpoints sob `/api/**` contra acessos anônimos ou tokens inválidos/expirados, mantendo rotas públicas (como `/api/health`) abertas.
4. Padronizar as respostas de erro de autenticação (`401 Unauthorized`) e autorização (`403 Forbidden`) no formato padrão `ErrorResponse` da aplicação.
5. Atualizar os controllers das features (`projects`, `sessions`, `tags`) e o interceptor de rate limit para utilizarem o usuário autenticado.

---

## 📂 Arquivos e Pacotes Envolvidos

### 1. Modificações de Dependências e Configurações
- `backend/pom.xml`: Adicionar dependência `spring-boot-starter-oauth2-resource-server`.
- `backend/src/main/resources/application.properties`: Adicionar configurações de JWKS URI e Issuer URI do Supabase.
- `backend/src/main/java/com/company/flowmodoro/configs/WebConfig.java`: Ajustar configuração de CORS e registrar `HandlerMethodArgumentResolver` para injeção do usuário atual.

### 2. Novos Componentes de Segurança (`configs/security/`)
- `backend/src/main/java/com/company/flowmodoro/configs/security/SecurityConfig.java`: Configuração principal do Spring Security / Resource Server, regras de autorização de rotas e filtros CORS.
- `backend/src/main/java/com/company/flowmodoro/configs/security/CustomAuthenticationEntryPoint.java`: Manipulador para converter falhas de autenticação (`401`) no formato JSON `ErrorResponse`.
- `backend/src/main/java/com/company/flowmodoro/configs/security/CustomAccessDeniedHandler.java`: Manipulador para converter acessos negados (`403`) no formato JSON `ErrorResponse`.
- `backend/src/main/java/com/company/flowmodoro/configs/security/CurrentUser.java`: Anotação customizada para injeção do UUID do usuário autenticado nos métodos dos Controllers.
- `backend/src/main/java/com/company/flowmodoro/configs/security/CurrentUserArgumentResolver.java`: `HandlerMethodArgumentResolver` responsável por extrair o claim `sub` (UUID) do `Jwt` autenticado no `SecurityContext`.
- `backend/src/main/java/com/company/flowmodoro/configs/security/SecurityUtils.java`: Utilitário estático auxiliar para obtenção rápida do `UUID` do usuário autenticado no contexto atual.

### 3. Tratamento de Exceções (`exception/`)
- `backend/src/main/java/com/company/flowmodoro/exception/enums/CommonErrorCode.java`: Adicionar `UNAUTHORIZED` e `ACCESS_DENIED`.

### 4. Ajustes nas Features Existentes
- `backend/src/main/java/com/company/flowmodoro/configs/RateLimitInterceptor.java`: Atualizar para obter o identificador a partir do usuário autenticado no token (com fallback para IP em rotas públicas).
- `backend/src/main/java/com/company/flowmodoro/features/projects/ProjectController.java`: Substituir `@RequestHeader("X-User-Id") UUID userId` por `@CurrentUser UUID userId`.
- `backend/src/main/java/com/company/flowmodoro/features/sessions/SessionController.java`: Substituir `@RequestHeader("X-User-Id") UUID userId` por `@CurrentUser UUID userId`.
- `backend/src/main/java/com/company/flowmodoro/features/tags/TagController.java`: Substituir `@RequestHeader("X-User-Id") UUID userId` por `@CurrentUser UUID userId`.

### 5. Testes Automatizados (`src/test/java/com/company/flowmodoro/`)
- `backend/src/test/java/com/company/flowmodoro/security/SecurityIntegrationTest.java`: Testes de integração cobrindo cenários com JWT válido, JWT inválido/expirado, rota pública e rota protegida sem token.

---

## 🛠️ Detalhamento Passo a Passo

### 🔹 ETAPA 1: Dependências e Configuração de Propriedades

1. **Adicionar dependência no `backend/pom.xml`**:
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
   </dependency>
   ```
2. **Definir propriedades no `backend/src/main/resources/application.properties`**:
   ```properties
   # Supabase JWT / Resource Server
   spring.security.oauth2.resourceserver.jwt.issuer-uri=${SUPABASE_JWT_ISSUER_URI:https://<project-ref>.supabase.co/auth/v1}
   spring.security.oauth2.resourceserver.jwt.jwk-set-uri=${SUPABASE_JWKS_URI:https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json}
   ```

---

### 🔹 ETAPA 2: Configuração de Segurança e Tratamento de Erros

1. **Atualizar `CommonErrorCode.java`**:
   - Incluir valores: `UNAUTHORIZED`, `ACCESS_DENIED`.
2. **Criar `CustomAuthenticationEntryPoint.java`**:
   - Implementar `AuthenticationEntryPoint`.
   - Interceptar exceções de autenticação e escrever resposta JSON `401 Unauthorized` com `ErrorResponse.builder().code(CommonErrorCode.UNAUTHORIZED)...`.
3. **Criar `CustomAccessDeniedHandler.java`**:
   - Implementar `AccessDeniedHandler`.
   - Interceptar acessos negados e escrever resposta JSON `403 Forbidden` com `ErrorResponse.builder().code(CommonErrorCode.ACCESS_DENIED)...`.
4. **Criar `SecurityConfig.java`**:
   - `@Configuration` e `@EnableWebSecurity`.
   - Configurar `SecurityFilterChain`:
     - Desabilitar CSRF (API REST stateless com Bearer Token).
     - Configurar `cors(cors -> cors.configurationSource(...))` integrado ao Spring Security.
     - Definir `sessionManagement` como `SessionCreationPolicy.STATELESS`.
     - Liberar explicitamente: `/api/health`, `/swagger-ui/**`, `/v3/api-docs/**` e requisições HTTP `OPTIONS` (pre-flight).
     - Exigir `authenticated()` para qualquer outra rota `/api/**`.
     - Configurar `oauth2ResourceServer` com `jwt()` e associar `CustomAuthenticationEntryPoint` e `CustomAccessDeniedHandler`.
   - Configurar Bean `JwtDecoder` utilizando `NimbusJwtDecoder.withJwkSetUri(jwkSetUri).build()` com validador de issuer configurado.

---

### 🔹 ETAPA 3: Injeção do Usuário Autenticado (`@CurrentUser`)

1. **Criar a anotação `@CurrentUser`**:
   - `@Target(ElementType.PARAMETER)` e `@Retention(RetentionPolicy.RUNTIME)`.
2. **Criar `CurrentUserArgumentResolver.java`**:
   - Implementar `HandlerMethodArgumentResolver`.
   - No método `supportsParameter`: verificar se o parâmetro possui `@CurrentUser` e é do tipo `UUID` (ou `String`).
   - No método `resolveArgument`:
     - Obter `Authentication` do `SecurityContextHolder`.
     - Se `authentication.getPrincipal()` for instância de `Jwt`, extrair claim `sub` (`jwt.getSubject()`).
     - Converter a string para `UUID.fromString(sub)`.
3. **Criar `SecurityUtils.java`**:
   - Fornecer método auxiliar `public static UUID getCurrentUserId()` para casos em que o ID for necessário fora do controlador.
4. **Registrar o Resolver no `WebConfig.java`**:
   - Implementar `addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers)` e adicionar o `CurrentUserArgumentResolver`.

---

### 🔹 ETAPA 4: Refatoração dos Controllers e Interceptors

1. **`ProjectController.java`**:
   - Substituir todas as ocorrências de `@RequestHeader("X-User-Id") UUID userId` por `@CurrentUser UUID userId`.
2. **`SessionController.java`**:
   - Substituir todas as ocorrências de `@RequestHeader("X-User-Id") UUID userId` por `@CurrentUser UUID userId`.
3. **`TagController.java`**:
   - Substituir todas as ocorrências de `@RequestHeader("X-User-Id") UUID userId` por `@CurrentUser UUID userId`.
4. **`RateLimitInterceptor.java`**:
   - Atualizar a lógica de identificação do cliente para consultar prioritariamente o `SecurityUtils.getCurrentUserId()` ou a `Authentication` do contexto de segurança, utilizando o IP do cliente apenas se não autenticado.

---

### 🔹 ETAPA 5: Testes e Validação

1. **Testes de Integração de Segurança (`SecurityIntegrationTest.java`)**:
   - Validar que `GET /api/health` responde `200 OK` sem token.
   - Validar que `GET /api/projects` responde `401 Unauthorized` com JSON estruturado ao chamar sem token.
   - Validar que `GET /api/projects` responde `401 Unauthorized` quando enviado token corrompido ou expirado.
   - Validar que requisição com token JWT mockado (`jwt().jwt(builder -> builder.subject(userId.toString()))`) acessa o endpoint com sucesso e injeta o `userId` correto.
2. **Testes de Regressão nos Controllers Existentes**:
   - Ajustar mocks dos testes unitários/integrados para incluir o contexto de segurança JWT nos endpoints de `projects`, `sessions` e `tags`.

---

## 📋 Checklist de Execução

- [x] Adicionar dependência `spring-boot-starter-oauth2-resource-server` no `pom.xml`.
- [x] Adicionar propriedades do Supabase no `application.properties`.
- [x] Adicionar códigos de erro `UNAUTHORIZED` e `ACCESS_DENIED` em `CommonErrorCode`.
- [x] Criar `CustomAuthenticationEntryPoint` e `CustomAccessDeniedHandler`.
- [x] Criar `SecurityConfig` com regras de rotas, CORS e JWT decoder.
- [x] Criar anotação `@CurrentUser` e `CurrentUserArgumentResolver`.
- [x] Registrar `CurrentUserArgumentResolver` em `WebConfig`.
- [x] Criar classe utilitária `SecurityUtils`.
- [x] Atualizar `ProjectController`, `SessionController` e `TagController` para usar `@CurrentUser`.
- [x] Atualizar `RateLimitInterceptor` para usar identidade autenticada.
- [x] Implementar suíte de testes de segurança e validar build com `./mvnw clean test` (ou `mvn test`).

