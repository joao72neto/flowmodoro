import { db } from "../../../indexedDB";
import type { PaginationResponse } from "../../../shared/global.types";
import type {
  SessionGroupResponse,
  SessionPayload,
} from "../api/sessions.types";
import { DEFAULT_SESSION } from "./consts/default-session";
import type { SessionModel } from "./session.model";

const test = {
  content: [
    {
      date: "2026-07-03",
      totalFocus: 2280,
      totalRest: 456,
      sessionGroups: [
        {
          id: "fb3e42ae-40ad-3bfc-a47f-2af2f50fd88b",
          name: "Codando a lot",
          totalFocus: 2280,
          totalRest: 456,
          sessions: [
            {
              id: 164,
              name: "Codando a lot",
              focus: 18,
              ratio: 0.2,
              rest: 4,
              project: {
                id: 42,
                name: "Nossa",
                totalFocus: null,
              },
              tag: {
                id: 39,
                name: "Tag",
              },
            },
          ],
        },
      ],
    },
  ],
  page: 1,
  size: 5,
  totalElements: 17,
  totalPages: 4,
};

export const fetchLocalSessions = async ({
  page = 1,
  size = 10,
}: {
  page: number;
  size: number;
}): Promise<PaginationResponse<SessionGroupResponse>> => {
  db.sessions
    .offset((page - 1) * size)
    .limit(size)
    .toArray();

  return test;
};

export const createLocalSession = async (
  payload: SessionPayload,
): Promise<SessionModel> => {
  const session = {
    id: crypto.randomUUID(),
    name: payload.name || DEFAULT_SESSION.name,
    focus: payload.focus || DEFAULT_SESSION.focus,
    ratio: payload.ratio || DEFAULT_SESSION.ratio,
    rest: payload.rest || DEFAULT_SESSION.rest,
    projectId: payload.projectId || DEFAULT_SESSION.projectId,
    tagId: payload.tagId || DEFAULT_SESSION.tagId,
  };

  await db.sessions.add(session);

  return session;
};
