import Timer from "../components/home/Timer";
import Interruptions from "../components/home/Interruptions";
import TaskSelector from "../components/home/TaskSelector";
import MainLayout from "../layouts/MainLayout";

function Home() {
  return (
    <>
      <MainLayout>
        <TaskSelector />
        <Interruptions />
        <Timer />
      </MainLayout>
    </>
  );
}

export default Home;
