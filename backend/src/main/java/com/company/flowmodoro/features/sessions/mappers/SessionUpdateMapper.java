package com.company.flowmodoro.features.sessions.mappers;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.sessions.SessionModel;
import com.company.flowmodoro.features.sessions.dtos.SessionUpdateDTO;
import com.company.flowmodoro.features.tags.TagModel;

@Component
public class SessionUpdateMapper {

	public void apply(SessionModel session, SessionUpdateDTO dto) {
		session.setName(dto.getName() != null ? dto.getName() : session.getName());
		session.setFocus(dto.getFocus() != null ? dto.getFocus() : session.getFocus());
		session.setRatio(dto.getRatio() != null ? dto.getRatio() : session.getRatio());
		session.setRest(dto.getRest() != null ? dto.getRest() : session.getRest());
		session.setProject(dto.getProjectId() != null ? (dto.getProjectId() > 0 ? ProjectModel.builder().id(dto.getProjectId()).build() : null)
				: session.getProject());
		session.setTag(dto.getTagId() != null ? (dto.getTagId() > 0 ? TagModel.builder().id(dto.getTagId()).build() : null) : session.getTag());
	}

	public SessionUpdateDTO toDTO(SessionModel session) {
		return SessionUpdateDTO.builder()
			.focus(session.getFocus())
			.ratio(session.getRatio())
			.rest(session.getRest())
			.projectId(session.getProject() != null ? session.getProject().getId() : null)
			.tagId(session.getTag() != null ? session.getTag().getId() : null)
			.build();
	}

}
