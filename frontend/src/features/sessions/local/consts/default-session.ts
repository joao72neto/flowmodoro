import type { SessionModel } from "../session.model";

export const DEFAULT_SESSION: SessionModel = {
  id: crypto.randomUUID(),
  focus: 0,
  name: "Sessão padrão",
  ratio: 0.2,
  rest: 0,
  projectId: "",
  tagId: "",
  date: new Date().toISOString(),
  deleted: false,
  pending_action: null,
};
