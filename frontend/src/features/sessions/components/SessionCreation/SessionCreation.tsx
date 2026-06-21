import clsx from "clsx";
import { useState } from "react";

import { FaPlayCircle } from "react-icons/fa";
import { GoProject } from "react-icons/go";
import { IoMdPricetag } from "react-icons/io";
import SessionSelector from "./SessionSelector";

const SessionCreation = () => {
  const [sessionText, setSessionText] = useState("");
  const hasContent = sessionText.trim().length > 0;

  return (
    <div
      className={clsx(
        "flex items-center justify-between border border-border p-4 rounded-xl",
        "min-w-20 max-w-70 w-full shadow-md",
        "transition-all duration-300",
        hasContent ? "max-w-150" : "max-w-70",
      )}
    >
      <input
        className="flex-1 w-full focus:outline-none"
        placeholder="Insira uma descrição..."
        value={sessionText}
        onChange={(e) => setSessionText(e.target.value)}
      />

      {hasContent && (
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <SessionSelector icon={<GoProject />}>Projetos</SessionSelector>
            <SessionSelector icon={<IoMdPricetag />}>Tags</SessionSelector>
          </div>
          <button
            type="button"
            className={clsx(
              "hover:cursor-pointer text-3xl hover:scale-110 transition duration-100",
              "active:scale-95",
            )}
          >
            <FaPlayCircle />
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionCreation;
