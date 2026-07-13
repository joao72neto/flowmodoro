package com.company.flowmodoro.features.projects;

import com.company.flowmodoro.features.projects.dtos.ProjectDTO;
import com.company.flowmodoro.features.projects.dtos.ProjectUpdateDTO;
import com.company.flowmodoro.features.projects.enums.ProjectErrorCode;
import com.company.flowmodoro.features.projects.exceptions.InvalidProjectException;
import com.company.flowmodoro.features.projects.mappers.ProjectUpdateMapper;
import com.company.flowmodoro.features.sessions.SessionRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    private final SessionRepository sessionRepository;

    private final ProjectUpdateMapper projectUpdateMapper;

    public ProjectService(
        ProjectRepository projectRepository,
        ProjectUpdateMapper projectUpdateMapper,
        SessionRepository sessionRepository
    ) {
        this.projectRepository = projectRepository;
        this.sessionRepository = sessionRepository;
        this.projectUpdateMapper = projectUpdateMapper;
    }

    @Transactional
    public ProjectModel save(ProjectModel project, UUID userId) {
        boolean exists = projectRepository.existsByNameAndUserId(
            project.getName(),
            userId
        );

        if (exists) {
            throw new InvalidProjectException(
                ProjectErrorCode.PROJECT_EXISTS,
                "Projeto com nome '" + project.getName() + "' já existe"
            );
        }

        project.setUserId(userId);
        return projectRepository.save(project);
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
    public ProjectModel update(UUID id, ProjectUpdateDTO dto, UUID userId) {
        ProjectModel project = findById(id, userId);
        boolean exists = projectRepository.existsByNameAndUserId(
            dto.getName(),
            userId
        );

        if (exists && !project.getName().equals(dto.getName())) {
            throw new InvalidProjectException(
                ProjectErrorCode.PROJECT_EXISTS,
                "Projeto com nome '" + dto.getName() + "' já existe"
            );
        }

        projectUpdateMapper.apply(project, dto);
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
