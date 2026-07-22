package com.company.flowmodoro.features.tags.helpers;

import com.company.flowmodoro.features.projects.exceptions.InvalidProjectException;
import com.company.flowmodoro.features.tags.TagModel;
import com.company.flowmodoro.features.tags.TagRepository;
import com.company.flowmodoro.features.tags.enums.TagErrorCode;
import com.company.flowmodoro.features.tags.exceptions.InvalidTagException;
import java.util.List;
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

    public void validateTagsFound(List<UUID> ids, List<TagModel> tags) {
        if (tags.size() != ids.size()) {
            throw new InvalidTagException(
                TagErrorCode.TAG_NOT_FOUND,
                "One or more projects were not found"
            );
        }
    }

    public void validateTagBelongsToUser(TagModel tag, UUID userId) {
        if (!tag.getProject().getUserId().equals(userId)) {
            throw new InvalidTagException(
                TagErrorCode.TAG_NOT_FOUND,
                "Tag not found for this user"
            );
        }
    }

    public void validateProjectIdIsNotNull(UUID projectId) {
        if (projectId == null) {
            throw new InvalidTagException(
                TagErrorCode.TAG_PROJECT_MISMATCH,
                "Project ID is required"
            );
        }
    }
}
