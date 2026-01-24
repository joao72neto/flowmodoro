import { createContext, useContext, useState } from "react";

interface ISessionContext {
  focus: number;
  interruptions: number;
  setFocus: (focus: number) => void;
  setInterruptions: (interruptions: number) => void;
}

export const SessionContext = createContext<ISessionContext | null>(null);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [focus, setFocus] = useState(0);
  const [interruptions, setInterruptions] = useState(0);

  return (
    <SessionContext.Provider
      value={{
        focus,
        interruptions,
        setFocus,
        setInterruptions,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context)
    throw new Error("useSessionContext must be used within a SessionProvider");

  return context;
};
