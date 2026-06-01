import Skeleton from "../../../../shared/components/Skeleton";
import Stack from "../../../../shared/components/Stack";
import SessionsWrapper from "./SessionsWrapper";

const SessionItemSkeleton = () => (
  <div className="w-full border border-border p-3 sm:p-4 rounded-xl bg-neutral-60/50">
    <Stack direction="row" justify="between" align="center">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-7 w-16 rounded-lg" />
    </Stack>
  </div>
);

const SessionsGroupSkeleton = () => (
  <Stack className="w-full" gap={4}>
    <div className="flex justify-between items-center w-full border-y p-4 border-border bg-neutral-80/50">
      <div className="flex items-center gap-3 w-1/3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-5 w-full" />
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
    <div className="py-1 px-1.5 sm:px-2 w-full">
      <Stack gap={4}>
        <SessionItemSkeleton />
        <SessionItemSkeleton />
      </Stack>
    </div>
  </Stack>
);

const SessionsSkeleton = () => {
  return (
    <SessionsWrapper>
      <SessionsGroupSkeleton />
      <SessionsGroupSkeleton />
    </SessionsWrapper>
  );
};

export default SessionsSkeleton;
