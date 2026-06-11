import Timer from "../features/timer/components/Timer/Timer";
import MainLayout from "./MainLayout/MainLayout";

import TimerContainer from "../features/timer/components/Timer/TimerContainer";
import RatioSelector from "../features/timer/components/RatioSelector/RatioSelector";
import SessionsDisplay from "../features/sessions/components/SessionsDisplay/SessionsDisplay";

function Home() {
  return (
    <MainLayout>
      <TimerContainer>
        <Timer />
      </TimerContainer>

      <RatioSelector />

      <SessionsDisplay />
    </MainLayout>
  );
}

export default Home;
