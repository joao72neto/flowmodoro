import type { ProjectModel } from "../../../projects/offline/project.model";
import type { TagModel } from "../../../tags/offline/tag.model";
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
  const projectsMap = new Map(projects.map((p) => [p.id, p]));
  const tagsMap = new Map(tags.map((t) => [t.id, t]));

  return sessions.map((session) => ({
    ...modelToDTO({
      session,
      project: projectsMap.get(session.projectId || ""),
      tag: tagsMap.get(session.tagId || ""),
    }),
  }));
};

export const buildDailySessions = (
  sessions: SessionDTO[],
): DailySessionsDTO[] => {
  const daysMap: Record<string, any> = {};

  sessions.forEach((session) => {
    const dateKey = session.date.split("T")[0];
    const projectId = session.project?.id || "null";
    const tagId = session.tag?.id || "null";
    const groupKey = `${session.name}_${projectId}_${tagId}`;

    if (!daysMap[dateKey]) {
      daysMap[dateKey] = {
        date: dateKey,
        totalFocus: 0,
        totalRest: 0,
        groupsMap: {},
      };
    }

    const day = daysMap[dateKey];
    day.totalFocus += session.focus;
    day.totalRest += session.rest;

    if (!day.groupsMap[groupKey]) {
      day.groupsMap[groupKey] = {
        id: groupKey,
        name: session.name,
        totalFocus: 0,
        totalRest: 0,
        sessions: [],
      };
    }

    const group = day.groupsMap[groupKey];
    group.totalFocus += session.focus;
    group.totalRest += session.rest;
    group.sessions.push(session);
  });

  const content: DailySessionsDTO[] = Object.values(daysMap).map((day: any) => {
    const sessionGroups: SessionGroupDTO[] = Object.values(day.groupsMap);

    sessionGroups.forEach((group) => {
      group.sessions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    });

    sessionGroups.sort(
      (a, b) => new Date(b.sessions[0].date).getTime() - new Date(a.sessions[0].date).getTime(),
    );

    return {
      date: day.date,
      totalFocus: day.totalFocus,
      totalRest: day.totalRest,
      sessionGroups,
    };
  });

  return content.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
};
