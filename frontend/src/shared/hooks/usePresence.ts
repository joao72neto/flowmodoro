import { useState, useEffect } from "react";

export const usePresence = (isOpen: boolean, duration = 300) => {
  const [mounted, setMounted] = useState(isOpen);
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);

      requestAnimationFrame(() => {
        setVisible(true);
      });

      return;
    }

    setVisible(false);

    const timeout = setTimeout(() => {
      setMounted(false);
    }, duration);

    return () => clearTimeout(timeout);
  }, [isOpen, duration]);

  return { mounted, visible };
};
