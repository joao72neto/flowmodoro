import Stack from "../../../../shared/components/Stack";

const SessionsGroup = ({
  children,
  groupName,
  totalFocus,
  totalRest,
}: {
  children: React.ReactNode;
  totalFocus: number | string;
  totalRest: number | string;
  groupName: string;
}) => {
  return (
    <Stack align="left" gap={4}>
      <p className="font-bold">
        {groupName}
        {totalFocus && totalRest && ` (${totalFocus} | ${totalRest})`}
      </p>
      {children}
    </Stack>
  );
};

export default SessionsGroup;
