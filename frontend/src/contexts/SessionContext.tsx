import React, { createContext, useState } from "react";
import { useCreateSession } from "../hooks/sessions/useCreateSession";

interface SessionContextType {
  task: string;
  interruptions: number;
  focus: string;
  setTask: (tasks: string) => void;
  setInterruptions: (interruptions: number) => void;
  setFocus: (time: string) => void;
  saveSession: () => Promise<void>;
  error: string | undefined | null;
  success: string | undefined | null;
}

export const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [task, setTask] = useState<string>("");
  const [interruptions, setInterruptions] = useState<number>(0);
  const [focus, setFocus] = useState<string>("");
  const { error, success } = useCreateSession();

  const saveSession = async () => {
    // const data = {
    //   task,
    //   focus,
    //   interruptions,
    // };
    // await createSession(data);
  };

  return (
    <SessionContext.Provider
      value={{
        task,
        interruptions,
        focus,
        setTask,
        setInterruptions,
        setFocus,
        saveSession,
        error,
        success,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
