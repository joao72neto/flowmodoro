import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { APP_LOCAL_DATA_QUERY_KEY } from "../../../../query-key";
import { useModal } from "../../../../shared/contexts/modal.context";
import { createLocalProject, fetchLocalProjects } from "../projects.repository";
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
        title: "Erro ao criar projeto local'cls",
        message: error.message,
        action: hideModal,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APP_LOCAL_DATA_QUERY_KEY] });
    },
  });
};
