import SessionsWrapper from "./SessionsWrapper";
import SessionsGroup from "./SessionsGroup";
import Session from "./Session";

import { useSessionContext } from "../../contexts/SessionContext";
import useSessions from "../../hooks/useSessions";
import { useEffect } from "react";
import { formatToBRDate } from "../../../../shared/utils/date.utils";
import { formatToHour } from "../../../../shared/utils/number.utils";
import { useTaskContext } from "../../../task/contexts/TaskContext";
import PageSelector from "../../../../shared/components/PageSelector";
import { usePagination } from "../../../../shared/hooks/usePagination";

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
    }
  }, [success, wasTaskDeleted, fetchSessions]);

  const {
    currentPage,
    prevPage,
    nextPage,
    totalPages,
    goToPage,
    hasNextPage,
    hasPrevPage,
  } = usePagination({
    initialPage: 1,
    itemsPerPage: 10,
    totalItems: sessions?.totalElements ?? 0,
  });

  if (sessions?.content.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full items-center">
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

      <PageSelector
        goToPage={goToPage}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        currentPage={currentPage}
        prevPage={prevPage}
        nextPage={nextPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default SessionsDisplay;
