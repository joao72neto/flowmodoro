import { useSessionContext } from "../../session/contexts/SessionContext";
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";

function Interruptions() {
  const { setInterruptions, interruptions } = useSessionContext();
  const isGreaterThanZero = interruptions > 0;

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <span className="cursor-pointer">
        <CiCircleMinus
          size={30}
          onClick={() =>
            setInterruptions(isGreaterThanZero ? interruptions - 1 : 0)
          }
          className="hover:scale-110 transition duration-100"
        />
      </span>
      <span className="text-lg font-bold">{interruptions}</span>
      <span className="cursor-pointer">
        <CiCirclePlus
          size={30}
          onClick={() => setInterruptions(interruptions + 1)}
          className="hover:scale-110 transition duration-100"
        />
      </span>
    </div>
  );
}

export default Interruptions;
