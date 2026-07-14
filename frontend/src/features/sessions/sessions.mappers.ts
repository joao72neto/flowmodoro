import type { SessionModel } from "./local/session.model";
import type { SessionDTO } from "./dtos/sessions-response";
import type {
  CreateSessionDTO,
  UpdateSessionDTO,
} from "./dtos/sessions-request";

import { DEFAULT_SESSION } from "./local/consts/default-session";
import { calculateRest } from "./local/utils/calculate-rest";

import type { ProjectModel } from "../projects/local/project.model";
import type { TagModel } from "../tags/local/tag.model";

class SessionMapper {
  toCreateSessionDTO = (session: SessionModel): CreateSessionDTO => ({
    id: session.id,
    name: session.name,
    focus: session.focus,
    ratio: session.ratio,
    rest: session.rest,
    projectId: session.projectId,
    tagId: session.tagId,
  });

  toCreateSessionsDTO = (sessions: SessionModel[]): CreateSessionDTO[] => {
    return sessions.map((s) => this.toCreateSessionDTO(s));
  };

  toUpdateSessionDTO = (session: SessionModel): UpdateSessionDTO => ({
    name: session.name,
    focus: session.focus,
    ratio: session.ratio,
    rest: session.rest,
    projectId: session.projectId,
    tagId: session.tagId,
  });

  toUpdateSessionsDTO = (sessions: SessionModel[]): UpdateSessionDTO[] => {
    return sessions.map((s) => this.toUpdateSessionDTO(s));
  };

  toDTO = ({
    session,
    project,
    tag,
  }: {
    session: SessionModel;
    project?: ProjectModel;
    tag?: TagModel;
  }): SessionDTO => ({
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
  });

  toEntity = (session: CreateSessionDTO): SessionModel => ({
    id: session.id,
    name: session.name || DEFAULT_SESSION.name,
    focus: session.focus || DEFAULT_SESSION.focus,
    rest: calculateRest(
      session.focus || DEFAULT_SESSION.focus,
      session.ratio || DEFAULT_SESSION.ratio,
    ),
    ratio: session.ratio || DEFAULT_SESSION.ratio,
    date: new Date().toISOString(),
    pending_action: "CREATE",
  });
}

export default new SessionMapper();
