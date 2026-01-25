import SessionsWrapper from "./elements/SessionsWrapper";
import SessionsGroup from "./elements/SessionsGroup";
import Session from "./elements/Session";

import { useSessionContext } from "../../../contexts/SessionContext";
import useSessions from "../../../hooks/services/useSessions";
import { useEffect } from "react";

const SessionsDisplay = () => {
  const { success } = useSessionContext();
  const { sessions, fetchSessions } = useSessions();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (success) fetchSessions();
  }, [success]);

  if (sessions.length === 0) return null;

  return (
    <SessionsWrapper>
      {sessions.map((sessionGroup) => (
        <SessionsGroup groupName={sessionGroup.date}>
          {sessionGroup.sessions.map((session) => (
            <Session activity={session.task.name} duration={session.focus} />
          ))}
        </SessionsGroup>
      ))}
    </SessionsWrapper>
  );
};

export default SessionsDisplay;
