import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import projectsService from "../projects.service";
import type { ProjectPayload, ProjectResponse } from "../projects.types";
import { ApiError } from "../../../configs/api-error.configs";
import { projectErrors, type ProjectError } from "../consts/project-errors";
import { useModal } from "../../../shared/contexts/modal.context";
import { APP_DATA_QUERY_KEY } from "../../../app-query-key";

export const useFetchProjects = () => {
  const { showError, hideModal } = useModal();

  return useQuery({
    queryKey: [APP_DATA_QUERY_KEY],
    queryFn: async () => {
      try {
        return await projectsService.fetchProjects();
      } catch (error) {
        if (error instanceof ApiError) {
          showError({
            title:
              projectErrors[error.code as ProjectError] ??
              "Erro ao carregar projetos",
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

export const useCreateProject = () => {
  const { showError, hideModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectPayload): Promise<ProjectResponse> =>
      projectsService.createProject(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
    },

    onError: (error: ApiError) => {
      showError({
        title:
          projectErrors[error.code as ProjectError] ?? "Erro ao criar projeto",
        message: error.message,
        action: hideModal,
      });
    },
  });
};

export const useUpdateProject = () => {
  const { showError, hideModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: ProjectPayload;
    }): Promise<ProjectResponse> => projectsService.updateProject({ id, data }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
    },

    onError: (error: ApiError) => {
      showError({
        title:
          projectErrors[error.code as ProjectError] ??
          "Erro ao atualizar projeto",
        message: error.message,
        action: hideModal,
      });
    },
  });
};

export const useDeleteProject = () => {
  const { showError, hideModal, setModalLoading } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => projectsService.deleteProject(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
      setModalLoading(false);
      hideModal();
    },

    onError: (error: ApiError) => {
      showError({
        title:
          projectErrors[error.code as ProjectError] ??
          "Erro ao deletar projeto",
        message: error.message,
        action: hideModal,
      });
    },
  });
};
