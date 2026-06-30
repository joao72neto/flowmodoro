package com.company.flowmodoro.features.tags;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.ProjectService;
import com.company.flowmodoro.features.sessions.SessionRepository;
import com.company.flowmodoro.features.tags.dtos.TagDTO;
import com.company.flowmodoro.features.tags.dtos.TagUpdateDTO;
import com.company.flowmodoro.features.tags.enums.TagErrorCode;
import com.company.flowmodoro.features.tags.exceptions.InvalidTagException;
import com.company.flowmodoro.features.tags.mappers.TagUpdateMapper;

@Service
public class TagService {

	private final TagRepository tagRepository;

	private final ProjectService projectService;

	private final TagUpdateMapper tagUpdateMapper;

	private final SessionRepository sessionRepository;

	public TagService(TagRepository tagRepository, ProjectService projectService, TagUpdateMapper tagUpdateMapper,
			SessionRepository sessionRepository) {
		this.tagRepository = tagRepository;
		this.projectService = projectService;
		this.tagUpdateMapper = tagUpdateMapper;
		this.sessionRepository = sessionRepository;
	}

	@Transactional
	public TagModel save(TagModel tag, Long projectId, String userId) {
		boolean exists = tagRepository.existsByNameAndProjectId(tag.getName(), projectId);

		if (exists) {
			throw new InvalidTagException(TagErrorCode.TAG_EXISTS, "Tag com nome '" + tag.getName() + "' já existe");
		}

		ProjectModel project = projectService.findById(projectId, userId);
		tag.setProject(project);
		return tagRepository.save(tag);
	}

	public List<TagDTO> findAllByProject(Long projectId, String userId) {
		projectService.findById(projectId, userId);
		return tagRepository.findAllWithTotalFocus(projectId, userId);
	}

	@Transactional
	public TagModel update(Long id, TagUpdateDTO dto, String userId) {
		TagModel tag = tagRepository.findById(id)
				.orElseThrow(() -> new InvalidTagException(TagErrorCode.TAG_NOT_FOUND, "Tag not found"));

		boolean exists = tagRepository.existsByNameAndProjectId(dto.getName(), tag.getProject().getId());

		if (exists && !tag.getName().equals(dto.getName())) {
			throw new InvalidTagException(TagErrorCode.TAG_EXISTS, "Tag com nome '" + dto.getName() + "' já existe");
		}

		projectService.findById(tag.getProject().getId(), userId);
		tagUpdateMapper.apply(tag, dto);
		return tagRepository.save(tag);
	}

	@Transactional
	public void delete(Long id, String userId) {
		TagModel tag = tagRepository.findById(id)
				.orElseThrow(() -> new InvalidTagException(TagErrorCode.TAG_NOT_FOUND, "Tag not found"));

		projectService.findById(tag.getProject().getId(), userId);

		var sessions = sessionRepository.findByTagAndUserId(tag, userId);
		sessions.forEach(session -> session.setTag(null));

		tagRepository.delete(tag);
	}

}
