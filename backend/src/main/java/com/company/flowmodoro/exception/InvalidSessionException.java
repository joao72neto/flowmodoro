package com.company.flowmodoro.exception;

import java.util.List;

public class InvalidSessionException extends RuntimeException {

    private final List<String> errors;

    public InvalidSessionException(String error) {
        super(error);
        this.errors = List.of(error);
    }

    public InvalidSessionException(List<String> errors) {
        super(String.join(", ", errors));
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}
