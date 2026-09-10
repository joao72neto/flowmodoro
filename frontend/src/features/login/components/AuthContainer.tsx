import clsx from "clsx";

const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={clsx(
        "flex flex-col border-r border-border p-10 w-full gap-4",
        "shadow-[8px_0_20px_rgba(0,0,0,0.10)] z-10 overflow-hidden",
        "bg-gradient-to-b from-neutral-60 to-neutral-10",
        "md:bg-none md:bg-neutral-100 md:max-w-xl md:flex-1 md:w-auto",
      )}
    >
      <div className={"flex items-center gap-2 text-neutral-10"}>
        <svg
          width={44}
          height={44}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative text-neutral-10 drop-shadow-sm"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 6V12L16.5 16.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-2xl">Flowmodoro</p>
      </div>

      {children}
    </div>
  );
};

export default AuthContainer;
