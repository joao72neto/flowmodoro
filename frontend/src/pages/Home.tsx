import Timer from "../components/home/timer/Counter";
import Interruptions from "../components/home/timer/Interruptions";
import TaskSelector from "../components/home/timer/TaskSelector";
import MainLayout from "../layouts/MainLayout";

function Home() {
  return (
    <MainLayout>
      <TaskSelector />
      <Interruptions />
      <Timer />
    </MainLayout>
  );
}

export default Home;
