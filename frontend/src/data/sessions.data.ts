import type { ISessionGroupoResponse } from "../types/sessions.types";

export const sessionData: ISessionGroupoResponse[] = [
  {
    date: "2026-01-11",
    totalFocus: 40,
    totalRest: 8,
    sessions: [
      {
        focus: 40,
        rest: 8,
        ratio: 0.2,
        interruptions: 0,
        task: {
          id: 6,
          name: "My task",
        },
      },
    ],
  },
  {
    date: "2026-01-12",
    totalFocus: 120,
    totalRest: 24,
    sessions: [
      {
        focus: 25,
        rest: 5,
        ratio: 0.2,
        interruptions: 2,
        task: {
          id: 7,
          name: "Code Review",
        },
      },
      {
        focus: 35,
        rest: 7,
        ratio: 0.2,
        interruptions: 1,
        task: {
          id: 8,
          name: "API Development",
        },
      },
      {
        focus: 60,
        rest: 12,
        ratio: 0.2,
        interruptions: 0,
        task: {
          id: 9,
          name: "Project Planning",
        },
      },
    ],
  },
  {
    date: "2026-01-13",
    totalFocus: 85,
    totalRest: 17,
    sessions: [
      {
        focus: 50,
        rest: 10,
        ratio: 0.2,
        interruptions: 3,
        task: {
          id: 10,
          name: "Bug Fixing",
        },
      },
      {
        focus: 35,
        rest: 7,
        ratio: 0.2,
        interruptions: 0,
        task: {
          id: 11,
          name: "Documentation",
        },
      },
    ],
  },
  {
    date: "2026-01-14",
    totalFocus: 180,
    totalRest: 36,
    sessions: [
      {
        focus: 45,
        rest: 9,
        ratio: 0.2,
        interruptions: 1,
        task: {
          id: 12,
          name: "UI Design",
        },
      },
      {
        focus: 30,
        rest: 6,
        ratio: 0.2,
        interruptions: 2,
        task: {
          id: 13,
          name: "Team Meeting",
        },
      },
      {
        focus: 60,
        rest: 12,
        ratio: 0.2,
        interruptions: 0,
        task: {
          id: 14,
          name: "Feature Development",
        },
      },
      {
        focus: 45,
        rest: 9,
        ratio: 0.2,
        interruptions: 0,
        task: {
          id: 15,
          name: "Testing",
        },
      },
    ],
  },
  {
    date: "2026-01-15",
    totalFocus: 60,
    totalRest: 12,
    sessions: [
      {
        focus: 60,
        rest: 12,
        ratio: 0.2,
        interruptions: 1,
        task: {
          id: 16,
          name: "Learning New Tech",
        },
      },
    ],
  },
];
