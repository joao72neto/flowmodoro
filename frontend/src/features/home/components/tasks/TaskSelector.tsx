import { useEffect, useRef, useState } from "react";
import { useTaskContext } from "../../../task/contexts/TaskContext";
import clsx from "clsx";
import { useSessionContext } from "../../../session/contexts/SessionContext";

function TaskSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { selectedTask, setSelectedTask, setIsSidebarOpen, undoneTasks } =
    useTaskContext();
  const { setTaskId } = useSessionContext();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={ref} className="relative inline-block w-70 mb-12">
      <button
        onClick={() => {
          undoneTasks.length > 0 ? setIsOpen(!isOpen) : setIsSidebarOpen(true);
        }}
        className={clsx(
          "appearance-none",
          "bg-transparent",
          "text-center",
          "rounded-2xl",
          "w-full",
          "py-4",
          "cursor-pointer",
          "border",
          "border-white/10",
          "transition",
        )}
      >
        {selectedTask}
        {undoneTasks.length > 0 ? (
          <i className="bi bi-caret-down-fill ml-2 text-white/60"></i>
        ) : (
          <i className="bi bi-plus-lg ml-2 text-white/60"></i>
        )}
      </button>

      {isOpen && undoneTasks.length > 0 && (
        <ul
          className={clsx(
            "absolute",
            "mt-2",
            "w-full",
            "bg-gray",
            "backdrop-blur-lg",
            "border",
            "border-white/10",
            "rounded-xl",
            "shadow-lg",
            "text-center",
            "overflow-auto z-10",
            "max-h-80",
          )}
        >
          {undoneTasks.map((task, index) => (
            <li
              key={index}
              onClick={() => {
                setSelectedTask(task.name);
                setTaskId(task.id);
                setIsOpen(false);
              }}
              className="py-3 hover:bg-black/30 cursor-pointer"
            >
              {task.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskSelector;
