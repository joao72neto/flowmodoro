import SessionsWrapper from "./elements/SessionsWrapper";
import SessionsGroup from "./elements/SessionsGroup";
import Session from "./elements/Session";

import { useSessionContext } from "../../../contexts/SessionContext";
import useSessions from "../../../hooks/services/useSessions";
import { useEffect } from "react";
import { formatToBRDate } from "../../../utils/date.utils";
import { formatToHour } from "../../../utils/number.utils";
import { useTaskContext } from "../../../contexts/TaskContext";

const SessionsDisplay = () => {
  const { success } = useSessionContext();
  const { wasTaskDeleted } = useTaskContext();
  const { sessions, fetchSessions } = useSessions();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (success || wasTaskDeleted) {
      fetchSessions();
      console.log("fetching sessions");
    }
  }, [success, wasTaskDeleted, fetchSessions]);

  if (sessions.length === 0) return null;

  return (
    <SessionsWrapper>
      {sessions.map((sessionGroup) => (
        <SessionsGroup
          groupName={formatToBRDate(sessionGroup.date)}
          totalFocus={formatToHour(sessionGroup.totalFocus)}
          totalRest={formatToHour(sessionGroup.totalRest)}
        >
          {sessionGroup.sessions.map((session) => (
            <Session activity={session.task.name} duration={session.focus} />
          ))}
        </SessionsGroup>
      ))}
    </SessionsWrapper>
  );
};

export default SessionsDisplay;
