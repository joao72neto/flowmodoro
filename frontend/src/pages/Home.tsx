import Timer from "../components/home/Timer";
import Interruptions from "../components/home/Interruptions";
import TaskSelector from "../components/home/TaskSelector";
import SideBar from "../components/home/SideBar";
import { useState } from "react";

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      <div
        className={`flex flex-col items-center justify-center min-h-screen p-6 transition-w duration-300 ${
          isSidebarOpen ? "w-2/3" : "w-full"
        }`}
      >
        <TaskSelector />
        <Interruptions />
        <Timer />
      </div>
      <div
        className={`fixed top-0 right-0 w-1/3 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <SideBar onClick={() => setIsSidebarOpen(!isSidebarOpen)}></SideBar>
      </div>
    </div>
  );
}

export default Home;
