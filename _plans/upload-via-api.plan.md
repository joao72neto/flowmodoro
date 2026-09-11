## Importação de Backup via API (Backend Spring Boot + Frontend React)

Este documento detalha o plano de implementação para substituir o fluxo atual de importação local de backup (que gravava diretamente no IndexedDB e enfileirava item por item na fila de sincronização) por um fluxo centralizado no backend através do endpoint `POST /api/backup/import`.

## User Review Required

> [!IMPORTANT]
> **Alteração de Comportamento na Importação**:
> 1. O cliente **não irá mais escrever diretamente no IndexedDB local** nem enfileirar itens na `syncQueue` durante o backup. Toda a persistência é feita atomicamente no backend.
> 2. **Validação Estrita de Itens Órfãos (EC-09)**: O backend irá rejeitar a importação completa (retornando `400 Bad Request`) se houver tags ou sessões no backup apontando para projetos/tags inexistentes (tanto no backup quanto na conta do usuário no servidor), listando especificamente os IDs dos itens órfãos.
> 3. **Ocultação do BackupMenu para Deslogados (RN-05, RF-08)**: Usuários não autenticados não verão o `BackupMenu` no rodape da aplicação.
> 4. **Resolução de Conflitos e Soft-Deletes**: Registros recebidos no backup são resolvidos por upsert (`id` + `updatedAt`, onde "mais recente vence") e o campo `deletedAt` será respeitado e persistido.

---

## Proposed Changes

### Backend - Feature de Backup (`/api/backup`)

#### [NEW] backend/src/main/java/com/company/flowmodoro/features/backup/dtos/BackupImportDTO.java

Estrutura do DTO de importação contendo o payload completo do backup.

```java
package com.company.flowmodoro.features.backup.dtos;

import com.company.flowmodoro.features.projects.dtos.ProjectDTO;
import com.company.flowmodoro.features.tags.dtos.TagDTO;
import com.company.flowmodoro.features.sessions.dtos.SessionDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class BackupImportDTO {
    @NotNull(message = "userId é obrigatório")
    private UUID userId;

    private Integer version;

    private String exportedAt;

    @Valid
    @NotNull
    private List<ProjectDTO> projects;

    @Valid
    @NotNull
    private List<TagDTO> tags;

    @Valid
    @NotNull
    private List<SessionDTO> sessions;
}
```

#### [NEW] backend/src/main/java/com/company/flowmodoro/features/backup/enums/BackupErrorCode.java

Códigos de erro específicos da funcionalidade de backup.

```java
package com.company.flowmodoro.features.backup.enums;

import com.company.flowmodoro.exception.ErrorResponse.ErrorCode;

public enum BackupErrorCode implements ErrorCode {
    INVALID_BACKUP("BACKUP_001", "Backup inválido"),
    USER_MISMATCH("BACKUP_002", "O userId do backup não corresponde ao usuário autenticado"),
    ORPHAN_ENTITIES("BACKUP_003", "Backup contém itens órfãos ou inconsistentes");

    private final String code;
    private final String message;

    BackupErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
```

#### [NEW] backend/src/main/java/com/company/flowmodoro/features/backup/exceptions/InvalidBackupException.java

Exceção customizada para erros no payload de backup.

```java
package com.company.flowmodoro.features.backup.exceptions;

import com.company.flowmodoro.exception.BaseException;
import com.company.flowmodoro.exception.ErrorResponse.ErrorCode;
import java.util.List;

public class InvalidBackupException extends BaseException {
    public InvalidBackupException(ErrorCode code, String message) {
        super(code, message);
    }

    public InvalidBackupException(ErrorCode code, List<String> errors) {
        super(code, errors);
    }
}
```

#### [NEW] backend/src/main/java/com/company/flowmodoro/features/backup/BackupService.java

Lógica de negócio atômica (`@Transactional`) para validação de integridade e upsert.

