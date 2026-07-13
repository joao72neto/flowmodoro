import type { SessionPayload, SessionResponse } from "../sessions.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../../../../configs/api-error.configs";
import { sessionErrors, type SessionError } from "../consts/session-errors";
import { createManySessions } from "../sessions.api";
import type { SessionDTO, SessionPayloadDTO } from "../../local/session.dtos";

import { useModal } from "../../../../shared/contexts/modal/modal.context";
import { APP_DATA_QUERY_KEY } from "../../../../query-key";
import {
  createSession,
  deleteSession,
  fetchSessions,
  updateSession,
} from "../sessions.api";

export const useFetchSessions = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  const { showError, hideModal } = useModal();

  const SESSIONS_QUERY_KEY = "sessions";

  return useQuery({
    queryKey: [APP_DATA_QUERY_KEY, SESSIONS_QUERY_KEY, page, size],
    queryFn: async () => {
      try {
        return await fetchSessions({ page, size });
      } catch (error) {
        if (error instanceof ApiError) {
          showError({
            title:
              sessionErrors[error.code as SessionError] ??
              "Erro ao carregar sessões",
            message: error.message,
            action: hideModal,
          });
        }
        console.error(error);
        throw error;
      }
    },
  });
};

export const useCreateManySessions = () => {
  const { showError, hideModal, setModalLoading } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SessionPayloadDTO[]): Promise<SessionDTO[]> =>
      createManySessions(data),

    onError: (error: ApiError) => {
      showError({
        title: "Erro ao criar sessões",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
      setModalLoading(false);
    },
  });
};

export const useCreateSession = () => {
  const { showError, hideModal, setModalLoading } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SessionPayloadDTO): Promise<SessionDTO> =>
      createSession(data),

    onError: (error: ApiError) => {
      showError({
        title:
          sessionErrors[error.code as SessionError] ?? "Erro ao criar sessão",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
      setModalLoading(false);
      hideModal();
    },
  });
};

export const useUpdateSession = () => {
  const { showError, hideModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: SessionPayload;
    }): Promise<SessionResponse> => updateSession({ id, data }),

    onError: (error: ApiError) => {
      showError({
        title:
          sessionErrors[error.code as SessionError] ??
          "Erro ao atualizar sessão",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
    },
  });
};

export const useDeleteSession = () => {
  const { showError, hideModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSession(id),

    onError: (error: ApiError) => {
      showError({
        title:
          sessionErrors[error.code as SessionError] ?? "Erro ao deletar sessão",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
    },
  });
};
