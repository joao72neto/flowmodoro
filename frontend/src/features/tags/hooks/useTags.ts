import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../../shared/contexts/modal/modal.context";
import { APP_DATA_QUERY_KEY } from "../../../global-query-key";
import { ApiError } from "../../../configs/api-error.configs";
import {
  createTag,
  deleteTag,
  fetchTagsByProject,
  updateTag,
} from "../local/tags.respository";

import type { TagDTO } from "../dtos/tags-response";
import type { TagPayloadDTO } from "../dtos/tags-request";

const duplicatedErrorConfig = {
  title: "Tag duplicada",
  message: "Já existe uma tag com esse nome.",
  action: () => {},
};

export const useFetchTagsByProject = (projectId: string) => {
  const { showError, hideModal } = useModal();

  const TAGS_QUERY_KEY = "tags";

  return useQuery({
    queryKey: [APP_DATA_QUERY_KEY, TAGS_QUERY_KEY, projectId],
    queryFn: async () => {
      try {
        return await fetchTagsByProject(projectId);
      } catch (error) {
        if (error instanceof ApiError) {
          showError({
            title: "Erro ao carregar tags",
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

export const useCreateTag = () => {
  const { showError, hideModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TagPayloadDTO): Promise<TagDTO> => createTag(data),

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
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
    },
  });
};

export const useUpdateTag = () => {
  const { showError, hideModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TagPayloadDTO;
    }): Promise<TagDTO> => updateTag({ id, data }),

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
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
    },
  });
};

export const useDeleteTag = () => {
  const { showError, hideModal, setModalLoading } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTag(id),

    onError: (error: ApiError) => {
      showError({
        title: "Erro ao deletar tag",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
      hideModal();
      setModalLoading(false);
    },
  });
};
