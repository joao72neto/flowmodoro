import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../../../shared/contexts/modal.context";
import { APP_LOCAL_DATA_QUERY_KEY } from "../../../../query-key";
import { ApiError } from "../../../../configs/api-error.configs";
import {
  createLocalTag,
  deleteLocalTag,
  fetchLocalTagsByProject,
  updateLocalTag,
} from "../tags.respository";

import type { TagDTO, TagPayloadDTO } from "../tag.dtos";

const duplicatedErrorConfig = {
  title: "Tag duplicada",
  message: "Já existe uma tag com esse nome.",
  action: () => {},
};

export const useFetchLocalTagsByProject = (projectId: string) => {
  const { showError, hideModal } = useModal();

  const TAGS_QUERY_KEY = "tags";

  return useQuery({
    queryKey: [APP_LOCAL_DATA_QUERY_KEY, TAGS_QUERY_KEY, projectId],
    queryFn: async () => {
      try {
        return await fetchLocalTagsByProject(projectId);
      } catch (error) {
        if (error instanceof ApiError) {
          showError({
            title: "Erro ao carregar tags locais",
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

export const useCreateLocalTag = () => {
  const { showError, hideModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TagPayloadDTO): Promise<TagDTO> => createLocalTag(data),

    onError: (error) => {
      if (error.name === "ConstraintError") {
        showError({
          title: duplicatedErrorConfig.title,
          message: duplicatedErrorConfig.message,
          action: duplicatedErrorConfig.action,
        });
        return;
      }

      showError({
        title: "Erro ao criar tag",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_LOCAL_DATA_QUERY_KEY] });
    },
  });
};

export const useUpdateLocalTag = () => {
  const { showError, hideModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TagPayloadDTO;
    }): Promise<TagDTO> => updateLocalTag({ id, data }),

    onError: (error) => {
      if (error.message.includes("ConstraintError")) {
        showError({
          title: duplicatedErrorConfig.title,
          message: duplicatedErrorConfig.message,
          action: duplicatedErrorConfig.action,
        });
        return;
      }

      showError({
        title: "Erro ao atualizar tag",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_LOCAL_DATA_QUERY_KEY] });
    },
  });
};

export const useDeleteLocalTag = () => {
  const { showError, hideModal, setModalLoading } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLocalTag(id),

    onError: (error: ApiError) => {
      showError({
        title: "Erro ao deletar tag local",
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
