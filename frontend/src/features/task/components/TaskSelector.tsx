import { useEffect, useRef, useState } from "react";
import { useTaskContext } from "../contexts/TaskContext";
import clsx from "clsx";
import { useSessionContext } from "../../session/contexts/SessionContext";

import { FaCaretDown } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";

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
    <div ref={ref} className="relative inline-block w-70">
      <button
        onClick={() => {
          undoneTasks.length > 0 ? setIsOpen(!isOpen) : setIsSidebarOpen(true);
        }}
        className={clsx(
          "flex items-center px-3",
          "appearance-none",
          "bg-transparent",
          "text-center",
          "rounded-xl",
          "w-full",
          "py-3",
          "cursor-pointer",
          "border",
          "border-white/10",
          "transition",
        )}
      >
        <div className="flex-1">{selectedTask}</div>
        {undoneTasks.length > 0 ? (
          <FaCaretDown
            size={20}
            className={clsx(
              "text-white/60 transition duration-200",
              isOpen && "rotate-180",
            )}
          />
        ) : (
          <CiCirclePlus size={25} className="text-white/60" />
        )}
      </button>

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
          "transition-all duration-200 ease-in-out",
          isOpen
            ? "opacity-100 max-h-80 translate-y-1"
            : "opacity-0 max-h-0 pointer-events-none translate-y-0",
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
    </div>
  );
}

export default TaskSelector;
