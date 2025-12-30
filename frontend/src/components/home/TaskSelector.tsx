import { useEffect, useRef, useState } from "react";
import { useSessionContext } from "../../hooks/sessions/useSessionContext";
import clsx from "clsx";

function TaskSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState("Select a task...");
  const ref = useRef<HTMLDivElement>(null);
  const { tasks } = useSessionContext();

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
    <div ref={ref} className="relative inline-block w-70 mb-15">
      <button
        onClick={() => setIsOpen(!isOpen)}
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
          "transition"
        )}
      >
        {selectedTask}
        <i className="bi bi-caret-down-fill ml-2 text-white/60"></i>
      </button>

      {isOpen && (
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
            "h-80"
          )}
        >
          {tasks.map((task, index) => (
            <li
              key={index}
              onClick={() => {
                setSelectedTask(task.name);
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
