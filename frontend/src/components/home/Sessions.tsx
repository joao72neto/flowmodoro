import Stack from "../common/Stack";

const Sessions = () => {
  return (
    <div className="flex flex-col gap-6 p-4  min-w-[300px] w-full max-w-[500px]">
      <h1 className="text-2xl border-b-2 border-b-white/10 py-2 text-center">
        Work
      </h1>

      <Stack align="left" gap={4}>
        <p>Today (1h 20min | 15min)</p>
        <Stack
          direction="row"
          justify="between"
          className="border py-6 px-4 rounded-lg w-full"
        >
          <span className="text-xl">Coding</span>
          <span className="text-xl">1h 20min</span>
          <span>Icon</span>
        </Stack>
      </Stack>
    </div>
  );
};

export default Sessions;
