import Timer from "../components/home/Timer";
import Interruptions from "../components/home/Interruptions";
import Tasks from "../components/home/Tasks";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl mb-8">Flowmodoro Timer</h1>
      <Timer />
      <Interruptions />
      <Tasks />
    </div>
  );
}

export default Home;
