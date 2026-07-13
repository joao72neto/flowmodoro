package com.company.flowmodoro.features.sessions.exceptions;

import com.company.flowmodoro.exception.BaseException;
import com.company.flowmodoro.features.sessions.enums.SessionErrorCode;
import java.util.List;

public class InvalidSessionException extends BaseException {

    public InvalidSessionException(SessionErrorCode code, String error) {
        super(code, error);
    }

    public InvalidSessionException(SessionErrorCode code, List<String> errors) {
        super(code, errors);
    }
}
