import SessionsWrapper from "./SessionsWrapper";
import SessionsGroup from "./SessionsGroup";
import Session from "./Session";

import { useSessionContext } from "../../contexts/SessionContext";
import useSessions from "../../hooks/useSessions";
import { useEffect } from "react";
import { formatToBRDate } from "../../../../shared/utils/date.utils";
import { formatToHour } from "../../../../shared/utils/number.utils";
import { useTaskContext } from "../../../task/contexts/TaskContext";

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

  if (sessions?.content.length === 0) return null;

  return (
    <SessionsWrapper>
      {sessions &&
        sessions.content.map((sessionGroup) => (
          <SessionsGroup
            groupName={formatToBRDate(sessionGroup.date)}
            totalFocus={formatToHour(sessionGroup.totalFocus)}
            totalRest={formatToHour(sessionGroup.totalRest)}
          >
            {sessionGroup.sessions.map((session, index) => (
              <Session key={index} session={session} />
            ))}
          </SessionsGroup>
        ))}
    </SessionsWrapper>
  );
};

export default SessionsDisplay;
