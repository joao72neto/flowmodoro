package com.company.flowmodoro.mapper;

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

    public SessionDTO toDTO(Session session) {
        return SessionDTO.builder()
                .task(session.getTask())
                .focus(session.getFocus())
                .rest(session.getRest())
                .interruptions(session.getInterruptions())
                .build();
    }
}
