import SideBar from "./SideBar";
import MainContentContainer from "./MainContentContainer";

import { useNotificationPermission } from "../../shared/hooks/useNotificationPermission";
import SideBarContainer from "./SideBarContainer";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { lockScroll, unlockScroll } from "../../shared/utils/scroll-lock.utils";

import Footer from "./Footer";
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
    <div className="relative min-h-screen flex overflow-x-hidden">
      <div className="fixed top-4 left-4">
        <SyncStatus />
      </div>

      <MainContentContainer>{children}</MainContentContainer>
      <Footer setIsSidebarOpen={setIsSidebarOpen} />
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
    </div>
  );
};

export default MainLayout;