```java
package com.company.flowmodoro.features.backup;

import com.company.flowmodoro.features.backup.dtos.BackupImportDTO;
import com.company.flowmodoro.features.backup.enums.BackupErrorCode;
import com.company.flowmodoro.features.backup.exceptions.InvalidBackupException;
import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.ProjectRepository;
import com.company.flowmodoro.features.projects.mappers.ProjectMapper;
import com.company.flowmodoro.features.tags.TagModel;
import com.company.flowmodoro.features.tags.TagRepository;
import com.company.flowmodoro.features.tags.mappers.TagMapper;
import com.company.flowmodoro.features.sessions.SessionModel;
import com.company.flowmodoro.features.sessions.SessionRepository;
import com.company.flowmodoro.features.sessions.mappers.SessionMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BackupService {

    private final ProjectRepository projectRepository;
    private final TagRepository tagRepository;
    private final SessionRepository sessionRepository;
    private final ProjectMapper projectMapper;
    private final TagMapper tagMapper;
    private final SessionMapper sessionMapper;

    public BackupService(
        ProjectRepository projectRepository,
        TagRepository tagRepository,
        SessionRepository sessionRepository,
        ProjectMapper projectMapper,
        TagMapper tagMapper,
        SessionMapper sessionMapper
    ) {
        this.projectRepository = projectRepository;
        this.tagRepository = tagRepository;
        this.sessionRepository = sessionRepository;
        this.projectMapper = projectMapper;
        this.tagMapper = tagMapper;
        this.sessionMapper = sessionMapper;
    }

    @Transactional
    public void importBackup(BackupImportDTO dto, UUID authUserId) {
        if (!authUserId.equals(dto.getUserId())) {
            throw new InvalidBackupException(
                BackupErrorCode.USER_MISMATCH,
                "O userId do backup não corresponde ao usuário autenticado"
            );
        }

        // 1. Carregar IDs existentes no banco para o usuário
        Set<UUID> existingProjectIds = projectRepository.findByUserId(authUserId)
                .stream().map(ProjectModel::getId).collect(Collectors.toSet());
        Set<UUID> existingTagIds = tagRepository.findByUserId(authUserId)
                .stream().map(TagModel::getId).collect(Collectors.toSet());

        // Projetos e tags presentes no payload de importação
        Set<UUID> payloadProjectIds = dto.getProjects().stream()
                .map(p -> p.getId())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Set<UUID> payloadTagIds = dto.getTags().stream()
                .map(t -> t.getId())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Set<UUID> validProjectIds = new HashSet<>(existingProjectIds);
        validProjectIds.addAll(payloadProjectIds);

        Set<UUID> validTagIds = new HashSet<>(existingTagIds);
        validTagIds.addAll(payloadTagIds);

        List<String> orphanErrors = new ArrayList<>();

        // 2. Validar órfãos nas Tags
        for (var tagDto : dto.getTags()) {
            if (tagDto.getProjectId() != null && !validProjectIds.contains(tagDto.getProjectId())) {
                orphanErrors.add("Tag '" + tagDto.getName() + "' (ID: " + tagDto.getId() + ") referencia projectId inexistente: " + tagDto.getProjectId());
            }
        }

        // 3. Validar órfãos nas Sessões
        for (var sessionDto : dto.getSessions()) {
            if (sessionDto.getProjectId() != null && !validProjectIds.contains(sessionDto.getProjectId())) {
                orphanErrors.add("Sessão '" + sessionDto.getName() + "' (ID: " + sessionDto.getId() + ") referencia projectId inexistente: " + sessionDto.getProjectId());
            }
            if (sessionDto.getTagId() != null && !validTagIds.contains(sessionDto.getTagId())) {
                orphanErrors.add("Sessão '" + sessionDto.getName() + "' (ID: " + sessionDto.getId() + ") referencia tagId inexistente: " + sessionDto.getTagId());
            }
        }

        if (!orphanErrors.isEmpty()) {
            throw new InvalidBackupException(BackupErrorCode.ORPHAN_ENTITIES, orphanErrors);
        }

        // 4. Persistence / Upsert com "mais recente vence" (updatedAt)
        upsertProjects(dto.getProjects(), authUserId);
        upsertTags(dto.getTags(), authUserId);
        upsertSessions(dto.getSessions(), authUserId);
    }

    private void upsertProjects(List<ProjectDTO> dtos, UUID userId) {
        for (ProjectDTO dto : dtos) {
            Optional<ProjectModel> existingOpt = projectRepository.findByIdAndUserId(dto.getId(), userId);
            if (existingOpt.isPresent()) {
                ProjectModel existing = existingOpt.get();
                if (dto.getUpdatedAt() == null || existing.getUpdatedAt() == null ||
                    !dto.getUpdatedAt().isBefore(existing.getUpdatedAt())) {
                    existing.setName(dto.getName());
                    existing.setColor(dto.getColor());
                    existing.setUpdatedAt(dto.getUpdatedAt());
                    existing.setDeletedAt(dto.getDeletedAt());
                    projectRepository.save(existing);
                }
            } else {
                ProjectModel model = projectMapper.toEntity(dto);
                model.setUserId(userId);
                projectRepository.save(model);
            }
        }
    }

    private void upsertTags(List<TagDTO> dtos, UUID userId) {
        for (TagDTO dto : dtos) {
            Optional<TagModel> existingOpt = tagRepository.findByIdAndUserId(dto.getId(), userId);
            if (existingOpt.isPresent()) {
                TagModel existing = existingOpt.get();
                if (dto.getUpdatedAt() == null || existing.getUpdatedAt() == null ||
                    !dto.getUpdatedAt().isBefore(existing.getUpdatedAt())) {
                    existing.setName(dto.getName());
                    if (dto.getProjectId() != null) {
                        existing.setProject(projectRepository.findById(dto.getProjectId()).orElse(null));
                    }
                    existing.setUpdatedAt(dto.getUpdatedAt());
                    existing.setDeletedAt(dto.getDeletedAt());
                    tagRepository.save(existing);
                }
            } else {
                TagModel model = tagMapper.toEntity(dto);
                tagRepository.save(model);
            }
        }
    }

    private void upsertSessions(List<SessionDTO> dtos, UUID userId) {
        for (SessionDTO dto : dtos) {
            Optional<SessionModel> existingOpt = sessionRepository.findByIdAndUserId(dto.getId(), userId);
            if (existingOpt.isPresent()) {
                SessionModel existing = existingOpt.get();
                if (dto.getUpdatedAt() == null || existing.getUpdatedAt() == null ||
                    !dto.getUpdatedAt().isBefore(existing.getUpdatedAt())) {
                    existing.setName(dto.getName());
                    existing.setFocus(dto.getFocus());
                    existing.setRatio(dto.getRatio());
                    existing.setRest(dto.getRest());
                    existing.setDate(dto.getDate());
                    existing.setUpdatedAt(dto.getUpdatedAt());
                    existing.setDeletedAt(dto.getDeletedAt());
                    if (dto.getProjectId() != null) {
                        existing.setProject(projectRepository.findById(dto.getProjectId()).orElse(null));
                    }
                    if (dto.getTagId() != null) {
                        existing.setTag(tagRepository.findById(dto.getTagId()).orElse(null));
                    }
                    sessionRepository.save(existing);
                }
            } else {
                SessionModel model = sessionMapper.toEntity(dto);
                model.setUserId(userId);
                sessionRepository.save(model);
            }
        }
    }
}
```

