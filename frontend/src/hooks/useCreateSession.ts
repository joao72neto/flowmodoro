import { useState } from "react";
import { createSessionService } from "../api/services/sessionService";

export const useCreateSession = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>();

  const create = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const res = await createSessionService(data);
      return res;
    } catch (e: any) {
      setError("Erro ao salvar a sessão");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    create,
  };
};
