package com.company.flowmodoro.features.tags;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.ProjectService;
import com.company.flowmodoro.features.projects.helpers.ProjectValidator;
import com.company.flowmodoro.features.sessions.SessionModel;
import com.company.flowmodoro.features.sessions.SessionRepository;
import com.company.flowmodoro.features.tags.dtos.TagDTO;
import com.company.flowmodoro.features.tags.dtos.TagUpdateBulkDTO;
import com.company.flowmodoro.features.tags.dtos.TagUpdateDTO;
import com.company.flowmodoro.features.tags.helpers.TagValidator;
import com.company.flowmodoro.features.tags.mappers.TagUpdateMapper;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TagService {

    private final TagRepository tagRepository;

    private final ProjectService projectService;

    private final TagUpdateMapper updateMapper;

    private final SessionRepository sessionRepository;

    private final TagValidator validator;

    private final ProjectValidator projectValidator;

    public TagService(
        TagRepository tagRepository,
        ProjectService projectService,
        TagUpdateMapper updateMapper,
        SessionRepository sessionRepository,
        TagValidator validator,
        ProjectValidator projectValidator
    ) {
        this.tagRepository = tagRepository;
        this.projectService = projectService;
        this.updateMapper = updateMapper;
        this.sessionRepository = sessionRepository;
        this.validator = validator;
        this.projectValidator = projectValidator;
    }

    @Transactional
    public List<TagModel> saveAll(List<TagModel> tags, UUID userId) {
        List<TagModel> entities = tags
            .stream()
            .map(tag -> {
                projectValidator.validateProjectExists(tag.getProject());

                validator.validateUniqueName(
                    tag.getName(),
                    tag.getProject().getId()
                );

                ProjectModel project = projectService.findById(
                    tag.getProject().getId(),
                    userId
                );

                tag.setProject(project);
                return tag;
            })
            .toList();
        return tagRepository.saveAll(entities);
    }

    @Transactional
    public TagModel save(TagModel tag, UUID userId) {
        projectValidator.validateProjectExists(tag.getProject());

        validator.validateUniqueName(tag.getName(), tag.getProject().getId());

        ProjectModel project = projectService.findById(
            tag.getProject().getId(),
            userId
        );

        tag.setProject(project);

        return tagRepository.save(tag);
    }

    public List<TagDTO> findAllByProject(UUID projectId, UUID userId) {
        projectService.findById(projectId, userId);
        return tagRepository.findAllWithTotalFocus(projectId, userId);
    }

    @Transactional
    public List<TagModel> updateAll(List<TagUpdateBulkDTO> dtos, UUID userId) {
        List<UUID> ids = dtos.stream().map(TagUpdateBulkDTO::getId).toList();

        Map<UUID, TagModel> existingTags = tagRepository
            .findAllById(ids)
            .stream()
            .collect(Collectors.toMap(TagModel::getId, Function.identity()));

        List<TagModel> entities = dtos
            .stream()
            .map(dto -> {
                TagModel existing = existingTags.get(dto.getId());

                if (existing == null) {
                    return createFromBulkDTO(dto, userId);
                }

                validator.validateUniqueName(
                    existing,
                    dto.getName(),
                    existing.getProject().getId()
                );
                updateMapper.apply(existing, dto);
                existing.setProject(
                    projectService.findById(
                        existing.getProject().getId(),
                        userId
                    )
                );
                return existing;
            })
            .toList();

        return tagRepository.saveAll(entities);
    }

    private TagModel createFromBulkDTO(TagUpdateBulkDTO dto, UUID userId) {
        validator.validateProjectIdIsNotNull(dto.getProjectId());

        TagModel tag = new TagModel();
        tag.setId(dto.getId());
        tag.setName(dto.getName());
        tag.setProject(projectService.findById(dto.getProjectId(), userId));
        return tag;
    }

    @Transactional
    public TagModel update(UUID id, TagUpdateDTO dto, UUID userId) {
        TagModel tag = tagRepository.findById(id).orElse(null);

        validator.validateTagExists(tag);

        validator.validateUniqueName(
            tag,
            dto.getName(),
            tag.getProject().getId()
        );

        projectService.findById(tag.getProject().getId(), userId);
        updateMapper.apply(tag, dto);
        return tagRepository.save(tag);
    }

    @Transactional
    public void deleteAll(List<UUID> ids, UUID userId) {
        List<TagModel> tags = tagRepository.findAllById(ids);

        validator.validateTagsFound(ids, tags);

        tags.forEach(tag -> {
            validator.validateTagBelongsToUser(tag, userId);
        });

        tags.forEach(tag -> {
            List<SessionModel> sessions = sessionRepository.findByTagAndUserId(
                tag,
                userId
            );
            sessions.forEach(session -> session.setTag(null));
        });

        tagRepository.deleteAll(tags);
    }

    @Transactional
    public void delete(UUID id, UUID userId) {
        TagModel tag = tagRepository.findById(id).orElse(null);

        validator.validateTagExists(tag);

        validator.validateTagBelongsToUser(tag, userId);

        List<SessionModel> sessions = sessionRepository.findByTagAndUserId(
            tag,
            userId
        );

        sessions.forEach(session -> session.setTag(null));

        tagRepository.delete(tag);
    }
}
