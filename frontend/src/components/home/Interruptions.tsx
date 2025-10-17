import { useState } from "react";

function Interruptions() {
  let [count, setCount] = useState(0);

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <p>Interruptions</p>
      <span className="cursor-pointer">
        <i onClick={() => setCount(count + 1)} className="bi bi-plus-lg" />
      </span>
      <span className="text-lg font-bold">{count}</span>
    </div>
  );
}

export default Interruptions;
