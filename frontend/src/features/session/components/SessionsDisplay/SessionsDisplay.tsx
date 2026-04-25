import SessionsWrapper from "./SessionsWrapper";
import SessionsGroup from "./SessionsGroup";
import Session from "./Session";

import { useSessionContext } from "../../session.context";
import useSessions from "../../useSession";
import { useEffect } from "react";
import { formatToBRDate } from "../../../../shared/utils/date.utils";
import { formatToHour } from "../../../../shared/utils/number.utils";
import { useTaskContext } from "../../../task/task.context";
import PageSelector from "../../../../shared/components/PageSelector";
import { usePagination } from "../../../../shared/hooks/usePagination";
import EmptySessions from "./EmptySessions";

const SessionsDisplay = () => {
  const { success } = useSessionContext();
  const { wasTaskDeleted } = useTaskContext();
  const { sessions, fetchSessions } = useSessions();

  const SIZE = 4;

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
    itemsPerPage: SIZE,
    totalItems: sessions?.totalElements ?? 0,
  });

  useEffect(() => {
    fetchSessions(currentPage, SIZE);
  }, [currentPage, SIZE, fetchSessions]);

  useEffect(() => {
    if (success || wasTaskDeleted) {
      goToPage(1);
      fetchSessions(1, SIZE);
    }
  }, [success, wasTaskDeleted, fetchSessions, goToPage]);

  return (
    <div className="flex flex-col gap-6 w-full items-center">
      {!sessions || sessions.content.length === 0 ? (
        <EmptySessions />
      ) : (
        <>
          <SessionsWrapper>
            {sessions.content.map((sessionGroup) => (
              <SessionsGroup
                key={sessionGroup.date}
                groupName={formatToBRDate(sessionGroup.date)}
                totalFocus={formatToHour(sessionGroup.totalFocus)}
              >
                {sessionGroup.sessions.map((session, index) => (
                  <Session key={index} session={session} />
                ))}
              </SessionsGroup>
            ))}
          </SessionsWrapper>

          {sessions.totalElements > SIZE && (
            <PageSelector
              goToPage={goToPage}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              currentPage={currentPage}
              prevPage={prevPage}
              nextPage={nextPage}
              totalPages={totalPages}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SessionsDisplay;
