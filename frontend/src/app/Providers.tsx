import { TimerProvider } from "../features/timer/context/timer.provider";

import { ThemeProvider } from "../shared/contexts/theme/theme.provider";
import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
  QueryCache,
} from "@tanstack/react-query";
import { SessionProvider } from "../features/sessions/context/sessions.provider";
import { ModalProvider } from "../shared/contexts/modal/modal.provider";

import { useModal } from "../shared/contexts/modal/modal.context";
import { useState } from "react";
import { ApiError } from "../configs/api-error.configs";

const QueryClientWithModalConfig = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { showError, hideModal, setModalLoading } = useModal();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },

        queryCache: new QueryCache({
          onError: (error, query) => {
            if (error instanceof ApiError) {
              showError({
                title:
                  (query.meta?.errorTitle as string) ||
                  "Erro ao carregar dados",
                message: error.message,
                action: hideModal,
              });
            }
          },
        }),

        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            const errorTitle =
              (mutation.meta?.errorTitle as string) || "Ocorreu um erro";

            if (error instanceof ApiError) {
              showError({
                title: errorTitle,
                message: error.message,
                action: hideModal,
              });
            } else {
              console.error(error);
            }

            setModalLoading(false);
          },

          onSuccess: (_data, _variables, _context, mutation) => {
            if (mutation.meta?.closeModalOnSuccess) {
              hideModal();
              setModalLoading(false);
            }
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ModalProvider>
      <QueryClientWithModalConfig>
        <ThemeProvider>
          <SessionProvider>
            <TimerProvider>{children}</TimerProvider>
          </SessionProvider>
        </ThemeProvider>
      </QueryClientWithModalConfig>
    </ModalProvider>
  );
};

export default Providers;
