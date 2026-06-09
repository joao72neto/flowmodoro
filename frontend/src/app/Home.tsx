import Timer from "../features/timer/components/Timer/Timer";
import MainLayout from "./MainLayout/MainLayout";

import TimerContainer from "../features/timer/components/Timer/TimerContainer";
import RatioSelector from "../features/timer/components/RatioSelector/RatioSelector";
import TaskSelector from "../features/tasks/components/TaskSelector";
import SessionsDisplay from "../features/sessions/components/SessionsDisplay/SessionsDisplay";

function Home() {
  return (
    <MainLayout>
      <TimerContainer>
        <TaskSelector />
        <Timer />
      </TimerContainer>

      <RatioSelector />

      <SessionsDisplay />
    </MainLayout>
  );
}

export default Home;
