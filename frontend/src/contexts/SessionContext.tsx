import React, { createContext, useState } from "react";
import { useCreateSession } from "../hooks/useCreateSession";

interface SessionContextType {
  tasks: any[];
  interruptions: any[];
  focus: number;
  setTasks: (tasks: any[]) => void;
  setInterruptions: (interruptions: any[]) => void;
  setFocus: (time: number) => void;
  saveSession: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [interruptions, setInterruptions] = useState<any[]>([]);
  const [focus, setFocus] = useState(0);
  const { create } = useCreateSession();

  const saveSession = async () => {
    try {
      console.log(focus);
      const data = {
        tasks,
        focus,
        interruptions,
      };

      const res = await create(data);
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        tasks,
        interruptions,
        focus,
        setTasks,
        setInterruptions,
        setFocus,
        saveSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
