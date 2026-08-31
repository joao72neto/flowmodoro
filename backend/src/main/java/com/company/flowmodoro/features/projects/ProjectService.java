package com.company.flowmodoro.features.projects;

import com.company.flowmodoro.features.projects.dtos.ProjectPayloadDTO;
import com.company.flowmodoro.features.projects.helpers.ProjectValidator;
import com.company.flowmodoro.features.projects.mappers.ProjectUpdateMapper;
import com.company.flowmodoro.features.sessions.SessionModel;
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

    @Transactional(readOnly = true)
    public List<ProjectModel> pull(
        UUID userId,
        java.time.OffsetDateTime lastSync
    ) {
        if (lastSync != null) {
            return projectRepository.findByUserIdAndUpdatedAtGreaterThanEqual(
                userId,
                lastSync
            );
        }
        return projectRepository.findByUserId(userId);
    }

    public ProjectModel findById(UUID id, UUID userId) {
        ProjectModel project = projectRepository.findById(id).orElse(null);

        validator.validateProjectExists(project);
        validator.validateProjectBelongsToUser(project, userId);

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
    public List<ProjectModel> updateAll(
        List<ProjectPayloadDTO> dtos,
        UUID userId
    ) {
        List<UUID> ids = dtos.stream().map(ProjectPayloadDTO::getId).toList();

        Map<UUID, ProjectModel> existingProjects = projectRepository
            .findAllById(ids)
            .stream()
            .collect(
                Collectors.toMap(ProjectModel::getId, Function.identity())
            );

        List<ProjectModel> entities = dtos
            .stream()
            .map(dto -> {
                ProjectModel existing = existingProjects.get(dto.getId());

                if (existing == null) {
                    return createFromBulkDTO(dto, userId);
                }

                validator.validateProjectExists(existing);

                validator.validateUniqueName(existing, dto.getName(), userId);

                updateMapper.apply(existing, dto);

                existing.setUserId(userId);

                return existing;
            })
            .toList();

        return projectRepository.saveAll(entities);
    }

    @Transactional
    public void deleteAll(List<UUID> ids, UUID userId) {
        List<ProjectModel> projects = projectRepository.findAllById(ids);

        validator.validateProjectsFound(ids, projects);

        projects.forEach(project ->
            validator.validateProjectBelongsToUser(project, userId)
        );

        projects.forEach(project -> {
            List<SessionModel> sessions =
                sessionRepository.findByProjectAndUserId(project, userId);

            sessions.forEach(session -> {
                session.setProject(null);
                session.setTag(null);
            });
            project.setDeletedAt(java.time.OffsetDateTime.now());
        });

        projectRepository.saveAll(projects);
    }

    private ProjectModel createFromBulkDTO(ProjectPayloadDTO dto, UUID userId) {
        ProjectModel project = new ProjectModel();
        project.setId(dto.getId());
        project.setName(dto.getName());
        project.setColor(dto.getColor());
        project.setUserId(userId);
        return project;
    }
}
