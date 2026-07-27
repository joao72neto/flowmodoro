import type { ReactNode } from "react";
import { useState, useEffect } from "react";

import clsx from "clsx";

interface AnimatedCollapseProps {
  show: boolean;
  children: ReactNode;
  overflow?: boolean;
}

export const AnimatedCollapse = ({
  show,
  children,
  overflow = false,
}: AnimatedCollapseProps) => {
  const [hasOpened, setHasOpened] = useState(show);

  useEffect(() => {
    if (show) setHasOpened(true);
  }, [show]);

  return (
    <div
      className={clsx(
        "grid w-full transition-[grid-template-rows,opacity] duration-250 ease-in-out",
        show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      {(show || hasOpened) && (
        <div className={clsx("min-h-0 px-1", !overflow && "overflow-hidden")}>
          {children}
        </div>
      )}
    </div>
  );
};
