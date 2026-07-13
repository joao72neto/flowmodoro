package com.company.flowmodoro.features.tags.mappers;

import com.company.flowmodoro.features.tags.TagModel;
import com.company.flowmodoro.features.tags.dtos.TagSessionDTO;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class TagSessionMapper {

    public TagModel toEntity(TagSessionDTO dto) {
        return TagModel.builder().id(dto.getId()).name(dto.getName()).build();
    }

    public TagSessionDTO toDTO(TagModel entity) {
        return TagSessionDTO.builder()
            .id(entity.getId())
            .name(entity.getName())
            .build();
    }

    public List<TagSessionDTO> toDTO(List<TagModel> entities) {
        return entities.stream().map(this::toDTO).toList();
    }
}
