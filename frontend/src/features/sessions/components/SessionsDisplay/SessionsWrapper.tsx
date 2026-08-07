import { forwardRef } from "react";

const SessionsWrapper = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => {
  return (
    <div ref={ref} className="flex flex-col gap-6 min-w-[300px] w-full">
      {children}
    </div>
  );
});

SessionsWrapper.displayName = "SessionsWrapper";

export default SessionsWrapper;
