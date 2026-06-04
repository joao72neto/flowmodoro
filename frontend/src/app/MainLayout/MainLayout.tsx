import IconButton from "../../features/home/components/buttons/IconButton";
import SideBar from "./SideBar";
import MainContentContainer from "./MainContentContainer";

import { useTaskContext } from "../../features/task/task.context";
import { useNotificationPermission } from "../../shared/hooks/useNotificationPermission";
import SideBarContainer from "./SideBarContainer";

import { PiCaretLeftBold } from "react-icons/pi";
import clsx from "clsx";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useTaskContext();
  useNotificationPermission();

  return (
    <div className="relative min-h-screen flex overflow-x-hidden items-center">
      <MainContentContainer>{children}</MainContentContainer>

      <div
        className={clsx(
          "fixed inset-0 bg-black/50 backdrop-blur-lg z-20 transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      <SideBarContainer isOpen={isSidebarOpen}>
        <SideBar onClick={() => setIsSidebarOpen(false)} />
      </SideBarContainer>

      {!isSidebarOpen && (
        <div className="fixed top-0 right-0 p-4 z-10">
          <IconButton
            icon={
              <PiCaretLeftBold
                size={25}
                className="transition duration-200 hover:-translate-x-1"
              />
            }
            onClick={() => setIsSidebarOpen(true)}
          />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
