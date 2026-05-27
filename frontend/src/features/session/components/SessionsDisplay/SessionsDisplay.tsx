import SessionsWrapper from "./SessionsWrapper";
import DailySessions from "./DailySessions";
import SessionGroup from "./SessionGroup";

import { useSessionContext } from "../../session.context";
import { useEffect } from "react";
import { formatToBRDate } from "../../../../shared/utils/date.utils";
import { formatToHour } from "../../../../shared/utils/number.utils";
import { useTaskContext } from "../../../task/task.context";
import PageSelector from "../../../../shared/components/PageSelector";
import { usePagination } from "../../../../shared/hooks/usePagination";
import EmptySessions from "./EmptySessions";
import SessionsSkeleton from "./SessionsSkeleton";

const SessionsDisplay = () => {
  const { success, sessions, fetchSessions, loading, refreshToggle } =
    useSessionContext();
  const { wasTaskDeleted } = useTaskContext();

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
  }, [currentPage, SIZE, fetchSessions, refreshToggle]);

  useEffect(() => {
    if (success || wasTaskDeleted) {
      goToPage(1);
      fetchSessions(1, SIZE);
    }
  }, [success, wasTaskDeleted, fetchSessions, goToPage]);

  if (loading || !sessions) {
    return (
      <div className="flex flex-col gap-6 w-full items-center">
        <SessionsSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full items-center relative">
      {!sessions || sessions.content.length === 0 ? (
        <EmptySessions />
      ) : (
        <>
          <SessionsWrapper>
            {sessions.content.map((sessionGroup) => (
              <DailySessions
                key={sessionGroup.date}
                groupName={formatToBRDate(sessionGroup.date)}
                totalFocus={formatToHour(sessionGroup.totalFocus)}
              >
                {sessionGroup.sessionGroups.map((group) => (
                  <SessionGroup
                    key={`${sessionGroup.date}-${group.name}`}
                    sessionGroup={group}
                  />
                ))}
              </DailySessions>
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
