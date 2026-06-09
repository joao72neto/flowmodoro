import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";
import { formatToHour } from "../../../../shared/utils/number.utils";
import { capitalize } from "../../../../shared/utils/string.utils";

import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";
import { useEffect, useState } from "react";
import { PRESETS } from "../../../timer/ratio.const";
import type { ISessionGroup, SessionResponse } from "../../sessions.types";
import SessionDetailsModal from "../SessionDetailsModal";
import Session from "./Session";

const SessionGroup = ({ sessionGroup }: { sessionGroup: ISessionGroup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSessionDetailsModal, setShowSessionDetailsModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionResponse>(
    sessionGroup.sessions[0],
  );

  useEffect(() => {
    setSelectedSession(sessionGroup.sessions[0]);
  }, [sessionGroup.sessions]);

  const handleToggle = () => setIsOpen(!isOpen);
  const isTogglable = sessionGroup.sessions.length > 1;

  useEffect(() => {
    if (!isTogglable) {
      setIsOpen(false);
    }
  }, [isTogglable]);

  const preset = PRESETS.find(
    (preset) => preset.value === sessionGroup.sessions[0].ratio * 100,
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
          <Stack
            direction="row"
            justify="between"
            align="center"
            className="w-full"
          >
            <div className="flex gap-3 items-center">
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
            <span
              className={clsx(
                "text-sm sm:text-base bg-neutral-80/50 border border-border ",
                "px-3 py-1 rounded-lg shadow font-semibold",
                !isTogglable && preset?.textClass,
              )}
            >
              {formatToHour(sessionGroup.totalFocus)}
            </span>
          </Stack>
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
