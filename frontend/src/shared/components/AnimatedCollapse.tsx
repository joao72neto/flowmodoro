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
        "grid w-full transition-[grid-template-rows,opacity] duration-300 ease-in-out",
        show
          ? "grid-rows-[1fr] opacity-100"
          : "grid-rows-[0fr] opacity-0 pointer-events-none",
      )}
      style={{ overflow: show ? "visible" : "hidden" }}
    >
      <div className="min-h-0">{children}</div>
    </div>
  );
};
