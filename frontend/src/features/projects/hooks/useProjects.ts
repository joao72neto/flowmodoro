import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APP_DATA_QUERY_KEY } from "../../../consts/global-query-key";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "../local/projects.repository";

import type {
  ProjectPayloadDTO,
  ProjectUpdateDTO,
} from "../dtos/projects-request";
import type { ProjectDTO } from "../dtos/projects-response";
import { triggerSync } from "../../../local/sync/sync-manager";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProjectPayloadDTO): Promise<ProjectDTO> =>
      createProject(data),

    meta: {
      errorTitle: "Erro ao criar projeto",
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

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ProjectUpdateDTO;
    }): Promise<ProjectDTO> => updateProject({ id, data }),

    meta: {
      errorTitle: "Erro ao atualizar projeto",
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

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProject(id),

    meta: {
      errorTitle: "Erro ao deletar projeto",
      closeModalOnSuccess: true,
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_DATA_QUERY_KEY] });
      triggerSync();
    },
  });
};
