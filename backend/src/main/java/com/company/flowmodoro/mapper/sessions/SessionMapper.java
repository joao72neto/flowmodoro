package com.company.flowmodoro.mapper.sessions;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.company.flowmodoro.dto.sessions.SessionDTO;
import com.company.flowmodoro.mapper.tasks.TaskMapper;
import com.company.flowmodoro.model.Session;

@Component
public class SessionMapper {

    @Autowired
    private TaskMapper mapper;

    public Session toEntity(SessionDTO sessionDTO) {
        return Session.builder()
                .id(sessionDTO.getId())
                .focus(sessionDTO.getFocus())
                .ratio(sessionDTO.getRatio() != null ? sessionDTO.getRatio() : null)
                .interruptions(sessionDTO.getInterruptions())
                .build();
    }

    public List<Session> toEntity(List<SessionDTO> sessionDTOs) {
        return sessionDTOs.stream().map(this::toEntity).toList();
    }

    public SessionDTO toDTO(Session session) {
        return SessionDTO.builder()
                .id(session.getId())
                .focus(session.getFocus())
                .ratio(session.getRatio())
                .rest(session.getRest())
                .interruptions(session.getInterruptions())
                .task(mapper.toDTO(session.getTask()))
                .build();
    }

    public List<SessionDTO> toDTO(List<Session> sessions) {
        return sessions.stream().map(this::toDTO).toList();
    }
}
