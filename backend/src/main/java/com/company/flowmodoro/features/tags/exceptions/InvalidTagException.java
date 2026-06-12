package com.company.flowmodoro.features.tags.exceptions;

import com.company.flowmodoro.shared.exception.BaseException;
import com.company.flowmodoro.shared.exception.ErrorCode;

public class InvalidTagException extends BaseException {

	public InvalidTagException(ErrorCode errorCode, String message) {
		super(errorCode, message);
	}

}
