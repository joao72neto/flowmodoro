import type { ProjectModel } from "../../../projects/db/project.model";
import type { TagModel } from "../../../tags/db/tag.model";
import type {
  DailySessionsDTO,
  SessionDTO,
  SessionGroupDTO,
} from "../session.dtos";
import type { SessionModel } from "../session.model";
import { modelToDTO } from "../sessions.mappers";

export const normalizeSessions = ({
  sessions,
  projects,
  tags,
}: {
  sessions: SessionModel[];
  projects: ProjectModel[];
  tags: TagModel[];
}): SessionDTO[] => {
  const projectsMap = new Map(projects.map((project) => [project.id, project]));
  const tagsMap = new Map(tags.map((tag) => [tag.id, tag]));

  const sessionResponse: SessionDTO[] = sessions.map((session) => {
    const project = projectsMap.get(session.projectId || "");
    const tag = tagsMap.get(session.tagId || "");

    return modelToDTO({ session, project, tag });
  });

  return sessionResponse;
};

export const groupSessions = (sessions: SessionDTO[]): SessionGroupDTO[] => {
  const groupedData = sessions.reduce((acc: any, session) => {
    const dateKey = session.date.split("T")[0];
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

  return Object.values(groupedData);
};

export const groupSessionsByDate = (
  sessions: SessionGroupDTO[],
): DailySessionsDTO[] => {
  const content: DailySessionsDTO[] = sessions.map((dateGroup: any) => {
    return {
      date: dateGroup.date,
      totalFocus: dateGroup.totalFocus,
      totalRest: dateGroup.totalRest,
      sessionGroups: Object.values(dateGroup.sessionGroupsMap),
    };
  });

  return content;
};
