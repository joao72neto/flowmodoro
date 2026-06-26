import clsx from "clsx";

import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import { IoPlaySkipForwardCircleSharp } from "react-icons/io5";

import { GoProject } from "react-icons/go";
import { IoMdPricetag } from "react-icons/io";
import SessionSelector from "./SessionSelector";

import { useTimerContext } from "../../../timer/timer.context";
import { useFetchProjects } from "../../../projects/hooks/useProjects";
import { useFetchTagsByProject } from "../../../tags/hooks/useTagsApi";
import { useSessionContext } from "../../sessions.context";

const SessionCreation = () => {
  const { mode, startBreak, startFocus, stopFocus, skipBreak } =
    useTimerContext();

  const {
    selectedProject,
    setSelectedProject,
    selectedTag,
    setSelectedTag,
    setSessionName,
    sessionName,
  } = useSessionContext();

  const isTimerRunning = mode === "focus" || mode === "break";

  const hasContent = sessionName.trim().length > 0;
  const isExpanded = hasContent && !isTimerRunning;

  const showProjectSelector = !isTimerRunning || selectedProject !== null;
  const showTagSelector = !isTimerRunning || selectedTag !== null;
  const showSelectorsContainer =
    isExpanded ||
    (isTimerRunning && (selectedProject !== null || selectedTag !== null));

  const buttonClasses = clsx(
    "text-primary text-3xl hover:scale-110 active:scale-95",
    "transition duration-150 hover:cursor-pointer hover:text-primary/90",
  );

  const { data: projects } = useFetchProjects();
  const { data: tags } = useFetchTagsByProject(selectedProject?.id ?? 0);

  return (
    <div
      className={clsx(
        "relative z-10 w-full",
        "border border-border p-4 rounded-2xl shadow-lg",
        "transition-all duration-300 bg-neutral-80/40",
        "focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(245,158,11,0.08)]",
        isExpanded
          ? "max-w-full"
          : isTimerRunning
            ? "max-w-[550px]"
            : "max-w-[300px]",
        isTimerRunning
          ? "border-primary/50 animate-border-pulse"
          : "hover:border-neutral-60/80",
      )}
    >
      <div
        className={clsx(
          "flex sm:flex-row items-stretch sm:items-center",
          showSelectorsContainer ? "gap-4 flex-col" : "flex-row",
        )}
      >
        <input
          className="flex-1 bg-transparent text-neutral-10 text-base sm:text-lg focus:outline-none placeholder:text-neutral-40 min-w-0 py-1"
          placeholder="Estou focando em..."
          disabled={isTimerRunning}
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
        />

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
                onChange={(project) => setSelectedProject(project)}
                disabled={isTimerRunning}
                title="Projetos"
                variant="primary"
                items={projects}
                placeholder="Pesquisar projeto..."
                icon={<GoProject />}
              >
                Projetos
              </SessionSelector>
            )}
            {showTagSelector && (
              <SessionSelector
                value={selectedTag}
                onChange={(tag) => setSelectedTag(tag)}
                disabled={isTimerRunning}
                title="Tags"
                variant="secondary"
                items={tags}
                placeholder="Pesquisar tag..."
                icon={<IoMdPricetag />}
              >
                Tags
              </SessionSelector>
            )}
          </div>

          {mode === null ? (
            <button
              onClick={() => startFocus()}
              className={clsx(buttonClasses, !isExpanded && "hidden")}
            >
              <FaPlayCircle />
            </button>
          ) : mode === "focus" ? (
            <button onClick={() => stopFocus()} className={buttonClasses}>
              <FaStopCircle />
            </button>
          ) : mode === "stopped" ? (
            <button onClick={() => startBreak()} className={buttonClasses}>
              <FaPlayCircle />
            </button>
          ) : (
            <button onClick={() => skipBreak()} className={buttonClasses}>
              <IoPlaySkipForwardCircleSharp />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCreation;
