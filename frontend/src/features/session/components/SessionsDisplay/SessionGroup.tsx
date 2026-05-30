import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";
import { formatToHour } from "../../../../shared/utils/number.utils";
import { capitalize } from "../../../../shared/utils/string.utils";
import type { ISessionGroup, SessionResponse } from "../../session.types";
import Session from "./Session";

import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";
import { useEffect, useState } from "react";
import SessionDetailsModal from "../SessionDetailsModal";
import { PRESETS } from "../../../home/ratio.const";

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
            "w-full bg-neutral-80/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/5",
            "shadow-xl transition-all hover:bg-neutral-60/20 cursor-pointer min-h-[80px]",
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
                    "break-all border border-white/10 rounded-lg px-3 py-1",
                    "hover:bg-black/20 transition-colors bg-black/30",
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
                "text-sm sm:text-base bg-white/10 border border-white/10 ",
                "px-3 py-1 rounded-lg shadow font-semibold",
                !isTogglable && preset?.textClass,
              )}
            >
              {formatToHour(sessionGroup.totalFocus)}
            </span>
          </Stack>
        </Stack>
        <AnimatedCollapse show={isOpen}>
          <Stack gap={4} className="border-white/5 w-full pt-4">
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
