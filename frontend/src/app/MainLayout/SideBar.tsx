import IconButton from "../../shared/components/buttons/IconButton";

import { IoClose } from "react-icons/io5";
import ThemeToggle from "../../shared/components/ThemeToggle";

import Projects from "../../features/projects/components/Projects/Projects";

const SideBar = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div className="border-l bg-neutral-100 border-l-border h-screen shadow-2xl flex flex-col">
      <div className="flex justify-between items-center px-3 py-3 border-b border-border">
        <div className="flex items-center gap-4">
          <IconButton
            icon={
              <IoClose
                size={26}
                className="text-neutral-20 hover:text-danger hover:rotate-90 transition-all duration-300"
              />
            }
            onClick={onClick}
          />
          <h1 className="text-2xl text-neutral-20">Projetos e Tags</h1>
        </div>
        <ThemeToggle />
      </div>
      <div className="flex-1 min-h-0">
        <Projects />
      </div>
    </div>
  );
};

export default SideBar;
