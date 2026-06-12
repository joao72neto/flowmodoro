package com.company.flowmodoro.features.sessions.mappers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.sessions.SessionModel;
import com.company.flowmodoro.features.sessions.dtos.SessionDTO;
import com.company.flowmodoro.features.tags.TagModel;

@Component
public class SessionMapper {

	public SessionModel toEntity(SessionDTO sessionDTO) {
		return SessionModel.builder()
			.id(sessionDTO.getId())
			.name(sessionDTO.getName())
			.focus(sessionDTO.getFocus())
			.ratio(sessionDTO.getRatio() != null ? sessionDTO.getRatio() : null)
			.project(sessionDTO.getProjectId() != null ? ProjectModel.builder().id(sessionDTO.getProjectId()).build()
					: null)
			.tag(sessionDTO.getTagId() != null ? TagModel.builder().id(sessionDTO.getTagId()).build() : null)
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
			.projectId(session.getProject() != null ? session.getProject().getId() : null)
			.tagId(session.getTag() != null ? session.getTag().getId() : null)
			.build();
	}

	public List<SessionDTO> toDTO(List<SessionModel> sessions) {
		return sessions.stream().map(this::toDTO).toList();
	}

}
