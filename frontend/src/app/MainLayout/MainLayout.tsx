import SideBar from "./SideBar";
import MainContentContainer from "./containers/MainContentContainer";

import { useNotificationPermission } from "../../shared/hooks/useNotificationPermission";
import SideBarContainer from "./containers/SideBarContainer";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { lockScroll, unlockScroll } from "../../shared/utils/scroll-lock.utils";

import Stack from "../../shared/components/Stack";
import Footer from "./Footer/Footer";
import SyncStatus from "./SyncStatus";

import { Link } from "react-router-dom";
import { IoLogInOutline } from "react-icons/io5";
import { useAuth } from "../../shared/contexts/auth/auth.context";
import UserAvatarMenu from "../../shared/components/UserAvatarMenu";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  useNotificationPermission();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

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
      <div className="flex items-center">
        <Stack align="left" className="pt-5 px-5 flex-1">
          <SyncStatus />
        </Stack>

        <Stack align="right" className="pt-5 px-5">
          {isAuthenticated ? (
            <UserAvatarMenu />
          ) : (
            <Link to="/login">
              <button
                title="Ir para a página de login"
                className={clsx(
                  "flex items-center gap-2",
                  "hover:scale-110 hover:text-primary duration-75",
                )}
              >
                <IoLogInOutline size={30} />
              </button>
            </Link>
          )}
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
