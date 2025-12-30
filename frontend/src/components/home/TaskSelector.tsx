import { useEffect, useRef, useState } from "react";
import { useSessionContext } from "../../hooks/sessions/useSessionContext";
import clsx from "clsx";

function TaskSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { tasks, selectedTask, setSelectedTask, setIsSidebarOpen } =
    useSessionContext();

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
        onClick={() => {
          tasks.length > 0 ? setIsOpen(!isOpen) : setIsSidebarOpen(true);
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
          "transition"
        )}
      >
        {selectedTask}
        {tasks.length > 0 ? (
          <i className="bi bi-caret-down-fill ml-2 text-white/60"></i>
        ) : (
          <i className="bi bi-plus-lg ml-2 text-white/60"></i>
        )}
      </button>

      {isOpen && tasks.length > 0 && (
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
            "max-h-80"
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
