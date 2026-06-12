package com.company.flowmodoro.features.projects.mappers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.dtos.ProjectDTO;

@Component
public class ProjectMapper {

	public ProjectModel toEntity(ProjectDTO dto) {
		return ProjectModel.builder().id(dto.getId()).name(dto.getName()).build();
	}

	public ProjectDTO toDTO(ProjectModel entity) {
		return ProjectDTO.builder().id(entity.getId()).name(entity.getName()).build();
	}

	public List<ProjectDTO> toDTO(List<ProjectModel> entities) {
		return entities.stream().map(this::toDTO).toList();
	}

}
