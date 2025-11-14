import { useEffect, useState } from "react";
import { getSessionService } from "../api/services/sessionService";

export function useSessions() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    getSessionService().then(setSessions);
  }, []);

  return sessions;
}
