package com.company.flowmodoro.features.session.mappers;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.features.session.SessionModel;
import com.company.flowmodoro.features.session.dtos.SessionUpdateDTO;

@Component
public class SessionUpdateMapper {

  public void apply(SessionModel session, SessionUpdateDTO dto) {
    session.setFocus(dto.getFocus());
    session.setRatio(dto.getRatio());
    session.setRest(dto.getRest());
    session.setInterruptions(dto.getInterruptions());
  }

  public SessionUpdateDTO toDTO(SessionModel session) {
    return SessionUpdateDTO.builder()
        .focus(session.getFocus())
        .ratio(session.getRatio())
        .rest(session.getRest())
        .interruptions(session.getInterruptions())
        .task(session.getTask().getId())
        .build();
  }
}
