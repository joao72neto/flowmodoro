import { useSession } from "../../hooks/sessions/useSession";

function Interruptions() {
  const { interruptions, setInterruptions } = useSession();

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <p>Interruptions</p>
      <span className="cursor-pointer">
        <i
          onClick={() => setInterruptions(interruptions + 1)}
          className="bi bi-plus-lg"
        />
      </span>
      <span className="text-lg font-bold">{interruptions}</span>
    </div>
  );
}

export default Interruptions;
