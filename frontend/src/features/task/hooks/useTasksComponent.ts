import { useModal } from "../../../shared/modal.context";
import { useTaskContext } from "../task.context";

const useTasksComponent = () => {
  const { showWarning, hideModal } = useModal();
  const { handleRemoveTask } = useTaskContext();

  const handleDeleteTask = (id: number) => {
    showWarning({
      title: "Deletar tarefa",
      message: "Tem certeza que deseja deletar essa tarefa?",
      action: () => {
        handleRemoveTask(id);
        hideModal();
      },
    });
  };

  return { handleDeleteTask };
};

export default useTasksComponent;
