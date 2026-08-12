import type { SessionModel } from "../../../features/sessions/local/session.model";

export const sumFocusBy = (
  sessions: SessionModel[],
  getId: (session: SessionModel) => string | undefined,
): Record<string, number> => {
  return sessions.reduce(
    (accumulator, session) => {
      const id = getId(session);

      if (!id) return accumulator;

      accumulator[id] = (accumulator[id] || 0) + (session.focus || 0);

      return accumulator;
    },
    {} as Record<string, number>,
  );
};
