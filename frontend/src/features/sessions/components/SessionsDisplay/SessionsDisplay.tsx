import DailySessions from "./DailySessions";

import { formatToBRDate } from "../../../../shared/utils/date.utils";
import { formatToHour } from "../../../../shared/utils/number.utils";
import PageSelector from "../../../../shared/components/PageSelector";
import { usePagination } from "../../../../shared/hooks/usePagination";
import EmptySessions from "./EmptySessions";
import { useFetchSessions } from "../../hooks/useSessionsApi";
import { useSessionContext } from "../../sessions.context";
import SessionsSkeleton from "./SessionsSkeleton";
import SessionsWrapper from "./SessionsWrapper";
import SessionGroup from "./SessionGroup";

const SessionsDisplay = () => {
  const SIZE = 7;

  const { isSaving, currentPage, setCurrentPage } = useSessionContext();

  const { data: sessions, isLoading: loading } = useFetchSessions({
    page: currentPage,
    size: SIZE,
  });

  const { totalPages, goToPage } = usePagination({
    itemsPerPage: SIZE,
    totalItems: sessions?.totalElements ?? 0,
    currentPage,
    setCurrentPage,
  });

  if (loading || !sessions || isSaving) {
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
                    key={`${sessionGroup.date}-${group.name}-${group.id}`}
                    sessionGroup={group}
                  />
                ))}
              </DailySessions>
            ))}
          </SessionsWrapper>

          {sessions.totalElements > SIZE && (
            <PageSelector
              goToPage={goToPage}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SessionsDisplay;
