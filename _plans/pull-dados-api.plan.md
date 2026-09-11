## Sincronização de Sessões (Pull de Dados da API)

Este documento detalha as mudanças necessárias para implementar a sincronização manual e pós-login (pull), o isolamento de dados por usuário (wipe no logout) e a resolução de conflitos de sessão, conforme definido na especificação.

## User Review Required

> [!IMPORTANT]
> **Adição de timestamp**: Para resolver conflitos de edição em múltiplos dispositivos escolhendo sempre o "mais recente", precisaremos adicionar um campo `updatedAt` nas tabelas `sessions` (backend) e também no `SessionModel` do frontend. Isso exigirá que a tabela no banco de dados seja atualizada. O Spring fará isso automaticamente via `ddl-auto=update`, mas registros antigos ficarão com valor `null` e deverão ser tratados ou atualizados manualmente (via SQL) para uma data padrão (ex: `now()`).
>
> **Limpeza no Logout (Wipe)**: Ao fazer logout, **todo o conteúdo offline** do banco Dexie (`sessions`, `projects`, `tags`, `syncQueue`) será deletado. Sessões não sincronizadas serão perdidas caso o usuário não as tenha sincronizado antes do logout. Você está de acordo com essa abordagem destrutiva e segura?

## Open Questions

> [!TIP]
> Apenas os dados de `sessions` estão previstos para receber um "pull" neste escopo, mas projetos e tags também deveriam ser incluídos neste pull futuramente? Por enquanto, manteremos o foco em sessões.

---

## Proposed Changes

### Backend - Entidades e Repositório

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/sessions/SessionModel.java

Adicionar o campo `updatedAt` para resolver conflitos de versão na sincronização.

```java
import org.hibernate.annotations.UpdateTimestamp;
import java.time.OffsetDateTime;

// ... (dentro da classe)

    @UpdateTimestamp
    @Column(name = "ses_updated_at")
    private OffsetDateTime updatedAt;
```

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/sessions/SessionRepository.java

Adicionar um método para retornar registros lineares filtrados por data, otimizando o "pull incremental".

```java
    List<SessionModel> findByUserIdAndUpdatedAtGreaterThanEqualOrderByIdDesc(
        UUID userId,
        OffsetDateTime lastSync
    );

    List<SessionModel> findByUserIdOrderByIdDesc(UUID userId);
```

---

### Backend - Controllers e Services

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/sessions/SessionController.java

Adicionar a rota de `pull`.

```java
    import java.time.OffsetDateTime;

    @GetMapping("/pull")
    public ResponseEntity<List<SessionDTO>> pullSessions(
        @RequestParam(required = false) OffsetDateTime lastSync,
        @CurrentUser UUID userId
    ) {
        return ResponseEntity.ok(sessionService.pull(userId, lastSync));
    }
```

#### [MODIFY] backend/src/main/java/com/company/flowmodoro/features/sessions/SessionService.java

Implementar a regra de negócio para buscar as sessões:

```java
    @Transactional(readOnly = true)
    public List<SessionDTO> pull(UUID userId, OffsetDateTime lastSync) {
        List<SessionModel> sessions = (lastSync != null)
            ? sessionRepository.findByUserIdAndUpdatedAtGreaterThanEqualOrderByIdDesc(userId, lastSync)
            : sessionRepository.findByUserIdOrderByIdDesc(userId);

        return mapper.toDTO(sessions);
    }
```

_(Não esqueça de adicionar mapeamento para `updatedAt` no `SessionMapper` se for retornar no DTO, e no DTO)_

---

### Frontend - Modelos e API

#### [MODIFY] frontend/src/features/sessions/local/session.model.ts

Adicionar `updatedAt`.

```typescript
export interface SessionModel {
  // ...
  updatedAt?: string;
}
```

#### [MODIFY] frontend/src/features/sessions/dtos/sessions-response.ts

Atualizar DTO para receber o `updatedAt` da API.

#### [NEW] frontend/src/local/sync/pull-manager.ts

Criar lógica isolada para fazer o pull. Irá buscar na API e atualizar o Dexie.

