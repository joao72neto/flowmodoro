import Stack from "../common/Stack";
import { CgDetailsMore } from "react-icons/cg";

const Sessions = () => {
  return (
    <div className="flex flex-col gap-6 p-4  min-w-[300px] w-full max-w-[500px]">
      <h1 className="text-2xl border-b-2 border-b-white/10 py-2 text-center">
        Sessões
      </h1>

      <Stack align="left" gap={4}>
        <p className="font-bold">Today (1h 20min | 15min)</p>
        <Stack
          direction="row"
          justify="between"
          className="border border-white/10 shadow-lg py-6 px-4 rounded-lg w-full"
        >
          <span className="text-xl">Coding</span>
          <span className="text-xl">1h 20min</span>
          <span>
            <CgDetailsMore className="cursor-pointer text-[25px]" />
          </span>
        </Stack>
      </Stack>
    </div>
  );
};

export default Sessions;
