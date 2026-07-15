import { TimerProvider } from "../features/timer/context/timer.provider";
import { ThemeProvider } from "../shared/contexts/theme/theme.provider";

import { SessionProvider } from "../features/sessions/context/sessions.provider";
import { ModalProvider } from "../shared/contexts/modal/modal.provider";

import QueryClientConfig from "../configs/QueryClientConfig";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ModalProvider>
      <QueryClientConfig>
        <ThemeProvider>
          <SessionProvider>
            <TimerProvider>{children}</TimerProvider>
          </SessionProvider>
        </ThemeProvider>
      </QueryClientConfig>
    </ModalProvider>
  );
};

export default Providers;
