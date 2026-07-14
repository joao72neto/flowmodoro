import type { ProjectModel } from "../../../projects/local/project.model";
import type { TagModel } from "../../../tags/local/tag.model";
import type {
  DailySessionsDTO,
  SessionDTO,
  SessionGroupDTO,
} from "../../dtos/sessions-response";
import type { SessionModel } from "../session.model";

import mapper from "../../sessions.mappers";

type DayMap = {
  [key: string]: {
    date: string;
    totalFocus: number;
    totalRest: number;
    groupsMap: Record<
      string,
      {
        id: string;
        name: string;
        totalFocus: number;
        totalRest: number;
        sessions: SessionDTO[];
      }
    >;
  };
};

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
    ...mapper.toDTO({
      session,
      project: projectsMap.get(session.projectId || ""),
      tag: tagsMap.get(session.tagId || ""),
    }),
  }));
};

export const buildDailySessions = (
  sessions: SessionDTO[],
): DailySessionsDTO[] => {
  const daysMap: DayMap = {};

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

  const content: DailySessionsDTO[] = Object.values(daysMap).map((day) => {
    const sessionGroups: SessionGroupDTO[] = Object.values(day.groupsMap);

    sessionGroups.forEach((group) => {
      group.sessions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    });

    sessionGroups.sort(
      (a, b) =>
        new Date(b.sessions[0].date).getTime() -
        new Date(a.sessions[0].date).getTime(),
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
