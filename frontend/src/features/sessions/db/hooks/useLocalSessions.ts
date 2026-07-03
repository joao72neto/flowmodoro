import { useMutation, useQuery } from "@tanstack/react-query";
import type { SessionPayload } from "../../api/sessions.types";
import type { SessionModel } from "../session.model";
import { createLocalSession, fetchLocalSessions } from "../sessions.repository";
import { useModal } from "../../../../shared/contexts/modal.context";
import { ApiError } from "../../../../configs/api-error.configs";
import { APP_LOCAL_DATA_QUERY_KEY } from "../../../../query-key";

export const useFetchLocalSessions = ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  const { showError, hideModal } = useModal();

  return useQuery({
    queryKey: [APP_LOCAL_DATA_QUERY_KEY, page, size],
    queryFn: async () => {
      try {
        return await fetchLocalSessions({ page, size });
      } catch (error) {
        if (error instanceof ApiError) {
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

export const useCreateLocalSession = () => {
  const { showError, hideModal, setModalLoading } = useModal();

  return useMutation({
    mutationFn: (data: SessionPayload): Promise<SessionModel> =>
      createLocalSession(data),

    onError: (error: ApiError) => {
      showError({
        title: "Erro ao criar sessão local",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      setModalLoading(false);
      hideModal();
    },
  });
};
