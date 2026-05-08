package com.company.flowmodoro.features.session.helpers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.company.flowmodoro.features.session.SessionModel;
import com.company.flowmodoro.features.session.enums.SessionErrorCode;
import com.company.flowmodoro.features.session.exceptions.InvalidSessionException;

@Component
public class SessionValidator {

	public void validateSessions(SessionModel session, List<String> errors) {

		if (session.getFocus() == null || session.getFocus() <= 0) {
			errors.add("Focus time must be greater than 0");
		}

		if (session.getRatio() != null && (session.getRatio() < 0 || session.getRatio() > 1)) {
			errors.add("Ratio needs to be between 0 and 1");
		}

		if (session.getInterruptions() != null && session.getInterruptions() < 0) {
			errors.add("Interruptions can't be less than 0");
		}

		if (!errors.isEmpty()) {
			throw new InvalidSessionException(SessionErrorCode.INVALID_SESSION, errors);
		}
	}

}
