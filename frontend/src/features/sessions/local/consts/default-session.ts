import type { SessionModel } from "../session.model";
import { v4 as uuidv4 } from "uuid";

export const DEFAULT_SESSION: SessionModel = {
  id: uuidv4(),
  focus: 0,
  name: "Sessão padrão",
  ratio: 0.2,
  rest: 0,
  projectId: "",
  tagId: "",
  date: new Date().toISOString(),
};
