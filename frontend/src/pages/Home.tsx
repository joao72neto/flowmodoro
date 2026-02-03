import Timer from "../components/home/timer/Timer";
import Interruptions from "../components/home/timer/Interruptions";
import TaskSelector from "../components/home/timer/TaskSelector";
import MainLayout from "../layouts/MainLayout";

import SessionsDisplay from "../components/home/sessions/SessionsDisplay";
import TimerContainer from "../components/home/containers/TimerContainer";

function Home() {
  return (
    <MainLayout>
      <TimerContainer>
        <TaskSelector />
        <Interruptions />
        <Timer />
      </TimerContainer>

      <SessionsDisplay />
    </MainLayout>
  );
}

export default Home;
