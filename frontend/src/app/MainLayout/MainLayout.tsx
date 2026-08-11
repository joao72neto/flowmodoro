import ExpandableButton from "../../shared/components/buttons/ExpandableButton";
import SideBar from "./SideBar";
import MainContentContainer from "./containers/MainContentContainer";

import { useNotificationPermission } from "../../shared/hooks/useNotificationPermission";
import SideBarContainer from "./containers/SideBarContainer";

import { PiCaretLeftBold } from "react-icons/pi";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { lockScroll, unlockScroll } from "../../shared/utils/scroll-lock.utils";
import SyncStatus from "./SyncStatus";

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
    <div className="min-h-screen flex flex-col gap-5">
      <div className="flex justify-start items-center pt-5 px-5">
        <SyncStatus />
      </div>
      <div className="relative flex flex-1 overflow-x-hidden items-center">
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
      </div>
    </div>
  );
};

export default MainLayout;
