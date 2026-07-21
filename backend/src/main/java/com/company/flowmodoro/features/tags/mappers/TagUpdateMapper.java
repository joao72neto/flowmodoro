package com.company.flowmodoro.features.tags.mappers;

import com.company.flowmodoro.features.tags.TagModel;
import com.company.flowmodoro.features.tags.dtos.TagPayloadDTO;
import com.company.flowmodoro.features.tags.dtos.TagUpdateDTO;
import org.springframework.stereotype.Component;

@Component
public class TagUpdateMapper {

    public void apply(TagModel entity, TagPayloadDTO dto) {
        entity.setName(
            dto.getName() != null ? dto.getName() : entity.getName()
        );
    }

    public void apply(TagModel entity, TagUpdateDTO dto) {
        entity.setName(
            dto.getName() != null ? dto.getName() : entity.getName()
        );
    }
}
