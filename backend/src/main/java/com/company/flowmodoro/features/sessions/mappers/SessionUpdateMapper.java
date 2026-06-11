package com.company.flowmodoro.features.sessions.mappers;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.features.sessions.SessionModel;
import com.company.flowmodoro.features.sessions.dtos.SessionUpdateDTO;

@Component
public class SessionUpdateMapper {

	public void apply(SessionModel session, SessionUpdateDTO dto) {
		session.setName(dto.getName() != null ? dto.getName() : session.getName());
		session.setFocus(dto.getFocus() != null ? dto.getFocus() : session.getFocus());
		session.setRatio(dto.getRatio() != null ? dto.getRatio() : session.getRatio());
		session.setRest(dto.getRest() != null ? dto.getRest() : session.getRest());
	}

	public SessionUpdateDTO toDTO(SessionModel session) {
		return SessionUpdateDTO.builder()
			.focus(session.getFocus())
			.ratio(session.getRatio())
			.rest(session.getRest())
			.build();
	}

}
