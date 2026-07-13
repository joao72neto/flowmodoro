package com.company.flowmodoro.features.sessions.mappers;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.mappers.ProjectMapper;
import com.company.flowmodoro.features.sessions.SessionModel;
import com.company.flowmodoro.features.sessions.dtos.SessionDTO;
import com.company.flowmodoro.features.tags.TagModel;
import com.company.flowmodoro.features.tags.mappers.TagSessionMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SessionMapper {

    private final ProjectMapper projectMapper;

    private final TagSessionMapper tagMapper;

    public SessionModel toEntity(SessionDTO sessionDTO) {
        return SessionModel.builder()
            .id(sessionDTO.getId())
            .name(sessionDTO.getName())
            .focus(sessionDTO.getFocus())
            .ratio(sessionDTO.getRatio() != null ? sessionDTO.getRatio() : null)
            .project(
                sessionDTO.getProject() != null &&
                    sessionDTO.getProject().getId() != null
                    ? ProjectModel.builder()
                          .id(sessionDTO.getProject().getId())
                          .build()
                    : null
            )
            .tag(
                sessionDTO.getTag() != null &&
                    sessionDTO.getTag().getId() != null
                    ? TagModel.builder().id(sessionDTO.getTag().getId()).build()
                    : null
            )
            .build();
    }

    public List<SessionModel> toEntity(List<SessionDTO> sessionDTOs) {
        return sessionDTOs.stream().map(this::toEntity).toList();
    }

    public SessionDTO toDTO(SessionModel session) {
        return SessionDTO.builder()
            .id(session.getId())
            .name(session.getName())
            .focus(session.getFocus())
            .ratio(session.getRatio())
            .rest(session.getRest())
            .project(
                session.getProject() != null
                    ? projectMapper.toDTO(session.getProject())
                    : null
            )
            .tag(
                session.getTag() != null
                    ? tagMapper.toDTO(session.getTag())
                    : null
            )
            .build();
    }

    public List<SessionDTO> toDTO(List<SessionModel> sessions) {
        return sessions.stream().map(this::toDTO).toList();
    }
}
