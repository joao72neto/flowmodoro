import Timer from "./components/Timer";
import Interruptions from "./components/Interruptions";
import TaskSelector from "../task/components/TaskSelector";
import MainLayout from "../../app/layout";

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
