package com.company.flowmodoro.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.dto.SessionDTO;
import com.company.flowmodoro.model.Session;

@Component
public class SessionMapper {

    public Session toEntity(SessionDTO sessionDTO) {
        return Session.builder()
                .task(sessionDTO.getTask())
                .focus(sessionDTO.getFocus())
                .rest(sessionDTO.getRest())
                .interruptions(sessionDTO.getInterruptions())
                .build();
    }

    public List<Session> toEntity(List<SessionDTO> sessionDTOs) {
        return sessionDTOs.stream().map(this::toEntity).toList();
    }

    public SessionDTO toDTO(Session session) {
        return SessionDTO.builder()
                .task(session.getTask())
                .focus(session.getFocus())
                .rest(session.getRest())
                .interruptions(session.getInterruptions())
                .build();
    }

    public List<SessionDTO> toDTO(List<Session> sessions) {
        return sessions.stream().map(this::toDTO).toList();
    }
}
