import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";
import { formatToHour } from "../../../../shared/utils/number.utils";
import { capitalize } from "../../../../shared/utils/string.utils";

import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";
import { useEffect, useState } from "react";
import { PRESETS } from "../../../timer/consts/ratio-presets";
import SessionDetailsModal from "../SessionDetailsModal";
import Session from "./Session";
import Label from "../../../../shared/components/labels/Label";

import { GoProject } from "react-icons/go";
import { IoMdPricetag } from "react-icons/io";
import { sessionStorageKeys } from "../../../../shared/utils/storage.utils";
import type { SessionDTO, SessionGroupDTO } from "../../offline/session.dtos";

const SessionGroup = ({ sessionGroup }: { sessionGroup: SessionGroupDTO }) => {
  const [showSessionDetailsModal, setShowSessionDetailsModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionDTO>(
    sessionGroup.sessions[0],
  );

  useEffect(() => {
    setSelectedSession(sessionGroup.sessions[0]);
  }, [sessionGroup.sessions]);

  const storageKey = sessionStorageKeys.isSessionGroupOpen(sessionGroup.id);

  const [isOpen, setIsOpen] = useState(() => {
    return sessionStorage.getItem(storageKey) === "true";
  });

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      sessionStorage.setItem(storageKey, String(next));
      return next;
    });
  };

  const isTogglable = sessionGroup.sessions.length > 1;

  useEffect(() => {
    if (!isTogglable) {
      setIsOpen(false);
      sessionStorage.removeItem(storageKey);
    }
  }, [isTogglable]);

  const preset = PRESETS.find(
    (preset) => preset.value === sessionGroup.sessions[0].ratio * 100,
  );

  const tag = sessionGroup.sessions[0].tag;
  const project = sessionGroup.sessions[0].project;
  const hasTagOrProject = tag.id !== "" || project.id !== "";
  const showTagAndProject = hasTagOrProject;

  const totalFocusClasses = clsx(
    "flex items-center shrink-0 whitespace-nowrap text-sm sm:text-base bg-neutral-80/50",
    "border border-border px-3 py-1 rounded-lg shadow font-semibold",
  );

  return (
    <>
      <div className="flex flex-col w-full">
        <Stack
          className={clsx(
            "w-full shadow-lg bg-neutral-80/90 rounded-2xl p-4 sm:p-5 border border-border",
            "transition-all hover:bg-neutral-80/50 cursor-pointer min-h-[80px]",
          )}
          gap={3}
          onClick={
            isTogglable ? handleToggle : () => setShowSessionDetailsModal(true)
          }
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full">
            <div className="flex gap-3 items-center justify-between sm:justify-start w-full sm:w-auto sm:flex-1 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={clsx(
                    "w-1 h-1 rounded-full shrink-0",
                    preset?.bgClass,
                  )}
                />

                {isTogglable && (
                  <span
                    className={clsx(
                      "cursor-pointer text-md sm:text-lg font-medium line-clamp-1 shrink-0",
                      "break-all border border-border rounded-lg px-3 py-1",
                      "hover:bg-neutral-60/50 transition-colors bg-neutral-60/50",
                    )}
                    title="Expandir sessões"
                  >
                    {sessionGroup.sessions.length}
                  </span>
                )}

                <span className="text-lg sm:text-xl font-medium line-clamp-1 break-all">
                  {capitalize(sessionGroup.name)}
                </span>
              </div>
              {!showTagAndProject && (
                <span className={clsx(totalFocusClasses, "sm:ml-auto")}>
                  {formatToHour(sessionGroup.totalFocus)}
                </span>
              )}
            </div>

            {showTagAndProject && (
              <div className="flex justify-between w-full sm:w-auto sm:flex-1 sm:justify-end sm:items-center sm:gap-6 min-w-0">
                <div className="flex items-center gap-2 min-w-0 sm:flex-1 justify-start">
                  {project?.name && (
                    <Label icon={<GoProject />}>{project.name}</Label>
                  )}
                  {tag?.name && (
                    <Label variant="secondary" icon={<IoMdPricetag />}>
                      {tag.name}
                    </Label>
                  )}
                </div>

                <span className={clsx(totalFocusClasses)}>
                  {formatToHour(sessionGroup.totalFocus)}
                </span>
              </div>
            )}
          </div>
        </Stack>
        <AnimatedCollapse show={isOpen}>
          <Stack gap={2} className="border-border w-full pt-2">
            {sessionGroup.sessions.map((session) => (
              <Session
                key={session.id}
                session={session}
                onClick={() => {
                  setSelectedSession(session);
                  setShowSessionDetailsModal(true);
                }}
              />
            ))}
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
};

export default SessionGroup;
