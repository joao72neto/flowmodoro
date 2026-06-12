package com.company.flowmodoro.features.projects.mappers;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.dtos.ProjectUpdateDTO;

@Component
public class ProjectUpdateMapper {

	public void apply(ProjectModel entity, ProjectUpdateDTO dto) {
		entity.setName(dto.getName() != null ? dto.getName() : entity.getName());
	}

}
