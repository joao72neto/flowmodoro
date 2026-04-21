import IconButton from "../../features/home/components/buttons/IconButton";
import SideBar from "./SideBar";

import LayoutContainer from "./LayoutContainer";
import MainContentContainer from "./MainContentContainer";

import { useTaskContext } from "../../features/task/contexts/TaskContext";
import { useNotificationPermission } from "../../shared/hooks/useNotificationPermission";
import SideBarContainer from "./SideBarContainer";
import ToggleButtonContainer from "./ToggleButtonContainer";

import { PiCaretLeftBold } from "react-icons/pi";
import clsx from "clsx";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useTaskContext();
  useNotificationPermission();

  return (
    <LayoutContainer>
      <MainContentContainer isOpen={isSidebarOpen}>
        {children}
      </MainContentContainer>

      <SideBarContainer isOpen={isSidebarOpen}>
        <SideBar onClick={() => setIsSidebarOpen(!isSidebarOpen)}></SideBar>
      </SideBarContainer>

      <ToggleButtonContainer>
        <IconButton
          icon={
            <PiCaretLeftBold
              size={25}
              className={clsx("transition duration-200 hover:-translate-x-1")}
            />
          }
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </ToggleButtonContainer>
    </LayoutContainer>
  );
};

export default MainLayout;
