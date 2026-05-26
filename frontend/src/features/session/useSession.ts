import { useCallback, useState } from "react";
import sessionsService from "./session.service";
import type {
  ISessionGroupResponse,
  CreateSessionRequest,
  UpdateSessionRequest,
} from "./session.types";
import type { PaginationResponse } from "../../shared/globals.types";
import { LOADING_TIMEOUT } from "../../app/loading.const";

const useSessions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [success, setSuccess] = useState<string | null>();
  const [sessions, setSessions] =
    useState<PaginationResponse<ISessionGroupResponse>>();

  const reset = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const createSession = useCallback(
    async (id: number, data: CreateSessionRequest) => {
      let timer = setTimeout(() => setLoading(true), LOADING_TIMEOUT);
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
    [reset],
  );

  const fetchSessions = useCallback(
    async (page: number = 1, size: number = 10) => {
      let timer = setTimeout(() => setLoading(true), LOADING_TIMEOUT);
      reset();

      try {
        const res = await sessionsService.getSessions(page, size);
        const data: PaginationResponse<ISessionGroupResponse> = res.data;
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
    [reset],
  );

  const updateSession = useCallback(
    async (id: number, data: UpdateSessionRequest) => {
      let timer = setTimeout(() => setLoading(true), LOADING_TIMEOUT);
      reset();

      try {
        const res = await sessionsService.updateSession(id, data);
        setSuccess("Session updated successfully");
        return res;
      } catch (e: any) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    },
    [reset],
  );

  const deleteSession = useCallback(
    async (id: number) => {
      let timer = setTimeout(() => setLoading(true), LOADING_TIMEOUT);
      reset();

      try {
        const res = await sessionsService.deleleSession(id);
        setSuccess("Session deleted successfully");
        return res;
      } catch (e: any) {
        setError(e.message);
        throw e;
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    },
    [reset],
  );

  return {
    loading,
    error,
    createSession,
    success,
    fetchSessions,
    sessions,
    updateSession,
    deleteSession,
  };
};

export default useSessions;
