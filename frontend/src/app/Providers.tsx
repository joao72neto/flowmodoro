import { TimerProvider } from "../features/timer/context/timer.provider";
import { ThemeProvider } from "../shared/contexts/theme/theme.provider";

import { SessionProvider } from "../features/sessions/context/sessions.provider";
import { ModalProvider } from "../shared/contexts/modal/modal.provider";
import { AuthProvider } from "../shared/contexts/auth/auth.provider";

import QueryClientConfig from "../configs/QueryClientConfig";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ModalProvider>
      <QueryClientConfig>
        <AuthProvider>
          <ThemeProvider>
            <SessionProvider>
              <TimerProvider>{children}</TimerProvider>
            </SessionProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientConfig>
    </ModalProvider>
  );
};

export default Providers;
