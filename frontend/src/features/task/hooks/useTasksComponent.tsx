import { useModal } from "../../../shared/contexts/ModalContext";
import { useTaskContext } from "../contexts/TaskContext";

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
