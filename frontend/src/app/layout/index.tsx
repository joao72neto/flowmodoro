import IconButton from "../../features/home/components/buttons/IconButton";
import SideBar from "./SideBar";

import LayoutContainer from "./LayoutContainer";
import MainContentContainer from "./MainContentContainer";

import { useTaskContext } from "../../features/task/contexts/TaskContext";
import SideBarContainer from "./SideBarContainer";
import ToggleButtonContainer from "./ToggleButtonContainer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useTaskContext();

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
          icon={<i className={`${!isSidebarOpen ? "bi bi-caret-left" : ""}`} />}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </ToggleButtonContainer>
    </LayoutContainer>
  );
};

export default MainLayout;
