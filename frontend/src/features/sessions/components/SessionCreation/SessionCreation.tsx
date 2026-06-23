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
        "relative z-10",
        "border border-border p-4 rounded-2xl shadow-lg",
        "transition-all duration-300 bg-neutral-80/40",
        "hover:border-neutral-60/80 focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(245,158,11,0.08)]",
        hasContent ? "max-w-full" : "max-w-xs",
        "w-full",
      )}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <input
          className="flex-1 bg-transparent text-neutral-10 text-base sm:text-lg focus:outline-none placeholder:text-neutral-40 min-w-0 py-1"
          placeholder="Em que você está trabalhando?"
          value={sessionText}
          onChange={(e) => setSessionText(e.target.value)}
        />

        {hasContent && (
          <div className="flex items-center justify-between sm:justify-start gap-8">
            <div className="flex items-center gap-3">
              <SessionSelector
                title="Projetos"
                variant="primary"
                align="left"
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
                align="left"
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
                "text-primary text-3xl hover:scale-110 active:scale-95",
                "transition duration-150 hover:cursor-pointer hover:text-primary/90",
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
