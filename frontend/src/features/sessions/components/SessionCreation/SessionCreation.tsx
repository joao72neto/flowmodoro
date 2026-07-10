import clsx from "clsx";

import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import { IoPlaySkipForwardCircleSharp } from "react-icons/io5";

import { GoProject } from "react-icons/go";
import { IoMdPricetag } from "react-icons/io";
import SessionSelector from "./SessionSelector";

import { useTimerContext } from "../../../timer/timer.context";
import { useSessionContext } from "../../context/sessions.context";
import { useEffect, useState } from "react";
import { localStorageKeys } from "../../../../shared/utils/storage.utils";

const SessionCreation = () => {
  const { mode, startBreak, startFocus, stopFocus, skipBreak } =
    useTimerContext();

  const {
    setSessionName: setContextSessionName,
    sessionName: contextSessionName,
    selectedProject,
    setSelectedProjectId,
    selectedTag,
    setSelectedTagId,
    projects,
    tags,
  } = useSessionContext();

  const [sessionName, setSessionName] = useState(contextSessionName);

  const isTimerRunning = mode === "focus" || mode === "break";

  const isFocusRunning = mode === "focus";
  const isBreakRunning = mode === "break";
  const isTimerStopped = mode === "stopped";

  const hasContent = sessionName.trim().length > 0;
  const isExpanded = hasContent && !isTimerRunning;

  const showProjectSelector = !isTimerRunning || selectedProject !== null;
  const showTagSelector = !isTimerRunning || selectedTag !== null;
  const showSelectorsContainer =
    isExpanded ||
    (isTimerRunning && (selectedProject !== null || selectedTag !== null));

  const buttonClasses = clsx(
    isBreakRunning || isTimerStopped
      ? "text-success hover:text-success/90"
      : "text-primary hover:text-primary/90",
    "text-3xl hover:scale-110 active:scale-95",
    "transition duration-150 hover:cursor-pointer",
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        localStorageKeys.session,
        JSON.stringify({
          sessionName: sessionName,
          selectedProjectId: selectedProject?.id,
          selectedTagId: selectedTag?.id,
        }),
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [sessionName, selectedProject, selectedTag]);

  const commitSessionName = () => {
    setContextSessionName(sessionName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitSessionName();

      if (mode === null) {
        startFocus();
        return;
      }

      startBreak();
    }
  };

  return (
    <div
      className={clsx(
        "relative z-10 w-full",
        "border border-border p-4 rounded-2xl shadow-lg",
        "transition-all duration-300 bg-neutral-80/40",
        isBreakRunning || isTimerStopped
          ? "focus-within:border-success/50 focus-within:shadow-[0_0_20px_rgba(34,197,94,0.08)]"
          : "focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(245,158,11,0.08)]",
        isExpanded
          ? "max-w-full"
          : isTimerRunning
            ? "max-w-[550px]"
            : "max-w-[300px]",
        isFocusRunning
          ? "border-primary/50 animate-border-pulse-focus"
          : isBreakRunning
            ? "border-success/50 animate-border-pulse-break"
            : "hover:border-neutral-60/80",
      )}
    >
      <div
        className={clsx(
          "flex sm:flex-row items-stretch sm:items-center",
          showSelectorsContainer ? "gap-4 flex-col" : "flex-row",
        )}
      >
        {isTimerRunning || isTimerStopped ? (
          <div
            title={
              isTimerRunning
                ? "Foco em andamento"
                : "Pronto para iniciar a pausa"
            }
            className={clsx(
              "flex-1 min-w-0 py-1",
              "truncate text-neutral-10 text-base sm:text-lg",
            )}
          >
            {sessionName}
          </div>
        ) : (
          <input
            className={clsx(
              "flex-1 min-w-0 py-1",
              "bg-transparent text-neutral-10 text-base sm:text-lg",
              "focus:outline-none placeholder:text-neutral-40",
            )}
            placeholder="Estou focando em..."
            value={sessionName}
            onKeyDown={handleKeyDown}
            onBlur={commitSessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
        )}

        <div
          className={clsx(
            "flex items-center justify-between sm:justify-start gap-8",
          )}
        >
          <div
            className={clsx(
              "items-center gap-3",
              showSelectorsContainer ? "flex" : "hidden",
            )}
          >
            {showProjectSelector && (
              <SessionSelector
                value={selectedProject}
                onChange={(project) =>
                  setSelectedProjectId(project?.id ?? null)
                }
                disabled={isTimerRunning}
                title="Projetos"
                variant="primary"
                items={projects}
                placeholder="Pesquisar projeto..."
                emptyMsg="Nenhum projeto encontrado"
                icon={<GoProject />}
              >
                Projetos
              </SessionSelector>
            )}
            {showTagSelector && (
              <SessionSelector
                value={selectedTag}
                onChange={(tag) => setSelectedTagId(tag?.id ?? null)}
                disabled={isTimerRunning}
                title="Tags"
                variant="secondary"
                items={tags}
                placeholder="Pesquisar tag..."
                emptyMsg={
                  selectedProject
                    ? "Nenhuma tag encontrada"
                    : "Selecione um projeto primeiro"
                }
                icon={<IoMdPricetag />}
              >
                Tags
              </SessionSelector>
            )}
          </div>

          {mode === null ? (
            <button
              title="Iniciar foco"
              onClick={startFocus}
              className={clsx(buttonClasses, !isExpanded && "hidden")}
            >
              <FaPlayCircle />
            </button>
          ) : mode === "focus" ? (
            <button
              title="Parar foco"
              onClick={stopFocus}
              className={buttonClasses}
            >
              <FaStopCircle />
            </button>
          ) : mode === "stopped" ? (
            <button
              title="Iniciar pausa"
              onClick={startBreak}
              className={buttonClasses}
            >
              <FaPlayCircle />
            </button>
          ) : (
            <button
              title="Pular pausa"
              onClick={skipBreak}
              className={buttonClasses}
            >
              <IoPlaySkipForwardCircleSharp />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCreation;
