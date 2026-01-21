import Stack from "../../../common/Stack";

const SessionsGroup = ({
  children,
  groupName,
}: {
  children: React.ReactNode;
  groupName: string;
}) => {
  return (
    <Stack align="left" gap={4}>
      <p className="font-bold">{groupName}</p>
      {children}
    </Stack>
  );
};

export default SessionsGroup;
