package com.company.flowmodoro.shared.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.company.flowmodoro.features.session.exceptions.InvalidSessionException;
import com.company.flowmodoro.features.task.exceptions.InvalidTaskException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidSessionException.class)
    public ResponseEntity<ErrorResponse> handleInvalidSession(InvalidSessionException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(ex.getCode())
                .errors(ex.getErrors())
                .build();

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(InvalidTaskException.class)
    public ResponseEntity<ErrorResponse> handleInvalidTask(InvalidTaskException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .code(ex.getCode())
                .errors(ex.getErrors())
                .build();

        return ResponseEntity.badRequest().body(errorResponse);
    }
}
