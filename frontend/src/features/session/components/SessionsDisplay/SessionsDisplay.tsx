import SessionsWrapper from "./SessionsWrapper";
import DailySessions from "./DailySessions";
import SessionGroup from "./SessionGroup";

import { formatToBRDate } from "../../../../shared/utils/date.utils";
import { formatToHour } from "../../../../shared/utils/number.utils";
import PageSelector from "../../../../shared/components/PageSelector";
import { usePagination } from "../../../../shared/hooks/usePagination";
import EmptySessions from "./EmptySessions";
import SessionsSkeleton from "./SessionsSkeleton";
import { useFetchSessions } from "../../useSession";
import { useState } from "react";
import { useSessionContext } from "../../session.context";

const SessionsDisplay = () => {
  const SIZE = 5;

  const [currentPage, setCurrentPage] = useState(1);

  const { isSaving } = useSessionContext();

  const { data: sessions, isLoading: loading } = useFetchSessions({
    page: currentPage,
    size: SIZE,
  });

  const { prevPage, nextPage, totalPages, goToPage, hasNextPage, hasPrevPage } =
    usePagination({
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
