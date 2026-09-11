import type { ReactNode } from "react";
import clsx from "clsx";
import { usePresence } from "../hooks/usePresence";

interface AnimatedCollapseProps {
  show: boolean;
  children: ReactNode;
  overflow?: boolean;
  className?: string;
  duration?: number;
}

export const AnimatedCollapse = ({
  show,
  children,
  overflow = false,
  className,
  duration = 200,
}: AnimatedCollapseProps) => {
  const { mounted, visible } = usePresence(show, duration);

  if (!mounted) return null;

  return (
    <div
      className={clsx(
        "grid w-full transition-[grid-template-rows] ease-[cubic-bezier(0.2,0,0,1)]",
        visible ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className,
      )}
      style={{
        transitionDuration: `${duration}ms`,
        contain: "paint",
      }}
      aria-hidden={!visible}
    >
      <div className={clsx("min-h-0", !overflow && "overflow-hidden")}>
        <div
          className={clsx(
            "w-full transform-gpu transition-[opacity,transform] ease-[cubic-bezier(0.2,0,0,1)]",
            visible
              ? "opacity-100 translate-y-0 animate-fade-in"
              : "opacity-0 -translate-y-2 pointer-events-none",
          )}
          style={{
            transitionDuration: `${duration}ms`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
