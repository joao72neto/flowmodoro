import Input from "../../../../shared/components/Input";
import { useTaskContext } from "../../task.context";
import { useState, useMemo } from "react";
import TaskTabs from "./TaskTabs";
import EmptyTasks from "./EmptyTasks";
import TaskItem from "./TaskItem";

function Tasks() {
  const { handleAddTask, newTask, setNewTask, tasks } = useTaskContext();

  const [activeTab, setActiveTab] = useState<"todo" | "done">("todo");

  const { todoCount, doneCount } = useMemo(() => {
    return {
      todoCount: tasks.filter((t) => !t.checked).length,
      doneCount: tasks.filter((t) => t.checked).length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      activeTab === "todo" ? !task.checked : task.checked,
    );
  }, [tasks, activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  return (
    <div className="w-full max-w-xl flex flex-col h-screen">
      <h2 className="text-2xl mb-4 text-center">Tarefas</h2>
      <div className="flex mb-4">
        <Input
          placeholder="Adicionar tarefa"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <TaskTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        todoCount={todoCount}
        doneCount={doneCount}
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-auto mb-15 scrollbar-hidden">
        {filteredTasks.length === 0 ? (
          <EmptyTasks activeTab={activeTab} />
        ) : (
          <ul className="space-y-2">
            {filteredTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Tasks;
