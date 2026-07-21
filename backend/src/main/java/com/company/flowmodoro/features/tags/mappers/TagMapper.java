package com.company.flowmodoro.features.tags.mappers;

import com.company.flowmodoro.features.tags.TagModel;
import com.company.flowmodoro.features.tags.dtos.TagDTO;
import com.company.flowmodoro.features.tags.dtos.TagPayloadDTO;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class TagMapper {

    public TagModel toEntity(TagDTO dto) {
        return TagModel.builder().id(dto.getId()).name(dto.getName()).build();
    }

    public List<TagModel> toEntity(List<TagDTO> dtos) {
        return dtos.stream().map(this::toEntity).toList();
    }

    public TagModel fromPayload(TagPayloadDTO dto) {
        return TagModel.builder().id(dto.getId()).name(dto.getName()).build();
    }

    public TagDTO toDTO(TagModel entity) {
        return TagDTO.builder()
            .id(entity.getId())
            .name(entity.getName())
            .projectId(
                entity.getProject() != null ? entity.getProject().getId() : null
            )
            .build();
    }

    public List<TagDTO> toDTO(List<TagModel> entities) {
        return entities.stream().map(this::toDTO).toList();
    }
}
