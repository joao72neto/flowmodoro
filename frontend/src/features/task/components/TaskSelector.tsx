import { useEffect, useRef, useState } from "react";
import { useTaskContext } from "../task.context";
import clsx from "clsx";

import { FaCaretDown } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useTimerContext } from "../../home/timer.context";

function TaskSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { mode } = useTimerContext();
  const {
    selectedTask,
    setSelectedTask,
    setIsSidebarOpen,
    undoneTasks,
    setManualActiveTaskId,
    isLoadingTasks,
  } = useTaskContext();

  const isFocusing = mode === "focus";
  const isDisabled = isFocusing || isLoadingTasks;

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
    <div
      ref={ref}
      className="relative inline-block w-70 bg-neutral-80/80 rounded-xl"
    >
      <button
        disabled={isDisabled}
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
          "border",
          "border-white/10",
          "transition",
          isDisabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:border-white/30",
        )}
      >
        <div className="flex-1 line-clamp-1 break-all">
          {isLoadingTasks ? "Carregando tarefas..." : selectedTask}
        </div>
        {isLoadingTasks ? (
          <AiOutlineLoading3Quarters size={20} className="animate-spin" />
        ) : undoneTasks.length > 0 ? (
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

      {!isFocusing && (
        <ul
          className={clsx(
            "absolute",
            "bg-neutral-80/80",
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
            "transition-all duration-200 ease-in-out ",
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
                setManualActiveTaskId(task.id);
                setIsOpen(false);
              }}
              className="p-3 hover:bg-black/30 cursor-pointer"
            >
              <div className="line-clamp-1 break-all">{task.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskSelector;
