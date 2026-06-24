import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../../../shared/modal.context";
import tagService from "../tags.service";
import type { TagPayload, TagResponse } from "../tags.types";

const TAGS_QUERY_KEY = "tags";

export const useFetchTagsByProject = (projectId: number) => {
  const { showError, hideModal } = useModal();

  return useQuery({
    queryKey: [TAGS_QUERY_KEY, projectId],
    queryFn: async () => {
      try {
        if (projectId <= 0) return [];
        return await tagService.fetchTagsByProject(projectId);
      } catch (error) {
        if (error instanceof Error) {
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
    mutationFn: (data: TagPayload): Promise<TagResponse> =>
      tagService.createTag(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS_QUERY_KEY] });
    },

    onError: (error: any) => {
      showError({
        title: "Erro ao criar tag",
        message: error.message,
        action: hideModal,
      });
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
      id: number;
      data: TagPayload;
    }): Promise<TagResponse> => tagService.updateTag({ id, data }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS_QUERY_KEY] });
    },

    onError: (error: any) => {
      showError({
        title: "Erro ao atualizar tag",
        message: error.message,
        action: hideModal,
      });
    },
  });
};

export const useDeleteTag = () => {
  const { showError, hideModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tagService.deleteTag(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS_QUERY_KEY] });
    },

    onError: (error: any) => {
      showError({
        title: "Erro ao deletar tag",
        message: error.message,
        action: hideModal,
      });
    },
  });
};
