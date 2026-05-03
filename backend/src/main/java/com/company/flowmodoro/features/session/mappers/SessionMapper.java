package com.company.flowmodoro.features.session.mappers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.features.session.SessionModel;
import com.company.flowmodoro.features.session.dtos.SessionDTO;

@Component
public class SessionMapper {

	public SessionModel toEntity(SessionDTO sessionDTO) {
		return SessionModel.builder()
				.id(sessionDTO.getId())
				.name(sessionDTO.getName())
				.focus(sessionDTO.getFocus())
				.ratio(sessionDTO.getRatio() != null ? sessionDTO.getRatio() : null)
				.interruptions(sessionDTO.getInterruptions())
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
				.interruptions(session.getInterruptions())
				.build();
	}

	public List<SessionDTO> toDTO(List<SessionModel> sessions) {
		return sessions.stream().map(this::toDTO).toList();
	}

}
