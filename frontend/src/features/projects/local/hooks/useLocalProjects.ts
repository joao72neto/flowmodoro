import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APP_LOCAL_DATA_QUERY_KEY } from "../../../../query-key";
import { useModal } from "../../../../shared/contexts/modal/modal.context";
import {
  createLocalProject,
  deleteLocalProject,
  fetchLocalProjects,
  updateLocalProject,
} from "../projects.repository";
import { ApiError } from "../../../../configs/api-error.configs";

import type { ProjectDTO, ProjectPayloadDTO } from "../project.dtos";

const duplicatedErrorConfig = {
  title: "Projeto duplicado",
  message: "Já existe um projeto com esse nome.",
  action: () => {},
};

export const useFetchLocalProjects = () => {
  const { showError, hideModal } = useModal();

  const PROJECTS_QUERY_KEY = "projects";

  return useQuery({
    queryKey: [APP_LOCAL_DATA_QUERY_KEY, PROJECTS_QUERY_KEY],
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
    mutationFn: (data: ProjectPayloadDTO): Promise<ProjectDTO> =>
      createLocalProject(data),

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
      data: ProjectPayloadDTO;
    }): Promise<ProjectDTO> => updateLocalProject({ id, data }),

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
