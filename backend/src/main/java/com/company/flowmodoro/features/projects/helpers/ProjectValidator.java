package com.company.flowmodoro.features.projects.helpers;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.ProjectRepository;
import com.company.flowmodoro.features.projects.enums.ProjectErrorCode;
import com.company.flowmodoro.features.projects.exceptions.InvalidProjectException;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class ProjectValidator {

    private final ProjectRepository projectRepository;

    public ProjectValidator(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public void validateUniqueName(String name, UUID userId) {
        if (projectRepository.existsByNameAndUserId(name, userId)) {
            throw new InvalidProjectException(
                ProjectErrorCode.PROJECT_EXISTS,
                "Projeto com nome '" + name + "' já existe"
            );
        }
    }

    public void validateUniqueName(
        ProjectModel project,
        String name,
        UUID userId
    ) {
        if (project.getName().equals(name)) {
            return;
        }

        if (projectRepository.existsByNameAndUserId(name, userId)) {
            throw new InvalidProjectException(
                ProjectErrorCode.PROJECT_EXISTS,
                "Projeto com nome '" + name + "' já existe"
            );
        }
    }

    public void validateProjectExists(ProjectModel project) {
        if (project == null) {
            throw new InvalidProjectException(
                ProjectErrorCode.PROJECT_NOT_FOUND,
                "Project not found"
            );
        }
    }

    public void validateProjectsFound(
        List<UUID> ids,
        List<ProjectModel> projects
    ) {
        if (projects.size() != ids.size()) {
            throw new InvalidProjectException(
                ProjectErrorCode.PROJECT_NOT_FOUND,
                "One or more projects were not found"
            );
        }
    }

    public void validateProjectBelongsToUser(
        ProjectModel project,
        UUID userId
    ) {
        if (!project.getUserId().equals(userId)) {
            throw new InvalidProjectException(
                ProjectErrorCode.PROJECT_NOT_FOUND,
                "Project not found for this user"
            );
        }
    }
}
