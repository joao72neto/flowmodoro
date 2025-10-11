package com.company.flowmodoro.exception;

import java.util.List;

public class InvalidSessionException extends RuntimeException {

    private final List<String> errors;

    public InvalidSessionException(List<String> errors) {
        this.errors = errors;
    } 

    public List<String> getErrors() {
        return errors;
    }
}
