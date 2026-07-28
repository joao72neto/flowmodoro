import ExpandableButton from "../../shared/components/buttons/ExpandableButton";
import SideBar from "./SideBar";
import MainContentContainer from "./MainContentContainer";

import { useNotificationPermission } from "../../shared/hooks/useNotificationPermission";
import SideBarContainer from "./SideBarContainer";

import { PiCaretLeftBold } from "react-icons/pi";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { lockScroll, unlockScroll } from "../../shared/utils/scroll-lock.utils";

import BackupMenu from "./BackupMenu";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  useNotificationPermission();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isSidebarOpen) {
      lockScroll();
    }
    return () => {
      if (isSidebarOpen) {
        unlockScroll();
      }
    };
  }, [isSidebarOpen]);

  return (
    <div className="relative min-h-screen flex overflow-x-hidden items-center">
      <MainContentContainer>{children}</MainContentContainer>

      <div
        className={clsx(
          "fixed inset-0 bg-black/50 backdrop-blur-md z-20 transition-all duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      <SideBarContainer isOpen={isSidebarOpen}>
        <SideBar onClick={() => setIsSidebarOpen(false)} />
      </SideBarContainer>

      {!isSidebarOpen && (
        <div className="fixed bottom-0 right-0 p-4 z-10">
          <ExpandableButton
            icon={
              <PiCaretLeftBold
                size={25}
                className="transition duration-200 hover:-translate-x-1"
              />
            }
            className="rounded-full!"
            onClick={() => setIsSidebarOpen(true)}
          >
            Projetos e Tags
          </ExpandableButton>
        </div>
      )}

      <BackupMenu />
    </div>
  );
};

export default MainLayout;
