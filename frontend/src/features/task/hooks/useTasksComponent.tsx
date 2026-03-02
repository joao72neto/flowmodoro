import { useModal } from "../../../contexts/ModalContext";
import { useTaskContext } from "../contexts/TaskContext";

const useTasksComponent = () => {
  const { showWarning, hideModal } = useModal();
  const { handleRemoveTask } = useTaskContext();

  const handleDeleteTask = (id: number) => {
    showWarning(
      "Deletar tarefa",
      "Tem certeza que deseja deletar essa tarefa?",
      () => {
        handleRemoveTask(id);
        hideModal();
      },
    );
  };

  return { handleDeleteTask };
};

export default useTasksComponent;
