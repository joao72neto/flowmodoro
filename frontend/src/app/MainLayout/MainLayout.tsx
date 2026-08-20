import SideBar from "./SideBar";
import MainContentContainer from "./containers/MainContentContainer";

import { useNotificationPermission } from "../../shared/hooks/useNotificationPermission";
import SideBarContainer from "./containers/SideBarContainer";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { lockScroll, unlockScroll } from "../../shared/utils/scroll-lock.utils";

import LoadingScreen from "./LoadingScreen";

import Stack from "../../shared/components/Stack";
import Button from "../../shared/components/buttons/Button/Button";
import Footer from "./Footer/Footer";
import SyncStatus from "./SyncStatus";

import { Link } from "react-router-dom";
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
    <div className="min-h-screen flex flex-col gap-5">
      <div className="flex items-center">
        <Stack align="left" className="pt-5 px-5 flex-1">
          <SyncStatus />
        </Stack>

        <Stack align="right" className="pt-5 px-5">
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </Stack>
      </div>

      <div className="relative flex flex-1 overflow-x-hidden items-center">
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
    </div>
  );
};

export default MainLayout;
