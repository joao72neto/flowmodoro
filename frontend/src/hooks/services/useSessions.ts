import { useCallback, useState } from "react";
import sessionsService from "../../services/sessions.service";
import type {
  ISessionGroupoResponse,
  SessionRequest,
} from "../../types/sessions.types";

const useSessions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [success, setSuccess] = useState<string | null>();
  const [sessions, setSessions] = useState<ISessionGroupoResponse[]>([]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const createSession = useCallback(
    async (id: number, data: SessionRequest) => {
      setLoading(true);
      reset();

      try {
        const res = await sessionsService.createSession(id, data);
        setSuccess("Session created successfully");
        return res;
      } catch (e: any) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    reset();

    try {
      const res = await sessionsService.getSessions();
      const data: ISessionGroupoResponse[] = res.data;
      setSessions(data);
      return data;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createSession,
    success,
    fetchSessions,
    sessions,
  };
};

export default useSessions;
