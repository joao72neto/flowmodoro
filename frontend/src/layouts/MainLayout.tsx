import IconButton from "../components/home/buttons/IconButton";
import SideBar from "../components/layout/SideBar";

import LayoutContainer from "../components/layout/containers/LayoutContainer";
import MainContentContainer from "../components/layout/containers/MainContentContainer";
import SideBarContainer from "../components/layout/containers/SideBarContainer";
import ToggleButtonContainer from "../components/layout/containers/ToggleButtonContainer";
import { useTaskContext } from "../features/task/contexts/TaskContext";

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
