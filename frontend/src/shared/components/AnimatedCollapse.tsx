import { clsx } from "clsx";
import React from "react";

interface AnimatedCollapseProps {
  show: boolean;
  children: React.ReactNode;
}

export const AnimatedCollapse = ({ show, children }: AnimatedCollapseProps) => {
  return (
    <div
      className={clsx(
        "grid overflow-hidden w-full transition-all duration-300 ease-in-out transform-gpu origin-top",
        "will-change-[grid-template-rows,opacity,transform]",
        show
          ? "grid-rows-[1fr] opacity-100 translate-y-0"
          : "grid-rows-[0fr] opacity-0 -translate-y-2 pointer-events-none",
      )}
    >
      <div className="min-h-0">{children}</div>
    </div>
  );
};
