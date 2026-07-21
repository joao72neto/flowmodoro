package com.company.flowmodoro.features.tags.helpers;

import com.company.flowmodoro.features.projects.exceptions.InvalidProjectException;
import com.company.flowmodoro.features.tags.TagModel;
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

    public void validateUniqueName(TagModel project, String name, UUID userId) {
        if (project.getName().equals(name)) {
            return;
        }

        if (tagRepository.existsByNameAndProjectId(name, userId)) {
            throw new InvalidProjectException(
                TagErrorCode.TAG_EXISTS,
                "Tag com nome '" + name + "' já existe"
            );
        }
    }

    public void validateTagExists(TagModel tag) {
        if (tag == null) {
            throw new InvalidProjectException(
                TagErrorCode.TAG_NOT_FOUND,
                "Tag not found"
            );
        }
    }
}
