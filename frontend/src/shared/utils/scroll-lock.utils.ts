let activeScrollLocks = 0;

export const lockScroll = () => {
  activeScrollLocks++;
  if (activeScrollLocks === 1) {
    document.body.style.overflow = "hidden";
  }
};

export const unlockScroll = () => {
  activeScrollLocks = Math.max(0, activeScrollLocks - 1);
  if (activeScrollLocks === 0) {
    document.body.style.overflow = "";
  }
};
