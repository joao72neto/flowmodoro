package com.company.flowmodoro.features.sessions.helpers;

import com.company.flowmodoro.features.sessions.SessionModel;
import com.company.flowmodoro.features.sessions.enums.SessionErrorCode;
import com.company.flowmodoro.features.sessions.exceptions.InvalidSessionException;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class SessionValidator {

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
}
