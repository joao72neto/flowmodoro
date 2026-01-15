import Counter from "../components/home/timer/Counter";
import Interruptions from "../components/home/timer/Interruptions";
import TaskSelector from "../components/home/timer/TaskSelector";
import MainLayout from "../layouts/MainLayout";

import Sessions from "../components/home/Sessions";
import TimerContainer from "../components/home/containers/TimerContainer";

function Home() {
  return (
    <MainLayout>
      <TimerContainer>
        <TaskSelector />
        <Interruptions />
        <Counter />
      </TimerContainer>
      <Sessions />
    </MainLayout>
  );
}

export default Home;
