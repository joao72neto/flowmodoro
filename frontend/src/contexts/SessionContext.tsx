import React, { createContext, useState } from "react";
import { useCreateSession } from "../hooks/useCreateSession";

interface SessionContextType {
  task: string;
  interruptions: number;
  focus: string;
  setTask: (tasks: string) => void;
  setInterruptions: (interruptions: number) => void;
  setFocus: (time: string) => void;
  saveSession: () => Promise<void>;
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
  const { createSession } = useCreateSession();

  const saveSession = async () => {
    try {
      const data = {
        task,
        focus,
        interruptions,
      };
      await createSession(data);
      alert("Session saved successfully!");
    } catch (e: any) {
      alert(e.message);
    }
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
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
