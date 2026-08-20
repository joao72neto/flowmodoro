import clsx from "clsx";
import FormContainer from "./forms/FormContainer";

const AuthContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={clsx(
        "flex flex-col border-r border-border p-10 w-full gap-4",
        "max-w-xl shadow-[8px_0_20px_rgba(0,0,0,0.30)] z-10",
      )}
    >
      <div className="flex items-center gap-2">
        <img src="/flowmodoro-icon.svg" alt="App logo" className="w-10" />
        <p className="text-2xl">Flowmodoro</p>
      </div>

      <FormContainer>{children}</FormContainer>
    </div>
  );
};

export default AuthContainer;
