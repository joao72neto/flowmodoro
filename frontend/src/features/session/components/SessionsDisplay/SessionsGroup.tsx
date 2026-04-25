import clsx from "clsx";
import Stack from "../../../../shared/components/Stack";

const SessionsGroup = ({
  children,
  groupName,
  totalFocus,
}: {
  children: React.ReactNode;
  totalFocus: number | string;
  groupName: string;
}) => {
  return (
    <Stack className="w-full" gap={4}>
      <p
        className={clsx(
          "flex justify-between items-center gap-2 w-full",
          "font-bold text-neutral-20 border-b border-white/10 pb-1",
        )}
      >
        <span className="uppercase">{groupName}</span>
        <span>{totalFocus}</span>
      </p>
      {children}
    </Stack>
  );
};

export default SessionsGroup;
