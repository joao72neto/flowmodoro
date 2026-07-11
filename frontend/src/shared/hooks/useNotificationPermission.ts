import { useEffect } from "react";
import { useModal } from "../contexts/modal/modal.context";

export const useNotificationPermission = () => {
  const { showInfo, hideModal } = useModal();

  useEffect(() => {
    (async () => {
      if (!("Notification" in window)) {
        showInfo({
          title: "Notificações não suportadas",
          message:
            "Seu navegador não suporta notificações. Você não será avisado quando a pausa terminar.",
          action: hideModal,
        });
        return;
      }

      if (Notification.permission === "denied") {
        showInfo({
          title: "Notificações bloqueadas",
          message:
            "As notificações estão desativadas. Ative-as nas configurações do navegador para ser avisado sobre o fim das pausas.",
          action: hideModal,
        });
      } else if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission === "denied") {
          showInfo({
            title: "Notificações bloqueadas",
            message:
              "Você bloqueou as notificações. Você não será avisado quando a pausa terminar.",
            action: hideModal,
          });
        }
      }
    })();
  }, [showInfo, hideModal]);
};
