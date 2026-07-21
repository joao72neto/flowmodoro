package com.company.flowmodoro.features.tags.mappers;

import com.company.flowmodoro.features.tags.TagModel;
import com.company.flowmodoro.features.tags.dtos.TagPayloadDTO;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class TagSessionMapper {

    public TagModel toEntity(TagPayloadDTO dto) {
        return TagModel.builder().id(dto.getId()).name(dto.getName()).build();
    }

    public TagPayloadDTO toDTO(TagModel entity) {
        return TagPayloadDTO.builder()
            .id(entity.getId())
            .name(entity.getName())
            .build();
    }

    public List<TagPayloadDTO> toDTO(List<TagModel> entities) {
        return entities.stream().map(this::toDTO).toList();
    }
}
