import Stack from "../../../components/common/Stack";

const TimerContainer = ({ children }: { children: React.ReactNode }) => {
  return <Stack gap={0}>{children}</Stack>;
};

export default TimerContainer;
