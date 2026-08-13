import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";
import { formatToHour } from "../../../../shared/utils/number.utils";
import { capitalize } from "../../../../shared/utils/string.utils";

import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";
import { useEffect, useState, useCallback, memo } from "react";
import SessionDetailsModal from "../SessionDetailsModal";
import Session from "./Session";
import Label from "../../../../shared/components/labels/Label";

import { GoProject, GoChevronDown } from "react-icons/go";
import { IoMdPricetag } from "react-icons/io";
import { sessionStorageKeys } from "../../../../shared/utils/storage.utils";
import type { SessionDTO, SessionGroupDTO } from "../../dtos/sessions-response";

import { useTheme } from "../../../../shared/contexts/theme/theme.context";

const BORDER_COLORS: Record<number, string> = {
  10: "border-l-danger",
  20: "border-l-primary",
  30: "border-l-success",
};

const TOTAL_FOCUS_CLASSES = clsx(
  "flex items-center shrink-0 whitespace-nowrap text-sm sm:text-base bg-neutral-80/50",
  "border border-border px-3 py-1 rounded-lg shadow font-semibold",
);

const SessionGroup = memo(
  ({ sessionGroup }: { sessionGroup: SessionGroupDTO }) => {
    const [showSessionDetailsModal, setShowSessionDetailsModal] =
      useState(false);
    const [selectedSession, setSelectedSession] = useState<SessionDTO>(
      sessionGroup.sessions[0],
    );

    const { theme } = useTheme();

    useEffect(() => {
      setSelectedSession(sessionGroup.sessions[0]);
    }, [sessionGroup.sessions]);

    const storageKey = sessionStorageKeys.isSessionGroupOpen(sessionGroup.id);

    const [isOpen, setIsOpen] = useState(() => {
      return sessionStorage.getItem(storageKey) === "true";
    });

    const handleToggle = useCallback(() => {
      setIsOpen((prev) => {
        const next = !prev;
        sessionStorage.setItem(storageKey, String(next));
        return next;
      });
    }, [storageKey]);

    const isTogglable = sessionGroup.sessions.length > 1;

    useEffect(() => {
      if (!isTogglable) {
        setIsOpen(false);
        sessionStorage.removeItem(storageKey);
      }
    }, [isTogglable, storageKey]);

    const tag = sessionGroup.sessions[0].tag;
    const project = sessionGroup.sessions[0].project;
    const hasTagOrProject = tag.id !== "" || project.id !== "";
    const showTagAndProject = hasTagOrProject;

    const firstRatio = Math.round((sessionGroup.sessions[0]?.ratio || 0) * 100);

    const isUniform = sessionGroup.sessions.every(
      (session) => Math.round(session.ratio * 100) === firstRatio,
    );

    const borderColorClass = isUniform ? BORDER_COLORS[firstRatio] : undefined;

    const handleDetails = useCallback(
      (sessionId: string) => {
        const session = sessionGroup.sessions.find((s) => s.id === sessionId);
        if (session) {
          setSelectedSession(session);
          setShowSessionDetailsModal(true);
        }
      },
      [sessionGroup.sessions],
    );

    return (
      <>
        <div className="flex flex-col w-full">
          <Stack
            className={clsx(
              "w-full shadow-lg rounded-2xl p-4 sm:p-5 border border-border relative overflow-hidden",
              "transition-transform hover:bg-neutral-80/40 hover:translate-x-0.5 cursor-pointer min-h-[80px]",
              isOpen
                ? "bg-neutral-80/40 border-neutral-70/50"
                : "bg-neutral-80/90",
              "border-l-4",
              "contain-content",
              borderColorClass,
            )}
            direction="row"
            gap={3}
            onClick={
              isTogglable
                ? handleToggle
                : () => setShowSessionDetailsModal(true)
            }
          >
            <div className="flex flex-col w-full gap-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full">
                <div className="flex gap-3 items-center justify-between sm:justify-start w-full sm:w-auto sm:flex-1 min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    {isTogglable && (
                      <span
                        className={clsx(
                          "text-sm font-semibold px-3 py-1.5 rounded-full border border-border",
                          "bg-neutral-60/30 text-neutral-30 shrink-0",
                        )}
                      >
                        {sessionGroup.sessions.length}
                      </span>
                    )}

                    <span className="text-lg sm:text-xl font-medium line-clamp-1 break-all">
                      {capitalize(sessionGroup.name)}
                    </span>
                  </div>
                </div>
              </div>

              {showTagAndProject && (
                <div className="flex self-start items-center gap-2 min-w-0 sm:flex-1">
                  {project?.name && (
                    <Label icon={<GoProject />}>{project.name}</Label>
                  )}
                  {tag?.name && (
                    <Label variant="secondary" icon={<IoMdPricetag />}>
                      {tag.name}
                    </Label>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className={TOTAL_FOCUS_CLASSES}>
                {formatToHour(sessionGroup.totalFocus)}
              </span>

              <GoChevronDown
                className={clsx(
                  "text-neutral-40 transition-transform duration-200 text-lg",
                  isOpen && "rotate-180",
                  !isTogglable && "opacity-0",
                )}
              />
            </div>
          </Stack>

          <AnimatedCollapse show={isOpen}>
            <Stack
              gap={2}
              className={clsx(
                "mt-2 ml-5 border-l border-border pl-4",
                theme === "light" && "pb-4",
              )}
              style={{
                contentVisibility: "auto",
                containIntrinsicSize: "0 60px",
              }}
            >
              <div className="w-full px-1 flex flex-col gap-2">
                {sessionGroup.sessions.map((session) => (
                  <Session
                    key={session.id}
                    session={session}
                    onClick={handleDetails}
                  />
                ))}
              </div>
            </Stack>
          </AnimatedCollapse>
        </div>

        {showSessionDetailsModal && (
          <SessionDetailsModal
            isOpen={showSessionDetailsModal}
            setIsOpen={setShowSessionDetailsModal}
            session={selectedSession}
          />
        )}
      </>
    );
  },
);

SessionGroup.displayName = "SessionGroup";

export default SessionGroup;
