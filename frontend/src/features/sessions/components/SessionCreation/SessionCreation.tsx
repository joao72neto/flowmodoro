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
        "border border-border p-4 rounded-xl shadow-md",
        "transition-all duration-300 bg-neutral-80/50",
        hasContent ? "max-w-150" : "max-w-70",
        "w-full",
      )}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <input
          className="flex-1 focus:outline-none min-w-0"
          placeholder="Insira uma descrição..."
          value={sessionText}
          onChange={(e) => setSessionText(e.target.value)}
        />

        {hasContent && (
          <div className="flex items-center justify-between sm:justify-start gap-8">
            <div className="flex items-center gap-4">
              <SessionSelector
                title="Projetos"
                variant="primary"
                items={[
                  { id: 1, name: "Violin" },
                  { id: 2, name: "Coding" },
                  { id: 3, name: "Piano" },
                  { id: 4, name: "Flowmodoro" },
                  { id: 5, name: "College" },
                  { id: 6, name: "Work" },
                ]}
                placeholder="Pesquisar projeto..."
                icon={<GoProject />}
              >
                Projetos
              </SessionSelector>
              <SessionSelector
                title="Tags"
                variant="secondary"
                items={[
                  { id: 1, name: "Scales" },
                  { id: 2, name: "Integration" },
                  { id: 3, name: "Backend" },
                  { id: 4, name: "Frontend" },
                  { id: 5, name: "Meeting" },
                  { id: 6, name: "Planning" },
                ]}
                placeholder="Pesquisar tag..."
                icon={<IoMdPricetag />}
              >
                Tags
              </SessionSelector>
            </div>

            <button
              type="button"
              className={clsx(
                "text-3xl hover:scale-110 active:scale-95",
                "transition duration-100 hover:cursor-pointer",
              )}
            >
              <FaPlayCircle />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCreation;
