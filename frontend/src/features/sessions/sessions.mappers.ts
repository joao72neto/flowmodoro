import type { SessionModel } from "./local/session.model";
import type { SessionDTO } from "./dtos/sessions-response";
import type { SessionPayloadDTO } from "./dtos/sessions-request";

import { DEFAULT_SESSION } from "./local/consts/default-session";
import { calculateRest } from "./local/utils/calculate-rest";

import type { ProjectModel } from "../projects/local/project.model";
import type { TagModel } from "../tags/local/tag.model";

class SessionMapper {
  toPayload = (session: SessionModel): SessionPayloadDTO => ({
    id: session.id,
    name: session.name,
    focus: session.focus,
    ratio: session.ratio,
    rest: session.rest,
    projectId: session.projectId,
    tagId: session.tagId,
  });

  toPayloadList = (sessions: SessionModel[]): SessionPayloadDTO[] => {
    return sessions.map((session) => this.toPayload(session));
  };

  buildDTO = ({
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
    updatedAt: session.updatedAt,
    project: {
      id: project?.id || "",
      name: project?.name || "",
    },
    tag: {
      id: tag?.id || "",
      name: tag?.name || "",
    },
  });

  fromPayload = (session: SessionPayloadDTO): SessionModel => ({
    id: session.id,
    name: session.name || DEFAULT_SESSION.name,
    focus: session.focus || DEFAULT_SESSION.focus,
    rest: calculateRest(
      session.focus || DEFAULT_SESSION.focus,
      session.ratio || DEFAULT_SESSION.ratio,
    ),
    ratio: session.ratio || DEFAULT_SESSION.ratio,
    date: session.date || new Date().toISOString(),
    projectId: session.projectId,
    tagId: session.tagId,
  });

  fromPayloadList = (sessions: SessionPayloadDTO[]): SessionModel[] => {
    return sessions.map((session) => this.fromPayload(session));
  };

  fromDTO = (dto: SessionDTO): SessionModel => ({
    id: dto.id,
    name: dto.name || DEFAULT_SESSION.name,
    focus: dto.focus || DEFAULT_SESSION.focus,
    rest:
      dto.rest !== undefined && dto.rest !== null
        ? dto.rest
        : calculateRest(
            dto.focus || DEFAULT_SESSION.focus,
            dto.ratio || DEFAULT_SESSION.ratio,
          ),
    ratio: dto.ratio || DEFAULT_SESSION.ratio,
    date: dto.date || new Date().toISOString(),
    projectId: dto.project?.id || undefined,
    tagId: dto.tag?.id || undefined,
    updatedAt: dto.updatedAt,
  });

  fromDTOList = (dtos: SessionDTO[]): SessionModel[] => {
    return dtos.map((dto) => this.fromDTO(dto));
  };
}

export default new SessionMapper();
