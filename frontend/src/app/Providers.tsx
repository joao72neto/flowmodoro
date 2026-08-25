import { TimerProvider } from "../features/timer/context/timer.provider";
import { ThemeProvider } from "../shared/contexts/theme/theme.provider";

import { SessionProvider } from "../features/sessions/context/sessions.provider";
import { ModalProvider } from "../shared/contexts/modal/modal.provider";
import { AuthProvider } from "../shared/contexts/auth/auth.provider";

import QueryClientConfig from "../configs/QueryClientConfig";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ModalProvider>
      <AuthProvider>
        <QueryClientConfig>
          <ThemeProvider>
            <SessionProvider>
              <TimerProvider>{children}</TimerProvider>
            </SessionProvider>
          </ThemeProvider>
        </QueryClientConfig>
      </AuthProvider>
    </ModalProvider>
  );
};

export default Providers;
