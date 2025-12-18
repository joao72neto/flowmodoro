function TaskButton({
  onClick,
  taskCompleted,
}: {
  onClick?: () => void;
  taskCompleted?: boolean;
}) {
  return (
    <div
      title="Complete Task"
      onClick={onClick}
      className="inline-flex items-center justify-center mr-3 cursor-pointer"
    >
      {!taskCompleted ? (
        <div className="border w-5 h-5 rounded-full"></div>
      ) : (
        <i className="bi bi-check-lg text-xl"></i>
      )}
    </div>
  );
}

export default TaskButton;
