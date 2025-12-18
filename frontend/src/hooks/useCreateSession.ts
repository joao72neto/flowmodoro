import { useState } from "react";
import sessionsService from "../services/sessions.service";

export const useCreateSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();

  const createSession = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const res = await sessionsService.createSession(data);
      return res;
    } catch (e: any) {
      setError("Error: " + e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createSession,
  };
};
