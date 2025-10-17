import Button from "../common/Button";

function Timer() {
  return (
    <>
      <div className="text-6xl font-mono mb-8">{"00:00"}</div>
      <div className="flex gap-4 mb-6">
        <Button text="Start" variant="secondary" icon={<i className="bi bi-play-fill"/>}/>
        <Button text="Reset" variant="danger" icon={<i className="bi bi-x-lg"/>}/>
      </div>
    </>
  );
}

export default Timer;
