import type { SessionModel } from "./session.model";
import type { SessionPayloadDTO, SessionDTO } from "./session.dtos";
import { DEFAULT_SESSION } from "./consts/default-session";
import { calculateRest } from "./utils/calculate-rest";
import type { ProjectModel } from "../../projects/local/project.model";
import type { TagModel } from "../../tags/local/tag.model";

export const modelToDTO = ({
  session,
  project,
  tag,
}: {
  session: SessionModel;
  project?: ProjectModel;
  tag?: TagModel;
}): SessionDTO => {
  return {
    id: session.id,
    name: session.name,
    focus: session.focus,
    rest: session.rest,
    date: session.date,
    ratio: session.ratio,
    project: {
      id: project?.id || "",
      name: project?.name || "",
    },
    tag: {
      id: tag?.id || "",
      name: tag?.name || "",
    },
  };
};

export const modelToPayloadArray = (
  sessions: SessionModel[],
): SessionPayloadDTO[] => {
  return sessions.map((session) => ({
    name: session.name,
    focus: session.focus,
    ratio: session.ratio,
    rest: session.rest,
    projectId: session.projectId,
    tagId: session.tagId,
  }));
};

export const payloadToModel = (session: SessionPayloadDTO): SessionModel => ({
  id: crypto.randomUUID(),
  name: session.name || DEFAULT_SESSION.name,
  focus: session.focus || DEFAULT_SESSION.focus,
  ratio: session.ratio || DEFAULT_SESSION.ratio,
  rest: calculateRest(
    session.focus || DEFAULT_SESSION.focus,
    session.ratio || DEFAULT_SESSION.ratio,
  ),
  projectId: session.projectId || DEFAULT_SESSION.projectId,
  tagId: session.tagId || DEFAULT_SESSION.tagId,
  date: new Date().toISOString(),
});
