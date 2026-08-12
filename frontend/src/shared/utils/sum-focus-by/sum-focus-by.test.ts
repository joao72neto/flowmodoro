import { describe, test, expect } from "@jest/globals";

import { sumFocusBy } from "./sum-focus-by.util";
import type { SessionModel } from "../../../features/sessions/local/session.model";

describe("sumFocusBy", () => {
  test("should sum focus by entity id", () => {
    const project1Id = crypto.randomUUID();
    const project2Id = crypto.randomUUID();

    const sessions: SessionModel[] = [
      {
        id: crypto.randomUUID(),
        name: "Session 1",
        focus: 25,
        ratio: 0.2,
        rest: 5,
        projectId: project1Id,
        tagId: undefined,
        date: "",
      },
      {
        id: crypto.randomUUID(),
        name: "Session 2",
        focus: 30,
        ratio: 0.2,
        rest: 6,
        projectId: project1Id,
        tagId: undefined,
        date: "",
      },
      {
        id: crypto.randomUUID(),
        name: "Session 3",
        focus: 40,
        ratio: 0.2,
        rest: 8,
        projectId: project2Id,
        tagId: undefined,
        date: "",
      },
    ];

    const result = sumFocusBy(sessions, (session) => session.projectId);

    expect(result).toEqual({
      [project1Id]: 55,
      [project2Id]: 40,
    });
  });

  test("should sum focus by tag id", () => {
    const tag1Id = crypto.randomUUID();
    const tag2Id = crypto.randomUUID();

    const sessions: SessionModel[] = [
      {
        id: crypto.randomUUID(),
        name: "Session 1",
        focus: 120,
        ratio: 0.2,
        rest: 5,
        projectId: undefined,
        tagId: tag1Id,
        date: "",
      },
      {
        id: crypto.randomUUID(),
        name: "Session 2",
        focus: 30,
        ratio: 0.2,
        rest: 6,
        projectId: undefined,
        tagId: tag1Id,
        date: "",
      },
      {
        id: crypto.randomUUID(),
        name: "Session 3",
        focus: 80,
        ratio: 0.2,
        rest: 8,
        projectId: undefined,
        tagId: tag2Id,
        date: "",
      },
    ];

    const result = sumFocusBy(sessions, (session) => session.tagId);

    expect(result).toEqual({
      [tag1Id]: 150,
      [tag2Id]: 80,
    });
  });
});
