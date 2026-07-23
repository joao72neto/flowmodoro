import DailySessions from "./DailySessions";

import { formatToBRDate } from "../../../../shared/utils/date.utils";
import { formatToHour } from "../../../../shared/utils/number.utils";
import PageSelector from "../../../../shared/components/PageSelector";
import { usePagination } from "../../../../shared/hooks/usePagination";
import EmptySessions from "./EmptySessions";
import { useSessionContext } from "../../context/sessions.context";
import SessionsSkeleton from "./SessionsSkeleton";
import SessionsWrapper from "./SessionsWrapper";
import SessionGroup from "./SessionGroup";
import { useFetchSessions } from "../../hooks/useSessions";
import { AnimatedList } from "../../../../shared/components/AnimatedList";

import { LayoutGroup } from "framer-motion";

const SessionsDisplay = () => {
  const SIZE = 7;
  const { currentPage, setCurrentPage } = useSessionContext();
  const { data: sessions, isLoading } = useFetchSessions({
    page: currentPage,
    size: SIZE,
  });
  const { totalPages, goToPage } = usePagination({
    itemsPerPage: SIZE,
    totalItems: sessions?.totalElements ?? 0,
    currentPage,
    setCurrentPage,
  });

  if (isLoading || !sessions) {
    return (
      <div className="flex flex-col gap-6 w-full items-center">
        <SessionsSkeleton />
      </div>
    );
  }

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-6 w-full items-center relative">
        {!sessions || sessions.content.length === 0 ? (
          <EmptySessions />
        ) : (
          <>
            <SessionsWrapper>
              {sessions.content.map((sessionGroup) => {
                return (
                  <DailySessions
                    key={sessionGroup.date}
                    groupName={formatToBRDate(sessionGroup.date)}
                    totalFocus={formatToHour(sessionGroup.totalFocus)}
                  >
                    <AnimatedList
                      items={sessionGroup.sessionGroups}
                      getKey={(group) => group.id}
                      className="w-full"
                      enableLayoutAnimation="position"
                    >
                      {(group) => (
                        <SessionGroup key={group.id} sessionGroup={group} />
                      )}
                    </AnimatedList>
                  </DailySessions>
                );
              })}
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
    </LayoutGroup>
  );
};

export default SessionsDisplay;
