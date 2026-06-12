package com.company.flowmodoro.features.tags.mappers;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.features.tags.TagModel;
import com.company.flowmodoro.features.tags.dtos.TagUpdateDTO;

@Component
public class TagUpdateMapper {

	public void apply(TagModel entity, TagUpdateDTO dto) {
		entity.setName(dto.getName() != null ? dto.getName() : entity.getName());
	}

}
