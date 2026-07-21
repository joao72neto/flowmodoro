package com.company.flowmodoro.features.tags.mappers;

import com.company.flowmodoro.features.tags.TagModel;
import com.company.flowmodoro.features.tags.dtos.TagCreateDTO;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class TagSessionMapper {

    public TagModel toEntity(TagCreateDTO dto) {
        return TagModel.builder().id(dto.getId()).name(dto.getName()).build();
    }

    public TagCreateDTO toDTO(TagModel entity) {
        return TagCreateDTO.builder()
            .id(entity.getId())
            .name(entity.getName())
            .build();
    }

    public List<TagCreateDTO> toDTO(List<TagModel> entities) {
        return entities.stream().map(this::toDTO).toList();
    }
}