#### [NEW] backend/src/main/java/com/company/flowmodoro/features/backup/BackupController.java

Endpoint exposto na API para receber o arquivo importado.

```java
package com.company.flowmodoro.features.backup;

import com.company.flowmodoro.configs.security.CurrentUser;
import com.company.flowmodoro.features.backup.dtos.BackupImportDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/backup")
public class BackupController {

    private final BackupService backupService;

    public BackupController(BackupService backupService) {
        this.backupService = backupService;
    }

    @PostMapping("/import")
    public ResponseEntity<Void> importBackup(
        @Valid @RequestBody BackupImportDTO dto,
        @CurrentUser UUID userId
    ) {
        backupService.importBackup(dto, userId);
        return ResponseEntity.ok().build();
    }
}
```

---

### Frontend - Serviços e Telas

#### [MODIFY] frontend/src/local/backup/backup.schema.ts

Atualizar o Zod schema para aceitar campos `updatedAt` e `deletedAt` opcionais nos itens do backup.

```typescript
const projectSchema = z.object({
  id: z.uuid("id do projeto inválido"),
  name: z.string().min(1, "nome do projeto não pode ser vazio"),
  color: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional().nullable(),
});

const tagSchema = z.object({
  id: z.uuid("id da tag inválido"),
  name: z.string().min(1, "nome da tag não pode ser vazio"),
  projectId: z.uuid("projectId da tag inválido"),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional().nullable(),
});

const sessionSchema = z.object({
  id: z.uuid("id da sessão inválido"),
  focus: z.number(),
  name: z.string().min(1, "nome da sessão não pode ser vazio"),
  ratio: z.number().optional(),
  rest: z.number().optional(),
  projectId: z.uuid("projectId da sessão inválido").optional().nullable(),
  tagId: z.uuid("tagId da sessão inválido").optional().nullable(),
  date: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional().nullable(),
});
```

#### [NEW] frontend/src/features/backup/api/backup.api.ts

Criar a função de requisição HTTP para chamar o endpoint de importação da API backend.

