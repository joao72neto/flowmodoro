package com.company.flowmodoro.features.sessions.helpers;

import com.company.flowmodoro.features.projects.ProjectModel;
import com.company.flowmodoro.features.projects.ProjectService;
import com.company.flowmodoro.features.sessions.SessionModel;
import com.company.flowmodoro.features.sessions.enums.SessionErrorCode;
import com.company.flowmodoro.features.sessions.exceptions.InvalidSessionException;
import com.company.flowmodoro.features.tags.TagModel;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class SessionValidator {

    private final ProjectService projectService;
    private final SessionCalculator calculator;

    public SessionValidator(
        ProjectService projectService,
        SessionCalculator calculator
    ) {
        this.projectService = projectService;
        this.calculator = calculator;
    }

    public void validateSessions(SessionModel session, List<String> errors) {
        if (session.getFocus() == null || session.getFocus() <= 0) {
            errors.add("Focus time must be greater than 0");
        }

        Double ratio = session.getRatio();

        if (ratio != null && ratio != 0.1 && ratio != 0.2 && ratio != 0.3) {
            errors.add("Ratio needs to be 0.1, 0.2 or 0.3");
        }

        if (!errors.isEmpty()) {
            throw new InvalidSessionException(
                SessionErrorCode.INVALID_SESSION,
                errors
            );
        }
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

    public SessionModel prepareSession(SessionModel session, UUID userId) {
        List<String> errors = new ArrayList<>();

        if (session.getDate() == null) {
            session.setDate(LocalDate.now());
        }

        if (session.getRatio() == null) {
            session.setRatio(0.2);
        }

        this.validateProjectAndTag(session, userId);
        calculator.calculateRest(session, session.getRatio());
        this.validateSessions(session, errors);

        session.setUserId(userId);
        return session;
    }
}
