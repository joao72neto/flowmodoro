package com.company.flowmodoro.features.session.exceptions;

import java.util.List;

import com.company.flowmodoro.features.session.enums.SessionErrorCode;
import com.company.flowmodoro.shared.exception.BaseException;

public class InvalidSessionException extends BaseException {
    public InvalidSessionException(SessionErrorCode code, String error) {
        super(code, error);
    }

    public InvalidSessionException(SessionErrorCode code, List<String> errors) {
        super(code, errors);
    }
}
