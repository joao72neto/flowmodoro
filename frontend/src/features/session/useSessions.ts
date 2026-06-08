import { useCallback, useState } from "react";
import sessionsService from "./session.service";
import type {
  CreateSessionRequest,
  SessionResponse,
  UpdateSessionRequest,
} from "./session.types";
import { LOADING_TIMEOUT } from "../../app/loading.const";
import { useModal } from "../../shared/modal.context";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useSessions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [success, setSuccess] = useState<string | null>();

  const reset = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const updateSession = useCallback(
    async (id: number, data: UpdateSessionRequest) => {
      let timer = setTimeout(() => setLoading(true), LOADING_TIMEOUT);
      reset();

      try {
        const res = await sessionsService.updateSession({ id, data });
        setSuccess("Session updated successfully");
        return res;
      } catch (e: any) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    },
    [reset],
  );

  return {
    loading,
    error,
    success,
    updateSession,
  };
};

export const useFetchSessions = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  const { showError, hideModal } = useModal();

  return useQuery({
    queryKey: ["sessions", page, size],
    queryFn: async () => {
      try {
        return await sessionsService.getSessions({ page, size });
      } catch (error) {
        if (error instanceof Error) {
          showError({
            title: "Erro ao carregar sessões",
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
  const { showError, hideModal } = useModal();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CreateSessionRequest;
    }): Promise<SessionResponse> => sessionsService.createSession({ id, data }),

    onError: (error: any) => {
      showError({
        title: "Erro ao criar sessão",
        message: error.message,
        action: hideModal,
      });
    },
  });
};

export const useUpdateSession = () => {
  const { showError, hideModal } = useModal();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateSessionRequest;
    }): Promise<SessionResponse> => sessionsService.updateSession({ id, data }),

    onError: (error: any) => {
      showError({
        title: "Erro ao atualizar sessão",
        message: error.message,
        action: hideModal,
      });
    },
  });
};

export const useDeleteSession = () => {
  const { showError, hideModal } = useModal();

  return useMutation({
    mutationFn: (id: number) => sessionsService.deleteSession(id),

    onError: (error: any) => {
      showError({
        title: "Erro ao deletar sessão",
        message: error.message,
        action: hideModal,
      });
    },
  });
};
