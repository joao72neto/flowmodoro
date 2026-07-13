package com.company.flowmodoro.exception;

import com.company.flowmodoro.exception.ErrorResponse.ErrorCode;
import java.util.List;

public class BaseException extends RuntimeException {

    private final List<String> errors;

    private final ErrorCode code;

    public BaseException(ErrorCode code, String error) {
        super(error);
        this.code = code;
        this.errors = List.of(error);
    }

    public BaseException(ErrorCode code, List<String> errors) {
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
