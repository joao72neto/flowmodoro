import { db } from "../../../indexedDB";
import type { PaginationResponse } from "../../../shared/global.types";
import type {
  SessionGroupResponse,
  SessionPayload,
} from "../api/sessions.types";
import { DEFAULT_SESSION } from "./consts/default-session";
import type { SessionModel } from "./session.model";

export const fetchLocalSessions = async ({
  page = 1,
  size = 10,
}: {
  page: number;
  size: number;
}): Promise<PaginationResponse<SessionGroupResponse>> => {
  const sessions = await db.sessions.toArray();
  const projects = await db.projects.toArray();
  const tags = await db.tags.toArray();

  const projectsMap = new Map(projects.map((project) => [project.id, project]));
  const tagsMap = new Map(tags.map((tag) => [tag.id, tag]));

  const sessionResponse = sessions.map((session) => {
    const project = projectsMap.get(session.projectId || 0);
    const tag = tagsMap.get(session.tagId || 0);

    return {
      id: session.id,
      name: session.name,
      focus: session.focus,
      ratio: session.ratio,
      rest: session.rest,
      dateString: session.date.split("T")[0],
      project: {
        id: session.projectId || 0,
        name: project?.name ?? "",
      },
      tag: {
        id: session.tagId || 0,
        name: tag?.name ?? "",
      },
    };
  });

  const groupedData = sessionResponse.reduce((acc: any, session) => {
    const dateKey = session.dateString;
    const groupName = session.name;

    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        totalFocus: 0,
        totalRest: 0,
        sessionGroupsMap: {},
      };
    }

    if (!acc[dateKey].sessionGroupsMap[groupName]) {
      acc[dateKey].sessionGroupsMap[groupName] = {
        id: crypto.randomUUID(),
        name: groupName,
        totalFocus: 0,
        totalRest: 0,
        sessions: [],
      };
    }

    acc[dateKey].sessionGroupsMap[groupName].sessions.push(session);

    acc[dateKey].sessionGroupsMap[groupName].totalFocus += session.focus;
    acc[dateKey].sessionGroupsMap[groupName].totalRest += session.rest;

    acc[dateKey].totalFocus += session.focus;
    acc[dateKey].totalRest += session.rest;

    return acc;
  }, {});

  const content: SessionGroupResponse[] = Object.values(groupedData).map(
    (dateGroup: any) => {
      return {
        date: dateGroup.date,
        totalFocus: dateGroup.totalFocus,
        totalRest: dateGroup.totalRest,
        sessionGroups: Object.values(dateGroup.sessionGroupsMap),
      };
    },
  );

  return {
    content,
    page,
    size,
    totalElements: sessions.length,
    totalPages: Math.ceil(sessions.length / size),
  };
};

export const createLocalSession = async (
  payload: SessionPayload,
): Promise<SessionModel> => {
  const session = {
    id: crypto.randomUUID(),
    name: payload.name || DEFAULT_SESSION.name,
    focus: payload.focus || DEFAULT_SESSION.focus,
    ratio: payload.ratio || DEFAULT_SESSION.ratio,
    rest: calculateRest(
      payload.focus || DEFAULT_SESSION.focus,
      payload.ratio || DEFAULT_SESSION.ratio,
    ),
    projectId: payload.projectId || DEFAULT_SESSION.projectId,
    tagId: payload.tagId || DEFAULT_SESSION.tagId,
    date: new Date().toISOString(),
  };

  await db.sessions.add(session);

  return session;
};

const calculateRest = (focus: number, ratio: number) => {
  return focus * ratio;
};
