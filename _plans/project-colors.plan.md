# Plano de Implementação: Cores nos Projetos

Este plano detalha as alterações necessárias no backend e no frontend para adicionar suporte a cores customizadas para os projetos, atendendo à especificação revisada em `_specs/project-colors.spec.md`.

## Goal Description

Adicionar suporte a cores customizadas nos projetos do Flowmodoro, permitindo que os usuários escolham cores pré-definidas na criação e edição de projetos. Essas cores serão salvas no banco de dados (Dexie no frontend e PostgreSQL no backend) e sincronizadas. Quando uma sessão estiver vinculada a um projeto, sua borda esquerda utilizará a cor do projeto em vez da cor do perfil de descanso.

## User Review Required

> [!IMPORTANT]
> **Migração Suave de Dados Legados:** Projetos já existentes que não possuírem cores definidas receberão uma cor estável gerada via hash a partir do seu identificador (ID). Desta forma, a experiência do usuário permanecerá consistente e sem a necessidade de scripts de migração complexos no banco de dados.

---

## Proposed Changes

### 1. Backend

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/projects/ProjectModel.java
Adicionar a coluna `pro_color` para persistir o código hexadecimal da cor escolhida pelo usuário.

```java
    @Column(name = "pro_color")
    private String color;
```

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/projects/dtos/ProjectDTO.java
Adicionar a propriedade `color` e atualizar o construtor usado na projeção JPQL.

```java
    private String color;

    public ProjectDTO(UUID id, String name, Long totalFocus, String color) {
        this.id = id;
        this.name = name;
        this.totalFocus = totalFocus;
        this.color = color;
    }
```

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/projects/dtos/ProjectPayloadDTO.java
#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/projects/dtos/ProjectUpdateDTO.java
Adicionar a propriedade `color` aos DTOs de criação/atualização.

```java
    private String color;
```

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/projects/mappers/ProjectMapper.java
Atualizar o mapper para converter a cor entre a entidade e o DTO.

```java
    public ProjectModel toEntity(ProjectDTO dto) {
        return ProjectModel.builder()
            .id(dto.getId())
            .name(dto.getName())
            .color(dto.getColor())
            .build();
    }

    public ProjectDTO toDTO(ProjectModel entity) {
        return ProjectDTO.builder()
            .id(entity.getId())
            .name(entity.getName())
            .color(entity.getColor())
            .updatedAt(entity.getUpdatedAt())
            .deletedAt(entity.getDeletedAt())
            .build();
    }
```

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/projects/mappers/ProjectUpdateMapper.java
Atualizar a cópia dos dados nas atualizações parciais ou em lote.

```java
    public void apply(ProjectModel entity, ProjectUpdateDTO dto) {
        if (dto.getName() != null) {
            entity.setName(dto.getName());
        }
        if (dto.getColor() != null) {
            entity.setColor(dto.getColor());
        }
    }

    public void apply(ProjectModel entity, ProjectPayloadDTO dto) {
        entity.setName(dto.getName());
        entity.setColor(dto.getColor());
    }
```

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/projects/ProjectRepository.java
Atualizar a consulta JPQL em `findAllWithTotalFocus` para projetar a cor do projeto.

```java
    @Query(
        """
            SELECT new com.company.flowmodoro.features.projects.dtos.ProjectDTO(
                p.id,
                p.name,
                COALESCE(SUM(s.focus), 0),
                p.color
            )
            FROM ProjectModel p
            LEFT JOIN SessionModel s
                ON s.project.id = p.id
                AND s.userId = :userId
            WHERE p.userId = :userId
              AND p.deletedAt IS NULL
            GROUP BY p.id, p.name, p.color
            ORDER BY p.id DESC
        """
    )
    List<ProjectDTO> findAllWithTotalFocus(UUID userId);
```

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/projects/ProjectService.java
Atualizar a criação em lote a partir do DTO de sincronização.

```java
    private ProjectModel createFromBulkDTO(ProjectPayloadDTO dto, UUID userId) {
        ProjectModel tag = new ProjectModel();
        tag.setId(dto.getId());
        tag.setName(dto.getName());
        tag.setColor(dto.getColor());
        tag.setUserId(userId);
        return tag;
    }
```

---

### 2. Frontend

#### [NEW] frontend/src/features/projects/consts/project-colors.ts
Criar uma constante contendo as cores disponíveis e as funções utilitárias para geração de cores.

```typescript
export const PROJECT_COLORS = [
  "#ef4444", // Vermelho
  "#22c55e", // Verde
  "#eab308", // Amarelo
  "#3b82f6", // Azul
  "#a855f7", // Roxo
  "#ec4899", // Rosa
  "#f97316", // Laranja
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#06b6d4", // Cyan
];

export const getRandomProjectColor = (): string => {
  const randomIndex = Math.floor(Math.random() * PROJECT_COLORS.length);
  return PROJECT_COLORS[randomIndex];
};

export const getStableProjectColor = (id: string, color?: string | null): string => {
  if (color && PROJECT_COLORS.includes(color)) {
    return color;
  }
  // Algoritmo de hash estável para associar uma cor fixa para projetos antigos
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PROJECT_COLORS.length;
  return PROJECT_COLORS[index];
};
```

#### [MODIFY] frontend/src/features/projects/local/project.model.ts
Adicionar a propriedade `color` ao modelo.

```typescript
export interface ProjectModel {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}
```

#### [MODIFY] frontend/src/features/projects/dtos/projects-request.ts
#### [MODIFY] frontend/src/features/projects/dtos/projects-response.ts
#### [MODIFY] frontend/src/features/sessions/dtos/sessions-response.ts
Adicionar `color` aos DTOs de envio, resposta e sub-objetos de sessão.

