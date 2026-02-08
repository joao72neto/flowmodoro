package com.company.flowmodoro.session.exceptions;

import java.util.List;

import com.company.flowmodoro.global.BaseException;
import com.company.flowmodoro.session.enums.SessionErrorCode;

public class InvalidSessionException extends BaseException {
    public InvalidSessionException(SessionErrorCode code, String error) {
        super(code, error);
    }

    public InvalidSessionException(SessionErrorCode code, List<String> errors) {
        super(code, errors);
    }
}
