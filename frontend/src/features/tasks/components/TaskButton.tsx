import { FaCheck } from "react-icons/fa6";

function TaskButton({
  onClick,
  taskCompleted,
}: {
  onClick?: () => void;
  taskCompleted?: boolean;
}) {
  return (
    <div
      title="Completar a tarefa"
      onClick={onClick}
      className="inline-flex items-center justify-center mr-3 cursor-pointer"
    >
      {!taskCompleted ? (
        <div className="border w-5 h-5 rounded-full"></div>
      ) : (
        <FaCheck size={20} />
      )}
    </div>
  );
}

export default TaskButton;
