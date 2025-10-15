function Timer() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl mb-8">Pomodoro Timer</h1>

      {/* TIMER */}
      <div className="text-6xl font-mono mb-8">{"25:00"}</div>

      <div className="flex gap-4 mb-6">
        <button className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded">
          Start
        </button>
        <button className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded">
          Reset
        </button>
      </div>

      {/* INTERRUPÇÕES */}
      <div className="mb-8">
        <p className="mb-2 text-lg">Interrupções: 0</p>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
        >
          +1 Interrupção
        </button>
      </div>

      {/* TASKS */}
      <div className="w-full max-w-md">
        <h2 className="text-2xl mb-4 text-center">Tarefas</h2>
        <div className="flex mb-4">
          <input
            className="flex-grow px-4 py-2 text-black rounded-l"
            placeholder="Nova tarefa..."
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
            <li
              className="bg-gray-800 px-4 py-2 rounded flex items-center justify-between"
            >
              <span>Task</span>
              <button
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Remover
              </button>
            </li>
        </ul>
      </div>
    </div>
  );
}

export default Timer;
