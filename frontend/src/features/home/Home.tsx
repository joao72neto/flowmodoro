import Timer from "./components/Timer";
import Interruptions from "./components/Interruptions";
import TaskSelector from "./components/tasks/TaskSelector";
import MainLayout from "../../layouts/MainLayout";

import SessionsDisplay from "../session/components/SessionsDisplay";
import TimerContainer from "./components/TimerContainer";

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
