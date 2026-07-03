import { useMutation } from "@tanstack/react-query";
import type { SessionPayload } from "../../api/sessions.types";
import type { SessionModel } from "../session.model";
import { createSessionRepository } from "../sessions.repository";
import { useModal } from "../../../../shared/contexts/modal.context";
import type { ApiError } from "../../../../configs/api-error.configs";

export const useCreateLocalSession = () => {
  const { showError, hideModal, setModalLoading } = useModal();

  return useMutation({
    mutationFn: (data: SessionPayload): Promise<SessionModel> =>
      createSessionRepository(data),

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
