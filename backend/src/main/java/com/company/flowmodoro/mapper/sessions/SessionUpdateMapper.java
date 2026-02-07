package com.company.flowmodoro.mapper.sessions;

import com.company.flowmodoro.dto.sessions.SessionUpdateDTO;
import com.company.flowmodoro.model.Session;

public class SessionUpdateMapper {

  public Session toEntity(SessionUpdateDTO sessionUpdateDTO) {
    return Session.builder()
        .focus(sessionUpdateDTO.getFocus())
        .ratio(sessionUpdateDTO.getRatio())
        .rest(sessionUpdateDTO.getRest())
        .interruptions(sessionUpdateDTO.getInterruptions())
        .build();
  }

  public SessionUpdateDTO toDTO(Session session) {
    return SessionUpdateDTO.builder()
        .focus(session.getFocus())
        .ratio(session.getRatio())
        .rest(session.getRest())
        .interruptions(session.getInterruptions())
        .taskId(session.getTask().getId())
        .build();
  }
}
