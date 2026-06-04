import Timer from "./components/Timer/Timer";
import TaskSelector from "../task/components/TaskSelector";
import MainLayout from "../../app/MainLayout/MainLayout";

import SessionsDisplay from "../session/components/SessionsDisplay/SessionsDisplay";
import TimerContainer from "./components/Timer/TimerContainer";
import RatioSelector from "./components/RatioSelector/RatioSelector";

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
