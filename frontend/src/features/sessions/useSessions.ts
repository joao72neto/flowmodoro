import sessionsService from "./sessions.service";
import type {
  CreateSessionRequest,
  SessionResponse,
  UpdateSessionRequest,
} from "./sessions.types";
import { useModal } from "../../shared/modal.context";
import { useMutation, useQuery } from "@tanstack/react-query";

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
    mutationFn: (data: CreateSessionRequest): Promise<SessionResponse> =>
      sessionsService.createSession(data),

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
