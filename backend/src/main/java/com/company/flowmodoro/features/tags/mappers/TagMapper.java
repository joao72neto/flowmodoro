package com.company.flowmodoro.features.tags.mappers;

import com.company.flowmodoro.features.projects.ProjectService;
import com.company.flowmodoro.features.tags.TagModel;
import com.company.flowmodoro.features.tags.dtos.TagDTO;
import com.company.flowmodoro.features.tags.dtos.TagCreateDTO;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class TagMapper {

    private final ProjectService projectService;

    public TagMapper(ProjectService projectService) {
        this.projectService = projectService;
    }

    public TagModel toEntity(TagDTO dto) {
        return TagModel.builder().id(dto.getId()).name(dto.getName()).build();
    }

    public List<TagModel> toEntity(List<TagDTO> dtos) {
        return dtos.stream().map(this::toEntity).toList();
    }

    public TagModel fromPayload(TagCreateDTO dto, UUID userId) {
        return TagModel.builder()
            .id(dto.getId())
            .name(dto.getName())
            .project(projectService.findById(dto.getProjectId(), userId))
            .build();
    }

    public List<TagModel> fromPayload(List<TagCreateDTO> dtos, UUID userId) {
        return dtos
            .stream()
            .map(dto -> fromPayload(dto, userId))
            .toList();
    }

    public TagDTO toDTO(TagModel entity) {
        return TagDTO.builder()
            .id(entity.getId())
            .name(entity.getName())
            .projectId(
                entity.getProject() != null ? entity.getProject().getId() : null
            )
            .updatedAt(entity.getUpdatedAt())
            .deletedAt(entity.getDeletedAt())
            .build();
    }

    public List<TagDTO> toDTO(List<TagModel> entities) {
        return entities.stream().map(this::toDTO).toList();
    }
}
