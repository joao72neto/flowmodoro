import { PiEmpty } from "react-icons/pi";

interface EmptyTasksProps {
  activeTab: "todo" | "done";
}

function EmptyTasks({ activeTab }: EmptyTasksProps) {
  return (
    <div className="flex flex-col gap-3 justify-center items-center flex-1">
      <div className="flex flex-col items-center gap-2">
        <PiEmpty size={30} />
        <h2 className="text-xl mb-4 text-center m-0!">
          {activeTab === "todo"
            ? "Nada para fazer"
            : "Nenhuma tarefa concluída"}
        </h2>
      </div>
      <p className="text-neutral-10 max-w-[280px] text-center">
        {activeTab === "todo"
          ? "Aproveite seu tempo livre ou adicione uma nova tarefa."
          : "As tarefas que você terminar aparecerão aqui."}
      </p>
    </div>
  );
}

export default EmptyTasks;
