package com.company.flowmodoro.features.projects;

import com.company.flowmodoro.features.projects.dtos.ProjectDTO;
import com.company.flowmodoro.features.projects.dtos.ProjectPayloadDTO;
import com.company.flowmodoro.features.projects.dtos.ProjectUpdateDTO;
import com.company.flowmodoro.features.projects.enums.ProjectErrorCode;
import com.company.flowmodoro.features.projects.exceptions.InvalidProjectException;
import com.company.flowmodoro.features.projects.helpers.ProjectValidator;
import com.company.flowmodoro.features.projects.mappers.ProjectUpdateMapper;
import com.company.flowmodoro.features.sessions.SessionRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    private final SessionRepository sessionRepository;

    private final ProjectUpdateMapper updateMapper;

    private final ProjectValidator validator;

    public ProjectService(
        ProjectRepository projectRepository,
        ProjectUpdateMapper updateMapper,
        SessionRepository sessionRepository,
        ProjectValidator validator
    ) {
        this.projectRepository = projectRepository;
        this.sessionRepository = sessionRepository;
        this.updateMapper = updateMapper;
        this.validator = validator;
    }

    public List<ProjectDTO> findAll(String userId) {
        return projectRepository.findAllWithTotalFocus(userId);
    }

    public ProjectModel findById(UUID id, UUID userId) {
        ProjectModel project = projectRepository
            .findById(id)
            .orElseThrow(() ->
                new InvalidProjectException(
                    ProjectErrorCode.PROJECT_NOT_FOUND,
                    "Project not found"
                )
            );

        if (!project.getUserId().equals(userId)) {
            throw new InvalidProjectException(
                ProjectErrorCode.PROJECT_NOT_FOUND,
                "Project not found for this user"
            );
        }

        return project;
    }

    @Transactional
    public List<ProjectModel> saveAll(
        List<ProjectModel> projects,
        UUID userId
    ) {
        List<ProjectModel> entities = projects
            .stream()
            .map(project -> {
                validator.validateUniqueName(project.getName(), userId);
                project.setUserId(userId);
                return project;
            })
            .toList();

        return projectRepository.saveAll(entities);
    }

    @Transactional
    public ProjectModel save(ProjectModel project, UUID userId) {
        validator.validateUniqueName(project.getName(), userId);
        project.setUserId(userId);
        return projectRepository.save(project);
    }

    @Transactional
    public List<ProjectModel> updateAll(
        List<ProjectPayloadDTO> dtos,
        UUID userId
    ) {
        List<UUID> ids = dtos.stream().map(ProjectPayloadDTO::getId).toList();

        Map<UUID, ProjectModel> projects = projectRepository
            .findAllById(ids)
            .stream()
            .collect(
                Collectors.toMap(ProjectModel::getId, Function.identity())
            );

        List<ProjectModel> entities = dtos
            .stream()
            .map(dto -> {
                ProjectModel project = projects.get(dto.getId());

                if (project == null) {
                    throw new InvalidProjectException(
                        ProjectErrorCode.PROJECT_NOT_FOUND,
                        "Project not found"
                    );
                }

                validator.validateUniqueName(project, dto.getName(), userId);

                updateMapper.apply(project, dto);
                project.setUserId(userId);

                return project;
            })
            .toList();

        return projectRepository.saveAll(entities);
    }

    @Transactional
    public ProjectModel update(UUID id, ProjectUpdateDTO dto, UUID userId) {
        ProjectModel project = findById(id, userId);

        validator.validateUniqueName(dto.getName(), userId);

        updateMapper.apply(project, dto);

        return projectRepository.save(project);
    }

    @Transactional
    public void delete(UUID id, UUID userId) {
        ProjectModel project = findById(id, userId);

        var sessions = sessionRepository.findByProjectAndUserId(
            project,
            userId
        );

        sessions.forEach(session -> {
            session.setProject(null);
            session.setTag(null);
        });

        projectRepository.delete(project);
    }
}
