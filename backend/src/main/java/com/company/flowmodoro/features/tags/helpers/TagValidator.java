package com.company.flowmodoro.features.tags.helpers;

import com.company.flowmodoro.features.tags.TagRepository;
import com.company.flowmodoro.features.tags.enums.TagErrorCode;
import com.company.flowmodoro.features.tags.exceptions.InvalidTagException;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class TagValidator {

    private final TagRepository tagRepository;

    public TagValidator(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public void validateUniqueName(String name, UUID projectId) {
        if (tagRepository.existsByNameAndProjectId(name, projectId)) {
            throw new InvalidTagException(
                TagErrorCode.TAG_EXISTS,
                "Tag com nome '" + name + "' já existe"
            );
        }
    }
}
