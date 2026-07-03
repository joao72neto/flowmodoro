import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";
import { formatToHour } from "../../../../shared/utils/number.utils";
import { capitalize } from "../../../../shared/utils/string.utils";

import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";
import { useEffect, useState } from "react";
import { PRESETS } from "../../../timer/consts/ratio-presets";
import type { ISessionGroup, SessionResponse } from "../../api/sessions.types";
import SessionDetailsModal from "../SessionDetailsModal";
import Session from "./Session";
import Label from "../../../../shared/components/labels/Label";

import { GoProject } from "react-icons/go";
import { IoMdPricetag } from "react-icons/io";
import { sessionStorageKeys } from "../../../../shared/utils/storage.utils";

const SessionGroup = ({ sessionGroup }: { sessionGroup: ISessionGroup }) => {
  const [showSessionDetailsModal, setShowSessionDetailsModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionResponse>(
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
  const hasTagOrProject = tag || project;
  const showTagAndProject = hasTagOrProject;

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
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-between w-full">
            <div className="flex gap-3 items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {isTogglable && (
                  <span
                    className={clsx(
                      "cursor-pointer text-md sm:text-lg font-medium line-clamp-1",
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
                <span
                  className={clsx(
                    "text-sm sm:text-base bg-neutral-80/50 border border-border ",
                    "px-3 py-1 rounded-lg shadow font-semibold",
                    !isTogglable && preset?.textClass,
                  )}
                >
                  {formatToHour(sessionGroup.totalFocus)}
                </span>
              )}
            </div>

            {showTagAndProject && (
              <div className="flex justify-between gap-6 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  {project?.name && (
                    <Label icon={<GoProject />}>{project.name}</Label>
                  )}
                  {tag?.name && (
                    <Label variant="secondary" icon={<IoMdPricetag />}>
                      {tag.name}
                    </Label>
                  )}
                </div>

                <span
                  className={clsx(
                    "text-sm sm:text-base bg-neutral-80/50 border border-border ",
                    "px-3 py-1 rounded-lg shadow font-semibold",
                    !isTogglable && preset?.textClass,
                  )}
                >
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
