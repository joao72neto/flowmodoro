import Timer from "./components/Timer/Timer";
import TaskSelector from "../task/components/TaskSelector";
import MainLayout from "../../app/MainLayout/MainLayout";

import SessionsDisplay from "../session/components/SessionsDisplay/SessionsDisplay";
import TimerContainer from "./components/Timer/TimerContainer";
import RatioSlider from "./components/RatioSlider";

import { IoIosSettings } from "react-icons/io";
import { PiCaretUpLight } from "react-icons/pi";

import { AnimatedCollapse } from "../../shared/components/AnimatedCollapse";
import clsx from "clsx";
import { useState } from "react";

function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MainLayout>
      <TimerContainer>
        <TaskSelector />
        <Timer />
      </TimerContainer>

      <div className="flex flex-col items-center">
        <button
          type="button"
          className={clsx(
            "group flex items-center justify-center cursor-pointer",
            "h-10 px-2 rounded-lg transition-colors duration-200",
          )}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? (
            <PiCaretUpLight size={30} className="shrink-0" />
          ) : (
            <IoIosSettings size={30} className="shrink-0" />
          )}

          {!isOpen && (
            <span
              className={clsx(
                "transition-all duration-300 ease-out",
                "overflow-hidden whitespace-nowrap",
                "max-w-0 opacity-0 ml-0",
                "group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-2",
              )}
            >
              Configurar intensidade
            </span>
          )}
        </button>
        <AnimatedCollapse show={isOpen}>
          <RatioSlider />
        </AnimatedCollapse>
      </div>

      <SessionsDisplay />
    </MainLayout>
  );
}

export default Home;
