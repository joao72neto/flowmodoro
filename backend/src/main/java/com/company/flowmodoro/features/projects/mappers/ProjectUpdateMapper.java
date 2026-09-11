package com.company.flowmodoro.features.projects.mappers;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.dtos.ProjectPayloadDTO;
import com.company.flowmodoro.features.projects.dtos.ProjectUpdateDTO;
import org.springframework.stereotype.Component;

@Component
public class ProjectUpdateMapper {

    public void apply(ProjectModel entity, ProjectUpdateDTO dto) {
        if (dto.getName() != null) {
            entity.setName(dto.getName());
        }
        if (dto.getColor() != null) {
            entity.setColor(dto.getColor());
        }
    }

    public void apply(ProjectModel entity, ProjectPayloadDTO dto) {
        entity.setName(dto.getName());
        entity.setColor(dto.getColor());
    }
}
