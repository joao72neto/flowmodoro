import { useSessionContext } from "../../../contexts/SessionContext";

function Interruptions() {
  const { setInterruptions, interruptions } = useSessionContext();

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
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
