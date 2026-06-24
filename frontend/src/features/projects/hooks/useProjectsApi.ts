import { useQuery } from "@tanstack/react-query";
import { useModal } from "../../../shared/modal.context";
import projectsService from "../projects.service";

export const useFetchProjects = () => {
  const { showError, hideModal } = useModal();

  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        return await projectsService.fetchProjects();
      } catch (error) {
        if (error instanceof Error) {
          showError({
            title: "Erro ao carregar projetos",
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
