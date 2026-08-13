import DailySessions from "./DailySessions";

import { formatToBRDate } from "../../../../shared/utils/date.utils";
import { formatToHour } from "../../../../shared/utils/number.utils";
import PageSelector from "../../../../shared/components/PageSelector";
import { usePagination } from "../../../../shared/hooks/usePagination";
import EmptySessions from "./EmptySessions";
import { useSessionContext } from "../../context/sessions.context";
import SessionsWrapper from "./SessionsWrapper";
import SessionGroup from "./SessionGroup";
import { useFetchSessions } from "../../hooks/useSessions";
import { AnimatedList } from "../../../../shared/components/AnimatedList";

import { LayoutGroup, animate } from "framer-motion";
import { useRef } from "react";

const SessionsDisplay = () => {
  const SIZE = 7;
  const { currentPage, setCurrentPage } = useSessionContext();
  const { data: sessions } = useFetchSessions({
    page: currentPage,
    size: SIZE,
  });
  const { totalPages, goToPage } = usePagination({
    itemsPerPage: SIZE,
    totalItems: sessions?.totalElements ?? 0,
    currentPage,
    setCurrentPage,
  });

  const paginationRef = useRef<HTMLDivElement>(null);

  const handleScrollToPage = (page: number) => {
    goToPage(page);
    animate(window.scrollY, 550, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (value) => window.scrollTo(0, value),
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full items-center relative">
      {!sessions || sessions.content.length === 0 ? (
        <EmptySessions />
      ) : (
        <>
          <SessionsWrapper ref={paginationRef}>
            {sessions.content.map((sessionGroup) => {
              return (
                <LayoutGroup id={sessionGroup.date} key={sessionGroup.date}>
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
                </LayoutGroup>
              );
            })}
          </SessionsWrapper>
          {sessions.totalElements > SIZE && (
            <PageSelector
              goToEndPage={() => handleScrollToPage(totalPages)}
              goToPage={(page) => handleScrollToPage(page)}
              goToStartPage={() => handleScrollToPage(1)}
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
