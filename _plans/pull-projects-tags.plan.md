## Sincronização de Projetos e Tags (Pull de Dados da API)

Este documento detalha as mudanças necessárias para estender a sincronização offline-first (pull de dados da API) para as entidades de `projects` e `tags`, mantendo a consistência e as regras aplicadas anteriormente nas `sessions`.

## User Review Required

> [!IMPORTANT]
> **Adição de timestamp (`updatedAt`)**: Assim como nas sessões, precisaremos adicionar um campo `updatedAt` (anotado com `@UpdateTimestamp`) nas tabelas `projects` e `tags` (backend) e também nos respectivos modelos do frontend (`ProjectModel` e `TagModel`). O Spring atualizará o esquema do banco, e registros antigos receberão `null` a menos que atualizados manualmente via SQL.
>
> **Soft-Delete (Sessions, Projects, Tags)**: Como conversamos, o sistema atual faz _hard-delete_ (apaga direto no banco). Para que o frontend saiba o que deve ser apagado durante o _Pull_, implementaremos o _soft-delete_ no backend adicionando a coluna `deletedAt` para **sessions, projects e tags**.
>
> - No backend, as consultas regulares (como listar para a web) deverão ignorar registros com `deletedAt != null`, mas o endpoint de `/pull` **deve retornar os registros deletados** para o frontend.
> - No frontend, ao receber um registro com `deletedAt` preenchido durante o pull, a aplicação fará um _hard-delete_ seguro apenas no Dexie local para refletir a exclusão.

## Open Questions

> [!TIP]
> Os relacionamentos `Project -> Tag` e `Session -> Project/Tag` serão preservados pela ordem estrita do pull. Você concorda com a ordem sugerida: 1º Pull de Projects, 2º Pull de Tags e 3º Pull de Sessions? Sim.

---

## Proposed Changes

### Backend - Entidades e Repositórios

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/sessions/SessionModel.java

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/projects/ProjectModel.java

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/tags/TagModel.java

Adicionar os campos `updatedAt` (para resolução de conflitos) e `deletedAt` (para soft-delete). Também adicionaremos as anotações do Hibernate `@SQLDelete` e `@SQLRestriction` (ou `@Where` dependendo da versão do Spring Boot) se desejarmos que queries padrão ignorem deletados, porém, é mais seguro apenas ajustar os métodos dos services de delete para atualizar a data e o save para restaurar.

```java
    // Exemplo para ProjectModel (o mesmo vale para TagModel e SessionModel com seus prefixos)
    @UpdateTimestamp
    @Column(name = "pro_updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "pro_deleted_at")
    private OffsetDateTime deletedAt;
```

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/projects/ProjectRepository.java

Adicionar as buscas para o pull.

```java
    List<ProjectModel> findByUserIdAndUpdatedAtGreaterThanEqual(
        UUID userId,
        OffsetDateTime lastSync
    );

    List<ProjectModel> findByUserId(UUID userId);
```

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/tags/TagRepository.java

Adicionar as buscas para o pull.

```java
    @Query("SELECT t FROM TagModel t WHERE t.project.userId = :userId AND t.updatedAt >= :lastSync")
    List<TagModel> findByUserIdAndUpdatedAtGreaterThanEqual(
        @Param("userId") UUID userId,
        @Param("lastSync") OffsetDateTime lastSync
    );

    @Query("SELECT t FROM TagModel t WHERE t.project.userId = :userId")
    List<TagModel> findByUserId(@Param("userId") UUID userId);
```

---

### Backend - Controllers e Services

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/projects/ProjectController.java

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/tags/TagController.java

Adicionar rota de `/pull` em ambos os controllers, seguindo o padrão de `sessions`.

```java
    @GetMapping("/pull")
    public ResponseEntity<List<ProjectDTO>> pull(
        @RequestParam(required = false) OffsetDateTime lastSync,
        @CurrentUser UUID userId
    ) {
        return ResponseEntity.ok(projectService.pull(userId, lastSync));
    }
```

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/projects/ProjectService.java

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/tags/TagService.java

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/sessions/SessionService.java

