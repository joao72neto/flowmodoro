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
        <img src="/flowmodoro-icon.svg" alt="App logo" className="w-10" />
        <p className="text-2xl">Flowmodoro</p>
      </div>

      {children}
    </div>
  );
};

export default AuthContainer;
