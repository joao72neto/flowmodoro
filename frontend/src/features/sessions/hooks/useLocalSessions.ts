import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLocalSession,
  deleteLocalSession,
  fetchLocalSessions,
  updateLocalSession,
} from "../local/sessions.repository";

import { APP_LOCAL_DATA_QUERY_KEY } from "../../../global-query-keys";

import type { SessionDTO } from "../dtos/sessions-response";
import type { UpdateSessionDTO } from "../dtos/sessions-request";

import { triggerSync } from "../../../local/sync-manager";

const SESSIONS_QUERY_KEY = "sessions";

export const useFetchLocalSessions = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  return useQuery({
    queryKey: [APP_LOCAL_DATA_QUERY_KEY, SESSIONS_QUERY_KEY, page, size],
    queryFn: async () => await fetchLocalSessions({ page, size }),

    meta: {
      errorTitle: "Erro ao carregar sessões locais",
    },
  });
};

export const useCreateLocalSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSessionDTO): Promise<SessionDTO> =>
      createLocalSession(data),

    meta: {
      errorTitle: "Erro ao criar sessão local",
      closeModalOnSuccess: true,
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_LOCAL_DATA_QUERY_KEY] });
      triggerSync();
    },
  });
};

export const useUpdateLocalSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSessionDTO;
    }): Promise<SessionDTO> => updateLocalSession({ id, data }),

    meta: {
      errorTitle: "Erro ao atualizar sessão local",
      closeModalOnSuccess: true,
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_LOCAL_DATA_QUERY_KEY] });
    },
  });
};

export const useDeleteLocalSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLocalSession(id),

    meta: {
      errorTitle: "Erro ao deletar sessão local",
      closeModalOnSuccess: true,
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_LOCAL_DATA_QUERY_KEY] });
    },
  });
};
