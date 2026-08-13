import clsx from "clsx";

import { FaPlayCircle, FaStopCircle } from "react-icons/fa";
import { IoPlaySkipForwardCircleSharp } from "react-icons/io5";

import { GoProject } from "react-icons/go";
import { IoMdPricetag } from "react-icons/io";
import SessionSelector from "./SessionSelector";

import { useTimerContext } from "../../../timer/context/timer.context";
import { useSessionContext } from "../../context/sessions.context";
import { useCallback, useEffect, useState } from "react";
import { localStorageKeys } from "../../../../shared/utils/storage.utils";
import type { ProjectDTO } from "../../../projects/dtos/projects-response";
import type { TagDTO } from "../../../tags/dtos/tags-response";

const projectIcon = <GoProject />;
const tagIcon = <IoMdPricetag />;

import { FlowmodoroPlugin } from "../../../../mobile/plugins";

import { isNative } from "../../../../consts/platform";

import { ensureAllPermissions } from "../../permissions.utils";
import type { PluginListenerHandle } from "@capacitor/core";

import { IoClose } from "react-icons/io5";

import { useRef } from "react";
import { App } from "@capacitor/app";
import { useTotalFocus } from "../../../timer/hooks/useTimerStore";
import { useModal } from "../../../../shared/contexts/modal/modal.context";

const SessionCreation = () => {
  const { mode, startBreak, startFocus, stopFocus, skipBreak } =
    useTimerContext();

  const { showDefault, hideModal } = useModal();

  const totalFocusMillis = useTotalFocus();

  const {
    restRatio,
    setSessionName: setContextSessionName,
    sessionName: contextSessionName,
    selectedProject,
    setSelectedProjectId,
    selectedTag,
    setSelectedTagId,
    projects,
    tags,
  } = useSessionContext();

  const pendingAction = useRef<"start-focus" | null>(null);

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

  useEffect(() => {
    if (!isNative) {
      return;
    }

    const setup = async () => {
      const listener = await App.addListener("resume", async () => {
        if (!pendingAction.current) {
          return;
        }

        const ok = await ensureAllPermissions();
        if (!ok) {
          return;
        }

        pendingAction.current = null;
        startFocusTimer();
      });

      return listener;
    };

    let listener: PluginListenerHandle | undefined;
    setup().then((l) => {
      listener = l;
    });

    return () => {
      listener?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const startFocusTimer = async () => {
    const anchorMillis = Date.now();
    startFocus();

    if (isNative) {
      await FlowmodoroPlugin.startFocus({ anchorMillis });
    }
  };

  const handleStartFocus = async () => {
    if (isNative) {
      pendingAction.current = "start-focus";

      const ok = await ensureAllPermissions();

      if (!ok) {
        return;
      }

      pendingAction.current = null;
    }

    startFocusTimer();
  };

  const handleStartBreak = async () => {
    const anchorMillis = Date.now();
    startBreak();

    if (isNative) {
      const normalizedRestRatio = restRatio / 100;
      await FlowmodoroPlugin.startBreak({
        anchorMillis,
        totalFocusMillis,
        restRatio: normalizedRestRatio,
      });
    }
  };

  const handleStopTimer = async ({ type }: { type: "focus" | "break" }) => {
    if (isNative) {
      await FlowmodoroPlugin.stopTimer();
    }

    if (type === "focus") {
      stopFocus();
    } else {
      showDefault({
        title: "Atenção!",
        message: "Tem certeza que deseja pular o intervalo?",
        confirmLabel: "Sim",
        cancelLabel: "Não",
        action: () => {
          skipBreak();
          hideModal();
        },
        cancel: () => hideModal,
      });
    }
  };

  const handleSelectedProject = useCallback(
    (project: ProjectDTO | null) => {
      setSelectedProjectId(project?.id ?? null);
      setSelectedTagId(null);
    },
    [setSelectedProjectId, setSelectedTagId],
  );

  const handleSelecteTag = useCallback(
    (tag: TagDTO | null) => {
      setSelectedTagId(tag?.id ?? null);
    },
    [setSelectedTagId],
  );

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
            ? "max-w-[300px] sm:max-w-[550px]"
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
          <div className="flex justify-between items-center flex-1">
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

            {isExpanded && (
              <button
                className={clsx(
                  "cursor-pointer rounded-md p-1 text-xl text-neutral-40",
                  "transition-colors duration-200",
                  "hover:text-neutral-20",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                )}
                type="button"
                title="Limpar texto"
                aria-label="Limpar texto"
                onClick={() => setSessionName("")}
              >
                <IoClose />
              </button>
            )}
          </div>
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
              <SessionSelector<ProjectDTO>
                value={selectedProject}
                onChange={handleSelectedProject}
                disabled={isTimerRunning}
                title="Projetos"
                variant="primary"
                items={projects}
                placeholder="Pesquisar projeto..."
                emptyMsg="Nenhum projeto encontrado"
                icon={projectIcon}
              >
                Projetos
              </SessionSelector>
            )}
            {showTagSelector && (
              <SessionSelector<TagDTO>
                value={selectedTag}
                onChange={handleSelecteTag}
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
                icon={tagIcon}
              >
                Tags
              </SessionSelector>
            )}
          </div>

          {mode === null ? (
            <button
              title="Iniciar foco"
              onClick={handleStartFocus}
              className={clsx(buttonClasses, !isExpanded && "hidden")}
            >
              <FaPlayCircle />
            </button>
          ) : mode === "focus" ? (
            <button
              title="Parar foco"
              onClick={() => handleStopTimer({ type: "focus" })}
              className={buttonClasses}
            >
              <FaStopCircle />
            </button>
          ) : mode === "stopped" ? (
            <button
              title="Iniciar pausa"
              onClick={handleStartBreak}
              className={buttonClasses}
            >
              <FaPlayCircle />
            </button>
          ) : (
            <button
              title="Pular pausa"
              onClick={() => handleStopTimer({ type: "break" })}
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
