import Timer from "../components/home/Timer";
import Interruptions from "../components/home/Interruptions";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Interruptions />
      <Timer />
    </div>
  );
}

export default Home;
