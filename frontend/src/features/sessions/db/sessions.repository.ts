import { db } from "../../../indexedDB";
import type { PaginationResponse } from "../../../shared/global.types";
import type { SessionGroupResponse } from "../api/sessions.types";
import type { SessionModel } from "./session.model";
import type { SessionPayloadDTO, SessionDTO } from "./session.dtos";
import { payloadToModel, modelToDTO } from "./sessions.mappers";
import { applyUpdates } from "./utils/apply-updates";

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
    const project = projectsMap.get(session.projectId || "");
    const tag = tagsMap.get(session.tagId || "");

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
  payload: SessionPayloadDTO,
): Promise<SessionDTO> => {
  const session: SessionModel = payloadToModel(payload);

  await db.sessions.add(session);

  const project = await db.projects.get(session.projectId || "");
  const tag = await db.tags.get(session.tagId || "");

  return modelToDTO({ session, project, tag });
};

export const updateLocalSession = async ({
  id,
  data,
}: {
  id: string;
  data: SessionPayloadDTO;
}): Promise<SessionDTO> => {
  const old = await db.sessions.get(id);

  const updatedSession: SessionModel = applyUpdates({
    id,
    old,
    updated: data,
  });

  await db.sessions.update(id, data);

  const project = await db.projects.get(updatedSession.projectId || "");
  const tag = await db.tags.get(updatedSession.tagId || "");

  return modelToDTO({ session: updatedSession, project, tag });
};

export const deleteLocalSession = async (id: string) => {
  await db.sessions.delete(id);
};
