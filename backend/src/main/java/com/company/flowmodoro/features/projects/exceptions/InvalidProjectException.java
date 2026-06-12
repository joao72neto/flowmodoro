package com.company.flowmodoro.features.projects.exceptions;

import com.company.flowmodoro.exception.BaseException;
import com.company.flowmodoro.exception.ErrorCode;

public class InvalidProjectException extends BaseException {

	public InvalidProjectException(ErrorCode errorCode, String message) {
		super(errorCode, message);
	}

}