```typescript
import { db } from "../indexedDB";
import { localStorageKeys } from "../../shared/utils/storage.utils";
import axios from "axios"; // ou sua instância da API

const LAST_SYNC_KEY = "flowmodoro:lastSync";

export const executePull = async () => {
  const lastSync = localStorage.getItem(LAST_SYNC_KEY);
  // GET /api/sessions/pull?lastSync={lastSync}
  // Para cada sessão retornada da API:
  // 1. Checa se existe localmente (db.sessions.get(id))
  // 2. Se existir, compara 'updatedAt'. Se a API for mais recente, atualiza o local.
  // 3. Se não existir, insere (db.sessions.put())
  // 4. Salva novo timestamp de sync.
};
```

---

### Frontend - Fluxos e Interfaces

#### [MODIFY] frontend/src/local/sync/sync-manager.ts

Atualizar a ordem de sync quando autentica: Pull primeiro, Push depois (RF-09).

```typescript
import { executePull } from "./pull-manager";

// ... (dentro de initSync)
window.addEventListener(AUTH_CHANGE_EVENT, async () => {
  if (isUserAuthenticated()) {
    try {
      await executePull(); // <- RF-09 e RF-01
    } catch (err) {
      console.error("Falha no pull, prosseguindo com offline push", err);
    }
    process(); // Push queue
  }
});
```

#### [MODIFY] frontend/src/shared/contexts/auth/auth.provider.tsx

Aplicar o wipe completo do Dexie no momento do logout. Para evitar surpresas e prevenir a perda acidental de alterações não sincronizadas, adicionar um modal de aviso (`showWarning`) informando sobre a exclusão dos dados.

```typescript
import { db } from "../../../../local/indexedDB";
import { useModal } from "../modal/modal.context";

// ... dentro do componente
const { showWarning } = useModal();

const performLogout = async () => {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    // ...
  } finally {
    localStorage.removeItem(localStorageKeys.authUser);
    localStorage.removeItem("flowmodoro:lastSync"); // limpa também a sync date
    setUser(null);
    // Limpeza segura (RN-03)
    await Promise.all([
      db.sessions.clear(),
      db.projects.clear(),
      db.tags.clear(),
      db.syncQueue.clear(),
    ]);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
};

const logout = () => {
  showWarning({
    title: "Deseja realmente sair?",
    message:
      "Ao sair, todos os dados que ainda não foram sincronizados com o servidor serão perdidos. Certifique-se de realizar o backup ou esperar a sincronização.",
    confirmLabel: "Sair e apagar dados",
    cancelLabel: "Cancelar",
    action: performLogout,
  });
};
```

#### [MODIFY] frontend/src/app/MainLayout/Footer/BackupMenu.tsx

Adicionar a opção manual de "Sincronizar" (RF-02) baseada no `executePull()`. Adicionaremos um React Query Mutation ou gerenciaremos via state no botão.

```tsx
import { executePull } from "../../../../local/sync/pull-manager";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// ...
const queryClient = useQueryClient();
const { mutate: pullData, isPending: isPulling } = useMutation({
  mutationFn: executePull,
  onSuccess: () => {
    queryClient.invalidateQueries(); // Vai dar trigger no refetch local e atualizar a UI
  },
});

// JSX:
<Button onClick={() => pullData()} loading={isPulling}>
  Sincronizar
</Button>;
```

---

## Verification Plan

### Automated Tests

- Validar se os testes de service do backend (como em `SessionServiceTest`) compilam, adicionando mock para a nova query no repository e preenchendo UUID/data corretos.

### Manual Verification

1. **Pull no Login**: Logar em uma conta que já possui sessões. As sessões devem surgir na UI reativamente.
2. **Resolução de Conflitos**: Criar sessão em dispositivo A. Logar no dispositivo B. Alterar a sessão no B. Alterar a sessão no A e pedir pull manual. O registro mais novo deve prevalecer.
3. **Limpeza do Banco (Wipe)**: Fazer logout e inspecionar o DevTools (Application > IndexedDB). Todas as _object stores_ devem estar limpas. Logar em conta nova não deve vazar dados da anterior.
4. **Resiliência de Rede**: Tentar fazer o Pull manual do botão com DevTools em modo "Offline". O app deve exibir feedback visual que falhou, mas sem travar a tela.
