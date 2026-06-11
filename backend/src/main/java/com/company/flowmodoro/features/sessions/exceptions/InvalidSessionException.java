package com.company.flowmodoro.features.sessions.exceptions;

import java.util.List;

import com.company.flowmodoro.features.sessions.enums.SessionErrorCode;
import com.company.flowmodoro.shared.exception.BaseException;

public class InvalidSessionException extends BaseException {

	public InvalidSessionException(SessionErrorCode code, String error) {
		super(code, error);
	}

	public InvalidSessionException(SessionErrorCode code, List<String> errors) {
		super(code, errors);
	}

}