```typescript
// No projects-request.ts
export interface ProjectPayloadDTO {
  id: string;
  name: string;
  color?: string;
}
export interface ProjectUpdateDTO {
  name: string;
  color?: string;
}

// No projects-response.ts
export interface ProjectDTO {
  id: string;
  name: string;
  totalFocus: number;
  color?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

// No sessions-response.ts (na interface SessionDTO)
  project: {
    id: string;
    name: string;
    color?: string;
  };
```

#### [MODIFY] frontend/src/features/projects/projects.mappers.ts
Atualizar o mapeamento de projetos para transportar a cor.

```typescript
  toPayload = (project: ProjectModel): ProjectPayloadDTO => ({
    id: project.id,
    name: project.name,
    color: project.color,
  });

  fromModel = (project: ProjectModel): ProjectDTO => ({
    id: project.id,
    name: project.name,
    totalFocus: 0,
    color: project.color,
  });

  fromPayload = (project: ProjectPayloadDTO): ProjectModel => ({
    id: project.id,
    name: project.name,
    color: project.color,
    createdAt: new Date().toISOString(),
  });

  fromDTO = (dto: ProjectDTO): ProjectModel => ({
    id: dto.id,
    name: dto.name,
    color: dto.color,
    createdAt: dto.updatedAt || new Date().toISOString(),
    updatedAt: dto.updatedAt,
    deletedAt: dto.deletedAt,
  });
```

#### [MODIFY] frontend/src/features/projects/local/utils/apply-updates.ts
Mapear o campo `color` na aplicação de modificações offline.

```typescript
    color: updated?.color ?? old?.color ?? DEFAULT_PROJECT.color,
```

#### [MODIFY] frontend/src/features/projects/local/consts/default-project.ts
Adicionar uma cor default para o projeto padrão.

```typescript
export const DEFAULT_PROJECT: ProjectModel = {
  id: uuidv4(),
  name: "Projeto padrão",
  color: "#3b82f6",
  createdAt: new Date().toISOString(),
};
```

#### [MODIFY] frontend/src/features/projects/project.schema.ts
Atualizar a validação Yup do projeto.

```typescript
export const CreateProjectSchema = yup.object({
  name: yup.string().required("O nome do projeto é obrigatório"),
  color: yup.string().required("A cor do projeto é obrigatória"),
});
```

#### [MODIFY] frontend/src/features/projects/components/ProjectModal.tsx
- Integrar o campo `color` no `useForm`.
- Na inicialização:
  - Se for edição (`defaultValues` presente), carregar a cor existente (com fallback estável).
  - Se for criação, sortear uma cor aleatória via `getRandomProjectColor()`.
- Adicionar visualizador e seletor visual de cores no modal utilizando botões circulares estilizados.
- Chamar `setValue("color", color)` ao clicar em uma cor da paleta.
- Garantir que `onSubmit` repassa os dados do formulário contendo `color`.

#### [MODIFY] frontend/src/features/projects/components/Projects/Project.tsx
Substituir a cor primária estática do ícone `GoProject` pela cor definida no projeto.

```tsx
          <GoProject 
            style={{ color: getStableProjectColor(projectData.id, projectData.color) }} 
            className="shrink-0" 
            size={18} 
          />
```

#### [MODIFY] frontend/src/shared/components/labels/Label.tsx
Adicionar suporte a uma propriedade `style` opcional para permitir estilizações de cor arbitrárias e inline.

```typescript
  style?: React.CSSProperties;
```

#### [MODIFY] frontend/src/features/sessions/components/SessionsDisplay/Session.tsx
#### [MODIFY] frontend/src/features/sessions/components/SessionsDisplay/SessionGroup.tsx
- Se a sessão ou grupo possuir projeto associado, aplicar a cor deste projeto no `style={{ borderLeftColor: projectColor }}`.
- Caso contrário, aplicar `border-l-neutral-70/50`.
- Customizar a `Label` do projeto passando as seguintes propriedades de cor baseadas no hexadecimal do projeto:
  - `backgroundColor: projectColor + "1a"` (10% de opacidade)
  - `color: projectColor` (contraste forte)
  - `borderColor: projectColor + "40"` (25% de opacidade)

#### [MODIFY] frontend/src/features/sessions/components/SessionCreation/SessionSelector.tsx
Estilizar dinamicamente o botão seletor de projeto e as opções do dropdown utilizando a cor de cada projeto da lista.

---

## Verification Plan

### Automated Tests
Executar os testes unitários do frontend utilizando o Jest para garantir que não houve quebras estruturais:
```bash
npm test
```

### Manual Verification
1. **Seleção de Cores na Criação:** Abrir o modal de criação de projeto. Verificar se uma cor é sorteada e selecionada automaticamente na paleta. Tentar criar o projeto com outra cor clicando nela.
2. **Edição do Projeto:** Clicar para editar o projeto criado. Validar se a paleta exibe corretamente a cor atual do projeto e se permite trocá-la.
3. **Estilização das Sessões:** Associar uma sessão a um projeto. Verificar se a borda esquerda da sessão muda para a cor do projeto selecionado, assim como o badge de projeto interno.
4. **Respeito às Regras de Negócio:**
   - Validar se o projeto sem cor (dados antigos) renderiza com uma cor consistente (estável).
   - Validar se sessões sem projetos utilizam a cor padrão cinza neutra (`border-neutral-70/50`).
5. **Sincronização:** Verificar no banco de dados e através do console de desenvolvimento se o campo `color` é corretamente enviado e salvo via endpoints de sincronização com o backend.
