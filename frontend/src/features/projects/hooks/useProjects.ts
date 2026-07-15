import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APP_DATA_QUERY_KEY } from "../../../global-query-key";
import { useModal } from "../../../shared/contexts/modal/modal.context";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "../local/projects.repository";
import { ApiError } from "../../../configs/api-error.configs";

import type { ProjectPayloadDTO } from "../dtos/projects-request";
import type { ProjectDTO } from "../dtos/projects-response";

const duplicatedErrorConfig = {
  title: "Projeto duplicado",
  message: "Já existe um projeto com esse nome.",
  action: () => {},
};

export const useFetchProjects = () => {
  const PROJECTS_QUERY_KEY = "projects";

  return useQuery({
    queryKey: [APP_DATA_QUERY_KEY, PROJECTS_QUERY_KEY],
    queryFn: async () => await fetchProjects(),

    meta: {
      errorTitle: "Erro ao carregar projetos",
    },
  });
};

export const useCreateProject = () => {
  const { showError, hideModal } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectPayloadDTO): Promise<ProjectDTO> =>
      createProject(data),

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
        title: "Erro ao criar projeto",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
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
      id: string;
      data: ProjectPayloadDTO;
    }): Promise<ProjectDTO> => updateProject({ id, data }),

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
        title: "Erro ao atualizar projeto",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
    },
  });
};

export const useDeleteProject = () => {
  const { showError, hideModal, setModalLoading } = useModal();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),

    onError: (error: ApiError) => {
      showError({
        title: "Erro ao deletar projeto",
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
