import { useCallback, useState } from "react";
import sessionsService from "./session.service";
import type { ISessionGroupoResponse, SessionRequest } from "./session.types";
import type { PaginationResponse } from "../../shared/globals.types";
import { LOADING_TIMOUT } from "../../app/loading.const";

const useSessions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [success, setSuccess] = useState<string | null>();
  const [sessions, setSessions] =
    useState<PaginationResponse<ISessionGroupoResponse>>();

  const reset = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const createSession = useCallback(
    async (id: number, data: SessionRequest) => {
      let timer = setTimeout(() => setLoading(true), LOADING_TIMOUT);
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
        clearTimeout(timer);
      }
    },
    [],
  );

  const fetchSessions = useCallback(
    async (page: number = 1, size: number = 10) => {
      let timer = setTimeout(() => setLoading(true), LOADING_TIMOUT);
      reset();

      try {
        const res = await sessionsService.getSessions(page, size);
        const data: PaginationResponse<ISessionGroupoResponse> = res.data;
        setSessions(data);
        return data;
      } catch (e: any) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    },
    [],
  );

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
