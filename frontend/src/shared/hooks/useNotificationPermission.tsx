import { useEffect } from "react";
import { useModal } from "../contexts/ModalContext";

export const useNotificationPermission = () => {
  const { showDefault, hideModal } = useModal();

  useEffect(() => {
    (async () => {
      if (!("Notification" in window)) {
        showDefault(
          "Notificações não suportadas",
          "Seu navegador não suporta notificações. Você não será avisado quando a pausa terminar.",
          hideModal,
        );
        return;
      }

      if (Notification.permission === "denied") {
        showDefault(
          "Notificações bloqueadas",
          "As notificações estão desativadas. Ative-as nas configurações do navegador para ser avisado sobre o fim das pausas.",
          hideModal,
        );
      } else if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission === "denied") {
          showDefault(
            "Notificações bloqueadas",
            "Você bloqueou as notificações. Você não será avisado quando a pausa terminar.",
            hideModal,
          );
        }
      }
    })();
  }, []);
};
