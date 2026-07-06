import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APP_LOCAL_DATA_QUERY_KEY } from "../../../../query-key";
import { useModal } from "../../../../shared/contexts/modal.context";
import {
  createLocalProject,
  deleteLocalProject,
  fetchLocalProjects,
  updateLocalProject,
} from "../projects.repository";
import { ApiError } from "../../../../configs/api-error.configs";
import type { ProjectPayload } from "../../api/projects.types";
import type { ProjectModel } from "../project.model";

export const useFetchLocalProjects = () => {
  const { showError, hideModal } = useModal();

  return useQuery({
    queryKey: [APP_LOCAL_DATA_QUERY_KEY],
    queryFn: async () => {
      try {
        return await fetchLocalProjects();
      } catch (error) {
        if (error instanceof ApiError) {
          showError({
            title: "Erro ao carregar projetos locais",
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

export const useCreateLocalProject = () => {
  const { showError, hideModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectPayload): Promise<ProjectModel> =>
      createLocalProject(data),

    onError: (error: ApiError) => {
      showError({
        title: "Erro ao criar projeto local",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_LOCAL_DATA_QUERY_KEY] });
    },
  });
};

export const useUpdateLocalProject = () => {
  const { showError, hideModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ProjectPayload;
    }): Promise<ProjectModel> => updateLocalProject({ id, data }),

    onError: (error: ApiError) => {
      showError({
        title: "Erro ao atualizar projeto local",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_LOCAL_DATA_QUERY_KEY] });
    },
  });
};

export const useDeleteLocalProject = () => {
  const { showError, hideModal, setModalLoading } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLocalProject(id),

    onError: (error: ApiError) => {
      showError({
        title: "Erro ao deletar projeto local",
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
