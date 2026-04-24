import Timer from "./components/Timer/Timer";
import TaskSelector from "../task/components/TaskSelector";
import MainLayout from "../../app/MainLayout/MainLayout";

import SessionsDisplay from "../session/components/SessionsDisplay/SessionsDisplay";
import TimerContainer from "./components/Timer/TimerContainer";
import RatioSlider from "./components/RatioSlider";

function Home() {
  return (
    <MainLayout>
      <TimerContainer>
        <TaskSelector />
        <Timer />
      </TimerContainer>
      <RatioSlider />
      <SessionsDisplay />
    </MainLayout>
  );
}

export default Home;
