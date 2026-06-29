import Skeleton from "../../../../shared/components/Skeleton";

const TagItemSkeleton = () => (
  <div className="p-4 rounded-xl bg-neutral-80/40 border border-border flex items-center justify-between">
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex items-center gap-2">
        <Skeleton className="h-[18px] w-[18px] rounded-full" />
        <Skeleton className="h-5 w-48" />
      </div>

      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-14" />
      </div>
    </div>

    <Skeleton className="h-8 w-8 rounded-md" />
  </div>
);

const TagsSkeleton = () => (
  <div className="flex flex-col gap-4">
    <TagItemSkeleton />
    <TagItemSkeleton />
    <TagItemSkeleton />
    <TagItemSkeleton />
  </div>
);

export default TagsSkeleton;
