package com.company.flowmodoro.features.sessions.helpers;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.ProjectService;
import com.company.flowmodoro.features.sessions.SessionModel;
import com.company.flowmodoro.features.sessions.enums.SessionErrorCode;
import com.company.flowmodoro.features.sessions.exceptions.InvalidSessionException;
import com.company.flowmodoro.features.tags.TagModel;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class ProjectTagValidator {

    private final ProjectService projectService;

    public ProjectTagValidator(ProjectService projectService) {
        this.projectService = projectService;
    }

    public void validateProjectAndTag(SessionModel session, UUID userId) {
        if (
            session.getProject() != null && session.getProject().getId() != null
        ) {
            ProjectModel project = projectService.findById(
                session.getProject().getId(),
                userId
            );
            session.setProject(project);

            if (session.getTag() != null && session.getTag().getId() != null) {
                TagModel tag = project
                    .getTags()
                    .stream()
                    .filter(t -> t.getId().equals(session.getTag().getId()))
                    .findFirst()
                    .orElseThrow(() ->
                        new InvalidSessionException(
                            SessionErrorCode.INVALID_SESSION,
                            "Tag does not belong to the selected project"
                        )
                    );
                session.setTag(tag);
            }
        } else if (
            session.getTag() != null && session.getTag().getId() != null
        ) {
            throw new InvalidSessionException(
                SessionErrorCode.INVALID_SESSION,
                "A project must be selected to use a tag"
            );
        }
    }
}
