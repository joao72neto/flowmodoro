package com.company.flowmodoro.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.company.flowmodoro.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidSessionException.class)
    public ResponseEntity<ErrorResponse> handleInvalidSession(InvalidSessionException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .message("Invalid Session")
                .errors(ex.getErrors())
                .build();

        return ResponseEntity.badRequest().body(errorResponse);
    }

    @ExceptionHandler(InvalidTaskException.class)
    public ResponseEntity<ErrorResponse> handleInvalidTask(InvalidTaskException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .message("Invalid Task")
                .errors(ex.getErrors())
                .build();

        return ResponseEntity.badRequest().body(errorResponse);
    }
}
