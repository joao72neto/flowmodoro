import { GiEmptyHourglass } from "react-icons/gi";

function EmptySessions() {
  return (
    <div className="flex flex-col flex-1 gap-3 justify-center items-center w-full opacity-60">
      <div className="flex flex-col items-center gap-2">
        <GiEmptyHourglass size={40} />
        <h2 className="text-xl text-center m-0!">Nenhuma sessão registrada</h2>
      </div>
      <p className="text-neutral-40 max-w-[300px] text-center text-sm">
        Inicie o timer e complete seu primeiro ciclo de foco para ver suas
        estatísticas aqui.
      </p>
    </div>
  );
}

export default EmptySessions;
