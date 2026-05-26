import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";
import { formatToHour } from "../../../../shared/utils/number.utils";
import { capitalize } from "../../../../shared/utils/string.utils";
import type { ISessionGroup, SessionResponse } from "../../session.types";
import Session from "./Session";

import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";
import { useEffect, useState } from "react";
import SessionDetailsModal from "../SessionDetailsModal";

const SessionGroup = ({ sessionGroup }: { sessionGroup: ISessionGroup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSessionDetailsModal, setShowSessionDetailsModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionResponse>(
    sessionGroup.sessions[0],
  );

  const handleToggle = () => setIsOpen(!isOpen);
  const isTogglable = sessionGroup.sessions.length > 1;

  useEffect(() => {
    if (!isTogglable) {
      setIsOpen(false);
    }
  }, [isTogglable]);

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <Stack
          className={clsx(
            "w-full bg-white/4 rounded-xl p-3 sm:p-4 border border-white/10",
            "shadow-xl transition-colors hover:bg-white/3 cursor-pointer",
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
                    "cursor-pointer text-lg sm:text-xl font-medium line-clamp-1",
                    "break-all border border-white/10 rounded-lg px-3 py-1",
                    "hover:bg-black/20 transition-colors bg-black/10",
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
              )}
            >
              {formatToHour(sessionGroup.totalFocus)}
            </span>
          </Stack>
        </Stack>
        <AnimatedCollapse show={isOpen}>
          <Stack gap={2} className="px-1 border-white/5 w-full">
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
