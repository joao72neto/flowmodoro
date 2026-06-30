import sessionsService from "../sessions.service";
import type { SessionPayload, SessionResponse } from "../sessions.types";
import { useModal } from "../../../shared/modal.context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../../../configs/api-error.config";
import { sessionErrors, type SessionError } from "../consts/session-errors";

export const SESSIONS_QUERY_KEY = "sessions";

export const useFetchSessions = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  const { showError, hideModal } = useModal();

  return useQuery({
    queryKey: [SESSIONS_QUERY_KEY, page, size],
    queryFn: async () => {
      try {
        return await sessionsService.fetchSessions({ page, size });
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

export const useCreateSession = () => {
  const { showError, hideModal, setModalLoading } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SessionPayload): Promise<SessionResponse> =>
      sessionsService.createSession(data),

    onError: (error: ApiError) => {
      showError({
        title:
          sessionErrors[error.code as SessionError] ?? "Erro ao criar sessão",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
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
    }): Promise<SessionResponse> => sessionsService.updateSession({ id, data }),

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
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
    },
  });
};

export const useDeleteSession = () => {
  const { showError, hideModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sessionsService.deleteSession(id),

    onError: (error: any) => {
      showError({
        title:
          sessionErrors[error.code as SessionError] ?? "Erro ao deletar sessão",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] });
    },
  });
};
