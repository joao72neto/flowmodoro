import SideBar from "./SideBar";
import MainContentContainer from "./containers/MainContentContainer";

import { useNotificationPermission } from "../../shared/hooks/useNotificationPermission";
import SideBarContainer from "./containers/SideBarContainer";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { lockScroll, unlockScroll } from "../../shared/utils/scroll-lock.utils";

import LoadingScreen from "./LoadingScreen";

import Footer from "./Footer/Footer";
import SyncStatus from "./SyncStatus";

import { useAppReady } from "../../shared/hooks/useAppReady";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  useNotificationPermission();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isReady = useAppReady();

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

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative min-h-screen flex overflow-x-hidden">
      <div className="flex flex-col w-full">
        <div className="flex justify-start items-center pt-5 px-5">
          <SyncStatus />
        </div>
        <MainContentContainer>{children}</MainContentContainer>
      </div>

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
