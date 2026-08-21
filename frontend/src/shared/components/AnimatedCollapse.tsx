import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import clsx from "clsx";

interface AnimatedCollapseProps {
  show: boolean;
  children: ReactNode;
  overflow?: boolean;
  enableHeavyAnimations?: boolean;
}

export const AnimatedCollapse = ({
  show,
  children,
  overflow = false,
  enableHeavyAnimations = true,
}: AnimatedCollapseProps) => {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    }
  }, [show]);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !show) {
      setShouldRender(false);
    }
  };

  if (!enableHeavyAnimations) {
    if (!show) return null;
    return (
      <div
        className={clsx(
          "w-full animate-fade-in",
          !overflow && "overflow-hidden",
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      className={clsx(
        "grid w-full transition-[grid-template-rows,opacity] duration-250 ease-in-out",
        show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      {shouldRender && (
        <div className={clsx("min-h-0 px-1", !overflow && "overflow-hidden")}>
          {children}
        </div>
      )}
    </div>
  );
};
