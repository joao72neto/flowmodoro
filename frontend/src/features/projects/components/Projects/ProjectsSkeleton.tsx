import Skeleton from "../../../../shared/components/Skeleton";

const ProjectItemSkeleton = () => (
  <div className="p-4 rounded-xl bg-neutral-80/40 border border-border flex items-center justify-between">
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex items-center gap-2">
        <Skeleton className="h-[18px] w-[18px] rounded-full" />
        <Skeleton className="h-5 w-48" />
      </div>

      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-3 w-1 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>

    <Skeleton className="h-8 w-8 rounded-md" />
  </div>
);

const ProjectsSkeleton = () => (
  <div className="flex flex-col gap-4">
    <ProjectItemSkeleton />
    <ProjectItemSkeleton />
    <ProjectItemSkeleton />
    <ProjectItemSkeleton />
  </div>
);

export default ProjectsSkeleton;
