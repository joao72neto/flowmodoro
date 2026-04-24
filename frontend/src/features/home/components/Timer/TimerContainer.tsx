import Stack from "../../../../shared/components/Stack";

const TimerContainer = ({ children }: { children: React.ReactNode }) => {
  return <Stack gap={10}>{children}</Stack>;
};

export default TimerContainer;
