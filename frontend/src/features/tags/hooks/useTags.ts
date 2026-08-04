import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APP_DATA_QUERY_KEY } from "../../../consts/global-query-key";
import {
  createTag,
  deleteTag,
  fetchTagsByProject,
  updateTag,
} from "../local/tags.respository";

import type { TagDTO } from "../dtos/tags-response";
import type { TagPayloadDTO, TagUpdateDTO } from "../dtos/tags-request";
import { triggerSync } from "../../../local/sync/sync-manager";

const duplicatedErrorConfig = {
  title: "Tag duplicada",
  message: "Já existe uma tag com esse nome.",
  action: () => {},
};

export const useFetchTagsByProject = (projectId: string) => {
  const TAGS_QUERY_KEY = "tags";

  return useQuery({
    queryKey: [APP_DATA_QUERY_KEY, TAGS_QUERY_KEY, projectId],
    queryFn: async () => await fetchTagsByProject(projectId),

    meta: {
      errorTitle: "Erro ao carregar tags",
    },
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TagPayloadDTO): Promise<TagDTO> => createTag(data),

    meta: {
      errorTitle: "Erro ao criar tag",
      constraintError: {
        title: duplicatedErrorConfig.title,
        message: duplicatedErrorConfig.message,
      },
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
      triggerSync();
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TagUpdateDTO;
    }): Promise<TagDTO> => updateTag({ id, data }),

    meta: {
      errorTitle: "Erro ao atualizar tag",
      constraintError: {
        title: duplicatedErrorConfig.title,
        message: duplicatedErrorConfig.message,
      },
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
      triggerSync();
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTag(id),

    meta: {
      errorTitle: "Erro ao deletar tags",
      closeModalOnSuccess: true,
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
      triggerSync();
    },
  });
};
