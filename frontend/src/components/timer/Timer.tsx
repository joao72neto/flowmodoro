import Button from "../button/Button";

function Timer() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <p className="text-2xl">Flowmodoro</p>
      <div className="flex flex-col justify-center items-center border-2 border-white/25 rounded-full p-20 m-8 w-65 h-65 cursor-pointer">
        <p className="text-5xl text-center">00:00</p>
      </div>
      <Button icon={<i className="bi bi-play-fill"></i>} />
    </div>
  );
}

export default Timer;
