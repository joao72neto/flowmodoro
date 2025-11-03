import { getSession, createSession } from "../sessions";

export const getSessionService = async () => (await getSession()).data;
export const createSessionService = async (data: any) =>
  (await createSession(data)).data;
