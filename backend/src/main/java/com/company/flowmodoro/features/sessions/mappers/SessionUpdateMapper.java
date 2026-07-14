package com.company.flowmodoro.features.sessions.mappers;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.sessions.SessionModel;
import com.company.flowmodoro.features.sessions.dtos.SessionUpdateDTO;
import com.company.flowmodoro.features.tags.TagModel;
import org.springframework.stereotype.Component;

@Component
public class SessionUpdateMapper {

    public void apply(SessionUpdateDTO dto, SessionModel session) {
        session.setName(
            dto.getName() != null ? dto.getName() : session.getName()
        );
        session.setFocus(
            dto.getFocus() != null ? dto.getFocus() : session.getFocus()
        );
        session.setRatio(
            dto.getRatio() != null ? dto.getRatio() : session.getRatio()
        );
        session.setRest(
            dto.getRest() != null ? dto.getRest() : session.getRest()
        );
        session.setProject(
            dto.getProjectId() != null
                ? ProjectModel.builder().id(dto.getProjectId()).build()
                : null
        );
        session.setTag(
            dto.getTagId() != null
                ? TagModel.builder().id(dto.getTagId()).build()
                : null
        );
    }

    public SessionModel toEntity(SessionUpdateDTO dto) {
        return SessionModel.builder()
            .focus(dto.getFocus())
            .ratio(dto.getRatio())
            .rest(dto.getRest())
            .project(
                dto.getProjectId() != null
                    ? ProjectModel.builder().id(dto.getProjectId()).build()
                    : null
            )
            .tag(
                dto.getTagId() != null
                    ? TagModel.builder().id(dto.getTagId()).build()
                    : null
            )
            .build();
    }

    public SessionUpdateDTO toDTO(SessionModel session) {
        return SessionUpdateDTO.builder()
            .focus(session.getFocus())
            .ratio(session.getRatio())
            .rest(session.getRest())
            .projectId(
                session.getProject() != null
                    ? session.getProject().getId()
                    : null
            )
            .tagId(session.getTag() != null ? session.getTag().getId() : null)
            .build();
    }
}
