package com.company.flowmodoro.session.mapper;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.session.dto.SessionUpdateDTO;
import com.company.flowmodoro.session.model.Session;

@Component
public class SessionUpdateMapper {

  public void apply(Session session, SessionUpdateDTO dto) {
    session.setFocus(dto.getFocus());
    session.setRatio(dto.getRatio());
    session.setRest(dto.getRest());
    session.setInterruptions(dto.getInterruptions());
  }

  public SessionUpdateDTO toDTO(Session session) {
    return SessionUpdateDTO.builder()
        .focus(session.getFocus())
        .ratio(session.getRatio())
        .rest(session.getRest())
        .interruptions(session.getInterruptions())
        .task(session.getTask().getId())
        .build();
  }
}
