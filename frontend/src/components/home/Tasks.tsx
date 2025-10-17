import Button from "../common/Button";
import Input from "../common/Input";

function Tasks() {
  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl mb-4 text-center">Tarefas</h2>
      <div className="flex mb-4">
        <Input placeholder="Add new task" />
        <Button text="Add" />
      </div>

      <ul className="space-y-2">
        <li className="bg-gray-800 px-4 py-2 rounded flex items-center justify-between">
          <span>Task</span>
          <Button text="Remove" />
        </li>
      </ul>
    </div>
  );
}

export default Tasks;
