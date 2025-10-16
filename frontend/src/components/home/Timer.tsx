import Button from "../common/Button";

function Timer() {
  return (
    <>
      <div className="text-6xl font-mono mb-8">{"00:00"}</div>
      <div className="flex gap-4 mb-6">
        <Button text="Start" backgroundColor="green" />
        <Button text="Reset" backgroundColor="red" />
      </div>
    </>
  );
}

export default Timer;
