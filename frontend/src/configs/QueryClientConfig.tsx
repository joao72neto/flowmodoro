import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
  QueryCache,
} from "@tanstack/react-query";
import { ApiError } from "./api-error.configs";
import { useModal } from "../shared/contexts/modal/modal.context";
import { useState } from "react";

const isConstraintError = (error: unknown) => {
  return (
    error instanceof Error &&
    (error.name === "ConstraintError" ||
      error.message.includes("ConstraintError"))
  );
};

const QueryClientConfig = ({ children }: { children: React.ReactNode }) => {
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
            if (isConstraintError(error)) {
              const constraintError = mutation.meta?.constraintError as
                | {
                    title: string;
                    message: string;
                  }
                | undefined;

              if (constraintError) {
                showError({
                  ...constraintError,
                  action: hideModal,
                });

                setModalLoading(false);
                return;
              }
            }

            if (error instanceof ApiError) {
              showError({
                title:
                  (mutation.meta?.errorTitle as string) ??
                  "Erro ao executar operação",
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

export default QueryClientConfig;
