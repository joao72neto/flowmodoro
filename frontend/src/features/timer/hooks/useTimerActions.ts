import { isNative } from "../../../consts/platform";
import { FlowmodoroPlugin } from "../../../mobile/plugins";
import { useModal } from "../../../shared/contexts/modal/modal.context";

import { ensureAllPermissions } from "../../sessions/permissions.utils";
import { useEffect, useRef } from "react";
import { App } from "@capacitor/app";

import type { PluginListenerHandle } from "@capacitor/core";
import { getRatio, getTotalFocus } from "../timer.store";
import { useTimerContext } from "../context/timer.context";

const useTimerActions = () => {
  const { startFocus, startBreak, skipBreak, stopFocus } = useTimerContext();
  const { showDefault, hideModal } = useModal();

  const pendingAction = useRef<"start-focus" | null>(null);

  useEffect(() => {
    if (!isNative) {
      return;
    }

    const setup = async () => {
      const listener = await App.addListener("resume", async () => {
        if (!pendingAction.current) {
          return;
        }

        const ok = await ensureAllPermissions();
        if (!ok) {
          return;
        }

        pendingAction.current = null;
        startFocusTimer();
      });

      return listener;
    };

    let listener: PluginListenerHandle | undefined;
    setup().then((l) => {
      listener = l;
    });

    return () => {
      listener?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startFocusTimer = async () => {
    const anchorMillis = Date.now();
    startFocus();

    if (isNative) {
      await FlowmodoroPlugin.startFocus({ anchorMillis });
    }
  };

  const handleStartFocus = async () => {
    if (isNative) {
      pendingAction.current = "start-focus";

      const ok = await ensureAllPermissions();

      if (!ok) {
        return;
      }

      pendingAction.current = null;
    }

    startFocusTimer();
  };

  const handleStartBreak = async () => {
    const anchorMillis = Date.now();
    startBreak();

    if (isNative) {
      const normalizedRestRatio = getRatio() / 100;
      await FlowmodoroPlugin.startBreak({
        anchorMillis,
        totalFocusMillis: getTotalFocus(),
        restRatio: normalizedRestRatio,
      });
    }
  };

  const stopForegroundTimer = async () => {
    if (isNative) {
      await FlowmodoroPlugin.stopTimer();
    }
  };

  const handleStopTimer = async ({ type }: { type: "focus" | "break" }) => {
    if (type === "focus") {
      await stopForegroundTimer();
      stopFocus();
    } else {
      showDefault({
        title: "Atenção!",
        message: "Tem certeza que deseja pular o intervalo?",
        confirmLabel: "Sim",
        cancelLabel: "Não",
        action: async () => {
          await stopForegroundTimer();
          skipBreak();
          hideModal();
        },
        cancel: () => hideModal,
      });
    }
  };

  return {
    startFocusTimer,
    handleStartFocus,
    handleStartBreak,
    stopForegroundTimer,
    handleStopTimer,
  };
};

export default useTimerActions;
