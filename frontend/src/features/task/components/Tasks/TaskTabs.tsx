import clsx from "clsx";

interface TaskTabsProps {
  activeTab: "todo" | "done";
  setActiveTab: (tab: "todo" | "done") => void;
  todoCount: number;
  doneCount: number;
}

function TaskTabs({
  activeTab,
  setActiveTab,
  todoCount,
  doneCount,
}: TaskTabsProps) {
  return (
    <div className="flex border-b border-white/10 mb-4">
      <button
        onClick={() => setActiveTab("todo")}
        className={clsx(
          "flex-1 py-2 text-sm font-medium transition-colors border-b-2 cursor-pointer flex items-center justify-center gap-2",
          activeTab === "todo"
            ? "border-danger text-danger"
            : "border-transparent text-neutral-400 hover:text-white",
        )}
      >
        A fazer
        <span
          className={clsx(
            "px-2 py-1 flex items-center justify-center rounded-full text-[10px] font-bold",
            activeTab === "todo"
              ? "bg-danger text-white"
              : "bg-white/10 text-neutral-400",
          )}
        >
          {todoCount}
        </span>
      </button>
      <button
        onClick={() => setActiveTab("done")}
        className={clsx(
          "flex-1 py-2 text-sm font-medium transition-colors border-b-2 cursor-pointer flex items-center justify-center gap-2",
          activeTab === "done"
            ? "border-success text-success"
            : "border-transparent text-neutral-400 hover:text-white",
        )}
      >
        Concluído
        <span
          className={clsx(
            "px-2 py-1 flex items-center justify-center rounded-full text-[10px] font-bold",
            activeTab === "done"
              ? "bg-success text-neutral-100"
              : "bg-white/10 text-neutral-400",
          )}
        >
          {doneCount}
        </span>
      </button>
    </div>
  );
}

export default TaskTabs;
