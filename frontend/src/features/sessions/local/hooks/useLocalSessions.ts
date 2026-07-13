import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLocalSession,
  deleteLocalSession,
  fetchLocalSessions,
  updateLocalSession,
} from "../sessions.repository";
import { useModal } from "../../../../shared/contexts/modal/modal.context";
import { ApiError } from "../../../../configs/api-error.configs";
import { APP_LOCAL_DATA_QUERY_KEY } from "../../../../query-key";
import type { SessionDTO, SessionPayloadDTO } from "../session.dtos";
import { triggerSync } from "../../../../local/sync-manager";

const SESSIONS_QUERY_KEY = "sessions";

export const useFetchLocalSessions = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  const { showError, hideModal } = useModal();

  return useQuery({
    queryKey: [APP_LOCAL_DATA_QUERY_KEY, SESSIONS_QUERY_KEY, page, size],
    queryFn: async () => {
      try {
        return await fetchLocalSessions({ page, size });
      } catch (error) {
        if (error instanceof ApiError) {
          showError({
            title: "Erro ao carregar sessões locais",
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

export const useCreateLocalSession = () => {
  const { showError, hideModal, setModalLoading } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SessionPayloadDTO): Promise<SessionDTO> =>
      createLocalSession(data),

    onError: (error: ApiError) => {
      showError({
        title: "Erro ao criar sessão local",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_LOCAL_DATA_QUERY_KEY] });
      setModalLoading(false);
      hideModal();
      triggerSync();
    },
  });
};

export const useUpdateLocalSession = () => {
  const { showError, hideModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: SessionPayloadDTO;
    }): Promise<SessionDTO> => updateLocalSession({ id, data }),

    onError: (error: ApiError) => {
      showError({
        title: "Erro ao atualizar sessão local",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_LOCAL_DATA_QUERY_KEY] });
    },
  });
};

export const useDeleteLocalSession = () => {
  const { showError, hideModal, setModalLoading } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLocalSession(id),

    onError: (error: ApiError) => {
      showError({
        title: "Erro ao deletar sessão local",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_LOCAL_DATA_QUERY_KEY] });
      hideModal();
      setModalLoading(false);
    },
  });
};
