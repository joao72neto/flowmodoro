import { useState } from "react";
import Button from "../common/Button";

function Timer() {
  const [running, setRunning] = useState(true);

  return (
    <>
      <div className="text-6xl font-mono mb-8">{"00:00"}</div>
      <div className="flex gap-4 mb-6">
        {running ? (
          <Button
            onClick={() => setRunning(!running)}
            text="Start"
            variant="danger"
            icon={<i className="bi bi-play-fill" />}
          />
        ) : (
          <Button
            onClick={() => setRunning(!running)}
            text="Stop"
            variant="secondary"
            icon={<i className="bi bi-x-lg" />}
          />
        )}
      </div>
    </>
  );
}

export default Timer;
