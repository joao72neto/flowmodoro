import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSession,
  deleteSession,
  fetchSessions,
  updateSession,
} from "../local/sessions.repository";

import { APP_DATA_QUERY_KEY } from "../../../consts/global-query-key";

import type { SessionDTO } from "../dtos/sessions-response";
import type {
  SessionPayloadDTO,
  SessionUpdateDTO,
} from "../dtos/sessions-request";
import { triggerSync } from "../../../local/sync/sync-manager";

const SESSIONS_QUERY_KEY = "sessions";

import { keepPreviousData } from "@tanstack/react-query";

export const useFetchSessions = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  return useQuery({
    queryKey: [APP_DATA_QUERY_KEY, SESSIONS_QUERY_KEY, page, size],
    queryFn: async () => await fetchSessions({ page, size }),
    placeholderData: keepPreviousData,
    meta: {
      errorTitle: "Erro ao carregar sessões",
    },
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SessionPayloadDTO): Promise<SessionDTO> =>
      createSession(data),

    meta: {
      errorTitle: "Erro ao criar sessão",
      closeModalOnSuccess: true,
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
      triggerSync();
    },
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: SessionUpdateDTO;
    }): Promise<SessionDTO> => updateSession({ id, data }),

    meta: {
      errorTitle: "Erro ao atualizar sessão",
      closeModalOnSuccess: true,
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
      triggerSync();
    },
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSession(id),

    meta: {
      errorTitle: "Erro ao deletar sessão",
      closeModalOnSuccess: true,
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
      triggerSync();
    },
  });
};