```typescript
import api from "../../../configs/api.configs";
import type { BackupData } from "../../../local/backup/backup.schema";

export const importBackupApi = async (data: BackupData): Promise<void> => {
  await api.post("/backup/import", data);
};
```

#### [MODIFY] frontend/src/local/backup/backup.service.ts

Remover escrita direta no IndexedDB e adição à `syncQueue`. Adicionar validação de tamanho de arquivo (5MB) e chamada ao backend.

```typescript
import { importBackupApi } from "../../features/backup/api/backup.api";
import { executePull } from "../sync/pull-manager";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

class BackupService {
  // ...
  async importData(file: File): Promise<{ pullFailed?: boolean }> {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error("Arquivo muito grande. O tamanho máximo permitido é de 5MB.");
    }

    const raw = await file.text();
    const data = this.parseAndValidate(raw);

    // 1. Enviar payload completo para o backend (API)
    await importBackupApi(data);

    // 2. Resetar lastSync para forçar pull completo
    localStorage.removeItem(localStorageKeys.lastSync);

    // 3. Executar o pull para sincronizar o IndexedDB local com o backend
    try {
      await executePull();
      return { pullFailed: false };
    } catch (pullErr) {
      console.error("Importação salva no servidor, mas falha no pull local:", pullErr);
      return { pullFailed: true };
    }
  }
}
```

#### [MODIFY] frontend/src/local/backup/useBackup.ts

Atualizar a mutation `useImportBackup` para repassar o resultado da importação e informar se o pull falhou.

#### [MODIFY] frontend/src/app/MainLayout/Footer/BackupMenu.tsx

1. Ocultar o `BackupMenu` inteiramente se `!isAuthenticated` (RF-08, RN-05).
2. Tratar a mensagem de erro específica quando a API sucede mas o pull falha (EC-08), sugerindo botão de "Sincronizar novamente" sem re-upload do arquivo.

```tsx
function BackupMenu() {
  const { isAuthenticated } = useAuth();

  // RN-05 / RF-08: Ocultar para usuários não autenticados
  if (!isAuthenticated) {
    return null;
  }

  // Restante da lógica de renderização e estado do menu...
}
```

---

## Verification Plan

### Automated Tests

- **Backend Unit Tests**:
  - `BackupServiceTest`:
    - Testar importação com backup válido.
    - Testar rejeição quando `userId` do backup difere do usuário autenticado (`USER_MISMATCH`).
    - Testar rejeição de itens órfãos (tag ou sessão com `projectId`/`tagId` inexistente) e verificar se a exceção contém os detalhes de cada item órfão (`ORPHAN_ENTITIES`).
    - Testar upsert de registros existentes comparando `updatedAt`.
  - `BackupControllerTest`:
    - Testar requisição sem token / não autenticado (deve retornar `401 Unauthorized`).
    - Testar requisição válida (deve retornar `200 OK`).

- **Frontend Tests**:
  - `backup.service.test.ts`:
    - Testar rejeição de arquivos > 5MB sem chamada HTTP.
    - Testar rejeição de JSON malformado e schemas inválidos.

### Manual Verification

1. **Importação bem-sucedida**:
   - Logar na aplicação com Usuário A.
   - Exportar backup ou usar um arquivo `.json` válido com dados do Usuário A.
   - Importar o backup. Verificar no Network tab que a chamada `POST /api/backup/import` é disparada de uma só vez.
   - Verificar se o `IndexedDB` local é atualizado após o `executePull` subsequente.

2. **Usuário não autenticado (RN-05)**:
   - Fazer logout do app.
   - Confirmar que o botão/menu de `Backup` não está visível no rodape (`BackupMenu` oculto).

3. **Validação de Arquivo > 5MB (EC-05)**:
   - Tentar selecionar um arquivo `.json` com mais de 5MB.
   - Confirmar mensagem de erro antes do envio.

4. **Detecção de Itens Órfãos (EC-09)**:
   - Editar um arquivo de backup para conter um `session` apontando para um `projectId` aleatório inexistente.
   - Tentar importar. Confirmar que a API retorna erro `400 Bad Request` com mensagem detalhada dos itens inconsistentes e nada é gravado no banco de dados.

5. **Falha do Pull após API Sucesso (EC-08)**:
   - Simular falha de rede logo após o retorno do endpoint de importação.
   - Verificar se a UI exibe o aviso de que os dados foram gravados no servidor mas a sincronização local pendente, permitindo clicar em "Sincronizar" sem re-upload.
