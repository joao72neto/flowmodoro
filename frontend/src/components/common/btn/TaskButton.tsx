function TaskButton({
  onClick,
  taskCompleted,
}: {
  onClick?: () => void;
  taskCompleted?: boolean;
}) {
  return (
    <>
      <div
        title="Complete Task"
        className={
          !taskCompleted
            ? "border w-5 h-5 rounded-full inline-block cursor-pointer mr-3"
            : ""
        }
        onClick={onClick}
      />
      <i
        className={
          taskCompleted ? "bi bi-check-lg text-xl mr-2 cursor-pointer" : ""
        }
      />
    </>
  );
}

export default TaskButton;
