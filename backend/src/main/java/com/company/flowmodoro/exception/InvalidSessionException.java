package com.company.flowmodoro.exception;

import java.util.List;

import com.company.flowmodoro.enums.ErrorCode;

public class InvalidSessionException extends RuntimeException {

    private final List<String> errors;
    private final ErrorCode code;

    public InvalidSessionException(ErrorCode code, String error) {
        super(error);
        this.code = code;
        this.errors = List.of(error);
    }

    public InvalidSessionException(ErrorCode code, List<String> errors) {
        super(String.join(", ", errors));
        this.code = code;
        this.errors = errors;
    }

    public ErrorCode getCode() {
        return code;
    }

    public List<String> getErrors() {
        return errors;
    }
}