Implementar a regra de pull filtrando por `lastSync` e também ajustar a lógica de deleção (soft-delete).

```java
    @Transactional(readOnly = true)
    public List<ProjectDTO> pull(UUID userId, OffsetDateTime lastSync) {
        List<ProjectModel> entities = (lastSync != null)
            ? projectRepository.findByUserIdAndUpdatedAtGreaterThanEqual(userId, lastSync)
            : projectRepository.findByUserId(userId);

        return projectMapper.toDTO(entities);
    }

    // Na lógica de exclusão (delete/deleteAll):
    // Em vez de projectRepository.delete(project);
    // Faremos: project.setDeletedAt(OffsetDateTime.now()); projectRepository.save(project);

    // E nas listagens regulares (getAll), filtraremos onde deletedAt == null.
```

_Nota: Será necessário atualizar os DTOs e seus respectivos `Mappers` para incluir a conversão das propriedades `updatedAt` e `deletedAt`._

---

### Frontend - Modelos e DTOs

#### [MODIFY] frontend/src/features/sessions/local/session.model.ts

#### [MODIFY] frontend/src/features/projects/local/project.model.ts

#### [MODIFY] frontend/src/features/tags/local/tag.model.ts

Adicionar as propriedades `updatedAt` (já estava previsto para sessions) e `deletedAt` (opcionais) aos modelos locais.

```typescript
  updatedAt?: string;
  deletedAt?: string | null;
```

_Nota: Os DTOs de Request/Response de sessions, projetos e tags também deverão ser ajustados para incluir `updatedAt` e `deletedAt`, bem como os `mappers.ts` responsáveis por transformar a resposta da API no formato salvo no Dexie._

---

### Frontend - Fluxos e Sincronização

#### [MODIFY] frontend/src/local/sync/pull-manager.ts

Atualizar a função `executePull` para sincronizar os dados na ordem estrita: `projects` -> `tags` -> `sessions`. Além disso, tratar os registros com `deletedAt != null` removendo-os do Dexie local.

```typescript
export const executePull = async () => {
  const lastSync = localStorage.getItem(LAST_SYNC_KEY);

  // 1. Pull de Projects
  // const { data: projects } = await axios.get(`/projects/pull?lastSync=${lastSync}`);
  // Iterar: se project.deletedAt != null, db.projects.delete(project.id).
  // Senão, merge/update no Dexie baseado no updatedAt.

  // 2. Pull de Tags
  // const { data: tags } = await axios.get(`/tags/pull?lastSync=${lastSync}`);
  // Iterar e deletar do Dexie ou merge/update.

  // 3. Pull de Sessions (já existente)
  // const { data: sessions } = await axios.get(`/sessions/pull?lastSync=${lastSync}`);
  // Iterar e deletar do Dexie ou merge/update.

  // Salva novo timestamp de sync
};
```

---

## Verification Plan

### Automated Tests

- Validar se os testes de service no backend para `ProjectService` e `TagService` continuam passando e incluir mocks para testar as novas funções `pull`.
- Testar integridade e mapeamento dos DTOs com o novo campo `updatedAt`.

### Manual Verification

1. **Pull no Login (Ordem):** Efetuar o login numa conta com projetos, tags e sessões previamente criados. Acompanhar a aba de rede (Network) do DevTools e validar se os requests de pull ocorrem na sequência correta.
2. **Resolução de Conflitos (Projects e Tags):** Atualizar o nome de um projeto localmente enquanto o app estiver offline. Num dispositivo secundário, atualizar o nome do mesmo projeto online. Ao acionar o botão "Sincronizar", o nome local só deve ser sobrescrito se o `updatedAt` do servidor for mais recente.
3. **Consistência Relacional:** Verificar se o Dexie está mantendo o relacionamento correto `Session -> Tag -> Project` e não está criando registros orfãos ao puxar os dados.
