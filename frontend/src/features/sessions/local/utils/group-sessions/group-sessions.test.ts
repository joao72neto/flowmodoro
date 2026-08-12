import { describe, test, expect } from "@jest/globals";
import { normalizeSessions } from "./group-sessions";

import type { SessionModel } from "../../session.model";
import type { TagModel } from "../../../../tags/local/tag.model";
import type { ProjectModel } from "../../../../projects/local/project.model";

describe("normalizeSessions", () => {
  test("should map sessions with their project and tag", () => {
    const project1: ProjectModel = {
      id: crypto.randomUUID(),
      name: "Project 1",
      createdAt: "",
    };

    const project2: ProjectModel = {
      id: crypto.randomUUID(),
      name: "Project 2",
      createdAt: "",
    };

    const tag1: TagModel = {
      id: crypto.randomUUID(),
      name: "Tag 1",
      projectId: project1.id,
      createdAt: "",
    };

    const tag2: TagModel = {
      id: crypto.randomUUID(),
      name: "Tag 2",
      projectId: project2.id,
      createdAt: "",
    };

    const sessions: SessionModel[] = [
      {
        id: crypto.randomUUID(),
        name: "Session 1",
        focus: 25,
        ratio: 0.2,
        rest: 5,
        projectId: project1.id,
        tagId: tag1.id,
        date: "2026-08-12T10:00:00",
      },
      {
        id: crypto.randomUUID(),
        name: "Session 2",
        focus: 30,
        ratio: 0.25,
        rest: 7.5,
        projectId: project2.id,
        tagId: tag2.id,
        date: "2026-08-12T11:00:00",
      },
    ];

    const result = normalizeSessions({
      sessions,
      projects: [project1, project2],
      tags: [tag1, tag2],
    });

    expect(result).toHaveLength(2);

    expect(result[0]).toEqual({
      id: sessions[0].id,
      name: sessions[0].name,
      focus: sessions[0].focus,
      ratio: sessions[0].ratio,
      rest: sessions[0].rest,
      project: {
        id: project1.id,
        name: project1.name,
      },
      tag: {
        id: tag1.id,
        name: tag1.name,
      },
      date: sessions[0].date,
    });

    expect(result[1]).toEqual({
      id: sessions[1].id,
      name: sessions[1].name,
      focus: sessions[1].focus,
      ratio: sessions[1].ratio,
      rest: sessions[1].rest,
      project: {
        id: project2.id,
        name: project2.name,
      },
      tag: {
        id: tag2.id,
        name: tag2.name,
      },
      date: sessions[1].date,
    });
  });

  test("should map sessions without project or tag", () => {
    const sessions: SessionModel[] = [
      {
        id: crypto.randomUUID(),
        name: "Session 1",
        focus: 25,
        ratio: 0.2,
        rest: 5,
        projectId: undefined,
        tagId: undefined,
        date: "2026-08-12T10:00:00",
      },
      {
        id: crypto.randomUUID(),
        name: "Session 2",
        focus: 30,
        ratio: 0.25,
        rest: 7.5,
        projectId: undefined,
        tagId: undefined,
        date: "2026-08-12T11:00:00",
      },
    ];

    const result = normalizeSessions({
      sessions,
      projects: [],
      tags: [],
    });

    expect(result).toHaveLength(2);

    expect(result[0]).toEqual({
      id: sessions[0].id,
      name: sessions[0].name,
      focus: sessions[0].focus,
      ratio: sessions[0].ratio,
      rest: sessions[0].rest,
      project: { id: "", name: "" },
      tag: { id: "", name: "" },
      date: sessions[0].date,
    });

    expect(result[1]).toEqual({
      id: sessions[1].id,
      name: sessions[1].name,
      focus: sessions[1].focus,
      ratio: sessions[1].ratio,
      rest: sessions[1].rest,
      project: { id: "", name: "" },
      tag: { id: "", name: "" },
      date: sessions[1].date,
    });
  });
});
