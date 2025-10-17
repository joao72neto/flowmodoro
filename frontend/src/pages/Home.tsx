import Timer from "../components/home/Timer";
import Interruptions from "../components/home/Interruptions";
import TaskSelector from "../components/home/TaskSelector";
import SideBar from "../components/home/SideBar";

function Home() {
  return (
    <div className="flex">
      <div className="flex flex-col items-center justify-center min-h-screen p-6 w-full">
        <TaskSelector />
        <Interruptions />
        <Timer />
      </div>
      <div className="w-150">
        <SideBar></SideBar>
      </div>
    </div>
  );
}

export default Home;
