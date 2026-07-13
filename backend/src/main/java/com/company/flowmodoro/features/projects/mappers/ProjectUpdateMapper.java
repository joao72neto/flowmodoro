package com.company.flowmodoro.features.projects.mappers;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.dtos.ProjectUpdateDTO;
import org.springframework.stereotype.Component;

@Component
public class ProjectUpdateMapper {

    public void apply(ProjectModel entity, ProjectUpdateDTO dto) {
        entity.setName(
            dto.getName() != null ? dto.getName() : entity.getName()
        );
    }
}
